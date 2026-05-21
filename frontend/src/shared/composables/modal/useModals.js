import { useUserStore } from "../store/userStore.js";
import { useHabitsStore } from "../store/habitsStore.js";
import { useModalsStore } from "../store/modalsStore.js";
import { useRecordsStore } from "../store/recordsStore.js";

import { useClearForms } from "../forms/clearForms.js";
import { useGetHabits } from "../../../features/habits/composables/getHabits.js";
import { useCalendar } from "../../../features/calendar/composables/useCalendar.js";
import { useGetRecords } from "../../../features/calendar/composables/getRecords.js";

export const useModals = () => {
    const userStore = useUserStore();
    const habitsStore = useHabitsStore();
    const modalsStore = useModalsStore();
    const recordsStore = useRecordsStore();

    const openLogoutUserModal = (message) => {
        userStore.logoutUserMessage.value = message;
        modalsStore.logoutUserModalVisible.value = true;
    }
    const closeLogoutUserModal = () => {
        modalsStore.logoutUserModalVisible.value = false;
    }

    const openDeleteUserModal = (message) => {
        userStore.deleteUserMessage.value = message;
        modalsStore.deleteUserModalVisible.value = true;
    }
    const closeDeleteUserModal = () => {
        modalsStore.deleteUserModalVisible.value = false;
    }

    const openCreateHabitModal = () => {
        modalsStore.createHabitModalVisible.value = true;
    }
    const closeCreateHabitModal = () => {
        const clearForms = useClearForms()

        modalsStore.createHabitModalVisible.value = false;
        clearForms.clearHabitForm();
    }

    const openHabitInfoModal = async (id) => {
        const getHabits = useGetHabits()

        await getHabits.getHabit(id);
        modalsStore.habitInfoModalVisible.value = true;
    }
    const closeHabitInfoModal = async () => {
        modalsStore.habitInfoModalVisible.value = false;
    }

    const openCalendarModal = async (id) => {
        const getRecords = useGetRecords()

        recordsStore.recordId.value = id;

        modalsStore.calendarModalVisible.value = true;
        await getRecords.getHabitRecords();

        modalsStore.habitInfoModalVisible.value = false;
    }
    const closeCalendarModal = async () => {
        modalsStore.calendarModalVisible.value = false;
        modalsStore.habitInfoModalVisible.value = true;
    }

    const openDeleteHabitModal = (id, message, deleteType) => {
        habitsStore.habitId.value = id;
        habitsStore.deleteHabitMessage.value = message;
        habitsStore.selectedDeleteType.value = deleteType;

        modalsStore.deleteHabitModalVisible.value = true;
    }
    const closeDeleteHabitModal = () => {
        modalsStore.deleteHabitModalVisible.value = false;
    }

    const openHabitsRecordsModal = async (day) => {
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

        modalsStore.habitsRecordsModalVisible.value = true;
    }
    const closeHabitsRecordsModal = () => {
        recordsStore.dayHabitsRecords.value = [];
        recordsStore.selectedDate.value = null;

        modalsStore.habitsRecordsModalVisible.value = false;
    }

    const openHabitRecordsModal = async (day) => {
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

        modalsStore.habitRecordsModalVisible.value = true;
    }

    const closeHabitRecordsModal = () => {
        recordsStore.dayHabitRecords.value = [];
        recordsStore.selectedDate.value = null;

        modalsStore.habitRecordsModalVisible.value = false;
    }

    const openResetRecordsModal = (id, message, resetType, month) => {
        recordsStore.recordId.value = id;
        recordsStore.resetMessage.value = message;
        recordsStore.selectedResetType.value = resetType;

        if(resetType === "MONTH"){
            recordsStore.resetDate.value = month;
        }
        modalsStore.resetRecordsModalVisible.value = true;
    }

    const closeResetRecordsModal = () => {
        modalsStore.resetRecordsModalVisible.value = false;
    }

    return {
        openLogoutUserModal,
        openDeleteUserModal,
        openCreateHabitModal,
        openHabitInfoModal,
        openCalendarModal,
        openDeleteHabitModal,
        openHabitsRecordsModal,
        openHabitRecordsModal,
        openResetRecordsModal,

        closeLogoutUserModal,
        closeDeleteUserModal,
        closeCreateHabitModal,
        closeHabitInfoModal,
        closeCalendarModal,
        closeDeleteHabitModal,
        closeHabitsRecordsModal,
        closeHabitRecordsModal,
        closeResetRecordsModal
    }
}