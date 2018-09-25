/**
 * @file example
 * @author Cuttle Cong
 * @date 2018/9/25
 *
 */

import popup from './'

const span = document.createElement('span')
span.textContent = '民主'
window.dispose = popup(
  ['富强', span, '文明', '和谐', '自由', '平等', '公正', '法治', '爱国', '敬业', '诚信', '友善'],
  document.body,
  {
    index: 0,
    styleMapper: style => ({ ...style, color: 'rgb(255,102,81)', fontSize: 12, fontWeight: 'bold' })
  }
)
