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
        path: '/blog',
        name: 'BlogView',
        component: () => import('../views/BlogView.vue'),
        meta: { requiresAuth: true } // 添加 meta 字段來表示該路由需要驗證
    },
    {
        path: '/contact',
        name: 'ContactView',
        component: () => import('../views/ContactView.vue'),
        meta: { requiresAuth: true } // 添加 meta 字段來表示該路由需要驗證
    },
    {
        path: '/member',
        name: 'MemberView',
        component: () => import('../views/MemberView.vue'),
        meta: { requiresAuth: true } // 添加 meta 字段來表示該路由需要驗證
    },
    {
        path: '/message',
        name: 'MessageView',
        component: () => import('../views/MessageView.vue'),
        meta: { requiresAuth: true } // 添加 meta 字段來表示該路由需要驗證
    },    
    {
        path: '/Product',
        name: 'ProductView',
        component: () => import('../views/ProductView.vue'),
        meta: { requiresAuth: true } // 添加 meta 字段來表示該路由需要驗證
    },
    // {
    //     path: '/Product/:id',
    //     name: 'ProductView',
    //     component: () => import('../views/ProductView.vue'),
    //     meta: { requiresAuth: true } // 添加 meta 字段來表示該路由需要驗證
    // },
    {
        path: '/ticket',
        name: 'TicketView',
        component: () => import('../views/TicketView.vue'),
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
    const adminInfo = localStorage.getItem('adminInfo') // 從本地儲存中獲取 adminInfo 來判斷是否已登入
    const loggedIn = adminInfo ? JSON.parse(adminInfo).a_id : null; // 從 adminInfo 解析出 id 來判斷是否已登入

    // 檢查路由是否需要驗證以及用戶是否已登入
    if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
        next({ name: 'LoginView' }) // 如果未登入，重定向到 LoginView
    } else {
        next() // 否則，繼續導航
    }
})

export default router
