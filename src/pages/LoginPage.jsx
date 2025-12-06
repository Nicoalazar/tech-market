import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext.jsx'

function LoginPage({ navigate }) {
  const { isAuthenticated, login } = useAuth()
  const [formValues, setFormValues] = useState({ user: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/')
  //   }
  // }, [isAuthenticated, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      const isAdmin = formValues.user === "admin" && formValues.password === "admin"
      login({ user: formValues.user, password: formValues.password })
      toast.success('Sesión iniciada correctamente')
      if(isAdmin){
        navigate('/admin')
        return
      }
      navigate('/cart')
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
        <p>Inicia sesión para acceder a tu carrito y tus productos.</p>
        <form onSubmit={handleSubmit} className="auth-card__form">
          <div className="auth-card__form">
          <label>
            Usuario
          </label>
            <input name="user" type="text" value={formValues.user} onChange={handleChange} />
          </div>
          <div className="auth-card__form">
          <label>
            Contraseña
          </label>
            <input name="password" type="password" value={formValues.password} onChange={handleChange} />
          </div>
          <button type="submit" className="button" disabled={submitting}>
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
