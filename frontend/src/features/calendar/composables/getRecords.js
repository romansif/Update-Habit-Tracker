import { handler } from "../../../shared/api/http.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";
import { useRecordsStore } from "../../../shared/composables/store/recordsStore.js";

export const useGetRecords = () => {
    const { habitsCount } = useHabitsStore();
    const { resetDate, records, monthRecords, dayRecords } = useRecordsStore();

    const userRecordsId = localStorage.getItem('userRecordsId');

    const getRecordsCurrent = async () => {
        if(!userRecordsId) return null;
        try{
            const res = await handler(`/habits-count/${userRecordsId}`, {
                method: 'GET'
            });
            habitsCount.value = res;
        }catch(err){
            console.log(err);
        }
    }

    const getRecords = async() => {
        if(!userRecordsId){
            console.log('Id записей не найдены');
            return;
        }
        try{
            const res = await handler(`/records?userRecordsId=${userRecordsId}`, {
                method: 'GET'
            });
            records.value = res;

            return records;
        }catch(err){
            console.log(err)
        }
    }

    const getMonthRecords = async() => {
        try{
            const res = await handler(`/records?userRecordsId=${userRecordsId}&monthCreatedRecord=${resetDate.value}`, {
                method: 'GET'
            });
            monthRecords.value = res

            return monthRecords;
        }catch(err){
            console.log(err);
        }
    }

    const getDayRecords = async () => {
        try{
            const res = await handler(`/records?userRecordsId=${userRecordsId}&dateCreatedRecord=${resetDate.value}`, {
                method: 'GET'
            });
            dayRecords.value = res;

            return dayRecords;
        }catch(err){
            console.log(err);
        }
    };

    return{
        getRecordsCurrent,
        getRecords,
        getMonthRecords,
        getDayRecords,
    }
}
