<template>
    <div class="ticket_order_management">
      <div class="ticket_order_management_container">
        <h3>票券訂單管理</h3>
        <div class="search-container">
          <input type="text" v-model="searchQuery" placeholder="訂單編號" />
          <button @click="searchOrders">搜尋</button>
        </div>
        <div class="btns-container">
          <ul class="btns">
            <li class="btn" :class="{ active: filter === 'all' }" @click="filterOrders('all')">
              全部({{ totalCount }})
            </li>
            <li class="btn" :class="{ active: filter === 'completed' }" @click="filterOrders('completed')">
              已完成({{ completedCount }})
            </li>
            <li class="btn" :class="{ active: filter === 'pending' }" @click="filterOrders('pending')">
              未處理({{ pendingCount }})
            </li>
          </ul>
        </div>
        <table class="orders-table">
          <thead>
            <tr>
              <th>訂單編號</th>
              <th>訂單日期</th>
              <th>會員ID</th>
              <th>金額</th>
              <th>訂單狀態</th>
              <th>支付方式</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.date }}</td>
              <td>{{ order.memberId }}</td>
              <td>{{ order.amount }}</td>
              <td>{{ order.status }}</td>
              <td>{{ order.paymentMethod }}</td>
              <td><button class="edit-btn">🖉</button></td>
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
  export default {
    data() {
      return {
        orders: [], // 存儲所有訂單數據
        searchQuery: '', // 搜索查詢
        filter: 'all', // 當前的過濾條件，預設為 'all'
        totalCount: 0, // 總訂單數量
        completedCount: 0, // 已完成訂單數量
        pendingCount: 0, // 未處理訂單數量
        page: 1, // 當前頁數
        perPage: 10, // 每頁顯示的訂單數量
      };
    },
    computed: {
      // 根據當前的過濾條件和頁數，返回過濾後的訂單數據
      filteredOrders() {
        let filtered = this.orders;
        if (this.filter === 'completed') {
          filtered = this.orders.filter((order) => order.status === '已完成');
        } else if (this.filter === 'pending') {
          filtered = this.orders.filter((order) => order.status === '未處理');
        }
        if (this.searchQuery) {
          filtered = filtered.filter((order) => order.id.includes(this.searchQuery));
        }
        return filtered.slice((this.page - 1) * this.perPage, this.page * this.perPage);
      },
      // 計算總頁數
      totalPages() {
        return Math.ceil(this.filteredOrders.length / this.perPage);
      },
    },
    methods: {
      // 從本地 JSON 文件中獲取訂單數據
      fetchOrders() {
        fetch('/orders.json') // 確保這個 URL 是正確的
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            this.orders = data;
            this.calculateOrderCounts();
          })
          .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
          });
      },
      // 計算總訂單、已完成訂單和未處理訂單的數量
      calculateOrderCounts() {
        this.totalCount = this.orders.length;
        this.completedCount = this.orders.filter((order) => order.status === '已完成').length;
        this.pendingCount = this.orders.filter((order) => order.status === '未處理').length;
      },
      // 根據過濾條件切換訂單顯示
      filterOrders(status) {
        this.filter = status;
        this.page = 1; // 每次切換過濾器時重置為第1頁
      },
      // 搜索訂單
      searchOrders() {
        this.page = 1; // 搜索時重置為第1頁
      },
      // 切換到上一頁
      prevPage() {
        if (this.page > 1) {
          this.page--;
        }
      },
      // 切換到下一頁
      nextPage() {
        if (this.page < this.totalPages) {
          this.page++;
        }
      },
    },
    // 組件掛載後自動調用 fetchOrders 方法以獲取數據
    mounted() {
      this.fetchOrders();
    },
  };
  </script>
  
  <style scoped>
  .ticket_order_management {
    position: absolute;
    top: 100px;
    bottom: 0;
    right: 0;
    left: 20%;
    z-index: 5;
    padding: 20px;
  }
  
  .ticket_order_management_container {
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
  
    .orders-table {
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
  