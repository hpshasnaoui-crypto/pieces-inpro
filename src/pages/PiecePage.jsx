import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Model3D from '../components/Model3D'
import { findPiece } from '../pieces'
import './PiecePage.css'

function PiecePage() {
  const { slug } = useParams()
  const piece = findPiece(slug)

  useEffect(() => {
    if (piece) document.title = `${piece.model} - ${piece.name}`
  }, [piece])

  if (!piece) {
    return (
      <div className="piece piece--missing">
        <p>Cette piece n&apos;existe pas.</p>
        <Link to="/">Retour aux pieces</Link>
      </div>
    )
  }

  return (
    <div className="piece">
      <Link className="piece__back" to="/" aria-label="Retour aux pieces">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M15 18l-6-6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <Model3D
        key={piece.slug}
        src={piece.src}
        iosSrc={piece.iosSrc ?? undefined}
        poster={piece.poster}
        alt={piece.alt}
      />
    </div>
  )
}

export default PiecePage
