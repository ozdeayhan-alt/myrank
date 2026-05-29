import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import type { AuthUser, RegisterProfile } from '../types'
import type { AppPost, NewPostInput, PostType } from '../types/post'
import type { RankedUser } from '../types/ranking'
import type { ProfileCategoryRank } from '../types/profile'
import { INITIAL_POSTS } from '../data/initialPosts'
import { EXPLORE_SEED_POSTS } from '../data/exploreSeedPosts'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { applyVoteToPost, COMBO_TARGET } from '../utils/comboEngine'
import {
  buildDynamicRankings,
  buildCategoryRanksFromBoard,
  getUserTotalPointsFromBoard,
} from '../utils/appRankings'
import { dedupePostsById, normalizePost } from '../utils/normalizePost'
import { auth, db, googleProvider } from '../lib/firebase'

function buildInitialPosts(): AppPost[] {
  return dedupePostsById(
    [...INITIAL_POSTS, ...EXPLORE_SEED_POSTS].map((p) => normalizePost(p)),
  )
}

function isProfileComplete(p: RegisterProfile): boolean {
  return (
    p.username.trim() !== '' &&
    p.country.trim() !== '' &&
    p.city.trim() !== '' &&
    p.gender.trim() !== '' &&
    p.age.trim() !== '' &&
    p.profession.trim() !== '' &&
    p.maritalStatus.trim() !== '' &&
    p.interests.trim() !== ''
  )
}

function buildDefaultProfile(input: {
  username: string
  fullName?: string
  country?: string
  city?: string
  gender?: string
  age?: string
  profession?: string
  maritalStatus?: string
  interests?: string
}): RegisterProfile {
  return {
    username: input.username,
    fullName: input.fullName ?? '',
    country: input.country ?? 'Türkiye',
    city: input.city ?? 'İstanbul',
    gender: input.gender ?? 'Belirtmek istemiyorum',
    age: input.age ?? '25',
    profession: input.profession ?? 'Kullanıcı',
    maritalStatus: input.maritalStatus ?? 'Bekar',
    interests: input.interests ?? 'Teknoloji',
  }
}

function usernameFromFirebase(user: FirebaseUser): string {
  const fromEmail =
    user.email?.split('@')[0]?.trim().replace(/\s+/g, '_') ?? ''
  const fromDisplayName =
    user.displayName?.trim().toLowerCase().replace(/\s+/g, '_') ?? ''
  return fromEmail || fromDisplayName || `user_${user.uid.slice(0, 6)}`
}

interface OnboardingInput {
  country: string
  city: string
  age: string
  gender: string
  maritalStatus: string
  profession: string
}

interface AppContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  authLoading: boolean
  isOnboarded: boolean
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (email: string, password: string) => Promise<void>
  completeOnboarding: (input: OnboardingInput) => Promise<void>
  logout: () => Promise<void>
  posts: AppPost[]
  feedPosts: AppPost[]
  addPost: (input: NewPostInput) => AppPost
  getPost: (id: string) => AppPost | undefined
  voteOnPost: (postId: string, type: 'like' | 'dislike') => void
  rankings: RankedUser[]
  getPostsByUser: (userId: string) => AppPost[]
  getUserTotalPoints: (username?: string) => number
  getCategoryRanks: () => ProfileCategoryRank[]
  getWorldRank: () => number
  comboTarget: number
  fullScreenOpen: boolean
  fullScreenStartId: string | null
  fullScreenType: PostType | null
  fullScreenPosts: AppPost[]
  openFullScreenFeed: (postId: string, type: PostType) => void
  closeFullScreenFeed: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<AuthUser | null>(
    'myrank1-user',
    null,
  )
  const [posts, setPosts] = useLocalStorage<AppPost[]>(
    'myrank1-posts',
    buildInitialPosts(),
  )
  const [fullScreenStartId, setFullScreenStartId] = useState<string | null>(
    null,
  )
  const [fullScreenType, setFullScreenType] = useState<PostType | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isOnboarded, setIsOnboarded] = useState(false)

  const normalizedPosts = useMemo(
    () => posts.map((p) => normalizePost(p)),
    [posts],
  )

  const rankings = useMemo(
    () => buildDynamicRankings(normalizedPosts, user),
    [normalizedPosts, user],
  )

  const feedPosts = useMemo(
    () =>
      [...normalizedPosts].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      ),
    [normalizedPosts],
  )

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setIsOnboarded(false)
        setAuthLoading(false)
        return
      }

      const uid = firebaseUser.uid
      const userRef = doc(db, 'users', uid)
      const snap = await getDoc(userRef)
      const username = usernameFromFirebase(firebaseUser)
      const fullName = firebaseUser.displayName ?? ''

      if (snap.exists() && snap.data().isOnboarded === true) {
        const data = snap.data()
        const profile = buildDefaultProfile({
          username: String(data.username ?? username),
          fullName: String(data.fullName ?? fullName),
          country: String(data.country ?? 'Türkiye'),
          city: String(data.city ?? 'İstanbul'),
          gender: String(data.gender ?? 'Belirtmek istemiyorum'),
          age: String(data.age ?? '25'),
          profession: String(data.profession ?? 'Kullanıcı'),
          maritalStatus: String(data.maritalStatus ?? 'Bekar'),
          interests: String(data.interests ?? 'Teknoloji'),
        })
        if (isProfileComplete(profile)) {
          setUser({
            id: uid,
            username: profile.username,
            profile,
          })
          setIsOnboarded(true)
        } else {
          setUser({
            id: uid,
            username,
            profile: buildDefaultProfile({
              username,
              fullName,
            }),
          })
          setIsOnboarded(false)
        }
      } else {
        setUser({
          id: uid,
          username,
          profile: buildDefaultProfile({
            username,
            fullName,
          }),
        })
        setIsOnboarded(false)
      }

      setAuthLoading(false)
    })

    return () => unsub()
  }, [setUser])

  const loginWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider)
  }, [])

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password)
    },
    [],
  )

  const registerWithEmail = useCallback(
    async (email: string, password: string) => {
      await createUserWithEmailAndPassword(auth, email, password)
    },
    [],
  )

  const completeOnboarding = useCallback(
    async (input: OnboardingInput) => {
      const current = auth.currentUser
      if (!current) {
        throw new Error('Kimlik bilgisi bulunamadi')
      }

      const username = usernameFromFirebase(current)
      const profile = buildDefaultProfile({
        username,
        fullName: current.displayName ?? '',
        country: input.country.trim(),
        city: input.city.trim(),
        gender: input.gender.trim(),
        age: input.age.trim(),
        profession: input.profession.trim(),
        maritalStatus: input.maritalStatus.trim(),
        interests: 'Teknoloji',
      })

      await setDoc(doc(db, 'users', current.uid), {
        uid: current.uid,
        email: current.email ?? '',
        username: profile.username,
        fullName: profile.fullName ?? '',
        interests: profile.interests,
        country: profile.country,
        city: profile.city,
        gender: profile.gender,
        age: profile.age,
        profession: profile.profession,
        maritalStatus: profile.maritalStatus,
        isOnboarded: true,
        updatedAt: serverTimestamp(),
      }, { merge: true })

      setUser({
        id: current.uid,
        username: profile.username,
        profile,
      })
      setIsOnboarded(true)
    },
    [setUser],
  )

  const logout = useCallback(async () => {
    await signOut(auth)
    setUser(null)
    setIsOnboarded(false)
  }, [setUser])

  const addPost = useCallback(
    (input: NewPostInput): AppPost => {
      const post = normalizePost({
        id: `post-${Date.now()}`,
        userId: user?.id ?? 'guest',
        author: user?.username ?? 'anonim',
        type: input.type,
        content: input.content.trim(),
        mediaUrl: input.mediaUrl,
        createdAt: new Date().toISOString(),
      })
      setPosts((prev) => [post, ...prev.map((p) => normalizePost(p))])
      return post
    },
    [user, setPosts],
  )

  const getPost = useCallback(
    (id: string) => normalizedPosts.find((p) => p.id === id),
    [normalizedPosts],
  )

  const voteOnPost = useCallback(
    (postId: string, type: 'like' | 'dislike') => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? applyVoteToPost(normalizePost(p), type) : p,
        ),
      )
    },
    [setPosts],
  )

  const getPostsByUser = useCallback(
    (userId: string) =>
      normalizedPosts.filter((p) => p.userId === userId),
    [normalizedPosts],
  )

  const getUserTotalPoints = useCallback(
    (username?: string) => {
      const name = username ?? user?.username
      if (!name) return 0
      return getUserTotalPointsFromBoard(rankings, name)
    },
    [rankings, user],
  )

  const getCategoryRanks = useCallback((): ProfileCategoryRank[] => {
    if (!user) return []
    return buildCategoryRanksFromBoard(
      user.profile,
      user.username,
      rankings,
    )
  }, [user, rankings])

  const getWorldRank = useCallback((): number => {
    if (!user) return 0
    const ranks = getCategoryRanks()
    return ranks.find((r) => r.key === 'world')?.rank ?? 0
  }, [user, getCategoryRanks])

  const fullScreenPosts = useMemo(() => {
    if (!fullScreenType) return []
    return feedPosts.filter((p) => p.type === fullScreenType)
  }, [feedPosts, fullScreenType])

  const fullScreenOpen = fullScreenType !== null && fullScreenStartId !== null

  const openFullScreenFeed = useCallback(
    (postId: string, type: PostType) => {
      setFullScreenStartId(postId)
      setFullScreenType(type)
    },
    [],
  )

  const closeFullScreenFeed = useCallback(() => {
    setFullScreenStartId(null)
    setFullScreenType(null)
  }, [])

  const value: AppContextType = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      authLoading,
      isOnboarded,
      loginWithGoogle,
      loginWithEmail,
      registerWithEmail,
      completeOnboarding,
      logout,
      posts: normalizedPosts,
      feedPosts,
      addPost,
      getPost,
      voteOnPost,
      rankings,
      getPostsByUser,
      getUserTotalPoints,
      getCategoryRanks,
      getWorldRank,
      comboTarget: COMBO_TARGET,
      fullScreenOpen,
      fullScreenStartId,
      fullScreenType,
      fullScreenPosts,
      openFullScreenFeed,
      closeFullScreenFeed,
    }),
    [
      user,
      authLoading,
      isOnboarded,
      loginWithGoogle,
      loginWithEmail,
      registerWithEmail,
      completeOnboarding,
      logout,
      normalizedPosts,
      feedPosts,
      addPost,
      getPost,
      voteOnPost,
      rankings,
      getPostsByUser,
      getUserTotalPoints,
      getCategoryRanks,
      getWorldRank,
      fullScreenOpen,
      fullScreenStartId,
      fullScreenType,
      fullScreenPosts,
      openFullScreenFeed,
      closeFullScreenFeed,
    ],
  )

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider')
  }
  return ctx
}

export function useAuth() {
  const app = useApp()
  return {
    user: app.user,
    isAuthenticated: app.isAuthenticated,
    authLoading: app.authLoading,
    isOnboarded: app.isOnboarded,
    loginWithGoogle: app.loginWithGoogle,
    completeOnboarding: app.completeOnboarding,
    logout: app.logout,
  }
}

export function usePosts() {
  const app = useApp()
  return {
    posts: app.posts,
    addPost: app.addPost,
    getPostsByUser: app.getPostsByUser,
  }
}
