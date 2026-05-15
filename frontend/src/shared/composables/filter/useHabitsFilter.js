export const useHabitsFilter = () => {
    const today = new Date();

    const formatDate = (date) => {
        if(!date) return null;

        return new Date(date.split('.').reverse().join('-'));
    };

    const shouldResetHabit = (habit) => {
        const lastDate = formatDate(habit.lastDate);

        if (!lastDate) return false;

        const nextDate = new Date(lastDate);

        if (habit.frequency === 'Ежедневно') {
            nextDate.setDate(nextDate.getDate() + 1);
        }
        if (habit.frequency === '1 раз в неделю') {
            nextDate.setDate(nextDate.getDate() + 7);
        }
        if (habit.frequency === '3 раза в неделю') {
            nextDate.setDate(nextDate.getDate() + 2);
        }
        return today >= nextDate;
    };

    const isToday = (dateStr) => {
        const date = formatDate(dateStr);

        if(!date) return false;

        return(
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
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

    const filteredHabits = (data, route) => {
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

        const activeHabits = rollBack

        if(route.name === 'habits'){
            return activeHabits.filter(habit => habit.status !== 'Выполнено')
        }else if(route.name === 'day-completed-habits'){
            return activeHabits.filter(habit => habit.status === 'Выполнено' && isToday(habit.lastDate))
        }else if(route.name === 'all-completed-habits'){
            return activeHabits.filter(habit => getHabitStatus(habit) === 'Завершено')
        }else if(route.name === 'in-progress-habits'){
            return activeHabits.filter(habit => habit.status === 'В процессе')
        }else if(route.name === 'incompleted-habits'){
            return activeHabits.filter(habit => habit.status === 'Не выполнено' )
        }
        return activeHabits
    }

    return{
        today,
        formatDate,
        shouldResetHabit,
        isToday,
        isFullyCompleted,
        getHabitStatus,
        filteredHabits
    }
}