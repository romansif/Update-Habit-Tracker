import { useUserStore } from "../../../shared/composables/store/useUserStore.js";
import { useRoute } from "vue-router";
import { handler } from "../../../shared/api/http.js";

export const useGetHabits = () => {
    const { habits, habit } = useUserStore();

    const route = useRoute();


    const today = new Date();

    const formateDate = (date) => {
        return new Date(date.split('.').reverse().join('-'));
    };

    const isToday = (dateStr) => {
        const date = formateDate(dateStr);

        return(
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
    }

    const isExpired = (endDate) => {
        return formateDate(endDate) < today
    }

    const filteredHabits = (data) => {
        const rollBack = data.map(habit => {
            if(habit.status === 'Выполнено' && !isToday(habit.lastDate)) {
                return {
                    ...habit,
                    status: 'Не выполнено'
                };
            }

            return habit
        })

        const activeHabits = rollBack.filter(habit => !isExpired(habit.endDateHabit))

        if(route.name === 'habits'){
            return activeHabits.filter(habit => habit.status !== 'Выполнено')
        }else if(route.name === 'day-completed-habits'){
            return activeHabits.filter(habit => habit.status === 'Выполнено' && isToday(habit.dateCreatedHabit))
        }else if(route.name === 'all-completed-habits'){
            return activeHabits.filter(habit => habit.status === 'Выполнено')
        }else if(route.name === 'in-progress-habits'){
            return activeHabits.filter(habit => habit.status === 'В процессе')
        }else if(route.name === 'incompleted-habits'){
            return activeHabits.filter(habit => habit.status === 'Не выполнено' )
        }
    }

    const getHabits = async () => {
        const userId = localStorage.getItem('userId');

        const res = await handler(`/habits?userId=${userId}`, {
            method: 'GET',
        });

        habits.value = filteredHabits(res.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }

    const getHabit = async (id) => {
        const res = await handler(`/habits/${id}`, {
            method: 'GET',
        });

        habit.value = res
        console.log(habit.value)
    }

    return{
        getHabits,
        getHabit
    }
}