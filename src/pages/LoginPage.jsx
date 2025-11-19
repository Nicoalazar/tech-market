import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext.jsx'

function LoginPage({ navigate }) {
  const { isAuthenticated, login } = useAuth()
  const [formValues, setFormValues] = useState({ email: '', name: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      login({ email: formValues.email, name: formValues.name })
      toast.success('Sesión iniciada correctamente')
      navigate('/products')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <Helmet>
        <title>Login | Tech Market</title>
        <meta name="description" content="Inicia sesión para administrar tu carrito y tus productos." />
      </Helmet>
      <div className="auth-card">
        <h2>Bienvenido nuevamente</h2>
        <p>Inicia sesión para acceder a tu carrito y al panel administrativo.</p>
        <form onSubmit={handleSubmit} className="auth-card__form">
          <label>
            Correo electrónico
            <input name="email" type="email" value={formValues.email} onChange={handleChange} required />
          </label>
          <label>
            Nombre
            <input name="name" value={formValues.name} onChange={handleChange} placeholder="Opcional" />
          </label>
          <button type="submit" className="button" disabled={submitting}>
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
