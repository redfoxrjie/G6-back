<template>
    <div class="admin_permissions">
        <div class="admin_permissions_container">
            <h3>管理員權限</h3>
            <div class="btns-container">
                <ul class="btns">
                    <li class="btn" :class="{ active: filter === 'active' }" @click="filterPermissions('active')">
                        啟用中({{ activeCount }})
                    </li>
                    <li class="btn" :class="{ active: filter === 'inactive' }" @click="filterPermissions('inactive')">
                        未啟用({{ inactiveCount }})
                    </li>
                    <li class="btn" :class="{ active: filter === 'all' }" @click="filterPermissions('all')">
                        全部({{ totalCount }})
                    </li>
                </ul>
                <button class="btn add-button" @click="showAddUserModal" :disabled="!isSuperAdmin">
                    +新增後台人員
                    <span v-if="!isSuperAdmin">(僅限超級管理員)</span>
                </button>
            </div>
            <table class="permissions-table">
                <thead>
                    <tr>
                        <th>管理員編號</th>
                        <th>名稱</th>
                        <th>權限等級</th>
                        <th>啟用狀態</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in filteredPermissions" :key="user.a_id">
                        <td>{{ user.a_id }}</td>
                        <td>{{ user.a_name }}</td>
                        <td>{{ user.a_role === '0' ? '主要管理員' : '後台人員' }}</td>
                        <td>
                            <span class="status"
                                :class="{ 'active': user.a_status === '1', 'inactive': user.a_status === '0' }">
                                <i class="circle"></i> {{ user.a_status === '1' ? '啟用' : '未啟用' }}
                            </span>
                        </td>
                        <td>
                            <button @click="toggleUserStatus(user)" class="toggle-btn"
                                :disabled="!isSuperAdmin || user.a_role === '0'"
                                :class="{ 'disabled': !isSuperAdmin || user.a_role === '0' }">
                                {{ user.a_status === '1' ? '停用' : '啟用' }}
                                <span v-if="!isSuperAdmin">(僅限超級管理員)</span>
                                <span v-else-if="user.a_role === '0'">(無法更改超級管理員狀態)</span>
                            </button>
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

        <!-- 新增用戶的模態窗 -->
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <h4>新增後台人員</h4>
                <div>
                    <label>管理員姓名</label>
                    <input v-model="newUser.name" placeholder="請輸入姓名">
                </div>
                <div>
                    <label>狀態</label>
                    <select v-model="newUser.status">
                        <option value="1">啟用</option>
                        <option value="0">停用</option>
                    </select>
                </div>
                <div>
                    <label>密碼</label>
                    <input v-model="newUser.password" type="password" placeholder="請輸入密碼">
                </div>
                <div>
                    <label>權限等級</label>
                    <input type="text" v-model="newUser.role" readonly>
                </div>
                <button @click="addNewUser">儲存</button>
                <button @click="showModal = false">取消</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            permissions: [], // 存儲所有管理員的權限資訊
            filter: 'all', // 當前過濾狀態
            activeCount: 0, // 啟用的管理員數量
            inactiveCount: 0, // 未啟用的管理員數量
            totalCount: 0, // 總管理員數量
            page: 1, // 當前頁碼
            perPage: 10, // 每頁顯示的數量
            showModal: false, // 控制新增用戶模態窗的顯示
            newUser: {
                name: '',
                password: '',
                role: '後台人員',
                status: '1'
            },
            isSuperAdmin: false, // 當前用戶是否為超級管理員
            currentAdminId: null // 當前管理員的ID
        }
    },
    computed: {
        // 根據過濾條件和分頁計算當前顯示的管理員列表
        filteredPermissions() {
            let filtered = this.permissions;
            if (this.filter === 'active') {
                filtered = this.permissions.filter(user => user.a_status === '1');
            } else if (this.filter === 'inactive') {
                filtered = this.permissions.filter(user => user.a_status === '0');
            }
            return filtered.slice((this.page - 1) * this.perPage, this.page * this.perPage);
        },
        // 計算總頁數
        totalPages() {
            return Math.ceil(this.permissions.length / this.perPage);
        }
    },
    methods: {
        // 獲取所有管理員的權限資訊
        async fetchPermissions() {
            try {
                console.log('正在獲取權限資訊');
                console.log('當前管理員ID:', this.currentAdminId);
                const response = await axios.get('http://localhost/phpG6/api/admin_management.php?action=getAllAdmin', {
                    headers: { 'X-Admin-Id': this.currentAdminId }
                });
                console.log('獲取權限資訊的響應:', response.data);
                if (response.data.success) {
                    this.permissions = response.data.data;
                    this.calculatePermissionCounts();
                } else {
                    throw new Error(response.data.message);
                }
            } catch (error) {
                console.error('獲取權限資訊時出錯:', error);
                alert('獲取管理員列表失敗: ' + error.message);
            }
        },
        // 計算各種狀態的管理員數量
        calculatePermissionCounts() {
            this.totalCount = this.permissions.length;
            this.activeCount = this.permissions.filter(user => user.a_status === '1').length;
            this.inactiveCount = this.permissions.filter(user => user.a_status === '0').length;
        },
        // 根據狀態過濾管理員列表
        filterPermissions(status) {
            this.filter = status;
            this.page = 1; // 重置到第一頁
        },
        // 顯示新增用戶的模態窗
        showAddUserModal() {
            console.log('嘗試顯示新增用戶模態窗');
            console.log('當前管理員ID:', this.currentAdminId);
            console.log('是否為超級管理員:', this.isSuperAdmin);
            if (this.isSuperAdmin) {
                this.showModal = true;
                this.resetNewUser();
            } else {
                console.log('非超級管理員，無法新增用戶');
                alert('只有超級管理員可以新增後台人員');
            }
        },
        // 新增管理員
        async addNewUser() {
            console.log('嘗試新增用戶');
            console.log('是否為超級管理員:', this.isSuperAdmin);
            console.log('當前管理員ID:', this.currentAdminId);
            if (!this.isSuperAdmin) {
                console.log('非超級管理員，無法新增用戶');
                alert('只有超級管理員可以新增後台人員');
                return;
            }
            try {
                console.log('發送新增用戶請求');
                console.log('請求頭:', { 'X-Admin-Id': this.currentAdminId });
                const response = await axios.post('http://localhost/phpG6/api/admin_management.php?action=addAdmin', this.newUser, {
                    headers: { 'X-Admin-Id': this.currentAdminId }
                });
                console.log('服務器響應:', response.data);
                if (response.data.success) {
                    alert('管理員新增成功');
                    this.showModal = false;
                    this.fetchPermissions();
                    this.resetNewUser();
                } else {
                    throw new Error(response.data.message);
                }
            } catch (error) {
                console.error('新增用戶時出錯:', error);
                alert('新增管理員失敗: ' + error.message);
            }
        },
        // 重置新用戶表單
        resetNewUser() {
            this.newUser = {
                name: '',
                password: '',
                role: '後台人員',
                status: '1'
            };
        },
        // 切換管理員狀態（啟用/停用）
        async toggleUserStatus(user) {
            console.log('嘗試切換用戶狀態');
            console.log('是否為超級管理員:', this.isSuperAdmin);
            console.log('當前管理員ID:', this.currentAdminId);
            console.log('要切換狀態的用戶:', user);
            if (!this.isSuperAdmin || user.a_role == 0) {
                console.log('無法切換狀態：非超級管理員或目標為超級管理員');
                return;
            }
            try {
                console.log('發送切換用戶狀態請求');
                console.log('請求頭:', { 'X-Admin-Id': this.currentAdminId });
                const response = await axios.post('http://localhost/phpG6/api/admin_management.php?action=toggleAdminStatus', {
                    id: user.a_id
                }, {
                    headers: { 'X-Admin-Id': this.currentAdminId }
                });
                console.log('服務器響應:', response.data);
                if (response.data.success) {
                    user.a_status = user.a_status === '1' ? '0' : '1';
                    this.calculatePermissionCounts();
                } else {
                    throw new Error(response.data.message);
                }
            } catch (error) {
                console.error('切換用戶狀態時出錯:', error);
                alert('更新管理員狀態失敗: ' + error.message);
            }
        },
        // 上一頁
        prevPage() {
            if (this.page > 1) {
                this.page--;
            }
        },
        // 下一頁
        nextPage() {
            if (this.page < this.totalPages) {
                this.page++;
            }
        }
    },
    // 組件掛載時執行
    mounted() {
        // 從 localStorage 獲取管理員資訊
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
        console.log('從 localStorage 獲取的管理員資訊:', adminInfo);
        if (adminInfo) {
            console.log('管理員角色:', adminInfo.a_role);
            console.log('管理員角色類型:', typeof adminInfo.a_role);
            this.isSuperAdmin = adminInfo.a_role == '0' || adminInfo.a_role == 0;
            this.currentAdminId = adminInfo.a_id;
            console.log('是否為超級管理員:', this.isSuperAdmin);
            console.log('當前管理員ID:', this.currentAdminId);
            this.fetchPermissions();
        } else {
            console.log('在 localStorage 中未找到管理員資訊');
            this.$router.push({ name: 'LoginView' });
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pages/_admin.scss';

.toggle-btn {
    margin: 0 5px;
    padding: 5px 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;

    &.disabled {
        background-color: #cccccc;
        color: #666666;
        cursor: not-allowed;
    }
}

.add-button {
    &:disabled {
        background-color: #cccccc;
        color: #666666;
        cursor: not-allowed;
    }
}

.modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: #fefefe;
    padding: 20px;
    border: 1px solid #ddd;
    width: 400px;
    max-width: 90%;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-family: 'Helvetica', 'Arial', sans-serif;
    color: #333;

    h4 {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 20px;
        color: #4A4A4A;
    }

    div {
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #555;
        text-align: left;
    }

    input,
    select {
        width: calc(100% - 20px);
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin: 0 auto;
        display: block;
        box-sizing: border-box;
    }

    button {
        padding: 10px 20px;
        margin-right: 10px;
        margin-bottom: 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        gap: 10px;
        background-color: #4F82D4;
        color: white;
        font-size: 14px;
    }

    .modal-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-footer button {
        width: 48%;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .modal-header .close {
        cursor: pointer;
        font-size: 20px;
        color: #aaa;
    }

    .modal-header .close:hover {
        color: #000;
    }
}


// 額外的樣式
.permissions-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th,
    td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
        font-weight: bold;
    }

    .status {
        display: flex;
        align-items: center;

        .circle {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 5px;
        }

        &.active .circle {
            background-color: #4CAF50;
        }

        &.inactive .circle {
            background-color: #f44336;
        }
    }
}

.pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    button {
        margin: 0 5px;
        padding: 5px 10px;
        border: none;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
        border-radius: 3px;

        &:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
    }
}

.btns-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .btns {
        display: flex;
        list-style-type: none;
        padding: 0;
        margin: 0;

        .btn {
            margin-right: 10px;
            padding: 5px 10px;
            border: 1px solid #ddd;
            border-radius: 3px;
            cursor: pointer;
        }
    }
}
</style>