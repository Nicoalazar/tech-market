import { Helmet } from 'react-helmet'

function NotFoundPage({ navigate }) {
  return (
    <div className="page">
      <Helmet>
        <title>Página no encontrada | Tech Market</title>
        <meta name="description" content="La página solicitada no existe." />
      </Helmet>
      <div className="state state--empty" role="status">
        <h2>Página no encontrada</h2>
        <p>La sección que buscas no está disponible.</p>
        <button type="button" onClick={() => navigate('/')} className="state__action">
          Ir al inicio
        </button>
      </div>
    </div>
  )
}

export default NotFoundPage
