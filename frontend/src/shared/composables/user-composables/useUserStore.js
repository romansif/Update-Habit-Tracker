import { ref } from "vue";

const habits = ref([]);
const userRecordsCurrent = ref(null);
const userRecords = ref(null);
const userDayRecords = ref(null);

export const useUserStore = () => {
    return{
        habits,
        userRecordsCurrent,
        userRecords,
        userDayRecords,
    }
}