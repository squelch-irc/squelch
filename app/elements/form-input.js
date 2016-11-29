const html = require('choo/html')
const cn = require('classnames')
const Input = require('./input')

module.exports = (opts) => {
  opts.name = opts.name || ''
  opts.label = opts.label || ''
  opts.subLabel = opts.subLabel || ''
  opts.error = opts.error || ''

  opts = Object.assign({}, opts, {
    divClass: cn('pb4', opts.className),
    className: cn('db w-100 o-100 f4 pa3', opts.inputClass),
    labelClass: cn('db pb1 f5', opts.labelClass),
    subLabelClass: cn({
      'db pb2 f5 fw2 gray': opts.subLabel,
      'dn': !opts.subLabel
    }, opts.labelClass),
    errorClass: cn('ml2 fw9 i red', opts.errorClass)
  })

  return html`
    <div class=${opts.divClass}>
      <label for=${opts.name} class=${opts.labelClass}>
        ${opts.label}
        <span class=${opts.errorClass}>${opts.error}</span>
      </label>
      <div class=${opts.subLabelClass}>${opts.subLabel}</div>
      ${Input(opts)}
    </div>
  `
}
