<template>
    <div class="member_management">
        <div class="member_management_container">
            <h3>會員管理</h3>
            <div class="search-container">
                <input type="text" v-model="searchQuery" placeholder="會員ID" />
                <button @click="searchMembers">搜尋</button>
            </div>
            <table class="members-table">
                <thead>
                    <tr>
                        <th>會員ID</th>
                        <th>姓名</th>
                        <th>連絡電話</th>
                        <th>電子信箱</th>
                        <th>啟用狀態</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="member in filteredMembers" :key="member.id">
                        <td>{{ member.id }}</td>
                        <td>{{ member.name }}</td>
                        <td>{{ member.phone }}</td>
                        <td>{{ member.email }}</td>
                        <td>
                            <toggle-switch v-model="member.active" @update:modelValue="updateMemberStatus(member.id, $event)"></toggle-switch>
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
            members: [], // 存儲所有會員數據
            searchQuery: '', // 搜索查詢
            filter: 'all', // 當前的過濾條件，預設為 'all'
            totalCount: 0, // 總會員數量
            activeCount: 0, // 啟用會員數量
            inactiveCount: 0, // 未啟用會員數量
            page: 1, // 當前頁數
            perPage: 10, // 每頁顯示的會員數量
        };
    },
    computed: {
        // 根據當前的過濾條件和頁數，返回過濾後的會員數據
        filteredMembers() {
            let filtered = this.members;
            if (this.filter === 'active') {
                filtered = this.members.filter((member) => member.active);
            } else if (this.filter === 'inactive') {
                filtered = this.members.filter((member) => !member.active);
            }
            if (this.searchQuery) {
                filtered = filtered.filter((member) => member.id.includes(this.searchQuery));
            }
            return filtered.slice((this.page - 1) * this.perPage, this.page * this.perPage);
        },
        // 計算總頁數
        totalPages() {
            return Math.ceil(this.filteredMembers.length / this.perPage);
        },
    },
    methods: {
        // 從本地 JSON 文件中獲取會員數據
        fetchMembers() {
            fetch('/member.json') // 確保這個 URL 是正確的
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    this.members = data.map((member) => ({
                        ...member,
                        active: member.status === '是', // 將 '是' 和 '否' 轉換為布爾值
                    }));
                    this.calculateMemberCounts();
                })
                .catch((error) => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        },
        // 更新成员状态
        updateMemberStatus(id, status) {
            const member = this.members.find((m) => m.id === id);
            if (member) {
                member.active = status;
                this.calculateMemberCounts(); // 更新计数
            }
        },
        // 計算總會員、啟用會員和未啟用會員的數量
        calculateMemberCounts() {
            this.totalCount = this.members.length;
            this.activeCount = this.members.filter((member) => member.active).length;
            this.inactiveCount = this.members.filter((member) => !member.active).length;
        },
        // 根據過濾條件切換會員顯示
        filterMembers(status) {
            this.filter = status;
            this.page = 1; // 每次切換過濾器時重置為第1頁
        },
        // 搜索會員
        searchMembers() {
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
    // 組件掛載後自動調用 fetchMembers 方法以獲取數據
    mounted() {
        this.fetchMembers();
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pages/_member.scss';
</style>
