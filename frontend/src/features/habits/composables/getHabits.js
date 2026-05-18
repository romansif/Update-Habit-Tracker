import { useRoute } from "vue-router";
import { handler } from "../../../shared/api/http.js";
import { useAppStore } from "../../../shared/composables/store/useAppStore.js";
import { useHabitsFilter } from "../../../shared/composables/filter/useHabitsFilter.js";

export const useGetHabits = () => {
    const { habits, habit } = useAppStore();
    const { filteredHabits } = useHabitsFilter();

    const route = useRoute();

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