import { ref } from "vue";

const habits = ref([]);
const habit = ref(null)
const habitsCurrent = ref(null);
const seriesCount = ref(0);
const records = ref(null);
const dayRecords = ref(null);

export const useUserStore = () => {
    return{
        habits,
        habit,
        habitsCurrent,
        seriesCount,
        records,
        dayRecords,
    }
}