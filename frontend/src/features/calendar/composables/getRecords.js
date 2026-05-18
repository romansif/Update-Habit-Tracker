import { handler } from "../../../shared/api/http.js";
import { useUserStore } from "../../../shared/composables/store/useUserStore.js";


export const useGetRecords = () => {
    const { selectedDate, resetDate, habitsCurrent, records, dayRecords } = useUserStore();

    const userRecordsId = localStorage.getItem('userRecordsId');

    const getRecordsCurrent = async () => {
        if(!userRecordsId){
            console.log('Id записей не найдены');
            return;
        }
        try{
            const res = await handler(`/habits-counter/${userRecordsId}`, {
                method: 'GET'
            })
            habitsCurrent.value = res;
        }catch(err){
            console.log(err)
        }
    }

    const getRecords = async() => {
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

    const getDayRecords = async () => {
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

    return{
        getRecordsCurrent,
        getRecords,
        getDayRecords,
    }
}
