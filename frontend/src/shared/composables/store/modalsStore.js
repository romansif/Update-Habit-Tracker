import {ref} from "vue";

const deleteUserVisible = ref(false);
const logoutUserVisible = ref(false);

const createHabitVisible = ref(false);
const habitInfoVisible = ref(false);
const rollbackSeriesVisible = ref(false);
const restoreSeriesVisible = ref(false);
const deleteHabitVisible = ref(false);

const resetRecordsVisible = ref(false)
const calendarVisible = ref(false);
const habitRecordsVisible = ref(false);
const habitsRecordsVisible = ref(false);

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