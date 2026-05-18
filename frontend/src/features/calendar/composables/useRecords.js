import { handler } from '../../../shared/api/http.js';
import { useAppStore } from "../../../shared/composables/store/useAppStore.js";
import { useGetRecords } from "./getRecords.js"
import { useModals } from "../../../shared/composables/modal/useModals.js";

export const useRecords = () => {
    const modals = useModals();

    const { getRecords, getDayRecords } = useGetRecords();
    const { RESET_TYPES, selectedReset, resetDate, habitsCurrent, recordId, dayRecords } = useAppStore();

    const userRecordsId = localStorage.getItem('userRecordsId');
    const userRecordId = localStorage.getItem('userRecordId');

    const createRecord = async (habit, series, status) => {
        const currentAllCounter = habitsCurrent.value?.allHabitsCounter || 0;
        const newAllHabitsCounter = currentAllCounter + 1;

        try{
            if(currentAllCounter === null){
                console.log('Не найдено общее количество привычек');
                return;
            }
            await handler(`/habits-counter/${userRecordsId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    allHabitsCounter: newAllHabitsCounter,
                })
            });

            const now = new Date();

            const month = now.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
            })

            const time = now.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
            })

            const newRecordDay = await handler(`/calendar-records`, {
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
        }catch(err){
            console.log(err)
        }
    }

    const updateHabitsCurrent = async (newStatus) => {
        const currentDayCompleted = habitsCurrent.value?.dayCompletedHabits || 0;
        const currentAllCompleted = habitsCurrent.value?.allCompletedHabits || 0;

        const date = new Date().toLocaleDateString()

        try{
            if(newStatus === 'Выполнено'){
                const res = await handler(`/habits-counter/${userRecordsId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        dayCompletedHabits: currentDayCompleted + 1,
                        allCompletedHabits: currentAllCompleted + 1,
                        lastDate: date
                    })
                })

                habitsCurrent.value = res
            }
        }catch(err){
            console.error(err);
        }
    };

    const resetHabitsCurrent = async () => {
        const res = await handler(`/habits-counter/${userRecordsId}`, {
            method: 'GET'
        });

        const today = new Date();

        const todayString = today.toLocaleDateString('ru-RU')

        if(res.lastDate !== todayString){
            try{
                await handler(`/habits-counter/${res.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        dayCompletedHabits: 0,
                        lastDate: todayString,
                    })
            })
        }catch(err){
            console.error(err);}
        }
    }

    const updateRecordStatus = async (habit, series, newStatus) => {
        const now = new Date();

        const time = now.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
        })

        try{
            if(newStatus === 'В процессе'){
                await handler(`/calendar-records/${userRecordId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        secondStatus: newStatus,
                        timeUpdatedStatus: time
                    })
                });
            }else{
                await handler(`/calendar-records/${userRecordId}`, {
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
            if(selectedReset.value === RESET_TYPES.value.ONE){
                await handler(`/calendar-records/${recordId.value}`, {
                    method: 'DELETE'
                })
                dayRecords.value = dayRecords.value.filter(record => record.id !== recordId.value);
            }else if(selectedReset.value === RESET_TYPES.value.DAY){
                const dayRecords = await handler(`/calendar-records?dateCreatedRecord=${resetDate.value}`,{
                    method: 'GET'
                })
                await Promise.all(
                    dayRecords.map(record =>
                        handler(`/calendar-records/${record.id}`, {
                            method: 'DELETE',
                        })
                    )
                )
                localStorage.removeItem('userRecordId')
            }else if(selectedReset.value === RESET_TYPES.value.MONTH){
                const res = await handler(`/calendar-records?userRecordsId=${userRecordsId}`,{
                    method: 'GET'
                })
                const monthRecords = res.filter(record => record.monthCreatedRecord === resetDate.value)

                await Promise.all(
                    monthRecords.map(record =>
                        handler(`/calendar-records/${record.id}`, {
                            method: 'DELETE',
                        })
                    )
                )
            }else if(selectedReset.value === RESET_TYPES.value.ALL){
                const allRecords = await handler(`/calendar-records?userRecordsId=${userRecordsId}`, {
                    method: 'GET'
                })
                await Promise.all(
                    allRecords.map(record =>
                        handler(`/calendar-records/${record.id}`, {
                            method: 'DELETE',
                        })
                    )
                )
            }
            await getDayRecords()

            await getRecords()

            modals.closeResetRecordsModal();
        }catch(err){
            console.log(err);
        }
    }


    return{
        createRecord,
        updateHabitsCurrent,
        resetHabitsCurrent,
        updateRecordStatus,
        resetRecords,
    }
}