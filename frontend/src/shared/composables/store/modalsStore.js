import {ref} from "vue";

const deleteUserModalVisible = ref(false);
const logoutUserModalVisible = ref(false);
const resetRecordsModalVisible = ref(false)
const createHabitModalVisible = ref(false);
const habitInfoModalVisible = ref(false);
const deleteHabitModalVisible = ref(false);
const recordsModalVisible = ref(false)

export const useModalsStore = () => {
    return{
        deleteUserModalVisible,
        logoutUserModalVisible,
        resetRecordsModalVisible,
        createHabitModalVisible,
        habitInfoModalVisible,
        deleteHabitModalVisible,
        recordsModalVisible,
    }
}