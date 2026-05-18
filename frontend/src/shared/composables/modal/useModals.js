import { useAppStore } from "../store/useAppStore.js";
import { useGetRecords } from "../../../features/calendar/composables/getRecords.js";
import { useGetHabits } from "../../../features/habits/composables/getHabits.js";
import { useClearForms } from "../forms/clearForms.js";
import { useCalendar } from "../../../features/calendar/composables/useCalendar.js";

export const useModals = () => {
    const store = useAppStore();

    const openLogoutUserModal = (message) => {
        store.logoutUserMessage.value = message;
        store.logoutUserModalVisible.value = true;
    }

    const closeLogoutUserModal = () => {
        store.logoutUserModalVisible.value = false;
    }

    const openDeleteUserModal = (message) => {
        store.delUserMessage.value = message;
        store.deleteUserModalVisible.value = true;
    }

    const closeDeleteUserModal = () => {
        store.deleteUserModalVisible.value = false;
    }

    const openCreateHabitModal = () => {
        store.createHabitModalVisible.value = true;
    }

    const closeCreateHabitModal = () => {
        const clearForms = useClearForms()

        store.createHabitModalVisible.value = false;
        clearForms.clearHabitForm();
    }

    const openHabitInfoModal = async (id) => {
        const getHabits = useGetHabits()

        await getHabits.getHabit(id);
        store.habitInfoModalVisible.value = true;
    }

    const closeHabitInfoModal = async () => {
        store.habitInfoModalVisible.value = false;
    }

    const openDeleteHabitModal = (id, message) => {
        store.habitId.value = id;
        store.deleteHabitMessage.value = message;
        store.deleteHabitModalVisible.value = true;
    }

    const closeDeleteHabitModal = () => {
        store.deleteHabitModalVisible.value = false;
    }

    const openRecordsModal = async (day) => {
        const calendar = useCalendar();
        const getRecords = useGetRecords()

        const date = new Date(
            calendar.currentYear.value,
            calendar.currentMonth.value,
            day
        );

        store.selectedDate.value = date;
        store.resetDate.value = store.selectedDate.value.toLocaleDateString();

        await getRecords.getDayRecords();

        store.recordsModalVisible.value = true;
    }

    const closeRecordsModal = () => {
        store.dayRecords.value = [];
        store.selectedDate.value = null;
        store.recordsModalVisible.value = false;
    }

    const openResetRecordsModal = (id, message, resetType, month) => {
        store.resetMessage.value = message;
        store.recordId.value = id;
        store.selectedReset.value = resetType;

        if(resetType === store.RESET_TYPES.value.MONTH){
            store.resetDate.value = month;
        }

        store.resetRecordsModalVisible.value = true;
    }

    const closeResetRecordsModal = () => {
        store.recordId.value = null;
        store.selectedReset.value = null;
        store.resetRecordsModalVisible.value = false;
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