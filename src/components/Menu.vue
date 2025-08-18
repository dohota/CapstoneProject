<template>
    <div class="total">
        <router-link to="/"><span class="title"><button class="title">怪物世界</button></span></router-link>
        <router-link to="author"><button class="menu">关于作者（博客）</button></router-link>
        <router-link to="data"><button class="menu">游戏数据库</button></router-link>
        <router-link to="create"><button class="menu">游戏开发全流程</button></router-link>
        <router-link to="teach"><button class="menu">游戏教学攻略</button></router-link>
        <router-link to="model"><button class="menu">模型展览</button></router-link>
        <router-link to="discuss"><button class="menu">游戏论坛</button></router-link>
        <router-link to="playing"><button class="menu">小游戏！</button></router-link>
    </div>

</template>
<script setup lang="ts">

</script>

<style lang="less" scoped>
.total{
  background-color: black;
  .title{
    color: rgb(174, 226, 43);
    text-shadow: 5px 5px 5px #FF0000;
    font-size: 55px;
    padding-left: 10px;
    cursor: pointer;
  }
  .menu{
    background-color: blueviolet;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: whitesmoke;
    border-radius: 25px;
    font-size: large;
    text-shadow: 1px 1px 1px yellow;
    margin-left: 40px;
    cursor: pointer;
  }
  .menu:hover{
    background-color: white;
    color:black;
    transform: scale(0.85);
  }
}
</style>