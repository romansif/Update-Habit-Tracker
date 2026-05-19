import {ref} from "vue";

const records = ref([]);
const recordId = ref(null)
const dayRecords = ref([]);
const selectedDate = ref(null)
const resetDate = ref(null)
const selectedResetType = ref(null)
const RESET_TYPES = {
    ONE:'ONE',
    DAY:'DAY',
    MONTH:'MONTH',
    ALL:'ALL',
}
const resetMessage = ref('')

export const useRecordsStore = () => {
    return{
        records,
        recordId,
        dayRecords,
        selectedDate,
        selectedResetType,
        resetDate,
        RESET_TYPES,
        resetMessage,
    }
}