import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { handler } from '../api/http.js';
import { useUserStore } from "./user-composables/useUserStore.js";
import { useDebounceFn } from "@vueuse/core";


export const useSearchingHabits = () => {
    const route = useRoute();

    const { habits } = useUserStore();

    const searchForm = ref({
        search: ''
    })

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

    const getSearchedHabits = async () => {
        const userId = localStorage.getItem('userId');

        const res = await handler(`/habits?userId=${userId}`, {
            method: 'GET',
        });

        habits.value = filteredHabits(
            res.filter(habit => habit.category === searchForm.value.search || habit.habit === searchForm.value.search)
                .sort((a, b) => new Date(b.dateCreatedHabit) - new Date(a.dateCreatedHabit))
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