import { handler } from "../../../shared/api/http.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";
import { useRecordsStore } from "../../../shared/composables/store/recordsStore.js";

export const useGetRecords = () => {
    const { habitsCount } = useHabitsStore();
    const { resetDate, records, monthRecords, dayHabitsRecords, habitRecords, dayHabitRecords, recordId } = useRecordsStore();

    const userId = localStorage.getItem('userId');
    const recordsId = localStorage.getItem('recordsId')
    const habitsCountId = localStorage.getItem('habitsCountId')

    const getRecordsCurrent = async () => {
        if(!userId) return null;
        try{
            const res = await handler(`/habits-count/${habitsCountId}`, {
                method: 'GET'
            });
            habitsCount.value = res;
        }catch(err){
            console.log(err);
        }
    }

    const getRecords = async() => {
        if(!userId){
            console.log('Id записей не найдены');
            return;
        }
        console.log(recordId)
        try{
            const res = await handler(`/records/${recordsId}`, {
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
            const res = await handler(`/records/${recordsId}&monthCreatedRecord=${resetDate.value}`, {
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
            const res = await handler(`/records/${recordsId}&dateCreatedRecord=${resetDate.value}`, {
                method: 'GET'
            });
            dayHabitsRecords.value = res;

            return dayHabitsRecords;
        }catch(err){
            console.log(err);
        }
    };

    const getHabitRecords = async () => {
        try{
            const res = await handler(`/records/${recordId.value}`, {
                method: 'GET'
            })
            habitRecords.value = res
        }catch(err){
            console.log(err);
        }
    }

    const getDayHabitRecords = async () => {
        try{
            const res = await handler(`/records/${recordId.value}&dateCreatedRecord=${resetDate.value}`, {
                method: 'GET'
            })
            dayHabitRecords.value = res
        }catch(err){
            console.log(err);
        }
    }

    return{
        getRecordsCurrent,
        getRecords,
        getMonthRecords,
        getDayRecords,
        getHabitRecords,
        getDayHabitRecords
    }
}
