import { createRouter, createWebHashHistory } from 'vue-router'

let routes = [
    { path: '/test123', component: () => import('../views/Test.vue') },

    { path: '/', component: () => import('../views/HomePage.vue') },

    {
        path: '/dashboard', component: () => import('../views/dashboard/Dashboard.vue'),
        children: [
            { path: '/dashboard/category', component: () => import('../views/dashboard/Category.vue') },
            { path: '/dashboard/article', component: () => import('../views/dashboard/Article.vue') },
        ]
    },

    { path: '/login', component: () => import('../views/Login.vue') },

    { path: '/detail', component: () => import('../views/Detail.vue'), props: true },

]

const router = createRouter({

    history: createWebHashHistory(),
    routes
})

// export default { router, routes }
export { router, routes }