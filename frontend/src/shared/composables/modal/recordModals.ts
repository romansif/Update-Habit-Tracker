import { useModalsStore } from "../store/modalsStore";
import { useRecordsStore } from "../store/recordsStore";

import { useCalendar } from "../../../features/calendar/composables/useCalendar.js";
import { useGetRecords } from "../../../features/calendar/composables/getRecords.js";

export const useRecordsModals = () => {
    const recordsStore = useRecordsStore();
    const modalsStore = useModalsStore();

    const openCalendar = async (id: string) => {
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


    const openHabitsRecords = async (day: number) => {
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
        recordsStore.selectedDate.value = null

        modalsStore.habitsRecordsVisible.value = false;
    }

    const openHabitRecords = async (day: number) => {
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
        recordsStore.dayHabitRecords.value = {};
        recordsStore.selectedDate.value = null;

        modalsStore.habitRecordsVisible.value = false;
    }

    const openResetRecords = (id: string, message: string, resetType: string, month: string) => {
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