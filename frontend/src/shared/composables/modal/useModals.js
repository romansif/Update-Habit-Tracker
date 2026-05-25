import { useUserStore } from "../store/userStore.js";
import { useHabitsStore } from "../store/habitsStore.js";
import { useModalsStore } from "../store/modalsStore.js";
import { useRecordsStore } from "../store/recordsStore.js";

import { useClearForms } from "../forms/clearForms.js";
import { useGetHabits } from "../../../features/habits/composables/getHabits.js";
import { useCalendar } from "../../../features/calendar/composables/useCalendar.js";
import { useGetRecords } from "../../../features/calendar/composables/getRecords.js";

export const useUserModals = () => {
    const userStore = useUserStore();
    const modalsStore = useModalsStore();

    const openLogoutUser = (message) => {
        userStore.logoutUserMessage.value = message;
        modalsStore.logoutUserVisible.value = true;
    }
    const closeLogoutUser = () => {
        modalsStore.logoutUserVisible.value = false;
    }

    const openDeleteUser = (message) => {
        userStore.deleteUserMessage.value = message;
        modalsStore.deleteUserVisible.value = true;
    }
    const closeDeleteUser = () => {
        modalsStore.deleteUserVisible.value = false;
    }

    return {
        openLogoutUser,
        openDeleteUser,

        closeLogoutUser,
        closeDeleteUser,
    }
}

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

    const openHabitInfo = async (id) => {
        const getHabits = useGetHabits()

        await getHabits.getHabit(id);
        modalsStore.habitInfoVisible.value = true;
    }
    const closeHabitInfo = async () => {
        modalsStore.habitInfoVisible.value = false;
    }

    const openDeleteHabit = (id, message, deleteType) => {
        habitsStore.habitId.value = id;
        habitsStore.deleteHabitMessage.value = message;
        habitsStore.selectedDeleteType.value = deleteType;

        modalsStore.deleteHabitVisible.value = true;
    }
    const closeDeleteHabit = () => {
        modalsStore.deleteHabitVisible.value = false;
    }

    const openRollBackSeries = (habit) => {
        habitsStore.restoreHabitsSeries.value.push(habit)

        habitsStore.restoreMessage.value = 'Вы потеряли свою серию выполнения этих привычек:'
        modalsStore.rollbackSeriesVisible.value = true;
    }
    const closeRollBackSeries = async () => {
        modalsStore.rollbackSeriesVisible.value = false;
    }

    const openRestoreSeries = (id) => {
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

export const useRecordsModals = () => {
    const recordsStore = useRecordsStore();
    const modalsStore = useModalsStore();

    const openCalendar = async (id) => {
        const getRecords = useGetRecords()

        recordsStore.recordId.value = id;

        modalsStore.calendarVisible.value = true;
        await getRecords.getHabitRecords();

        modalsStore.habitInfoVisible.value = false;
    }
    const closeCalendar = async () => {
        modalsStore.calendarVisible.value = false;
        modalsStore.habitInfoVisible.value = true;
    }


    const openHabitsRecords = async (day) => {
        const calendar = useCalendar();
        const getRecords = useGetRecords()

        const date = new Date(
            calendar.currentYear.value,
            calendar.currentMonth.value,
            day
        );

        recordsStore.recordId.value = date;

        recordsStore.selectedDate.value = date;
        recordsStore.resetDate.value = recordsStore.selectedDate.value.toLocaleDateString();

        await getRecords.getDayRecords();

        modalsStore.habitsRecordsVisible.value = true;
    }
    const closeHabitsRecords = () => {
        recordsStore.dayHabitsRecords.value = [];
        recordsStore.selectedDate.value = null;

        modalsStore.habitsRecordsVisible.value = false;
    }

    const openHabitRecords = async (day) => {
        const calendar = useCalendar();
        const getRecords = useGetRecords()

        const date = new Date(
            calendar.currentYear.value,
            calendar.currentMonth.value,
            day
        );
        recordsStore.selectedDate.value = date;
        recordsStore.resetDate.value = recordsStore.selectedDate.value.toLocaleDateString();

        await getRecords.getDayHabitRecords();

        modalsStore.habitRecordsVisible.value = true;
    }

    const closeHabitRecords = () => {
        recordsStore.dayHabitRecords.value = [];
        recordsStore.selectedDate.value = null;

        modalsStore.habitRecordsVisible.value = false;
    }

    const openResetRecords = (id, message, resetType, month) => {
        recordsStore.recordId.value = id;
        recordsStore.resetMessage.value = message;
        recordsStore.selectedResetType.value = resetType;

        if(resetType === "MONTH"){
            recordsStore.resetDate.value = month;
        }
        modalsStore.resetRecordsVisible.value = true;
    }

    const closeResetRecords = () => {
        modalsStore.resetRecordsVisible.value = false;
    }


    return{
        openCalendar,
        openHabitsRecords,
        openResetRecords,
        openHabitRecords,

        closeCalendar,
        closeHabitsRecords,
        closeResetRecords,
        closeHabitRecords
    }
}