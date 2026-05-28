import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { PostType } from '../types/post'
import TypeSelector from '../components/create/TypeSelector'
import TweetForm from '../components/create/TweetForm'
import VideoForm from '../components/create/VideoForm'
import PhotoForm from '../components/create/PhotoForm'
import Button from '../components/ui/Button'
import { getAvatarUrl } from '../utils/avatar'
import { readFileAsDataUrl } from '../utils/postMedia'

const VIDEO_FALLBACK =
  'https://images.unsplash.com/photo-1611162617474-5b21e939e113?w=400&q=80'
const VIDEO_LIMIT_ERROR =
  'MyRank kuralları gereği videolar maksimum 33 saniye olabilir. Lütfen kırpıp tekrar dene.'

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      resolve(video.duration || 0)
      URL.revokeObjectURL(url)
    }
    video.onerror = () => {
      reject(new Error('Video suresi okunamadi'))
      URL.revokeObjectURL(url)
    }
    video.src = url
  })
}

export default function CreatePost() {
  const navigate = useNavigate()
  const { user, addPost } = useApp()

  const [postType, setPostType] = useState<PostType>('tweet')
  const [tweetText, setTweetText] = useState('')
  const [caption, setCaption] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>()
  const [error, setError] = useState('')
  const [videoDurationError, setVideoDurationError] = useState('')

  const handlePhotoFile = async (file: File | null) => {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    if (!file) {
      setPhotoPreview(null)
      setPhotoDataUrl(undefined)
      return
    }
    setPhotoPreview(URL.createObjectURL(file))
    try {
      setPhotoDataUrl(await readFileAsDataUrl(file))
    } catch {
      setPhotoDataUrl(undefined)
    }
  }

  const handleVideoFile = async (file: File | null) => {
    if (videoPreview) URL.revokeObjectURL(videoPreview)
    if (!file) {
      setVideoPreview(null)
      setVideoDurationError('')
      return
    }
    try {
      const duration = await getVideoDuration(file)
      if (duration > 33) {
        setVideoPreview(null)
        setVideoDurationError(VIDEO_LIMIT_ERROR)
        return
      }
      setVideoDurationError('')
      setVideoPreview(URL.createObjectURL(file))
    } catch {
      setVideoPreview(null)
      setVideoDurationError('Video dosyası okunamadı. Lütfen başka bir dosya deneyin.')
    }
  }

  const handleShare = () => {
    setError('')

    if (postType === 'tweet') {
      if (!tweetText.trim()) {
        setError('Tweet metni boş olamaz.')
        return
      }
      addPost({ type: 'tweet', content: tweetText.trim() })
    } else if (postType === 'video') {
      if (videoDurationError) {
        setError(videoDurationError)
        return
      }
      if (!caption.trim() && !videoPreview) {
        setError('Video veya açıklama ekleyin.')
        return
      }
      addPost({
        type: 'video',
        content: caption.trim() || 'Video gönderisi',
        mediaUrl: VIDEO_FALLBACK,
      })
    } else {
      if (!photoDataUrl && !photoPreview) {
        setError('Bir fotoğraf seçin.')
        return
      }
      addPost({
        type: 'photo',
        content: caption.trim() || 'Fotoğraf gönderisi',
        mediaUrl: photoDataUrl ?? photoPreview ?? undefined,
      })
    }

    navigate('/', { replace: true })
  }

  if (!user) return null

  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 pb-8">
      <h1 className="text-lg font-bold text-neutral-900 mb-4">
        Yeni Gönderi
      </h1>

      <TypeSelector value={postType} onChange={setPostType} />

      <div className="mt-4">
        {postType === 'tweet' && (
          <TweetForm
            avatarUrl={getAvatarUrl(user.username)}
            text={tweetText}
            onTextChange={setTweetText}
          />
        )}
        {postType === 'video' && (
          <VideoForm
            caption={caption}
            previewUrl={videoPreview}
            onCaptionChange={setCaption}
            onFileSelect={handleVideoFile}
            durationError={videoDurationError}
          />
        )}
        {postType === 'photo' && (
          <PhotoForm
            caption={caption}
            previewUrl={photoPreview}
            onCaptionChange={setCaption}
            onFileSelect={handlePhotoFile}
          />
        )}
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-6">
        <Button
          type="button"
          variant={postType === 'video' ? 'red' : 'blue'}
          fullWidth
          onClick={handleShare}
          disabled={postType === 'video' && Boolean(videoDurationError)}
          className="rounded-xl py-3"
        >
          Paylaş
        </Button>
      </div>
    </div>
  )
}
