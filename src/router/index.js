import { createRouter, createWebHistory } from 'vue-router'

// 定義路由
const routes = [
    {
        path: '/login',
        name: 'LoginView',
        component: () => import('../views/LoginView.vue') // 動態導入 LoginView 組件
    },
    {
        path: '/adminview',
        name: 'AdminView',
        component: () => import('../views/AdminView.vue'),
        meta: { requiresAuth: true } // 添加 meta 字段來表示該路由需要驗證
    },
    {
        path: '/blogreport',
        name: 'BlogReport',
        component: () => import('../views/BlogReport.vue'),
        meta: { requiresAuth: true } // 添加 meta 字段來表示該路由需要驗證
    },
    {
        path: '/contactus',
        name: 'ContactUs',
        component: () => import('../views/ContactUs.vue'),
        meta: { requiresAuth: true } // 添加 meta 字段來表示該路由需要驗證
    },
    {
        path: '/membermanagement',
        name: 'MemberManagement',
        component: () => import('../views/MemberManagement.vue'),
        meta: { requiresAuth: true } // 添加 meta 字段來表示該路由需要驗證
    },
    {
        path: '/messagemanagement',
        name: 'MessageManagement',
        component: () => import('../views/MessageManagement.vue'),
        meta: { requiresAuth: true } // 添加 meta 字段來表示該路由需要驗證
    },
    {
        path: '/ticketmanagement',
        name: 'TicketManagement',
        component: () => import('../views/TicketManagement.vue'),
        meta: { requiresAuth: true } // 添加 meta 字段來表示該路由需要驗證
    },
    {
        path: '/productorder',
        name: 'ProductOrder',
        component: () => import('../views/ProductOrder.vue'),
        meta: { requiresAuth: true } // 添加 meta 字段來表示該路由需要驗證
    },
]

// 創建路由實例
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// 添加全局路由守衛
router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('adminId') // 從本地儲存中獲取 adminId 來判斷是否已登入

    // 檢查路由是否需要驗證以及用戶是否已登入
    if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
        next({ name: 'LoginView' }) // 如果未登入，重定向到 LoginView
    } else {
        next() // 否則，繼續導航
    }
})

export default router
