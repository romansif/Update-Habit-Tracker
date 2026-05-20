import { useGetRecords } from "./getRecords.js"
import { handler } from '../../../shared/api/http.js';
import { useModals } from "../../../shared/composables/modal/useModals.js";
import { useRecordsStore } from "../../../shared/composables/store/recordsStore.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";

export const useRecords = () => {
    const modals = useModals();

    const { habitsCount } = useHabitsStore();
    const { recordId, selectedResetType } = useRecordsStore();
    const { getRecords, getRecordsCurrent, getMonthRecords, getDayRecords } = useGetRecords();

    const userRecordsId = localStorage.getItem('userRecordsId');
    const userRecordId = localStorage.getItem('userRecordId');

    const createRecord = async (habit, series, status) => {
        const currentAllCounter = habitsCount.value?.allHabitsCounter || 0;
        const newAllHabitsCounter = currentAllCounter + 1;

        try{
            if(currentAllCounter === null) return null;
            await handler(`/habits-count/${userRecordsId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    allHabitsCounter: newAllHabitsCounter,
                })
            });

            const now = new Date();
            const dateCreated = now.toLocaleDateString()
            const month = Number(now.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
            }));
            const time = now.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
            });

            const newRecordDay = await handler(`/records`, {
                method: 'POST',
                body: JSON.stringify({
                    userRecordsId: userRecordsId,
                    date: now,
                    dateCreatedRecord: dateCreated,
                    monthCreatedRecord: month,
                    timeCreatedRecord: time,
                    habit: habit,
                    series: series,
                    firstStatus: status,
                })
            });
            await getDayRecords()

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
                await handler(`/habits-count/${userRecordsId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        dayCompletedHabits: currentDayCompleted + 1,
                        allCompletedHabits: currentAllCompleted + 1,
                        lastDate: date
                    })
                });
                await getRecordsCurrent()
            }catch(err){
                console.error(err);
            }
        }
    };

    const resetHabitsCurrentCount = async () => {
        const res = await handler(`/habits-count/${userRecordsId}`, {
            method: 'GET'
        })

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

    const deleteRecordById = async (id) => {
        await handler(`/records/${id}`, {
            method: 'DELETE'
        })
    }

    const methods = {
        'ONE': async () => {
            await deleteRecordById(recordId.value);

            await getDayRecords();
            await getRecords();
        },
        'DAY': async () => {
            const dayRecords = await getDayRecords()

            for(let record of dayRecords.value){
                await deleteRecordById(record.id)
            }
            await getDayRecords();
            await getRecords();
        },
        'MONTH': async () => {
            const monthRecords = await getMonthRecords()

            for(let record of monthRecords.value) {
                await deleteRecordById(record.id)
            }
            await getRecords();
        },
        'ALL': async () => {
            const allRecords = await getRecords()

            for(let record of allRecords.value){
                await deleteRecordById(record.id)
            }
            await getRecords();
        }
    }

    const resetRecords = async () => {
        methods[selectedResetType?.value]?.()

        modals.closeResetRecordsModal();
    }

    return{
        resetRecords,
        createRecord,
        updateRecordStatus,
        updateHabitsCurrentCount,
        resetHabitsCurrentCount,
    }
}