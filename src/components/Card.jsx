import Reveal from './Reveal'

function Card({ eyebrow, title, children, tone = 'mint', delay = 0 }) {
  return (
    <Reveal className={`card card-${tone}`} delay={delay}>
      <span className="card-eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </Reveal>
  )
}

export default Card
