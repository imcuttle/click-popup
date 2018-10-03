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

  const isSupportTouchStart = 'ontouchstart' in document.documentElement

  const clickHandler = evt => {
    let { pageX, pageY } = evt
    if (evt.type === 'touchstart' && evt.touches && evt.touches[0]) {
      pageX = evt.touches[0].pageX
      pageY = evt.touches[0].pageY
    }

    let left = pageX //- bodyRect.left
    let top = pageY - 3 //- bodyRect.top

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

  const eventName = isSupportTouchStart ? 'touchstart' : 'click'
  node.addEventListener(eventName, clickHandler, false)
  // node.addEventListener('touchstart', clickHandler, false)

  const close = () => {
    node.removeEventListener(eventName, clickHandler, false)
  }

  if (module.hot && process.env.NODE_ENV !== 'production') {
    module.hot.accept(['./'], close)
  }

  return close
}

export default popup
