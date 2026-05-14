import { useUserStore } from "../../../shared/composables/store/useUserStore.js";
import { useRoute } from "vue-router";
import { handler } from "../../../shared/api/http.js";

export const useGetHabits = () => {
    const { habits, habit } = useUserStore();

    const route = useRoute();

    const today = new Date();

    const formatDate = (date) => {
        if(!date) return null;

        return new Date(date.split('.').reverse().join('-'));
    };

    const shouldResetHabit = (habit) => {
        const lastDate = formatDate(habit.lastDate);

        const nextDate = new Date(lastDate);

        if(habit.frequency === 'Ежедневно'){
            nextDate.setDate(nextDate.getDate() + 1);
        }
        if(habit.frequency === '1 раз в неделю'){
            nextDate.setDate(nextDate.getDate() + 7);
        }
        if(habit.frequency === '3 раз в неделю'){
            nextDate.setDate(nextDate.getDate() + 2);
        }
    }

    const isToday = (dateStr) => {
        const date = formatDate(dateStr);

        return(
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
    }

    const isExpired = (endDate) => {
        const parsed = formatDate(endDate)

        if(!parsed) return false;

        return parsed < today
    }

    const isFullyCompleted = (habit) => {
        const endDate = formatDate(habit.endDateHabit);

        return endDate && today >= endDate
    }

    const getHabitStatus = (habit) => {
        if(isFullyCompleted(habit)){
            return 'Завершено'
        }else if(habit.status === 'Выполнено'){
            return 'Выполнено сегодня'
        }

        return 'В процессе'
    }

    const filteredHabits = (data) => {
        const rollBack = data.map(habit => {
            if(habit.status === 'Выполнено' && shouldResetHabit(habit)){
                return {
                    ...habit,
                    status: 'Не выполнено'
                };
            }else if(habit.status !== 'Выполнено' && shouldResetHabit(habit)){
                return {
                    ...habit,
                    series: 0,
                    status: habit.status,
                }
            }
            return habit
        })

        const activeHabits = rollBack.filter(habit => !isExpired(habit.endDateHabit))

        if(route.name === 'habits'){
            return activeHabits.filter(habit => habit.status !== 'Выполнено')
        }else if(route.name === 'day-completed-habits'){
            return activeHabits.filter(habit => habit.status === 'Выполнено' && isToday(habit.dateCreatedHabit))
        }else if(route.name === 'all-completed-habits'){
            return activeHabits.filter(habit => getHabitStatus(habit) === 'Завершено' )
        }else if(route.name === 'in-progress-habits'){
            return activeHabits.filter(habit => habit.status === 'В процессе')
        }else if(route.name === 'incompleted-habits'){
            return activeHabits.filter(habit => habit.status === 'Не выполнено' )
        }
        return activeHabits
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
    }

    return{
        getHabits,
        getHabit
    }
}