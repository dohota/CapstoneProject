<template>
  <div class="home">
    <Menu></Menu>
    <SelectBox></SelectBox>
  </div>
</template>

<script setup lang="ts">
import Menu from '../components/Menu.vue'
import SelectBox from '../components/SelectBox.vue'
</script>

<style lang="less" scoped>
.home{
  background-image: url("../assets/bg2.png");
} 
</style>