import { useUserStore } from "../../../shared/composables/store/useUserStore.js";
import { useRoute } from "vue-router";
import { handler } from "../../../shared/api/http.js";

export const useGetHabits = () => {
    const { habits } = useUserStore();

    const route = useRoute();

    const filteredHabits = (data) => {
        if(route.name === 'habits'){
            return data.filter(habit => habit.status !== 'Выполнено')
        }else if(route.name === 'completed-habits'){
            return data.filter(habit => habit.status === 'Выполнено')
        }else if(route.name === 'in-progress-habits'){
            return data.filter(habit => habit.status === 'В процессе')
        }else if(route.name === 'incompleted-habits'){
            return data.filter(habit => habit.status === 'Не выполнено')
        }

        return data;
    }

    const getHabits = async () => {
        const userId = localStorage.getItem('userId');

        const res = await handler(`/habits?userId=${userId}`, {
            method: 'GET',
        });

        habits.value = filteredHabits(res.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }

    return{
        getHabits
    }
}