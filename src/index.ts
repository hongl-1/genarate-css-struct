/**
 * 1. 通过读取.vue的文件中的template 生成ast树
 * 2. 获取ast中class 三步走 1) 获取直接的class 2) 获取数组的 3) 获取对象的
 * 3. 通过ast结构生成class树
 */


import parse from './parse'

const res = parse('<template><div class="abc"></div></template>')

console.log(res)
