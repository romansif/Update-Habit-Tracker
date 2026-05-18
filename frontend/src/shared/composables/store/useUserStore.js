import { ref } from "vue";

const users = ref([]);
const user = ref(null);

const habits = ref([]);
const habitsCurrent = ref(null);
const currentForms = ref({
    allHabits: 0,
    dayCompletedHabits: 0,
    allCompletedHabits: 0,
    incompletedHabits: 0,
})
const habitId = ref(null);
const habit = ref(null)
const seriesCount = ref(0);

const records = ref(null);
const recordId = ref(null)
const dayRecords = ref(null);
const selectedCategory = ref(null)
const selectedDate = ref(null)
const selectedReset = ref(null)
const resetDate = ref(null)
const RESET_TYPES = ref({
    ONE:'ONE',
    DAY:'DAY',
    MONTH:'MONTH',
    ALL:'ALL',
})

const delUserMessage = ref('')
const logoutUserMessage = ref('')
const deleteHabitMessage = ref('')
const resetMessage = ref('')

const deleteUserModalVisible = ref(false);
const logoutUserModalVisible = ref(false);
const resetRecordsModalVisible = ref(false)
const createHabitModalVisible = ref(false);
const habitInfoModalVisible = ref(false);
const deleteHabitModalVisible = ref(false);
const recordsModalVisible = ref(false)
const infoModalVisible = ref(false)

export const useUserStore = () => {
    return{
        users,
        user,
        habits,
        currentForms,
        habitsCurrent,
        habit,
        seriesCount,
        habitId,

        records,
        recordId,
        dayRecords,
        selectedCategory,
        selectedDate,
        selectedReset,
        resetDate,
        RESET_TYPES,

        delUserMessage,
        logoutUserMessage,
        deleteHabitMessage,
        resetMessage,

        deleteUserModalVisible,
        logoutUserModalVisible,
        resetRecordsModalVisible,
        createHabitModalVisible,
        habitInfoModalVisible,
        deleteHabitModalVisible,
        recordsModalVisible,
        infoModalVisible
    }
}