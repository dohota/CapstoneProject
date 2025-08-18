<template>
    <Menu></Menu>
    <img src="../assets/p.png" :class="p" @keypress.w="up" @keypress.s="down" @keypress.a="left" @keypress.d="right">
</template>

<script setup lang="ts">
import Menu from '../components/Menu.vue';
import {ref} from 'vue'

let p = ref("player1")
function up(){
    
}
function down(){

}
function left(){

}
function right(){

}
</script>

<style lang="less" scoped>
.player1{
    position: absolute;
    top:100px;
    left:200px;
}
</style>