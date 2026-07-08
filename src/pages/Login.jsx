import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import useAuth from '../hooks/useAuth'

function Login() {
  const [email, setEmail] = useState('hello@nile.dev')
  const [password, setPassword] = useState('password')
  const { isAuthenticated, isLoading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from?.pathname || '/dashboard'

  if (isAuthenticated) {
    return <Navigate to={destination} replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await login({ email, password })
    navigate(destination, { replace: true })
  }

  return (
    <section className="login-page section">
      <Reveal className="login-card">
        <p className="section-kicker">Mock login</p>
        <h1>Prove you are not three TODO comments in a trench coat.</h1>
        <p>
          Any email and password work for now. Later, this form can shake hands
          with a real API.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <Button type="submit" className="full-width" disabled={isLoading}>
            {isLoading ? 'Checking clipboard vibes...' : 'Login and look official'}
          </Button>
        </form>
      </Reveal>
    </section>
  )
}

export default Login
