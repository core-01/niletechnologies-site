import { Link } from 'react-router-dom'

function Button({
  children,
  to,
  type = 'button',
  variant = 'primary',
  className = '',
  ...props
}) {
  const classes = `btn btn-${variant} ${className}`.trim()

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  )
}

export default Button
