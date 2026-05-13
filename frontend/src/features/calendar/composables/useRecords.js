import { ref } from 'vue'
import { handler } from '../../../shared/api/http.js';
import { useUserStore } from "../../../shared/composables/store/useUserStore.js";
import { useGetRecords } from "./getRecords.js"

const RESET_TYPES = ref({
    ONE:'ONE',
    DAY:'DAY',
    MONTH:'MONTH',
    ALL:'ALL',
})

const recordId = ref(null)

const resetMessage = ref('')

const resetRecordsModalVisible = ref(false)

export const useRecords = () => {
    const { selectedReset, resetDate, getRecordsCurrent, getRecords, getDayRecords } = useGetRecords();
    const { habitsCurrent, dayRecords } = useUserStore();

    const createRecord = async (habit, status) => {
        const userRecordsId = localStorage.getItem('userRecordsId');

        const currentAllCounter = habitsCurrent.value?.allHabitsCounter || 0;
        const newAllHabitsCounter = currentAllCounter + 1;

        try{
            if(currentAllCounter === null){
                console.log('Не найдено общее количество привычек');
                return;
            }
            await handler(`/current-records/${userRecordsId}`, {
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
        const userRecordsId = localStorage.getItem('userRecordsId');

        const currentCompleted = habitsCurrent.value?.completedHabitsCounter || 0;
        const currentInProgress = habitsCurrent.value?.inProgressHabitsCounter;

        try{
            if(newStatus === 'В процессе'){
                await handler(`/current-records/${userRecordsId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        inProgressHabitsCounter: currentInProgress + 1
                    })
                })
            }else if(newStatus === 'Выполнено'){
                await handler(`/current-records/${userRecordsId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        completedHabitsCounter: currentCompleted + 1,
                        inProgressHabitsCounter: Math.max(0 ,currentInProgress - 1)
                    })
                })
            }else{
                await handler(`/current-records/${userRecordsId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        completedHabitsCounter: currentCompleted + 1
                    })
                })
            }
            await getRecordsCurrent();
        }catch(err){
            console.error(err);
        }
    };

    const updateRecordStatus = async (habit, newStatus) => {
        const userRecordId = localStorage.getItem('userRecordId');

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

    const openResetRecordsModal = (id, message, resetType, month) => {
        resetMessage.value = message;

        recordId.value = id
        selectedReset.value = resetType;

        if(resetType === RESET_TYPES.value.MONTH){
            resetDate.value = month
        }

        resetRecordsModalVisible.value = true;
    }

    const resetRecords = async () => {
        const userRecordsId = localStorage.getItem('userRecordsId');

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

            closeResetRecordsModal();
        }catch(err){
            console.log(err);
        }
    }

    const closeResetRecordsModal = () => {
        resetMessage.value = '';

        recordId.value = null;
        selectedReset.value = null;

        resetRecordsModalVisible.value = false
    }

    return{
        habitsCurrent,
        dayRecords,

        resetMessage,
        resetRecordsModalVisible,

        createRecord,

        updateHabitsCurrent,
        updateRecordStatus,

        openResetRecordsModal,
        resetRecords,
        closeResetRecordsModal
    }
}