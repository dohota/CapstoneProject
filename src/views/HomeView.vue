<template>
  <div class="home">
    <Menu></Menu>
    <SelectBox></SelectBox>
  </div>
</template>

<script setup lang="ts">
// import { onMounted } from 'vue'
// import request from '../axio/index.js' 
import Menu from '../components/Menu.vue'
import SelectBox from '../components/SelectBox.vue'

// onMounted(() => {
//   request.post('/api/', {
//     username: 'admin',
//     password: '123456'
//   }).then((res: any) => {
//     console.log('Login Success', res)
//   }).catch((err: any) => {
//     console.error('Login fail', err)
//   })
// })

// onMounted(() => {
//   request.get('/api/').then((res: any) => {
//     console.log('请求成功', res)
//   }).catch((err: any) => {
//     console.error('请求失败', err)
//   })
// })

</script>

<style lang="less" scoped>
.home{
  background-image: url("../assets/bg2.png");
} 
</style>