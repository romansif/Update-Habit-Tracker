import { ref } from 'vue';
import { useDebounceFn } from "@vueuse/core";

import { handler } from '../../../shared/api/http.js';
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";

export const useSearchingHabits = () => {
    const { allHabits, currentPage, totalPages } = useHabitsStore();

    const searchForm = ref({
        search: ''
    })

    const getSearchedHabits = async () => {
        const res = await handler(`/habits/pagination?page=${currentPage.value}&limit=8`, {
            method: 'GET',
        });

        allHabits.value = res.data.filter(habit =>
                habit.category?.toLowerCase().includes(searchForm.value.search.toLowerCase()) ||
                habit.habit?.toLowerCase().includes(searchForm.value.search.toLowerCase()) ||
                habit.dateCreatedHabit?.toLowerCase().includes(searchForm.value.search.toLowerCase()) ||
                habit.timeCreatedHabit?.toLowerCase().includes(searchForm.value.search.toLowerCase())
        ).sort((a, b) => new Date(b.date) - new Date(a.date))

        totalPages.value = res.totalPages

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