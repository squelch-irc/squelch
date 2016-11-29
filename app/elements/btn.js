const html = require('choo/html')
const cn = require('classnames')

module.exports = ({
  label,
  href,
  className,
  colors = 'light-gray hover-white hover-bg-dark-gray',
  disabledColors = 'gray',
  disabled,
  onClick = () => {}
}) => {
  const classes = cn(
    'f6 link br1 ba ph3 pv2 dib bg-animate pointer',
    disabled ? disabledColors : colors,
    {'disabled': disabled},
    className
  )
  const clickHandler = (e) => {
    if (!href) {
      e.preventDefault()
      e.stopPropagation()
    }
    onClick(e)
  }
  return html`
    <a
      href="${href || ''}"
      class=${classes}
      onclick=${clickHandler}
    >${label}</a>
  `
}
