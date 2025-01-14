export const vev = {
  install(Vue) {
    Vue.prototype.vev = function (options) {
      const { wrapper, rowHeight, data, tableDataName } = options
      const dataLength = data.length
      let num = 0
      let scrollRange = []
      const bodyWrapper = document.querySelector(wrapper + ' .el-table__body-wrapper')
      const fixedBodyWrapper = document.querySelector(wrapper + ' .el-table__fixed-body-wrapper')
  
      setTimeout(() => {
        // 放到宏任务中保证获取clientHeight时是最新的，注：即使在nexttick中这个h也不一定是最新的
        num = Math.floor((bodyWrapper.clientHeight) / rowHeight)
        bodyWrapper.style.position = 'relative'
  
        // 创建dom，高度为全部数据时的高度，使wrapper出现全部数据时的滚动条比例，模拟列表滚动
        const placeDom = document.querySelector(wrapper + ' .place-dom') || document.createElement('div')
        placeDom.className = 'place-dom'
        placeDom.style.width = '1px'
        placeDom.style.height = rowHeight * dataLength + 'px'
        bodyWrapper.appendChild(placeDom)
  
        // 初始渲染
        render(0)
  
        // 滚动到对应时机切换数据
        bodyWrapper.addEventListener('scroll', function () {
          // 滚动高度
          let n = bodyWrapper.scrollTop
          // 展示的第一条在数据中的位置
          let first = Math.floor(n / rowHeight)
          // 如果当前在范围中，则利用list的默认滚动，算是做了节流，也是为了能有滚动边界的效果，不然看到边界的数据是瞬变的
          if (first > scrollRange[0] && first + 2 * num < scrollRange[1]) return
          // 到了临界点，再更新数据重新渲染
          render(n)
        })
      }, 0)
  
      // 渲染数据
      const render = (n) => {
        let first = Math.floor(n / rowHeight)
        let leftData = data.slice(first - 2 * num, first)
        let centerData = data.slice(first, first + 2 * num)
        let rightData = data.slice(first + 2 * num, first + 4 * num)
        this[tableDataName] = [...leftData, ...centerData, ...rightData]
        // 改变list在wrapper中的位置。用translate性能更好
        const list = document.querySelector(wrapper + ' .el-table__body-wrapper .el-table__body')
        list.style.position = 'absolute'
        list.style.top = n - leftData.length * rowHeight + 'px'
        // list.style.transform = 'translateY(' + (n - leftData.length * rowHeight + 'px') + ')'
        // 如果有fixed列，做以下处理
        const list1 = document.querySelector(wrapper + ' .el-table__fixed-body-wrapper .el-table__body')
        // 设置fixed列表的宽度，按照elementui的表格处理
        fixedBodyWrapper.style.width = bodyWrapper.clientWidth + 'px'
        list1.style.position = 'absolute'
        list1.style.top = n - leftData.length * rowHeight + 'px'
        // list1.style.transform = 'translateY(' + (n - leftData.length * rowHeight + 'px') + ')'
        // 数据改变后，重置范围，在此范围内不替换数据，用list默认滚动
        scrollRange = [first - leftData.length, first + 4 * num]
      }
  
      window.onresize = e => {
        // 滚动条宽度
        // let computeScrollbarWidth = bodyWrapper.offsetWidth - bodyWrapper.clientWidth
        // 设置fixed列表的宽度，按照elementui的表格处理
        fixedBodyWrapper.style.width = bodyWrapper.clientWidth + 'px'
      }
    }
  }
}
