import React from 'react'

let styleElement
let counter = 0

function getStyleElement() {
  if (typeof document === 'undefined') {
    return null
  }

  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.setAttribute('data-styled-shim', 'true')
    document.head.appendChild(styleElement)
  }

  return styleElement
}

function injectStyles(className, cssText) {
  const element = getStyleElement()

  if (!element) {
    return
  }

  const processedCss = cssText.replace(/&/g, `.${className}`)
  element.appendChild(document.createTextNode(`.${className}{${processedCss}}`))
}

function styledFactory(tagOrComponent) {
  return (strings, ...values) => {
    const cssText = strings.reduce((acc, current, index) => acc + current + (values[index] ?? ''), '')
    const className = `sc-${counter++}`

    injectStyles(className, cssText)

    const StyledComponent = ({ className: extraClassName, as: asComponent, ...props }) => {
      const Component = asComponent || tagOrComponent
      const combined = extraClassName ? `${extraClassName} ${className}` : className

      return React.createElement(Component, { ...props, className: combined })
    }

    StyledComponent.displayName = `Styled(${typeof tagOrComponent === 'string' ? tagOrComponent : tagOrComponent.name || 'Component'})`

    return StyledComponent
  }
}

const styled = new Proxy(styledFactory, {
  apply(_target, _thisArg, args) {
    return styledFactory(...args)
  },
  get(_target, prop) {
    return styledFactory(prop)
  },
})

export default styled
