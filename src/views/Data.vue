<template>
    <Menu></Menu>
    <Left></Left>
    <div class="a"><Table></Table></div>
</template>

<script setup lang="ts">
import Menu from '../components/Menu.vue'
import Left from '../components/Left.vue'
import Table from '../components/Table.vue'
</script>

<style lang="less" scoped>
.a{
    position: relative;
    top:10%;
    left:13%;
}
</style>