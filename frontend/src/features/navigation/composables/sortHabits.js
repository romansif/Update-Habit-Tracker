import { useRoute } from "vue-router";

import { handler } from "../../../shared/api/http.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";
import { useHabitsFilter } from "../../../shared/composables/filter/useHabitsFilter.js";

export const useSortingHabits = () => {
    const { habits } = useHabitsStore();
    const { filteredHabits } = useHabitsFilter();

    const route = useRoute();

    const getHabits = async () => {
        const userId = localStorage.getItem('userId');

        const res = await handler(`/habits?userId=${userId}`, {
            method: 'GET',
        });

        return filteredHabits(res, route.name)
    }

    const sortingByNew = async () => {
        const data = await getHabits();

        habits.value = data.sort((a, b) => new Date(b.date) - new Date(a.date))
    }

    const sortingByOld = async () => {
        const data = await getHabits();

        habits.value = data.sort((a, b) => new Date(a.date) - new Date(b.date))
    }

    return{
        sortingByNew,
        sortingByOld,
        filteredHabits
    }
}
