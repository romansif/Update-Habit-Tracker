import { useRoute } from 'vue-router'

import { handler } from "../../../shared/api/http";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore"

export const useSortingHabits = () => {
    const route = useRoute();
    const routeName = route.name ? String(route.name) : ''

    const { habits, currentPage, totalPages } = useHabitsStore();

    const sortHabits = async (order: string) => {
        const res = await handler(`/habits/filtered?type=${routeName}&sort=date&order=${order}&page=${currentPage.value}&limit=8`, {
                method: 'GET'
            }
        )

        habits.value = res.data
        totalPages.value = res.totalPages;
    };

    return {
        sortHabits
    };
};
