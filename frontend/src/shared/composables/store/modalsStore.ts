import {ref} from "vue";

const deleteUserVisible = ref<boolean>(false);
const logoutUserVisible = ref<boolean>(false);

const createHabitVisible = ref<boolean>(false);
const habitInfoVisible = ref<boolean>(false);
const rollbackSeriesVisible = ref<boolean>(false);
const restoreSeriesVisible = ref<boolean>(false);
const deleteHabitVisible = ref<boolean>(false);

const resetRecordsVisible = ref<boolean>(false)
const calendarVisible = ref<boolean>(false);
const habitRecordsVisible = ref<boolean>(false);
const habitsRecordsVisible = ref<boolean>(false);

export const useModalsStore = () => {
    return{
        deleteUserVisible,
        logoutUserVisible,

        createHabitVisible,
        habitInfoVisible,
        deleteHabitVisible,
        rollbackSeriesVisible,
        restoreSeriesVisible,

        calendarVisible,
        resetRecordsVisible,
        habitRecordsVisible,
        habitsRecordsVisible,
    }
}