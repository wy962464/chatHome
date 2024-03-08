import router from "./router";
import { MessageStore } from '@/store/modules/message.js';

//路由拦截
router.beforeEach(async (to, from, next) => {
    const messageStore = MessageStore();
    if (to.path.toLocaleLowerCase() === "/login") {
        if (messageStore.userInfor.uuid) return next(from.fullPath);
        return next();
    }
    if (!messageStore.userInfor.uuid) return next({ path: "/login", replace: true });
    next()
});

router.afterEach(() => {
});

router.onError(error => {
    console.warn("路由错误", error.message);
});

export default router;