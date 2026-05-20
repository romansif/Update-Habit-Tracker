import {ref} from "vue";

const records = ref([]);
const recordId = ref(null)
const monthRecords = ref([])
const dayRecords = ref([]);
const selectedDate = ref(null)
const resetDate = ref(null)
const selectedResetType = ref(null)
const resetMessage = ref('')

export const useRecordsStore = () => {
    return{
        records,
        recordId,
        monthRecords,
        dayRecords,
        selectedDate,
        selectedResetType,
        resetDate,
        resetMessage,
    }
}