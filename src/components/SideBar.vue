<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const isDropdown1Open = ref(false)
const isDropdown2Open = ref(false)

const toggleDropdown1 = () => {
  isDropdown1Open.value = !isDropdown1Open.value
}
const toggleDropdown2 = () => {
  isDropdown2Open.value = !isDropdown2Open.value
}
</script>

<template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <router-link to="/">
        <img src="../assets/ToGoLogo.png" alt="logo" width="80" height="80">
      </router-link>
    </div>
    <ul class="nav flex-column">
      <li class="nav-item">
        <a class="nav-link" href="#" @click="toggleDropdown1">
          商城管理 <i :class="{'fas fa-chevron-down': !isDropdown1Open, 'fas fa-chevron-up': isDropdown1Open}"></i>
        </a>
        <ul class="nav flex-column dropdown" v-if="isDropdown1Open">
          <li><router-link class="nav-link dropdown-item" to="/ProductOrder">票券訂單管理</router-link></li>
          <li><router-link class="nav-link dropdown-item" to="/TicketManagement">票券管理</router-link></li>
        </ul>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/MessageManagement">消息管理</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/BlogReport">文章檢舉管理</router-link>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" @click="toggleDropdown2">
          帳戶管理 <i :class="{'fas fa-chevron-down': !isDropdown2Open, 'fas fa-chevron-up': isDropdown2Open}"></i>
        </a>
        <ul class="nav flex-column dropdown" v-if="isDropdown2Open">
          <li><router-link class="nav-link dropdown-item" to="/MemberManagement">會員管理</router-link></li>
          <li><router-link class="nav-link dropdown-item" to="/ContactUs">客服信件管理</router-link></li>
          <li><router-link class="nav-link dropdown-item" to="/AdminView">管理員權限</router-link></li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #4F82D4;
  padding-top: 20px;
  color: #fff;
}

.sidebar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #4a7bab;
}

.nav-link {
  color: #000000;
  padding: 10px 15px;
  text-decoration: none;
  display: flex;
  justify-content: space-between; /* 確保箭頭圖標在右側 */
  align-items: center;
}

.nav-link:hover {
  background-color: #6a9fcf;
}

.flex-column {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.dropdown-item {
  background-color: #9FC3E7;
  padding-left: 30px;
}

.dropdown-item:hover {
  background-color: #6a9fcf;
}

.dropdown {
  padding-left: 15px;
}

.nav-item {
  margin-bottom: 5px;
}

.fas {
  margin-left: 10px; /* 調整箭頭與文字之間的間距 */
}
</style>
