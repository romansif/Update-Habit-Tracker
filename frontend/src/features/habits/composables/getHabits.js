import { handler } from "../../../shared/api/http.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";

export const useGetHabits = () => {
    const { habits, habit, currentPage, totalPages } = useHabitsStore();

    const getAllHabits = async () => {
        const res = await handler(`/habits`, {
            method: 'GET',
        });
        habits.value = res

        return habits.value;
    }

    const getFilteredHabits = async (type) => {
        try{
            const res = await handler(`/habits/filtered?type=${type}&sort=date&order=desc&page=${currentPage.value}&limit=8`, {
                method: 'GET',
            });
            habits.value = res.data
            totalPages.value = res.totalPages
            return{
                data: res?.data || [],
                totalPages: res?.totalPages || 1,
                rollBack: res?.rollBack || []
            }
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
        getAllHabits,
        getFilteredHabits,
    }
}