import { useEffect, useRef, useState } from 'react'
import '@google/model-viewer'
import './Model3D.css'

function Model3D({ src, iosSrc, poster, alt, height = '100%' }) {
  const viewerRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [failed, setFailed] = useState(false)
  const [arError, setArError] = useState('')

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const onProgress = (event) => setProgress(event.detail.totalProgress)
    const onError = () => setFailed(true)

    // 'failed' = la session AR n'a pas pu demarrer
    // (permission camera refusee, appareil non compatible...)
    const onArStatus = (event) => {
      setArError(
        event.detail.status === 'failed'
          ? "Impossible de demarrer l'AR. Autorisez l'acces a la camera."
          : '',
      )
    }

    // La camera fonctionne mais la surface n'est pas encore detectee
    const onArTracking = (event) => {
      setArError(
        event.detail.status === 'not-tracking'
          ? 'Deplacez lentement le telephone pour detecter le sol.'
          : '',
      )
    }

    viewer.addEventListener('progress', onProgress)
    viewer.addEventListener('error', onError)
    viewer.addEventListener('ar-status', onArStatus)
    viewer.addEventListener('ar-tracking', onArTracking)

    return () => {
      viewer.removeEventListener('progress', onProgress)
      viewer.removeEventListener('error', onError)
      viewer.removeEventListener('ar-status', onArStatus)
      viewer.removeEventListener('ar-tracking', onArTracking)
    }
  }, [])

  const loaded = progress >= 1

  return (
    <model-viewer
      ref={viewerRef}
      class="model3d"
      src={src}
      ios-src={iosSrc}
      poster={poster}
      alt={alt}
      camera-controls
      auto-rotate
      auto-rotate-delay="1000"
      rotation-per-second="30deg"
      shadow-intensity="1"
      shadow-softness="1"
      exposure="1"
      environment-image="neutral"
      interaction-prompt="auto"
      loading="eager"
      ar
      ar-modes="webxr scene-viewer quick-look"
      ar-scale="auto"
      ar-placement="floor"
      xr-environment
      style={{ height }}
    >
      <div
        className={`model3d__progress${loaded ? ' model3d__progress--done' : ''}`}
        slot="progress-bar"
      >
        <div
          className="model3d__bar"
          style={{ width: `${Math.round(progress * 100)}%` }}
        ></div>
      </div>

      {/* model-viewer masque ce bouton automatiquement quand l'AR
          n'est pas disponible, et gere le clic (demande de permission camera). */}
      <button className="model3d__ar-button" slot="ar-button" type="button">
        Voir dans votre piece
      </button>

      {arError && <div className="model3d__toast">{arError}</div>}

      {failed && (
        <div className="model3d__error" slot="poster">
          Impossible de charger le modele 3D.
        </div>
      )}
    </model-viewer>
  )
}

export default Model3D
