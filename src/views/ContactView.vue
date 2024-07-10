<template>
    <div class="customer_mails">
        <div class="customer_mails_container">
            <h3>客戶信件管理</h3>
            <div class="search-container">
                <input type="text" v-model="searchQuery" placeholder="信件編號" />
                <button @click="searchMails">搜尋</button>
            </div>
            <div class="btns-container">
                <ul class="btns">
                    <li class="btn" :class="{ active: filter === 'all' }" @click="filterMails('all')">
                        全部({{ totalCount }})
                    </li>
                    <li class="btn" :class="{ active: filter === 'completed' }" @click="filterMails('completed')">
                        已完成({{ completedCount }})
                    </li>
                    <li class="btn" :class="{ active: filter === 'pending' }" @click="filterMails('pending')">
                        未處理({{ pendingCount }})
                    </li>
                </ul>
            </div>
            <table class="mails-table">
                <thead>
                    <tr>
                        <th>信件編號</th>
                        <th>姓名</th>
                        <th>電子信箱</th>
                        <th>內容</th>
                        <th>傳送時間</th>
                        <th>處理狀態</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="contact in filteredMails" :key="contact.id">
                        <td>{{ contact.cu_id }}</td>
                        <td>{{ contact.cu_name }}</td>
                        <td>{{ contact.cu_email }}</td>
                        <td>{{ contact.cu_message }}</td>
                        <td>{{ contact.cu_time }}</td>
                        <td>
                            <span class="status" :class="contact.statusClass">
                                <i class="circle"></i> {{ contact.cu_status }}
                            </span>
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
export default {
    data() {
        return {
            contactus: [], // 存儲所有信件數據
            searchQuery: '', // 搜索查詢
            filter: 'all', // 當前的過濾條件，預設為 'all'
            totalCount: 0, // 總信件數量
            completedCount: 0, // 已完成信件數量
            pendingCount: 0, // 未處理信件數量
            page: 1, // 當前頁數
            perPage: 10, // 每頁顯示的信件數量
        }
    },
    computed: {
        // 根據當前的過濾條件和頁數，返回過濾後的信件數據
        filteredMails() {
            let filtered = this.contactus;
            if (this.filter === 'completed') {
                filtered = this.contactus.filter((contact) => contact.completed);
            } else if (this.filter === 'pending') {
                filtered = this.contactus.filter((contact) => !contact.completed);
            }
            if (this.searchQuery) {
                filtered = filtered.filter(contact => contact.cu_id.includes(this.searchQuery));
            }
            return filtered.slice((this.page - 1) * this.perPage, this.page * this.perPage);
        },
        // 計算總頁數
        totalPages() {
            let filtered = this.contactus;
            if (this.filter === 'completed') {
                filtered = this.contactus.filter((contact) => contact.completed);
            } else if (this.filter === 'pending') {
                filtered = this.contactus.filter((contact) => !contact.completed);
            }
            if (this.searchQuery) {
                filtered = filtered.filter((order) => order.o_id.includes(this.searchQuery));
            }

            return Math.ceil(filtered.length / this.perPage);
        }
    },
    methods: {
        fetchMails() {
            fetch(`http://localhost/phpG6/api/getContact.php`)
                .then(response => {
                    if (!response.ok) {
                        console.log('出錯')
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    this.contactus = data.contactus.map(contact=>{
                        return {
                            ...contact,
                            completed: contact.cu_status === '1'
                        };
                    });
                    console.log(this.contactus[0]);
                    this.calculateMailCounts();
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        },
        // 計算總信件、已完成信件和未處理信件的數量
        calculateMailCounts() {
            this.totalCount = this.contactus.length;
            this.completedCount = this.contactus.filter((contact) => contact.completed).length;
            this.pendingCount = this.contactus.filter((contact) => !contact.completed).length;
        },
        // 根據過濾條件切換信件顯示
        filterMails(status) {
            this.filter = status;
            this.page = 1; // 每次切換過濾器時重置為第1頁
        },
        // 搜索信件
        searchMails() {
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
        }
    },
    // 組件掛載後自動調用 fetchMails 方法以獲取數據
    mounted() {
        this.fetchMails();
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pages/_contact.scss';
</style>

