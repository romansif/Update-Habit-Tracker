import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDebounceFn } from "@vueuse/core";
import { handler } from '../../../shared/api/http.js';
import { useUserStore } from "../../../shared/composables/store/useUserStore.js";
import { useHabitsFilter } from "../../../shared/composables/filter/useHabitsFilter.js";

export const useSearchingHabits = () => {
    const { habits } = useUserStore();
    const { filteredHabits } = useHabitsFilter();

    const route = useRoute();

    const searchForm = ref({
        search: ''
    })

    const getSearchedHabits = async () => {
        const userId = localStorage.getItem('userId');

        const res = await handler(`/habits?userId=${userId}`, {
            method: 'GET',
        });

        habits.value = filteredHabits(
            res.filter(habit =>
                habit.category?.toLowerCase().includes(searchForm.value.search.toLowerCase()) ||
                habit.habit?.toLowerCase().includes(searchForm.value.search.toLowerCase()) ||
                habit.dateCreatedHabit?.toLowerCase().includes(searchForm.value.search.toLowerCase()) ||
                habit.timeCreatedHabit?.toLowerCase().includes(searchForm.value.search.toLowerCase())
            ).sort((a, b) => new Date(b.date) - new Date(a.date)),
            route.name
        );

        return habits.value
    }

    const debouncedSearch = useDebounceFn(async () => {
        await getSearchedHabits(habits)

        return habits
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