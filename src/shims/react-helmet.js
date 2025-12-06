import React, { useEffect } from 'react'

export function Helmet({ children }) {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        return
      }

      if (child.type === 'title') {
        document.title = Array.isArray(child.props.children)
          ? child.props.children.join(' ')
          : child.props.children
      }

      if (child.type === 'meta' && child.props?.name) {
        let meta = document.querySelector(`meta[name="${child.props.name}"]`)

        if (!meta) {
          meta = document.createElement('meta')
          meta.setAttribute('name', child.props.name)
          document.head.appendChild(meta)
        }

        if (child.props.content) {
          meta.setAttribute('content', child.props.content)
        }
      }
    })
  }, [children])

  return null
}
