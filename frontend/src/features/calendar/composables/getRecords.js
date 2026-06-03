import { handler } from "../../../shared/api/http.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";
import { useRecordsStore } from "../../../shared/composables/store/recordsStore.js";

export const useGetRecords = () => {
    const { habitsCount } = useHabitsStore();
    const { resetDate, records, monthRecords, dayHabitsRecords, habitRecords, dayHabitRecords, recordId } = useRecordsStore();

    const habitsCountId = localStorage.getItem('habitsCountId');

    const getRecordsCurrent = async () => {
        if(!habitsCountId) return null;
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
        if(!habitsCountId){
            console.log('Id записей не найдены');
            return;
        }
        try{
            const res = await handler(`/records?habitsCountId=${habitsCountId}`, {
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
            const res = await handler(`/records?habitsCountId=${habitsCountId}&monthCreatedRecord=${resetDate.value}`, {
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
            const res = await handler(`/records?habitsCountId=${habitsCountId}&dateCreatedRecord=${resetDate.value}`, {
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
            const res = await handler(`/records?recordId=${recordId.value}`, {
                method: 'GET'
            })
            habitRecords.value = res
        }catch(err){
            console.log(err);
        }
    }

    const getDayHabitRecords = async () => {
        try{
            const res = await handler(`/records?dateCreatedRecord=${resetDate.value}&recordId=${recordId.value}`, {
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