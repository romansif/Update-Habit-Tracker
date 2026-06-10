import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js"

const { currentPage } = useHabitsStore();

export const usePagination = () => {
    const prevPage = async () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    };
    const nextPage = async () => {
        if (currentPage.value < 2) {
            currentPage.value++;
        }
    }

    return {
        prevPage,
        nextPage
    };
}