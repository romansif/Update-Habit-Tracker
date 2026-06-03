import { useGetRecords } from "./getRecords.js"
import { handler } from '../../../shared/api/http.js';
import { useRecordsModals } from "../../../shared/composables/modal/useModals.js";
import { useRecordsStore } from "../../../shared/composables/store/recordsStore.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";

export const useRecords = () => {
    const modals = useRecordsModals();

    const { habitsCount } = useHabitsStore();
    const { recordId, selectedResetType } = useRecordsStore();
    const { getRecords, getRecordsCurrent, getMonthRecords, getDayRecords, getHabitRecords, getDayHabitRecords } = useGetRecords();

    const habitsCountId = localStorage.getItem('habitsCountId');

    const createRecord = async (habit, series, status, id) => {
        const currentAllCount = habitsCount.value?.allHabits || 0;

        try{
            if(currentAllCount === null) return null;
            await handler(`/habits-count/${habitsCountId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    allHabits: currentAllCount + 1,
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

            const newRecord = await handler(`/records`, {
                method: 'POST',
                body: JSON.stringify({
                    date: now,
                    dateCreatedRecord: dateCreated,
                    monthCreatedRecord: month,
                    timeCreatedRecord: time,
                    habit: habit,
                    currentSeries: series,
                    firstStatus: status,
                })
            });
            await getRecordsCurrent()

            await getRecords()

            localStorage.setItem('recordsId', newRecord.id);
        } catch (err) {
            console.log(err);
        }
    }

    const updateHabitsCurrentCount = async (newStatus) => {
        const currentDayCompleted = habitsCount.value?.dayCompletedHabits || 0;

        const date = new Date().toLocaleDateString();

        if(newStatus === 'Выполнено'){
            try{
                await handler(`/habits-count/${habitsCountId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        dayCompletedHabits: currentDayCompleted + 1,
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
        const today = new Date();
        const todayString = today.toLocaleDateString('ru-RU');

        try{
            await handler(`/habits-count/${habitsCountId}`, {
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

    const updateRecordStatus = async (series, newStatus) => {
        const now = new Date();
        const time = now.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
        });

        try{
            if(newStatus === 'В процессе'){
                await handler(`/records?recordId=${recordId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        secondStatus: newStatus,
                        timeUpdatedStatus: time
                    })
                });
            }else{
                await handler(`/records?recordId=${recordId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        currentSeries: series,
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

            await getDayHabitRecords();
            await getHabitRecords();
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
        },
        'ALL_BY_ID': async () => {
            const allById = await getHabitRecords()

            for(let record of allById.value){
                await deleteRecordById(record.id)
            }
        }
    }

    const resetRecords = async () => {
        methods[selectedResetType?.value]?.()

        modals.closeResetRecords();
    }

    return{
        resetRecords,
        createRecord,
        updateRecordStatus,
        updateHabitsCurrentCount,
        resetHabitsCurrentCount,
    }
}