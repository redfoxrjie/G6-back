<template>
    <div class="message_management">
      <div class="message_management_container">
        <h3>消息管理</h3>
        <div class="search-container">
          <input type="text" v-model="searchQuery" placeholder="消息編號" />
          <button @click="searchMessages">搜尋</button>
        </div>
        <div class="btns-container">
          <ul class="btns">
            <li class="btn" :class="{ active: filter === 'all' }" @click="filterMessages('all')">
              全部({{ totalCount }})
            </li>
            <li class="btn" :class="{ active: filter === 'processed' }" @click="filterMessages('processed')">
              已處理({{ processedCount }})
            </li>
            <li class="btn" :class="{ active: filter === 'pending' }" @click="filterMessages('pending')">
              未處理({{ pendingCount }})
            </li>
          </ul>
          <button class="btn add-button" @click="addNewMessage">新增</button>
        </div>
        <table class="messages-table">
          <thead>
            <tr>
              <th>消息編號</th>
              <th>主圖預覽</th>
              <th>類別</th>
              <th>消息標題</th>
              <th>最後編輯日期</th>
              <th>修改</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="message in filteredMessages" :key="message.id">
              <td>{{ message.id }}</td>
              <td><img :src="message.image" alt="主圖預覽" class="preview-img" /></td>
              <td>{{ message.category }}</td>
              <td>{{ message.title }}</td>
              <td>{{ message.lastEdited }}</td>
              <td><button class="edit-btn">🖉</button></td>
              <td>
                <toggle-switch v-model="message.status"></toggle-switch>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button @click="prevPage" :disabled="page === 1">‹</button>
          <span>{{ page }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="page === totalPages">›</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ToggleSwitch from '@/components/ToggleSwitch.vue';
  
  export default {
    components: {
      ToggleSwitch,
    },
    data() {
      return {
        messages: [],
        searchQuery: '',
        filter: 'all',
        totalCount: 0,
        processedCount: 0,
        pendingCount: 0,
        page: 1,
        perPage: 10,
      };
    },
    computed: {
      filteredMessages() {
        let filtered = this.messages;
        if (this.filter === 'processed') {
          filtered = this.messages.filter((message) => message.status === '已發布');
        } else if (this.filter === 'pending') {
          filtered = this.messages.filter((message) => message.status === '未發布');
        }
        if (this.searchQuery) {
          filtered = filtered.filter((message) => message.id.includes(this.searchQuery));
        }
        return filtered.slice((this.page - 1) * this.perPage, this.page * this.perPage);
      },
      totalPages() {
        return Math.ceil(this.filteredMessages.length / this.perPage);
      },
    },
    methods: {
      fetchMessages() {
        fetch('/messages.json')
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            this.messages = data;
            this.calculateMessageCounts();
          })
          .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
          });
      },
      calculateMessageCounts() {
        this.totalCount = this.messages.length;
        this.processedCount = this.messages.filter((message) => message.status === '已發布').length;
        this.pendingCount = this.messages.filter((message) => message.status === '未發布').length;
      },
      filterMessages(status) {
        this.filter = status;
        this.page = 1;
      },
      searchMessages() {
        this.page = 1;
      },
      addNewMessage() {
        // 處理新增消息邏輯
      },
      prevPage() {
        if (this.page > 1) {
          this.page--;
        }
      },
      nextPage() {
        if (this.page < this.totalPages) {
          this.page++;
        }
      },
    },
    mounted() {
      this.fetchMessages();
    },
  };
  </script>

<style lang="scss" scoped>
@import '@/assets/scss/pages/_message.scss';
</style>
  
  