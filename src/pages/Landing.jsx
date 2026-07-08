import heroImage from '../assets/hero.png'
import Button from '../components/Button'
import Card from '../components/Card'
import Reveal from '../components/Reveal'

const features = [
  {
    eyebrow: 'Routes',
    title: 'Future pages already have a chair',
    copy: 'Centralized route config means new screens can join without knocking over the snack table.',
    tone: 'mint',
  },
  {
    eyebrow: 'Auth',
    title: 'Mock login, real boundaries',
    copy: 'Public and protected routes are wired now, so real backend auth can arrive with luggage later.',
    tone: 'coral',
  },
  {
    eyebrow: 'UI',
    title: 'Animations with manners',
    copy: 'Cards fade in, buttons wiggle just enough, and nobody yells at the layout.',
    tone: 'sky',
  },
]

function Landing() {
  return (
    <>
      <section className="hero-section section">
        <div className="hero-copy">
          <Reveal>
            <p className="section-kicker">Software that remembered to hydrate</p>
            <h1>We build websites that do not look like they lost a bet.</h1>
            <p className="hero-text">
              Nile Technologies ships crisp React experiences with scalable
              architecture, clean routes, and just enough personality to make
              your competitors inspect element in silence.
            </p>
            <div className="hero-actions">
              <Button to="/login">Enter the tiny command center</Button>
              <a className="text-link" href="#features">
                See the shiny bits
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal className="hero-visual" delay={120}>
          <img src={heroImage} alt="A playful product illustration" />
          <div className="status-card status-card-top">
            <strong>99%</strong>
            <span>less template sadness</span>
          </div>
          <div className="status-card status-card-bottom">
            <strong>Mock auth</strong>
            <span>no backend was emotionally harmed</span>
          </div>
        </Reveal>
      </section>

      <section className="section feature-section" id="features">
        <Reveal className="section-heading">
          <p className="section-kicker">Features</p>
          <h2>Small app bones, big app posture.</h2>
        </Reveal>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              eyebrow={feature.eyebrow}
              title={feature.title}
              tone={feature.tone}
              delay={index * 90}
            >
              {feature.copy}
            </Card>
          ))}
        </div>
      </section>

      <section className="section fun-section">
        <Reveal className="fun-panel">
          <div>
            <p className="section-kicker">About, but caffeinated</p>
            <h2>Clean enough for production. Weird enough to be remembered.</h2>
          </div>
          <p>
            This single page is public, router-ready, and structured so the next
            developer can add APIs, dashboards, and billing without whispering
            apologies to the codebase.
          </p>
          <Button to="/login" variant="secondary">
            Try mock login
          </Button>
        </Reveal>
      </section>
    </>
  )
}

export default Landing
