import { useUserStore } from "../store/userStore.js";
import { useHabitsStore } from "../store/habitsStore.js";
import { useRecordsStore } from "../store/recordsStore.js";
import { useModalsStore } from "../store/modalsStore.js";

import { useGetRecords } from "../../../features/calendar/composables/getRecords.js";
import { useGetHabits } from "../../../features/habits/composables/getHabits.js";
import { useClearForms } from "../forms/clearForms.js";
import { useCalendar } from "../../../features/calendar/composables/useCalendar.js";

export const useModals = () => {
    const userStore = useUserStore();
    const habitsStore = useHabitsStore();
    const recordsStore = useRecordsStore();
    const modalsStore = useModalsStore();

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

    const openDeleteHabitModal = (id, message) => {
        habitsStore.habitId.value = id;
        habitsStore.deleteHabitMessage.value = message;
        modalsStore.deleteHabitModalVisible.value = true;
    }

    const closeDeleteHabitModal = () => {
        modalsStore.deleteHabitModalVisible.value = false;
    }

    const openRecordsModal = async (day) => {
        const calendar = useCalendar();
        const getRecords = useGetRecords()

        const date = new Date(
            calendar.currentYear.value,
            calendar.currentMonth.value,
            day
        );

        recordsStore.selectedDate.value = date;
        recordsStore.resetDate.value = recordsStore.selectedDate.value.toLocaleDateString();

        await getRecords.getDayRecords();

        modalsStore.recordsModalVisible.value = true;
    }

    const closeRecordsModal = () => {
        recordsStore.dayRecords.value = [];
        recordsStore.selectedDate.value = null;
        modalsStore.recordsModalVisible.value = false;
    }

    const openResetRecordsModal = (id, message, resetType, month) => {
        recordsStore.resetMessage.value = message;
        recordsStore.recordId.value = id;
        recordsStore.selectedResetType.value = resetType;

        if(resetType === recordsStore.RESET_TYPES.MONTH){
            recordsStore.resetDate.value = month;
        }

        modalsStore.resetRecordsModalVisible.value = true;
    }

    const closeResetRecordsModal = () => {
        recordsStore.recordId.value = null;
        recordsStore.selectedResetType.value = null;
        modalsStore.resetRecordsModalVisible.value = false;
    }

    return {
        openLogoutUserModal,
        openDeleteUserModal,
        openCreateHabitModal,
        openHabitInfoModal,
        openDeleteHabitModal,
        openRecordsModal,
        openResetRecordsModal,

        closeLogoutUserModal,
        closeDeleteUserModal,
        closeCreateHabitModal,
        closeHabitInfoModal,
        closeDeleteHabitModal,
        closeRecordsModal,
        closeResetRecordsModal
    }
}