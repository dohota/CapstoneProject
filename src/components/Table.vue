<template>
    <table class="excel">
        <tr class="row">
            <th class="col">序号</th>
            <th class="col">单位名称</th>
            <th class="col">生命值</th>
            <th class="col">年龄</th>
            <th class="col">职业</th>
            <th class="col">特殊属性</th>
        </tr>
        <tr class="row">
            <td class="col">{{ id }}</td>
            <td class="col">大秦王</td>
            <td class="col">100</td>
            <td class="col">55</td>
            <td class="col">战斗英雄</td>
            <td class="col">不能贿赂</td>
        </tr>
        <tr class="row">
            <td class="col">{{ id+1 }}</td>
            <td class="col">农民</td>
            <td class="col">20</td>
            <td class="col">30</td>
            <td class="col">负责种地</td>
            <td class="col">无</td>
        </tr>
    </table>
</template>

<script setup lang="ts">
import {ref} from 'vue'
let id = ref(1);
</script>

<style lang="less" scoped>
.excel{
    border: 2px;
    border-radius: 40px;
    .row{
        .col{
        background-color: cadetblue;
        width: 160px;
        height: 50px;
        font-size: xx-large;
        color:blueviolet;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        text-align: center;
        text-shadow: 1px 1px 1px black;
    }
    .col:hover{
        transform: scale(0.95);
        background-color: rgb(239, 54, 54);
        color:black;
        text-shadow: 1px 1px 1px purple;
    }
    }
    
}
</style>