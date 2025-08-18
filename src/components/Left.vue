<template>
    <div class="left">
        <router-link to="total"><button class="bn">总纲</button></router-link>
        <router-link to="map"><button class="bn">地图系统</button></router-link>
        <router-link to="people"><button class="bn">单位系统</button></router-link>
        <router-link to="a1"><button class="bn">学习vue3</button></router-link>
        <router-link to="culture"><button class="bn">文明系统</button></router-link>
        <router-link to="industry"><button class="bn">产业系统</button></router-link>
        <router-link to="card"><button class="bn">卡牌系统</button></router-link>
        <router-link to="a2"><button class="bn">其它系统</button></router-link>
    </div>
</template>

<script setup lang="ts">
</script>

<style lang="less" scoped>
.left{
        background-image: url('../assets/bg2.png');
        position: absolute;
        display: flex;
        flex-direction: column;
        width: 180px;
        .bn{
            position: relative;
            left:2%;
            cursor: pointer;
            border:2px solid;
            border-radius: 30px;
            box-shadow: 10px 10px 5px #888888;
            background-image: linear-gradient(rgb(196, 196, 250), rgb(82, 181, 190), rgb(35, 40, 169));
            margin-top: 30px;
            margin-bottom:30px;
            margin-left: 20px;
        }
        .bn:hover{
            transform: scale(2.1);
            background-color: black;
            color:azure;
        }
    }
</style>