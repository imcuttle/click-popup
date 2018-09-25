/**
 * The interaction about funny popup animation
 * @author imcuttle
 */
import { easing, tween, styler } from 'popmotion'

function popup(popupList = [], node, { styleMapper = sty => sty, index = 0, from, to, ...props } = {}) {
  const Node = global.Node
  if (!Node || typeof document === 'undefined') {
    console.error(`Error: click-popup should be run in browser`)
    return
  }

  if (!(node instanceof Node)) {
    throw new Error('[click-popup] `node` should be instance of Node')
  }
  if (!popupList || !Array.isArray(popupList) || !popupList.length) {
    throw new Error('[click-popup] `popupList` should be an array which is not empty')
  }

  const clickHandler = evt => {
    // const bodyRect = document.body.getBoundingClientRect()
    let left = evt.pageX //- bodyRect.left
    let top = evt.pageY - 3 //- bodyRect.top

    const span = document.createElement('span')
    const node = popupList[index++ % popupList.length]

    if (node instanceof Node) {
      span.appendChild(node)
    } else {
      span.textContent = node
    }

    Object.assign(span.style, {
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      pointerEvents: 'none'
    })
    document.body.appendChild(span)
    tween({
      from: { top: top, y: '-100%', opacity: 1, ...from },
      to: { top: top - 170, y: '-100%', opacity: 0, ...to },
      duration: 1500,
      ease: easing.easeIn,
      loop: 0,
      flip: 0,
      ...props
    }).start({
      update: style => styler(span).set(styleMapper(style, node)),
      complete: () => {
        span.parentNode && span.parentNode.removeChild(span)
      }
    })
  }
  node.addEventListener('click', clickHandler, false)

  return () => {
    node.removeEventListener('click', clickHandler, false)
  }
}

export default popup
