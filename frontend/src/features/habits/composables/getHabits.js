import { useRoute } from "vue-router";

import { handler } from "../../../shared/api/http.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";
import { useHabitsFilter } from "../../../shared/composables/filter/useHabitsFilter.js";

export const useGetHabits = () => {
    const route = useRoute();

    const { habits, habit } = useHabitsStore();
    const { filteredHabits } = useHabitsFilter();

    const getHabits = async () => {
        const userId = localStorage.getItem('userId');

        const res = await handler(`/habits?userId=${userId}`, {
            method: 'GET',
        });
        habits.value = filteredHabits(
            res.sort((a, b) => new Date(b.date) - new Date(a.date)),
            route.name
        );

        return habits.value;
    }

    const getHabit = async (id) => {
        const res = await handler(`/habits/${id}`, {
            method: 'GET',
        });

        habit.value = res
    }

    return{
        getHabits,
        getHabit
    }
}