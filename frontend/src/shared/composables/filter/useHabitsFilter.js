export const useHabitsFilter = () => {
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
            'Ежедневно': () => nextDate.setDate(nextDate.getDate() + 1),
            '1 раз в неделю': () => nextDate.setDate(nextDate.getDate() + 7),
            '3 раза в неделю': () => nextDate.setDate(nextDate.getDate() + 2)
        }
        frequency[habit.frequency]?.()

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

    const filteredHabits = (data, routeName) => {
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

        const routeNames = {
            'habits': () => {
                return activeHabits.filter(habit => habit.status !== 'Выполнено')
            },
            'day-completed-habits': () => {
                return activeHabits.filter(habit => habit.status === 'Выполнено' && isToday(habit.lastDate))
            },
            'all-completed-habits': () => {
                return activeHabits.filter(habit => getHabitStatus(habit) === 'Завершено')
            },
            'in-progress-habits': () => {
                return activeHabits.filter(habit => habit.status === 'В процессе')
            },
            'incompleted-habits': () => {
                return activeHabits.filter(habit => habit.status === 'Не выполнено' )
            }
        }
        return routeNames[routeName]?.() || activeHabits
    }

    return{
        formatDate,
        shouldResetHabit,
        isToday,
        isFullyCompleted,
        getHabitStatus,
        filteredHabits
    }
}