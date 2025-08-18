<template>
    <div class="bar2">
      <router-link to="culture"><button class="btn">
        <img src="../assets/culture.png" class="tu"><p class="mi">文明系统</p><p class="i">介绍政策，国家组织形式等</p>
      </button></router-link>
      <router-link to="industry"><button class="btn">
        <img src="../assets/ss.png" class="tu"><p class="mi">产业系统</p><p class="i">介绍工具，实体及产业链（农业，工业）</p>
      </button></router-link>
      <router-link to="card"><button class="btn">
        <img src="../assets/card.png" class="tu"><p class="mi">卡牌系统</p><p class="i">特殊的卡牌模式</p>
      </button></router-link>
      <router-link to="a2"><button class="btn">
        <p class="mi">其它系统2</p><p class="i">其他的系统</p>
      </button></router-link>
    </div>
</template>

<script setup lang="ts">
</script>

<style lang="less" scoped>
.bar2{
    position: relative;
    display: flex;
    flex-direction: row;
  .btn{
    cursor: pointer;
    border: 5px dashed #FF5722;
    background:
    linear-gradient(to top, green, 10px, transparent 10px),
    linear-gradient(to right, green, 10px, transparent 10px),
    linear-gradient(to bottom, green, 10px, transparent 10px),
    linear-gradient(to left, green, 10px, transparent 10px);
    //background-origin: border-box;
    background-image: linear-gradient(rgb(196, 196, 250), rgb(82, 181, 190), rgb(35, 40, 169));
    margin-top: 32px;
    margin-bottom:37px;
    margin-left: 20px;
    margin-right: 20px;
    border-radius: 40px;
    width: 300px;
    height: 250px;
    .tu{
      cursor: grab;
      position: relative;
      top: 70px;
      left: 90px;
      height: 100px;
      width: 80px;
      margin-top: 10px;
      margin-left: 20px;
    }
    .mi{
      position: relative;
      bottom:25%;
      right:30%;
      font-size: larger;
      font-family:Verdana, Geneva, Tahoma, sans-serif;
      background: linear-gradient(to right, rgb(235, 229, 229), rgb(239, 11, 11));//文字渐变色
      -webkit-background-clip: text;
      color: transparent;
    }
    .i{
      position: relative;
      bottom:22%;
      right:17%;
      color:rgb(205, 50, 177);
    }
    .mi:hover{
      transform: scale(1.4);
      color:black;
    }
    .i:hover{
      transform: scale(1.6);
      color: aqua;
    }
    .tu:hover{
      transform: scale(0.7);
    }
  }
  .btn:hover{
    transform: scale(0.85);
  }
  }
</style>