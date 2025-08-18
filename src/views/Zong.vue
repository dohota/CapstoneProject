<template>
    <Menu></Menu>
    <Left></Left>
    <div class="liter" contenteditable="true"></div>
</template>
 
<script setup lang="ts">
import Menu from '../components/Menu.vue'
import Left from '../components/Left.vue'
</script>

<style lang="less" scoped>
.mine{
    position: absolute;
    left:15%;
    top:10%;
}
.liter{
  background-color: black;
  color: aliceblue; 
  width: 1000px;
  height: 200px;
  min-height: 100px;
  //设置元素的最小高度
  line-height: 30px;
  //设置行高
  margin: 0 auto;
  //外边距
  padding: 10px;
   //内边距
  outline: 0; 
  //去掉虚框 * 浏览器如Firefox在可编辑模式下的div获取焦点的时候会有虚框，而实际上textarea是 没有虚框显示的 */
  border: 1px solid #a0b3d6;
  //设置边框1px厚，实线，蓝色的边框线
  border-radius: 4px;
  font-size: 12px;
  word-wrap: break-word; 
  //允许长的内容长单词或 URL 地址内部可以自动换行。
  overflow-x: hidden;
  //左/右边缘进行裁剪，裁剪内容 - 隐藏滚动条
  overflow-y: auto;
  //上/下边缘的裁剪，裁剪内容 - 不隐藏滚动条
  overflow-y: visible;
 -webkit-user-modify: read-write-plaintext-only;
}
</style>