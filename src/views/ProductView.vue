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

<style lang="scss" scoped>
@import '@/assets/scss/pages//_order.scss';
</style>