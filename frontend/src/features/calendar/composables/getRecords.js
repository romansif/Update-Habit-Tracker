import {ref} from "vue";
import { handler } from "../../../shared/api/http.js";
import { useCalendar } from "./useCalendar.js";
import { useUserStore } from "../../../shared/composables/store/useUserStore.js";

const selectedCategory = ref(null)
const selectedDate = ref(null)

const selectedReset = ref(null)
const resetDate = ref(null)


const recordsModalVisible = ref(false)
const infoModalVisible = ref(false)

export const useGetRecords = () => {
    const { habitsCurrent, records, dayRecords } = useUserStore();
    const { currentMonth, currentYear } = useCalendar();

    const getRecordsCurrent = async () => {
        const userRecordsId = localStorage.getItem('userRecordsId');
        if(!userRecordsId){
            console.log('Id записей не найдены');
            return;
        }

        try{
            const res = await handler(`/current-records/${userRecordsId}`, {
                method: 'GET'
            })
            habitsCurrent.value = res;
        }catch(err){
            console.log(err)
        }
    }

    const getRecords = async() => {
        const userRecordsId = localStorage.getItem('userRecordsId');
        if(!userRecordsId){
            console.log('Id записей не найдены');
            return;
        }

        try{
            const res = await handler(`/calendar-records?userRecordsId=${userRecordsId}`, {
                method: 'GET'
            })
            records.value = res
        }catch(err){
            console.log(err)
        }
    }

    const openRecordsModal = async (day) => {
        const date = new Date(
            currentYear.value,
            currentMonth.value,
            day
        );

        selectedDate.value = date;
        resetDate.value = selectedDate.value.toLocaleDateString();

        await getDayRecords()

        recordsModalVisible.value = true;
    }

    const getDayRecords = async () => {
        const userRecordsId = localStorage.getItem('userRecordsId');

        if(!selectedDate.value) return;

        try{
            const res = await handler(`/calendar-records?userRecordsId=${userRecordsId}&dateCreatedRecord=${resetDate.value}`, {
                method: 'GET'
            });
            dayRecords.value = res
        }catch(err){
            console.log(err);
        }
    };

    const closeRecordsModal = () => {
        dayRecords.value = [];
        selectedDate.value = null;

        recordsModalVisible.value = false;
    }

    return{
        getRecordsCurrent,
        getRecords,

        openRecordsModal,
        getDayRecords,
        closeRecordsModal,

        selectedCategory,
        selectedDate,

        selectedReset,
        resetDate,

        recordsModalVisible,
        infoModalVisible,
    }
}
