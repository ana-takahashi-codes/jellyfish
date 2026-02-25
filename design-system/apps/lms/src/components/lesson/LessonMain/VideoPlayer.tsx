import { Icon } from '@jellyfish-ds/ui/icon'

interface VideoPlayerProps {
  videoUrl?: string
  title: string
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  return (
    <div className="video-player" role="region" aria-label={`Vídeo: ${title}`}>
      {videoUrl ? (
        <iframe
          src={videoUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="video-player__placeholder">
          <Icon name="video-off" size="3xl" fill="muted" decorative />
          <span className="video-player__placeholder-text">Vídeo não disponível</span>
        </div>
      )}
    </div>
  )
}
