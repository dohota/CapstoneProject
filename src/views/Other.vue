<template>
    <Menu></Menu>
    <Left></Left>
    <div class="vu">
        <button @click="dian">click,+1</button>
        <button @click="jian">click,-1</button>
        <p>{{a}}</p>  
    </div>
    <div class="ve">
        <p>pull &nbsp block &nbsp<button>^</button></p>
    </div>
    <!-- <div>
        <h1>用户列表</h1>
        <ul v-if="users.length">
            <li v-for="user in users" :key="user">{{ user+1 }}</li>
        </ul>
        <p v-else>正在加载...</p>
    </div> -->
    
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Menu from '../components/Menu.vue'
import Left from '../components/Left.vue'
// import instance from '../axio/index'

// const users = ref([]); // 响应式变量，用于存储用户数据

// const fetchUsers = async () => {
//     try {
//         const response = await instance.get('/a1',{}); // 调用 get 方法，传入请求路径（没有额外参数）
//         users.value = response.data; // 将返回的数据赋值给 users
//     } catch (error) {
//         console.error('获取用户数据失败:', error);
//     }
// };
// // 使用 onMounted 生命周期钩子在组件挂载时调用 fetchUsers 函数
// onMounted(() => {
//     fetchUsers();
// });

let a = ref(1);
function dian(){
    a.value += 1;
}
function jian(){
    a.value -= 1;
}
</script>

<style lang="less" scoped>
.vu{
    position: absolute;
    top:15%;
    left: 15%;
}
.ve{
    position: absolute;
    bottom:10%;
    left:15%;
    border:2px solid;
    box-shadow: 10px 10px 5px #888888;
    border-radius: 15px 50px 30px 5px;
    border-color: aqua;
}
</style>