import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { normalizePost } from '../utils/normalizePost'
import type { AppPost, NewPostInput } from '../types/post'
import type { AuthUser } from '../types'

function mapFirestorePost(
  postDoc: QueryDocumentSnapshot<DocumentData>,
): AppPost {
  const raw = postDoc.data()

  return normalizePost({
    id: postDoc.id,
    userId: String(raw.userId ?? 'guest'),
    author: String(raw.author ?? 'anonim'),
    type: String(raw.type ?? 'tweet') as AppPost['type'],
    content: String(raw.content ?? ''),
    createdAt:
      raw.createdAt && typeof raw.createdAt.toDate === 'function'
        ? raw.createdAt.toDate().toISOString()
        : String(raw.createdAt ?? new Date().toISOString()),
    mediaUrl: raw.mediaUrl ? String(raw.mediaUrl) : undefined,
    likes: Number(raw.likes ?? 0),
    dislikes: Number(raw.dislikes ?? 0),
    comboDirection: raw.comboDirection ?? null,
    comboCount: Number(raw.comboCount ?? 0),
    lastServerAction: raw.lastServerAction ?? null,
  })
}

export function subscribeToPosts(
  onPosts: (posts: AppPost[]) => void,
  onError?: (error: unknown) => void,
): Unsubscribe {
  const postsCollection = collection(db, 'posts')

  return onSnapshot(
    postsCollection,
    { includeMetadataChanges: false },
    (snapshot) => {
      const posts = snapshot.docs.map(mapFirestorePost)
      onPosts(posts)
    },
    (error) => {
      if (onError) {
        onError(error)
      } else {
        console.error('PostService.subscribeToPosts error:', error)
      }
    },
  )
}

export async function createPost(
  input: NewPostInput,
  user: AuthUser | null,
): Promise<string> {
  const postPayload = {
    userId: user?.id ?? 'guest',
    author: user?.username ?? 'anonim',
    type: input.type,
    content: input.content.trim(),
    mediaUrl: input.mediaUrl ?? null,
    likes: 0,
    dislikes: 0,
    comboDirection: null,
    comboCount: 0,
    lastServerAction: null,
    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(collection(db, 'posts'), postPayload)
  return docRef.id
}

export type PostVoteUpdate = {
  likes: number
  dislikes: number
  comboDirection: AppPost['comboDirection']
  comboCount: number
  lastServerAction: AppPost['lastServerAction']
}

export async function voteOnPost(
  postId: string,
  voteUpdate: PostVoteUpdate,
): Promise<void> {
  if (postId.startsWith('temp-')) return
  await updateDoc(doc(db, 'posts', postId), voteUpdate)
}
