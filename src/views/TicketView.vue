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
              <td>{{ ticket.t_id }}</td>
              <td><img :src="parseServerImg(ticket.t_image)" alt="票券縮圖" class="preview-img" /></td>
              <td>{{ ticket.t_name }}</td>
              <td>{{ ticket.t_price }}</td>
              <td>
                <toggle-switch v-model="ticket.active"></toggle-switch>
              </td>
              <td>{{ ticket.t_viewers ? '是' : '否' }}</td>
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
        // console.log(this.filteredTickets.length +'test')
        let filtered = this.tickets;
        if (this.filter === 'active') {
          filtered = this.tickets.filter((ticket) => ticket.active);
        } else if (this.filter === 'inactive') {
          filtered = this.tickets.filter((ticket) => !ticket.active);
        } else if (this.filter === 'popular') {
          filtered = this.tickets.filter((ticket) => ticket.popular);
        }

        return Math.ceil(filtered.length / this.perPage);
      },
    },
    methods: {
      fetchTickets() {
        fetch(`http://localhost/phpG6/api/getTickets.php`)
          .then((response) => {
            if (!response.ok) {
              console.log('出錯')
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            this.tickets = data.tickets.map(ticket => {
              return { //所有屬性都保留 再加添active與popular
                ...ticket,
                active: ticket.t_active === '1', 
                popular: ticket.t_popular === '1' 
              };
            });
            // console.log(this.tickets[0]);
            this.calculateTicketCounts();
          })
          .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
          });
      },
      // updateBookStatus(t_active, t_id) {
      //   fetch('http://localhost/phpG6/api/updateTickets.php', {
      //       method: 'POST',
      //       headers: {
      //           'Content-Type': 'application/json'
      //       },
      //       body: JSON.stringify({ t_active: this.t_active, t_id: this.t_id })
      //     })
      //     .then(response => response.json())
      //     .then(data => {
      //         if(data.error) {
      //             console.error('Error:', data.msg);
      //         } else {
      //             console.log('Update successful:', data.msg);
      //             // 重新加载数据或更新界面
      //             fetchBooks('all'); // 例如重新加载所有数据
      //         }
      //       })
      //   .catch(error => console.error('Error:', error));
      // },
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
      active_btn(active){
        if (active){
          return false;
        }else{
          return true;
        }
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
      parseServerImg(imgURL) {
          return `https://tibamef2e.com/cid101/g6/front/images/${imgURL}`
          // return `${import.meta.env.VITE_FILE_URL}/${imgURL}`
      }
    },
    mounted() {
      this.fetchTickets();
    },
  };
  </script>
  
  <style lang="scss" scoped>
@import '@/assets/scss/pages/_ticket.scss';
</style>