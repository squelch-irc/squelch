const html = require('choo/html')
const cn = require('classnames')

module.exports = ({
  text,
  active,
  highlighted,
  onClick
}) => {
  const className = cn('pv1 pl3 pointer', {
    'o-70 hover-bg-mid-gray': !active && !highlighted,
    'bg-blue hover-bg-light-blue': active,
    'fw5': highlighted && !active
  })

  const clickHandler = () => {
    if (!active) onClick()
  }

  return html`
    <li class=${className} onclick=${clickHandler}>
      <span class="pl3">${text}</span>
    </li>
  `
}
