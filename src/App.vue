<script setup>
import { RouterView, useRoute } from 'vue-router'
import SideBar from './components/SideBar.vue' 
import MainHeader from './components/MainHeader.vue';

// 獲取當前路由
const route = useRoute();
</script>

<template>
  <div id="app">
    <!-- 根據當前路由條件渲染 -->
    <MainHeader v-if="route.name !== 'LoginView'" />
    <SideBar v-if="route.name !== 'LoginView'" />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
  a {
    text-decoration: none;
  }
</style>
