import { handler } from "../../api/http.js";
import { useHabitsStore } from "../store/habitsStore.js";
import { useRecordsModals } from "../modal/useModals.js";
import {computed} from "vue";

export const useHabitsFilter = () => {
    const modal = useRecordsModals()
    const { habits } = useHabitsStore()

    const getToday = () => new Date();

    const formatDate = (date) => {
        if(!date) return null;

        return new Date(date.split('.').reverse().join('-'));
    };

    const shouldResetHabit = (habit) => {
        const lastDate = formatDate(habit.lastDate);

        const today = getToday();

        if (!lastDate) return false;

        const nextDate = new Date(lastDate);

        const frequency = {
            'Ежедневно': 1,
            '1 раз в неделю': 7,
            '3 раза в неделю': 2
        }
        nextDate.setDate(nextDate.getDate() + frequency[habit.frequency])

        return today >= nextDate;
    };

    const isToday = (dateStr) => {
        const date = formatDate(dateStr);

        const today = getToday()

        if(!date) return false;

        return(
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
    }

    const isFullyCompleted = (habit) => {
        const endDate = formatDate(habit.endDateHabit);

        const today = getToday()

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

    const filteredCurrentHabits = async (data, routeName) => {
        const habits = data

        for(let habit of habits){
            if(habit.status === 'Выполнено' && shouldResetHabit(habit)){
                await handler(`/habits/${habit.id}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        status: 'Не выполнено'
                    })
                })
            }else if(habit.status === 'Не выполнено' && shouldResetHabit(habit)){
                modal.openRollBackSeries(habit.habit)
                await handler(`/habits/${habit.id}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        currentSeries: 0
                    })
                })
            }
        }

        const routeNames = {
            'current-habits': () => {
                return habits.filter(habit => habit.status !== 'Выполнено')
            },
            'day-completed-habits': () => {
                return habits.filter(habit => habit.status === 'Выполнено' && isToday(habit.lastDate))
            },
            'all-completed-habits': () => {
                return habits.filter(habit => getHabitStatus(habit) === 'Завершено')
            },
            'in-progress-habits': () => {
                return habits.filter(habit => habit.status === 'В процессе')
            },
            'incompleted-habits': () => {
                return habits.filter(habit => habit.status === 'Не выполнено' )
            }
        }
        return routeNames[routeName]?.() || habits
    }

    const isHabitLocked = (habit) => {
        if (!habit?.linkedHabit) return false

        const linkedHabit = habits.value.find(h => h.id === habit.linkedHabit)

        return linkedHabit ? linkedHabit?.status !== 'Выполнено' : false
    }


    return{
        formatDate,
        shouldResetHabit,
        filteredCurrentHabits,
        isHabitLocked
    }
}