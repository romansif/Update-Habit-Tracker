import { useGetRecords } from "./getRecords.js"
import { handler } from '../../../shared/api/http.js';
import { useModals } from "../../../shared/composables/modal/useModals.js";
import { useRecordsStore } from "../../../shared/composables/store/recordsStore.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";

const RESET_TYPES = {
    ONE:'ONE',
    DAY:'DAY',
    MONTH:'MONTH',
    ALL:'ALL',
}
export const useRecords = () => {
    const modals = useModals();

    const { habitsCount } = useHabitsStore();
    const { getRecords, getDayRecords } = useGetRecords();
    const { recordId, dayRecords, selectedResetType, resetDate } = useRecordsStore();

    const userRecordsId = localStorage.getItem('userRecordsId');
    const userRecordId = localStorage.getItem('userRecordId');

    const createRecord = async (habit, series, status) => {
        const currentAllCounter = habitsCount.value?.allHabitsCounter || 0;
        const newAllHabitsCounter = currentAllCounter + 1;

        try{
            if(currentAllCounter === null){
                console.log('Не найдено общее количество привычек');
                return;
            }
            await handler(`/habits-count/${userRecordsId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    allHabitsCounter: newAllHabitsCounter,
                })
            });

            const now = new Date();

            const month = now.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
            });

            const time = now.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
            });

            const newRecordDay = await handler(`/records`, {
                method: 'POST',
                body: JSON.stringify({
                    userRecordsId: userRecordsId,
                    date: now,
                    dateCreatedRecord: now.toLocaleDateString(),
                    monthCreatedRecord: month,
                    timeCreatedRecord: time,
                    habit: habit,
                    series: series,
                    firstStatus: status,
                })
            });
            dayRecords.value = newRecordDay;

            localStorage.setItem('userRecordId', newRecordDay.id);
        } catch (err) {
            console.log(err);
        }
    }

    const updateHabitsCurrentCount = async (newStatus) => {
        const currentDayCompleted = habitsCount.value?.dayCompletedHabits || 0;
        const currentAllCompleted = habitsCount.value?.allCompletedHabits || 0;

        const date = new Date().toLocaleDateString();

        if(newStatus === 'Выполнено'){
            try{
                const res = await handler(`/habits-count/${userRecordsId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        dayCompletedHabits: currentDayCompleted + 1,
                        allCompletedHabits: currentAllCompleted + 1,
                        lastDate: date
                    })
                });
                habitsCount.value = res;
            }catch(err){
                console.error(err);
            }
        }
    };

    const resetHabitsCurrentCount = async () => {
        const res = await handler(`/habits-count/${userRecordsId}`, {
            method: 'GET'
        });

        const today = new Date();

        const todayString = today.toLocaleDateString('ru-RU');

        if(res.lastDate !== todayString){
            try{
                await handler(`/habits-count/${res.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        dayCompletedHabits: 0,
                        lastDate: todayString,
                    })
                });
            }catch(err){
                console.error(err);
            }
        }
    }

    const updateRecordStatus = async (habit, series, newStatus) => {
        const now = new Date();

        const time = now.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
        });

        try{
            if(newStatus === 'В процессе'){
                await handler(`/records/${userRecordId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        secondStatus: newStatus,
                        timeUpdatedStatus: time
                    })
                });
            }else{
                await handler(`/records/${userRecordId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        series: series,
                        thirdStatus: newStatus,
                        newTimeUpdatedStatus: time
                    })
                });
            }
            await getDayRecords();
        }catch(err){
            console.log(err);
        }
    }

    const resetRecords = async () => {
        try{
            if(selectedResetType?.value === RESET_TYPES.ONE){
                await handler(`/records/${recordId.value}`, {
                    method: 'DELETE'
                });
                dayRecords.value = dayRecords.value.filter(record => record.id !== recordId.value);
            }else if(selectedResetType?.value === RESET_TYPES.DAY){
                const dayRecords = await handler(`/records?dateCreatedRecord=${resetDate.value}`, {
                    method: 'GET'
                });
                await Promise.all(
                    dayRecords.map(record =>
                        handler(`/records/${record.id}`, {
                            method: 'DELETE',
                        })
                    )
                )
                localStorage.removeItem('userRecordId')
            }else if(selectedResetType?.value === RESET_TYPES.MONTH){
                const res = await getRecords()

                const monthRecords = res.value.filter(record => record.monthCreatedRecord === resetDate.value);

                await Promise.all(
                    monthRecords.map(record =>
                        handler(`/records/${record.id}`, {
                            method: 'DELETE',
                        })
                    )
                )
            }else if(selectedResetType?.value === RESET_TYPES.ALL){
                const allRecords = await getRecords()

                await Promise.all(
                    allRecords.value.map(record =>
                        handler(`/records/${record.id}`, {
                            method: 'DELETE',
                        })
                    )
                )
            }
            await getDayRecords();

            await getRecords();

            modals.closeResetRecordsModal();
        }catch(err){
            console.log(err);
        }
    }

    return{
        resetRecords,
        createRecord,
        updateRecordStatus,
        updateHabitsCurrentCount,
        resetHabitsCurrentCount,
    }
}