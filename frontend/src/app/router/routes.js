const routes = [
    {
        path: '/',
        component: () => import('../../app/layouts/auth-layout/AuthLayout.vue'),
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('../../pages/home/HomePage.vue'),
            },
            {
                path: '',
                name: 'login',
                component: () => import('../../pages/auth/LoginPage.vue'),
                meta: { guestOnly: true },
            },

            {
                path: '',
                name: 'register',
                component: () => import('../../pages/auth/RegisterPage.vue'),
                meta: { guestOnly: true },
            }
        ]
    },
    {
        path: '/',
        component: () => import('../../app/layouts/main-layout/MainLayout.vue'),
        children: [
            {
                path: 'profile',
                name: 'profile',
                component: () => import('../../pages/profile/ProfilePage.vue'),
                meta: { requireAuth: true },
            },
            {
                path: 'calendar',
                name: 'calendar',
                component: () => import('../../pages/calendar/CalendarPage.vue'),
                meta: { requireAuth: true },
            },
            {
                path: 'habits',
                name: 'habits',
                component: () => import('../../pages/habits/AllHabitsPage.vue'),
                meta: { requireAuth: true },
            },
            {
                path: 'completed-habits',
                name: 'completed-habits',
                component: () => import('../../pages/habits/CompletedHabitsPage.vue'),
                meta: { requireAuth: true },
            },
            {
                path: 'in-progress-habits',
                name: 'in-progress-habits',
                component: () => import('../../pages/habits/IncompletedHabitsPage.vue'),
                meta: { requireAuth: true },
            },
            {
                path: 'incompleted-habits',
                name: 'incompleted-habits',
                component: () => import('../../pages/habits/IncompletedHabitsPage.vue'),
                meta: { requireAuth: true },
            },
        ]
    }
]



export default routes;