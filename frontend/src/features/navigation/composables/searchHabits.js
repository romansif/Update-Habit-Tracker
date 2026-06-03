import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDebounceFn } from "@vueuse/core";

import { handler } from '../../../shared/api/http.js';
import { useHabitsFilter } from "../../../shared/composables/filter/HabitsFilter.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";

export const useSearchingHabits = () => {
    const { allHabits } = useHabitsStore();
    const { filteredCurrentHabits } = useHabitsFilter();

    const route = useRoute();

    const searchForm = ref({
        search: ''
    })

    const getSearchedHabits = async () => {
        const userId = localStorage.getItem('userId');

        const res = await handler(`/habits?userId=${userId}`, {
            method: 'GET',
        });

        allHabits.value = filteredCurrentHabits(
            res.filter(habit =>
                habit.category?.toLowerCase().includes(searchForm.value.search.toLowerCase()) ||
                habit.habit?.toLowerCase().includes(searchForm.value.search.toLowerCase()) ||
                habit.dateCreatedHabit?.toLowerCase().includes(searchForm.value.search.toLowerCase()) ||
                habit.timeCreatedHabit?.toLowerCase().includes(searchForm.value.search.toLowerCase())
            ).sort((a, b) => new Date(b.date) - new Date(a.date)),
            route.name
        );

        return allHabits.value
    }

    const debouncedSearch = useDebounceFn(async () => {
        await getSearchedHabits(allHabits)

        return allHabits
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