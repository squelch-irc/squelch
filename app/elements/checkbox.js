const html = require('choo/html')
const cn = require('classnames')

module.exports = ({
  label,
  name,
  checked,
  className,
  onChange = () => {}
}) => {
  const classes = cn('flex flex-row align-center', className)

  const changeHandler = e => onChange(e.target.checked)

  return html`
    <label class=${classes}>
      <input
        type="checkbox"
        name=${name}
        ${checked ? 'checked' : ''}
        onchange=${changeHandler}
      />
      <span class="ml2">${label}</span>
    </label>
  `
}
