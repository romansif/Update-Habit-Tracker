import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { handler } from '../../../shared/api/http.js';
import { useUserStore } from "../../../shared/composables/store/useUserStore.js";
import { useDebounceFn } from "@vueuse/core";


export const useSearchingHabits = () => {
    const { habits } = useUserStore();

    const route = useRoute();

    const searchForm = ref({
        search: ''
    })

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

    const getSearchedHabits = async () => {
        const userId = localStorage.getItem('userId');

        const res = await handler(`/habits?userId=${userId}`, {
            method: 'GET',
        });

        habits.value = filteredHabits(
            res.filter(habit => habit.category === searchForm.value.search ||
                habit.habit === searchForm.value.search ||
                habit.dateCreatedHabit === searchForm.value.search ||
                habit.timeCreatedHabit === searchForm.value.search
            ).sort((a, b) => new Date(b.timeCreatedHabit) - new Date(a.timeCreatedHabit))
        );
    }

    const debouncedSearch = useDebounceFn(async () => {
        await getSearchedHabits()
    }, 500)

    const resetSearchForm = () => {
        searchForm.value.search = '';
    }

    return{
        searchForm,
        debouncedSearch,

        getSearchedHabits,
        resetSearchForm
    }
}