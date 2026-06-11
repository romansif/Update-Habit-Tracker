import { useRoute } from 'vue-router'

import { handler } from "../../../shared/api/http.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js"

export const useSortingHabits = () => {
    const route = useRoute();

    const { habits, currentPage, totalPages } = useHabitsStore();

    const sortHabits = async (order) => {
        const res = await handler(`/habits/filtered?type=${route.name}&sort=date&order=${order}&page=${currentPage.value}&limit=8`, {
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
