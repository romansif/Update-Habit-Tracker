import {ref} from "vue";

const records = ref([]);
const recordId = ref(null)
const monthRecords = ref([])
const dayHabitsRecords = ref([]);
const habitRecords = ref([])
const dayHabitRecords = ref({})
const selectedDate = ref(null)
const resetDate = ref(null)
const selectedResetType = ref(null)
const resetMessage = ref('')

export const useRecordsStore = () => {
    return{
        records,
        recordId,
        monthRecords,
        dayHabitsRecords,
        habitRecords,
        dayHabitRecords,

        selectedDate,
        selectedResetType,
        resetDate,
        resetMessage,
    }
}