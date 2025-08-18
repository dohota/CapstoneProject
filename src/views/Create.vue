<template>
    <Menu></Menu>
    <Left></Left>
    <textarea class="literature">
        这个游戏体量很大
    </textarea>
    <textarea class="literature">
        对战模式
    </textarea>
    <textarea class="literature">
        游戏主要
    </textarea>
    <textarea class="literature">
        游戏包含单位，
    </textarea>
    <textarea class="literature">
        政治上参考文明6，城市规划参考城市天际线。
    </textarea>
</template>

<script setup lang="ts">
import Menu from '../components/Menu.vue'
import Left from '../components/Left.vue'
</script>

<style lang="less">
//给literature的设定对任何组件都有效
.literature{
    //边框
    border-radius: 25px;
    border: 2px solid #8AC007;
    //字体
    line-height: 30px;
    font-size: x-large;
    word-spacing: 3px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    //颜色
    color: beige;
    background-image: url('../assets/stone.png');
    //位置
    position: relative;
    left:14%;
    display: flex;
    flex-direction: column;
    width:900px;
    height: 200px;
    //文本框间隔
    margin-top: 30px;
    margin-bottom: 30px; 
}
.literature:hover{
    transform: scale(1.03);
    background-image: black;
    word-spacing: 5px;
    border-radius: 50px;
    color:azure;
}
</style>