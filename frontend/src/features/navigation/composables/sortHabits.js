import { useRoute } from 'vue-router'

import { handler } from "../../../shared/api/http.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js"
import { useHabitsFilter } from "../../../shared/composables/filter/HabitsFilter.js"

export const useSortingHabits = () => {
    const route = useRoute();

    const { filteredCurrentHabits } = useHabitsFilter()
    const { habits, currentPage, totalPages } = useHabitsStore();

    const sortHabits = async (order) => {
        const res = await handler(`/habits/filtered?page=${currentPage.value}&limit=8&sort=date&order=${order}`, {
                method: 'GET'
            }
        )

        habits.value = await filteredCurrentHabits(res.data, route.name);
        totalPages.value = res.totalPages;
    };

    return {
        sortHabits
    };
};
