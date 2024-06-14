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
  
  <style scoped>
  .message_management {
    position: absolute;
    top: 100px;
    bottom: 0;
    right: 0;
    left: 20%;
    z-index: 5;
    padding: 20px;
  }
  
  .message_management_container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 20px;
    width: 100%;
    max-width: 1200px;
  
    h3 {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 24px;
      color: #333;
    }
  
    .search-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      margin-bottom: 20px;
  
      input {
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-right: 10px;
      }
  
      button {
        background-color: #ffcc00;
        color: #333;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  
    .btns-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 20px;
  
      .btns {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0;
  
        .btn {
          padding: 10px 15px;
          cursor: pointer;
          font-size: 16px;
          color: #333;
          margin-right: 15px;
          border-bottom: 2px solid transparent;
  
          &.active {
            color: #3b8beb;
            border-bottom: 2px solid #3b8beb;
            font-weight: bold;
          }
        }
      }
  
      .add-button {
        background-color: #3b8beb;
        color: white;
        border-radius: 5px;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
      }
    }
  
    .messages-table {
      width: 100%;
      border-collapse: collapse;
  
      th,
      td {
       
        padding: 12px;
        text-align: center;
        vertical-align: middle;
        font-size: 14px;
      }
  
      th {
        background-color: #9FC3E7;
        color: #4F82D4;
        height: 50px;
        line-height: 50px;
      }
  
      .preview-img {
        width: 50px;
        height: auto;
      }
  
      .edit-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
      }
    }
  
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
  
      button {
        background-color: #3b8beb;
        color: white;
        border: none;
        padding: 10px;
        margin: 0 5px;
        cursor: pointer;
        border-radius: 5px;
      }
  
      span {
        font-size: 16px;
        margin: 0 10px;
      }
    }
  }
  </style>
  