import { useRoute } from "vue-router";

import { handler } from "../../../shared/api/http.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";
import { useHabitsFilter } from "../../../shared/composables/filter/HabitsFilter.js";

export const useGetHabits = () => {
    const route = useRoute();

    const { habits, habit, currentPage, totalPages } = useHabitsStore();
    const { filteredCurrentHabits } = useHabitsFilter();

    const getHabits = async () => {
        const res = await handler(`/habits`, {
            method: 'GET',
        });
        habits.value = res

        return habits.value;
    }

    const getFilteredHabits = async () => {
        try{
            const res = await handler(`/habits/filtered?page=${currentPage.value}&limit=8&sort=date&order=desc`, {
                method: 'GET',
            });
            habits.value = res.data
            totalPages.value = res.totalPages

            return habits.value;
        }catch(err){
            console.log('Ошибка при получении привычек пользователя');
            throw err;
        }
    }

    const getFilteredCurrentHabits = async () => {
        try{
            const res = await handler(`/habits/filtered?page=${currentPage.value}&limit=8&sort=date&order=desc`, {
                method: 'GET',
            });
            habits.value = await filteredCurrentHabits(res.data, route.name)
            totalPages.value = res.totalPages

            return habits.value;
        }catch(err){
            console.log('Ошибка при получении привычек пользователя');
            throw err;
        }
    }

    const getHabit = async (id) => {
        try{
            const res = await handler(`/habits/${id}`, {
                method: 'GET',
            });
            habit.value = res
        }catch(err){
            console.log('Ошибка при получении привычки пользователя');
            throw err;
        }
    }

    return{
        getHabit,
        getHabits,
        getFilteredHabits,
        getFilteredCurrentHabits,
    }
}