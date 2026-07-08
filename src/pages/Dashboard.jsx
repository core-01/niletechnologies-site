import Button from '../components/Button'
import Reveal from '../components/Reveal'
import useAuth from '../hooks/useAuth'

function Dashboard() {
  const { user } = useAuth()

  return (
    <section className="dashboard-page section">
      <Reveal className="dashboard-panel">
        <p className="section-kicker">Protected-ish zone</p>
        <h1>Welcome, {user?.name || 'future legend'}.</h1>
        <p>
          This dashboard is intentionally tiny for now. It proves protected
          routing works, then politely waits for real product decisions.
        </p>
        <Button to="/" variant="secondary">
          Back to the public circus
        </Button>
      </Reveal>
    </section>
  )
}

export default Dashboard
