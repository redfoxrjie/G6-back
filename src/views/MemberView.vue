<template>
    <div class="member_management">
        <div class="member_management_container">
            <h3>會員管理</h3>
            <div class="search-container">
                <input type="text" v-model="searchQuery" placeholder="會員ID" />
                <button @click="searchMembers">搜尋</button>
            </div>
            <table class="members-table" v-if="!loading && !error">
                <thead>
                    <tr>
                        <th>會員ID</th>
                        <th>姓名</th>
                        <th>帳號</th>
                        <th>電子信箱</th>
                        <th>啟用狀態</th>
                        <th>詳細資料</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="member in filteredMembers" :key="member.id">
                        <td>{{ member.id }}</td>
                        <td>{{ member.name }}</td>
                        <td>{{ member.account }}</td>
                        <td>{{ member.email }}</td>
                        <td>
                            <toggle-switch v-model="member.active"
                                @update:modelValue="updateMemberStatus(member.id, $event)"></toggle-switch>
                        </td>
                        <td>
                            <button type="button" class="btn btn-primary"
                                @click="showMemberDetails(member)">詳細資料</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="loading" class="loading">加載中...</div>
            <div v-if="error" class="error">{{ error }}</div>
            <div class="pagination">
                <button @click="prevPage" :disabled="page === 1">‹</button>
                <span>{{ page }} / {{ totalPages }}</span>
                <button @click="nextPage" :disabled="page === totalPages">›</button>
            </div>
        </div>

        <member-modal :member="selectedMember" :visible="isModalVisible" @close="isModalVisible = false"></member-modal>
    </div>
</template>

<script>
import ToggleSwitch from '@/components/ToggleSwitch.vue';
import MemberModal from '@/components/MemberModal.vue'; // 引入彈出框組件

export default {
    components: {
        ToggleSwitch,
        MemberModal
    },
    data() {
        return {
            members: [], // 存儲所有會員數據
            searchQuery: '', // 搜索查詢
            totalCount: 0, // 總會員數量
            activeCount: 0, // 啟用會員數量
            inactiveCount: 0, // 未啟用會員數量
            page: 1, // 當前頁數
            perPage: 10, // 每頁顯示的會員數量
            loading: false, // 加載狀態
            error: null, // 錯誤信息
            selectedMember: {}, // 選中的會員詳細資料
            isModalVisible: false // 模態框顯示狀態
        };
    },
    computed: {
        // 根據當前的搜索查詢過濾會員資料
        filteredMembers() {
            return this.members;
        },
        // 計算總頁數
        totalPages() {
            return Math.ceil(this.totalCount / this.perPage);
        },
    },
    methods: {
        // 顯示會員詳細資料
        showMemberDetails(member) {
            this.selectedMember = member;
            this.isModalVisible = true;
        },
        // 從後端 API 獲取會員數據
        fetchMembers() {
            this.loading = true;
            this.error = null;
            fetch(`${import.meta.env.VITE_API_URL}/back_getUserInfo.php?page=${this.page}&perPage=${this.perPage}&searchQuery=${this.searchQuery}`) // 確保這個 URL 是正確的
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.success) {
                        this.members = data.members;
                        this.members = data.members.map(member => ({
                            ...member,
                            active: true
                        }));
                        this.totalCount = data.total;
                        this.calculateMemberCounts();
                    } else {
                        this.error = data.message;
                    }
                })
                .catch((error) => {
                    this.error = 'There was a problem with the fetch operation: ' + error.message;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 更新會員狀態
        updateMemberStatus(id, status) {
            const member = this.members.find((m) => m.id === id);
            if (member) {
                member.active = status;
                this.calculateMemberCounts(); // 更新計數
            }
        },
        // 計算啟用會員和未啟用會員的數量
        calculateMemberCounts() {
            this.activeCount = this.members.filter((member) => member.active).length;
            this.inactiveCount = this.members.filter((member) => !member.active).length;
        },
        // 搜索會員
        searchMembers() {
            this.page = 1; // 搜索時重置為第1頁
            this.fetchMembers(); // 重新獲取會員數據
        },
        // 切換到上一頁
        prevPage() {
            if (this.page > 1) {
                this.page--;
                this.fetchMembers();
            }
        },
        // 切換到下一頁
        nextPage() {
            if (this.page < this.totalPages) {
                this.page++;
                this.fetchMembers();
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