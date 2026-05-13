import { ref } from "vue";

const habits = ref([]);
const habitsCurrent = ref(null);
const records = ref(null);
const dayRecords = ref(null);

export const useUserStore = () => {
    return{
        habits,
        habitsCurrent,
        records,
        dayRecords,
    }
}