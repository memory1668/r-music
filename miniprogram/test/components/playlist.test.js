const simulate = require('miniprogram-simulate')
const path = require('path')

test('test playlist', () => {
  const id = simulate.load(path.join(__dirname, '../../components/playlist/playlist')) // 此处必须传入绝对路径
  const comp = simulate.render(id, {
    playlistitem: {
      name: '那些好听却记不起歌名的歌',
      playCount: 179162
    }
  }) // 渲染成自定义组件树实例

  const parent = document.createElement('parent-wrapper') // 创建父亲节点
  comp.attach(parent) // attach 到父亲节点上，此时会触发自定义组件的 attached 钩子

  const name = comp.querySelector('.playlist-name') // 获取子组件
  const count = comp.querySelector('.playlist-count') // 获取子组件
  expect(name.dom.innerHTML).toBe('那些好听却记不起歌名的歌') // 测试渲染结果
  // expect(count.dom.innerHTML).toBe('') // 测试渲染结果
  // expect(window.getComputedStyle(view.dom).color).toBe('green') // 测试渲染结果
})