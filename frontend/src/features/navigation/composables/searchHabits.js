import { useDebounceFn } from "@vueuse/core";

import { handler } from '../../../shared/api/http.js';
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";

export const useSearchingHabits = () => {
    const { habits, currentPage, totalPages, searchForm } = useHabitsStore();

    const getSearchedHabits = async () => {
        const res = await handler(`/habits/filtered?search=${searchForm.value.search}&sort=date&order=desc&page=${currentPage.value}&limit=8`, {
            method: 'GET',
        })

        habits.value = res.data
        totalPages.value = res.totalPages

        return habits
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