import { ref } from 'vue'
import { handler } from '../../api/http.js';
import { useUserStore } from "./useUserStore.js";
import { useCalendar } from "../calendarComposable.js";

const selectedDate = ref(null)
const selectedReset = ref(null)

const RESET_TYPES = ref({
    ONE:'ONE',
    DAY:'DAY',
    MONTH:'MONTH',
    ALL:'ALL',
})

const recordId = ref(null)
const resetDate = ref(null)

const resetMessage = ref('')

const recordsModalVisible = ref(false)
const resetRecordsModalVisible = ref(false)

export const useRecords = () => {
    const { userRecordsCurrent, userRecords, userDayRecords } = useUserStore();
    const { currentMonth, currentYear } = useCalendar();

    const getRecordsCurrent = async () => {
        const userRecordsId = localStorage.getItem('userRecordsId');

        if(!userRecordsId){
            console.log('Id записей не найдены');
            return;
        }

        try{
            const res = await handler(`/records-user/${userRecordsId}`, {
                method: 'GET'
            })

            userRecordsCurrent.value = res;
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
            const res = await handler(`/records-user-calendar?userRecordsId=${userRecordsId}`, {
                method: 'GET'
            })

            userRecords.value = res
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

        recordsModalVisible.value = true;

        await getDayRecords();
    }

    const getDayRecords = async () => {
        const userRecordsId = localStorage.getItem('userRecordsId');

        if(!selectedDate.value) return;
        try{
            const res = await handler(`/records-user-calendar?userRecordsId=${userRecordsId}&date=${resetDate.value}`, {
                method: 'GET'
            });

            userDayRecords.value = res
        }catch(err){
            console.log(err);
        }
    };

    const closeRecordsModal = () => {
        userDayRecords.value = [];
        selectedDate.value = null;
        recordsModalVisible.value = false;
    }

    const createRecords = async (habit, status) => {
        const userRecordsId = localStorage.getItem('userRecordsId');

        const currentAllCounter = userRecordsCurrent.value?.allHabitsCounter || 0;
        const newAllHabitsCounter = currentAllCounter + 1;

        try{
            if(currentAllCounter === null){
                console.log('Не найдено общее количество привычек');
                return;
            }
            await handler(`/records-user/${userRecordsId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    allHabitsCounter: newAllHabitsCounter,
                })
            });

            const newRecordDay = await handler(`/records-user-calendar`, {
                method: 'POST',
                body: JSON.stringify({
                    userRecordsId: userRecordsId,
                    habit: habit,
                    firstStatus: status,
                    date: new Date().toLocaleDateString(),
                    dateCreatedRecord: new Date(),
                    timeCreatedRecord: new Date().toLocaleTimeString(),
                })
            });

            userDayRecords.value = newRecordDay;

            localStorage.setItem('userRecordId', newRecordDay.id);
        }catch(err){
            console.log(err)
        }
    }

    const updateStatusCurrent = async (newStatus) => {
        const userRecordsId = localStorage.getItem('userRecordsId');

        const currentCompleted = userRecordsCurrent.value?.completedHabitsCounter || 0;
        const currentInProgress = userRecordsCurrent.value?.inProgressHabitsCounter || 0;

        try{
            if(newStatus === 'В процессе'){
                await handler(`/records-user/${userRecordsId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        inProgressHabitsCounter: currentInProgress + 1
                    })
                })
            }else if(newStatus === 'Выполнено' || userRecordsCurrent.value?.inProgressHabitsCounter > 0){
                await handler(`/records-user/${userRecordsId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        inProgressHabitsCounter: currentInProgress - 1
                    })
                })
            }else if(newStatus === 'Выполнено'){
                await handler(`/records-user/${userRecordsId}`, {
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

    const updateDayRecordStatus = async (habit, newStatus) => {
        const userRecordId = localStorage.getItem('userRecordId');

        try{
            if(newStatus === 'В процессе'){
                await handler(`/records-user-calendar/${userRecordId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        secondStatus: newStatus,
                        timeUpdatedStatus: new Date().toLocaleTimeString(),
                    })
                });
            }else{
                await handler(`/records-user-calendar/${userRecordId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        thirdStatus: newStatus,
                        newTimeUpdatedStatus: new Date().toLocaleTimeString(),
                    })
                });
            }
            await getDayRecords();
        }catch(err){
            console.log(err);
        }
    }

    const openResetRecordsModal = (id, message, resetType) => {
        resetMessage.value = message;

        recordId.value = id
        selectedReset.value = resetType;

        resetRecordsModalVisible.value = true;
    }

    const resetRecords = async () => {
        const userRecordsId = localStorage.getItem('userRecordsId');

        try{
            if(selectedReset.value === RESET_TYPES.value.ONE){
                await handler(`/records-user-calendar/${recordId.value}`, {
                    method: 'DELETE'
                })

                userDayRecords.value = userDayRecords.value.filter(record => record.id !== recordId.value);
            }else if(selectedReset.value === RESET_TYPES.value.DAY){
                const dayRecords = await handler(`/records-user-calendar?date=${resetDate.value}`,{
                    method: 'GET'
                })
                await Promise.all(
                    dayRecords.map(record =>
                        handler(`/records-user-calendar/${record.id}`, {
                            method: 'DELETE',
                        })
                    )
                )

                localStorage.removeItem('userRecordId')

                await getDayRecords()
            }else if(selectedReset.value === RESET_TYPES.value.MONTH){

            }else if(selectedReset.value === RESET_TYPES.value.ALL){
                const allRecords = await handler(`/records-user-calendar?userRecordsId=${userRecordsId}`, {
                    method: 'GET'
                })

                await Promise.all(
                    allRecords.map(record =>
                        handler(`/records-user-calendar/${record.id}`, {
                            method: 'DELETE',
                        })
                    )
                )

                await getRecords();
            }

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
        userRecordsCurrent,
        userRecords,
        userDayRecords,

        recordsModalVisible,
        resetMessage,
        resetRecordsModalVisible,

        selectedDate,
        currentMonth,
        currentYear,

        getRecordsCurrent,
        getRecords,

        openRecordsModal,
        getDayRecords,
        closeRecordsModal,

        createRecords,

        updateStatusCurrent,
        updateDayRecordStatus,

        openResetRecordsModal,
        resetRecords,
        closeResetRecordsModal
    }
}