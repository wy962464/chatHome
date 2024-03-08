import {
    createRouter,
    createWebHistory,
    createWebHashHistory,
} from "vue-router";


const staticRoute = [
    {
        path: "/",
        redirect: "/Home",
    },
    {
        path: "/Home",
        name: "Home",
        component: () => import("@/components/Home.vue"),
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/components/login.vue"),
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import("@/components/ErrorMessage/404.vue"),
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes: staticRoute,
    // 切换页面，滚动到最顶部
    scrollBehavior(to, from, savedPosition) {
        return { top: 0, left: 0 };
    },
});

export default router;