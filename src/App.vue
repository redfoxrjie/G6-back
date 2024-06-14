<script setup>
import { RouterView } from 'vue-router'
import SideBar from './components/SideBar.vue' 
import MainHeader from './components/MainHeader.vue';

</script>

<template>
  <MainHeader/>
  <SideBar />
  <RouterView />
</template>

<style>
  a {
    text-decoration: none;
  }
</style>