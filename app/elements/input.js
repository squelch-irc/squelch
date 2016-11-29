const html = require('choo/html')
const cn = require('classnames')

module.exports = ({
  name = '',
  type = 'text',
  value = '',
  className = '',
  placeholder = '',
  min = '',
  max = '',
  onInput = () => {}
}) => {
  const classes = cn(
    'input-reset bg-transparent pa2 br1 ba light-gray b--gray focus-b--light-gray outline-transparent',
    className
  )

  return html`
    <input
      type=${type}
      name=${name}
      class=${classes}
      placeholder=${placeholder}
      min=${min}
      max=${max}
      value=${value != null ? value : ''}
      oninput=${(e) => onInput(e.target.value, e)}
    >
  `
}
