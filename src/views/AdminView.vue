<template>
    <div class="admin_permissions">
        <div class="admin_permissions_container">
            <h3>管理員權限</h3>
            <div class="btns-container">
                <ul class="btns">
                    <!-- 過濾按鈕，分別顯示啟用中、未啟用和全部的管理員數量 -->
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
                <!-- 新增後台人員按鈕 -->
                <button class="btn add-button" @click="addNewUser">+新增後台人員</button>
            </div>
            <!-- 權限表格，顯示管理員資訊 -->
            <table class="permissions-table">
                <thead>
                    <tr>
                        <th>管理員編號</th>
                        <th>名稱</th>
                        <th>權限等級</th>
                        <th>啟用狀態</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in filteredPermissions" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.role }}</td>
                        <td>
                            <span class="status" :class="user.statusClass">
                                <i class="circle"></i> {{ user.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- 分頁導航 -->
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
            permissions: [], // 存儲所有管理員權限的數據
            filter: 'all', // 當前的過濾條件，預設為 'all'
            activeCount: 0, // 啟用中的管理員數量
            inactiveCount: 0, // 未啟用的管理員數量
            totalCount: 0, // 總管理員數量
            page: 1, // 當前頁數
            perPage: 10, // 每頁顯示的管理員數量
        }
    },
    computed: {
        // 根據當前的過濾條件和頁數，返回過濾後的管理員數據
        filteredPermissions() {
            let filtered = this.permissions;
            if (this.filter === 'active') {
                filtered = this.permissions.filter(user => user.status === '是');
            } else if (this.filter === 'inactive') {
                filtered = this.permissions.filter(user => user.status === '否');
            }
            return filtered.slice((this.page - 1) * this.perPage, this.page * this.perPage);
        },
        // 計算總頁數
        totalPages() {
            return Math.ceil(this.permissions.length / this.perPage);
        }
    },
    methods: {
        // 從後端 API 獲取管理員權限數據
        fetchPermissions() {
            fetch('/api/permissions')
                .then(response => response.json())
                .then(data => {
                    this.permissions = data;
                    this.calculatePermissionCounts();
                });
        },
        // 計算啟用中、未啟用和總管理員的數量
        calculatePermissionCounts() {
            this.totalCount = this.permissions.length;
            this.activeCount = this.permissions.filter(user => user.status === '是').length;
            this.inactiveCount = this.permissions.filter(user => user.status === '否').length;
        },
        // 根據過濾條件切換管理員顯示
        filterPermissions(status) {
            this.filter = status;
            this.page = 1; // 每次切換過濾器時重置為第1頁
        },
        // 處理新增用戶邏輯
        addNewUser() {
            console.log('新增後台人員');
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
    // 組件掛載後自動調用 fetchPermissions 方法以獲取數據
    mounted() {
        this.fetchPermissions();
    }
}
</script>

<style scoped>
.admin_permissions {
    position: absolute;
    top: 100px;
    bottom: 0;
    right: 0;
    left: 20%;
    z-index: 5;
    padding: 20px;
}

.admin_permissions_container {
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
        font-size: 24px; /* 字體大小 */
        color: #333; /* 字體顏色 */
    }

    .btns-container {
        display: flex;
        justify-content: space-between;
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
                    color: #3b8beb; /* 活躍按鈕顏色 */
                    border-bottom: 2px solid #3b8beb; /* 活躍按鈕下邊框 */
                    font-weight: bold; /* 活躍按鈕加粗 */
                }
            }
        }

        .add-button {
            background-color: #3b8beb; /* 新增按鈕背景色 */
            color: white;
            border-radius: 5px; /* 邊角圓角 */
            border: none;
            padding: 10px 20px;
            cursor: pointer;
        }
    }

    .permissions-table {
        width: 100%;
        border-collapse: collapse;

        th, td {
            padding: 12px;
            text-align: center;
            vertical-align: middle;
            font-size: 14px;
        }

        th {
            background-color: #9FC3E7;/* 表頭背景色 */
            color: #4F82D4;
            height: 50px;
            line-height: 50px;
        }

        .status {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #333;

            .circle {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 5px;
            }

            &.是 .circle {
                background-color: #00c851; /* 啟用狀態顏色 */
            }

            &.否 .circle {
                background-color: #ff4444; /* 未啟用狀態顏色 */
            }
        }
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;

        button {
            background-color: #3b8beb; /* 按鈕背景色 */
            color: white;
            border: none;
            padding: 10px;
            margin: 0 5px;
            cursor: pointer;
            border-radius: 5px; /* 邊角圓角 */
        }

        span {
            font-size: 16px;
            margin: 0 10px;
        }
    }
}
</style>
