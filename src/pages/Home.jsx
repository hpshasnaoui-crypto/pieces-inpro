import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MODELES, piecesParModele } from '../pieces'
import './Home.css'

function Home() {
  useEffect(() => {
    document.title = 'Pieces HPS'
  }, [])

  return (
    <main className="home">
      {MODELES.map((modele) => (
        <section className="home__section" key={modele}>
          <h2 className="home__modele">{modele}</h2>
          <ul className="home__grid">
            {piecesParModele(modele).map((piece) => (
              <li key={piece.slug}>
                <Link className="home__card" to={`/piece/${piece.slug}`}>
                  <img
                    className="home__thumb"
                    src={piece.poster}
                    alt={piece.alt}
                    width="640"
                    height="640"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="home__name">{piece.profil}</span>
                  <span className="home__pack">pack {piece.pack}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}

export default Home
