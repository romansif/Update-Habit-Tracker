import {ref} from "vue";

const deleteUserModalVisible = ref(false);
const logoutUserModalVisible = ref(false);

const createHabitModalVisible = ref(false);
const habitInfoModalVisible = ref(false);
const deleteHabitModalVisible = ref(false);

const resetRecordsModalVisible = ref(false)
const calendarModalVisible = ref(false);
const habitRecordsModalVisible = ref(false);
const habitsRecordsModalVisible = ref(false);

export const useModalsStore = () => {
    return{
        deleteUserModalVisible,
        logoutUserModalVisible,
        resetRecordsModalVisible,
        createHabitModalVisible,
        habitInfoModalVisible,
        calendarModalVisible,
        deleteHabitModalVisible,
        habitRecordsModalVisible,
        habitsRecordsModalVisible,
    }
}