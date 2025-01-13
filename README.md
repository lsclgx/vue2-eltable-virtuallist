# 基于vue2和element-ui中el-table组件的虚拟列表方法

## 简介
直接写了个方法修改el-table的结构，无需破坏或修改已有el-table的模版结构，直接调用方法来转成虚拟列表。

## 使用

### 安装
npm install vue2-elTable-virtuallist --save

### 参数
options对象
|  属性   | 描述  |
|  ----  | ----  |
| wrapper  | table的类名，为了兼容一个页面多个el-table的情况 |
| rowHeight  | 行高，用来计算全部数据的高度，模拟滚动条用 |
| data  | 全部数据 |
| tableDataName  | 绑定在el-table的数据，这里传入变量名，直接操作数据，使用vue的双向绑定 |

## 代码
```js
// main.js
import { vev } from 'vue2-eltable-virtuallist'
Vue.use(vev)

// page.vue
methods: {
  getList() {
    axios.get(url, params).then(res => {
      // res为全部数据
      vev({
        wrapper: '.table_wrapper',
        rowHeight: 41,
        data: res,
        tableDataName: 'tableData'
      });
    })
  }
}
```

## 也可以将方法拷贝到全局mixin中直接使用

