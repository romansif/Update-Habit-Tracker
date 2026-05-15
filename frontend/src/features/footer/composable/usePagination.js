import { ref, computed, watch } from 'vue';

import { useUserStore } from "../../../shared/composables/store/useUserStore.js";

const currentPage = ref(1)

const itemsPerPage = 12

export const usePagination = () => {
    const { habits } = useUserStore();

    const totalPages = computed(() => {
        return Math.ceil(habits.value?.length / itemsPerPage)
    })

    const paginatedItems = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        return habits.value.slice(start, end)
    })

    const prevPage = () => {
        if (currentPage.value > 1) currentPage.value--
    }

    const nextPage = () => {
        if (currentPage.value < totalPages.value) currentPage.value++
    }

    watch(habits, () => {

        currentPage.value = 1;
    });

    return {
        currentPage,
        totalPages,
        paginatedItems,
        prevPage,
        nextPage,
    }
}