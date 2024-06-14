import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/adminview',
            name: 'AdminView',
            component: () => import('../views/AdminView.vue')
        },
        {
            path: '/blogreport',
            name: 'BlogReport',
            component: () => import('../views/BlogReport.vue')
        },
        {
            path: '/contactus',
            name: 'ContactUs',
            component: () => import('../views/ContactUs.vue')
        },
        {
            path: '/membermanagement',
            name:'MemberManagement',
            component: () => import('../views/MemberManagement.vue')
        },
        {
            path: '/messagemanagement',
            name:'MessageManagement',
            component: () => import('../views/MessageManagement.vue')
        },
        {
            path: '/ticketmanagement',
            name:'TicketManagement',
            component: () => import('../views/TicketManagement.vue')
        },
        {
            path: '/productorder',
            name:'ProductOrder',
            component: () => import('../views/ProductOrder.vue')
        },
    ]
})

export default router
