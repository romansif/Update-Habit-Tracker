import { useClearForms } from "../forms/clearForms.js";
import { useModalsStore } from "../store/modalsStore";
import { useHabitsStore } from "../store/habitsStore";
import { useGetHabits } from "../../../features/habits/composables/getHabits.js";

export const useHabitModals = () => {
    const habitsStore = useHabitsStore();
    const modalsStore = useModalsStore();

    const openCreateHabit = () => {
        modalsStore.createHabitVisible.value = true;
    }
    const closeCreateHabit = () => {
        const clearForms = useClearForms()

        modalsStore.createHabitVisible.value = false;
        clearForms.clearHabitForm();
    }

    const openHabitInfo = async (id: string) => {
        const getHabits = useGetHabits()

        await getHabits.getHabit(id);
        modalsStore.habitInfoVisible.value = true;
    }
    const closeHabitInfo = async () => {
        modalsStore.habitInfoVisible.value = false;
    }

    const openDeleteHabit = (id: string, message: string, deleteType: string) => {
        habitsStore.habitId.value = id;
        habitsStore.deleteHabitMessage.value = message;
        habitsStore.selectedDeleteType.value = deleteType;

        modalsStore.deleteHabitVisible.value = true;
    }
    const closeDeleteHabit = () => {
        modalsStore.deleteHabitVisible.value = false;
    }

    const openRollBackSeries = (habit: object) => {
        habitsStore.restoreHabitsSeries.value = habit

        habitsStore.restoreMessage.value = 'Вы потеряли свою серию выполнения этих привычек:'
        modalsStore.rollbackSeriesVisible.value = true;
    }
    const closeRollBackSeries = async () => {
        modalsStore.rollbackSeriesVisible.value = false;
    }

    const openRestoreSeries = (id: string) => {
        habitsStore.habitId.value = id

        modalsStore.restoreSeriesVisible.value = true

    }
    const closeRestoreSeries = () => {
        modalsStore.restoreSeriesVisible.value = false
    }

    return{
        openCreateHabit,
        openHabitInfo,
        openDeleteHabit,
        openRollBackSeries,
        openRestoreSeries,

        closeCreateHabit,
        closeHabitInfo,
        closeDeleteHabit,
        closeRollBackSeries,
        closeRestoreSeries
    }
}