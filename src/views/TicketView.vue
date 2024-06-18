<template>
    <div class="ticket_management">
      <div class="ticket_management_container">
        <h3>票券管理</h3>
        <div class="btns-container">
          <ul class="btns">
            <li class="btn" :class="{ active: filter === 'all' }" @click="filterTickets('all')">
              全部({{ totalCount }})
            </li>
            <li class="btn" :class="{ active: filter === 'active' }" @click="filterTickets('active')">
              已上架({{ activeCount }})
            </li>
            <li class="btn" :class="{ active: filter === 'inactive' }" @click="filterTickets('inactive')">
              未上架({{ inactiveCount }})
            </li>
            <li class="btn" :class="{ active: filter === 'popular' }" @click="filterTickets('popular')">
              熱門票券({{ popularCount }})
            </li>
          </ul>
          <button class="btn add-button" @click="addNewTicket">新增票券</button>
        </div>
        <table class="tickets-table">
          <thead>
            <tr>
              <th>票券編號</th>
              <th>票券縮圖</th>
              <th>票券名稱</th>
              <th>價格</th>
              <th>上架狀態</th>
              <th>熱門票券</th>
              <th>編輯</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticket in filteredTickets" :key="ticket.id">
              <td>{{ ticket.id }}</td>
              <td><img :src="ticket.image" alt="票券縮圖" class="preview-img" /></td>
              <td>{{ ticket.name }}</td>
              <td>{{ ticket.price }}</td>
              <td>
                <toggle-switch v-model="ticket.active"></toggle-switch>
              </td>
              <td>{{ ticket.popular ? '是' : '否' }}</td>
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
  import ToggleSwitch from '@/components/ToggleSwitch.vue';
  
  export default {
    components: {
      ToggleSwitch,
    },
    data() {
      return {
        tickets: [],
        filter: 'all',
        totalCount: 0,
        activeCount: 0,
        inactiveCount: 0,
        popularCount: 0,
        page: 1,
        perPage: 10,
      };
    },
    computed: {
      filteredTickets() {
        let filtered = this.tickets;
        if (this.filter === 'active') {
          filtered = this.tickets.filter((ticket) => ticket.active);
        } else if (this.filter === 'inactive') {
          filtered = this.tickets.filter((ticket) => !ticket.active);
        } else if (this.filter === 'popular') {
          filtered = this.tickets.filter((ticket) => ticket.popular);
        }
        return filtered.slice((this.page - 1) * this.perPage, this.page * this.perPage);
      },
      totalPages() {
        return Math.ceil(this.filteredTickets.length / this.perPage);
      },
    },
    methods: {
      fetchTickets() {
        fetch('/tickets.json')
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            this.tickets = data;
            this.calculateTicketCounts();
          })
          .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
          });
      },
      calculateTicketCounts() {
        this.totalCount = this.tickets.length;
        this.activeCount = this.tickets.filter((ticket) => ticket.active).length;
        this.inactiveCount = this.tickets.filter((ticket) => !ticket.active).length;
        this.popularCount = this.tickets.filter((ticket) => ticket.popular).length;
      },
      filterTickets(status) {
        this.filter = status;
        this.page = 1;
      },
      addNewTicket() {
        // 處理新增票券邏輯
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
      this.fetchTickets();
    },
  };
  </script>
  
  <style lang="scss" scoped>
@import '@/assets/scss/pages/_ticket.scss';
</style>