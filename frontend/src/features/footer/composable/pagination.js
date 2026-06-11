import { useGetHabits } from "../../habits/composables/getHabits.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js"

const { getFilteredHabits } = useGetHabits()
const { currentPage } = useHabitsStore();

export const usePagination = () => {
    const prevPage = async () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
        await getFilteredHabits()
    };
    const nextPage = async () => {
        if (currentPage.value < 2) {
            currentPage.value++;
        }
        await getFilteredHabits()
    }

    return {
        prevPage,
        nextPage
    };
}