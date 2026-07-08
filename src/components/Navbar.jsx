import { Link, useNavigate } from 'react-router-dom'
import Button from './Button'
import useAuth from '../hooks/useAuth'
import useScrollShadow from '../hooks/useScrollShadow'

function Navbar() {
  const hasShadow = useScrollShadow()
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className={`navbar ${hasShadow ? 'navbar-shadow' : ''}`}>
      <Link className="brand" to="/" aria-label="Nile Technologies home">
        <span className="brand-mark">NT</span>
        <span>Nile Technologies</span>
      </Link>

      {isAuthenticated ? (
        <Button variant="ghost" onClick={handleLogout}>
          Logout, tiny CEO
        </Button>
      ) : (
        <Button to="/login" variant="ghost">
          Login
        </Button>
      )}
    </header>
  )
}

export default Navbar
