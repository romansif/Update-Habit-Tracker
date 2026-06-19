import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 };
    },
});

router.beforeEach((to) => {
    const userId = localStorage.getItem('userId');

    if(to.meta["requireAuth"] && !userId){
        return { name: 'login' };
    }

    if(to.meta["guestOnly"] && userId){
        return { name: 'profile' };
    }
});
export default router;
