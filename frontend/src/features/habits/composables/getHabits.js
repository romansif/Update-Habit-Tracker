import { useRoute } from "vue-router";

import { handler } from "../../../shared/api/http.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";
import { useHabitsFilter } from "../../../shared/composables/filter/HabitsFilter.js";

export const useGetHabits = () => {
    const route = useRoute();

    const { habits, habit } = useHabitsStore();
    const { filteredCurrentHabits } = useHabitsFilter();

    const getHabits = async () => {
        try{
            const userId = localStorage.getItem('userId');

            const res = await handler(`/habits?userId=${userId}`, {
                method: 'GET',
            });
            habits.value = res

            return habits.value;
        }catch(err){
            console.log('Ошибка при получении привычек пользователя');
            throw err;
        }
    }

    const getCurrentHabits = async () => {
        try {
            const userId = localStorage.getItem('userId');

            const res = await handler(`/habits?userId=${userId}`, {
                method: 'GET',
            });
            habits.value = await filteredCurrentHabits(
                res.sort((a, b) => new Date(b.date) - new Date(a.date)),
                route.name
            );

            return habits.value;
        }catch(err){
            console.log('Ошибка при получении колличества привычек пользователя');
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
        getHabits,
        getCurrentHabits,
        getHabit
    }
}