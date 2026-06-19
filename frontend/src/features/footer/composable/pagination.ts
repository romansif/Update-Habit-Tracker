import { useRoute } from "vue-router";

import { useGetHabits } from "../../habits/composables/getHabits";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore"

const { getFilteredHabits } = useGetHabits()
const { currentPage } = useHabitsStore();

export const usePagination = () => {
    const route = useRoute();
    const routeName = route.name as string

    const prevPage = async () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
        await getFilteredHabits(routeName)
    };
    const nextPage = async () => {
        if (currentPage.value < 2) {
            currentPage.value++;
        }
        await getFilteredHabits(routeName)
    }

    return {
        prevPage,
        nextPage
    };
}