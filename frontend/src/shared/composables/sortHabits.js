import { handler } from "../api/http.js";
import { useRoute } from "vue-router";
import { useUserStore } from "./user-composables/useUserStore.js";

export const useSortingHabits = () => {
    const { habits } = useUserStore();

    const route = useRoute();

    const filteredHabits = (data) => {
        if(route.name === 'completed-habits'){
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

        return filteredHabits(res)
    }

    const sortingByNew = async () => {
        const data = await getHabits();

        habits.value = data.sort((a, b) => new Date(b.dateCreatedHabit) - new Date(a.dateCreatedHabit))
    }

    const sortingByOld = async () => {
        const data = await getHabits();

        habits.value = data.sort((a, b) => new Date(a.dateCreatedHabit) - new Date(b.dateCreatedHabit))
    }

    return{
        sortingByNew,
        sortingByOld,
        filteredHabits
    }
}
