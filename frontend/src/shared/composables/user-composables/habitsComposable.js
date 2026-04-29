import { ref } from 'vue';
import { useRoute } from 'vue-router';

import { handler } from '../../api/http.js';
import { useRecords } from "./recordsComposable.js";
import { useUserStore } from "./useUserStore.js";

const habitId = ref(null);

const habitForm = ref({
    habit: '',
    time: '',
    category: '',
    status: 'Не выполнено',
    frequency: '',
});

const habitErrors = ref({
    habitError: false,
    timeError: false,
    categoryError: false,
    frequencyError: false,

    habitMessage: '',
    timeMessage: '',
    categoryMessage: '',
    frequencyMessage: '',
})

const deleteHabitMessage = ref('')

const createHabitModalVisible = ref(false);
const deleteHabitModalVisible = ref(false);

export const useGetHabits = () => {
    const { habits } = useUserStore();

    const route = useRoute();

    const filteredHabits = (data) => {
        if(route.name === 'completed-habits'){
            return data.filter(habit => habit.status === 'Выполнено')
        }else if(route.name === 'in-progress-habits'){
            return data.filter(habit => habit.status === 'В процессе')
        }else if(route.name === 'incompleted-habits'){
            return data.filter(habit => habit.status === 'Не выполнено')
        }

        return data;
    }

    const getHabits = async () => {
        const userId = localStorage.getItem('userId');

        const res = await handler(`/habits?userId=${userId}`, {
            method: 'GET',
        });

        habits.value = filteredHabits(res.sort((a, b) => new Date(b.dateCreatedHabit) - new Date(a.dateCreatedHabit)));
    }

    return{
        getHabits
    }
}

export const useHabits = () => {
    const { userRecordsCurrent, getRecords, createRecords, updateStatusCurrent, updateDayRecordStatus } = useRecords();
    const { habits } = useUserStore();

    const openCreateModal = () => {
        createHabitModalVisible.value = true;
        console.log('Открыть модалку привычек');
    }

    const createHabit = async (status) => {
        const userId = localStorage.getItem('userId');

        habitErrors.value.habitError = !habitForm.value.habit
        habitErrors.value.timeError = !habitForm.value.time
        habitErrors.value.categoryError = !habitForm.value.category
        habitErrors.value.frequencyError = !habitForm.value.frequency

        habitErrors.value.habitMessage = habitErrors.value.habitError ? 'Поле привычки должно быть заполненно' : ''
        habitErrors.value.timeMessage = habitErrors.value.timeError ? 'Поле времени на привычку должно быть заполненно' : ''
        habitErrors.value.categoryMessage = habitErrors.value.categoryError ? 'Поле категории привычки должно быть заполненно' : ''
        habitErrors.value.frequencyMessage = habitErrors.value.frequencyError ? 'Поле частоты выполнения привычки должно быть заполненно' : ''

        try{
            if(!habitForm.value.category || !habitForm.value.time || !habitForm.value.habit || !habitForm.value.frequency){
                console.log('Заполните таблицу');
                return;
            }
            const newHabit = await handler('/habits', {
                method: 'POST',
                body: JSON.stringify({
                    userId: userId,
                    category: habitForm.value.category,
                    time: habitForm.value.time + 'мин',
                    habit: habitForm.value.habit,
                    status: status,
                    frequency: habitForm.value.frequency,
                    dateCreatedHabit: new Date(),
                })
            })

            await createRecords(newHabit.habit, newHabit.status);

            habits.value.push(newHabit);

            await getRecords();

            closeCreateModal();
        }catch(err){
            console.log(err)
        }
    }

    const closeCreateModal = () => {
        createHabitModalVisible.value = false;
        clearHabitForm();
    }


    const openDeleteHabitModal = (id, message) => {
        habitId.value = id;

        deleteHabitMessage.value = message;
        deleteHabitModalVisible.value = true;
    }

    const deleteHabit = async () => {
        const userRecordsId = localStorage.getItem('userRecordsId');

        const currentInProgressCounter = userRecordsCurrent.value?.inProgressHabitsCounter || 0;

        try{
            await handler(`/habits/${habitId.value}`, {
                method: 'DELETE',
            });

            if(userRecordsCurrent.value?.inProgressHabitsCounter > 0){
                await handler(`/records-user/${userRecordsId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        inProgressHabitsCounter: currentInProgressCounter - 1
                    })
                })
            }

            habits.value = habits.value.filter(habit => habit.id !== habitId.value);

            closeDeleteHabitModal()
        }catch(err){
            console.log(err);
        }
    }

    const closeDeleteHabitModal = () => {
        deleteHabitMessage.value = '';
        deleteHabitModalVisible.value = false;
    }

    const updateStatus = async (id, newStatus) => {
        try{
             await handler(`/habits/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    status: newStatus,
                })
            })
            const habit = habits.value.find(habit => habit.id === id);

            if(habits.value){
                if(habit){
                    habit.status = newStatus;
                }
                await updateDayRecordStatus(habit.habit, habit.status, newStatus)
            }

            await updateStatusCurrent(newStatus)
        }catch(err){
            console.log(err);
        }
    }


    const clearHabitForm = () => {
        habitForm.value.habit = '';
        habitForm.value.category = '';
        habitForm.value.habit = '';
        habitForm.value.status = '';
        habitForm.value.frequency = '';
        habitForm.value.time = ''

        habitErrors.value.habitError = false;
        habitErrors.value.timeError = false;
        habitErrors.value.categoryError = false;
        habitErrors.value.frequencyError = false;
    }

    return{
        habits,
        habitForm,
        habitErrors,

        createHabitModalVisible,
        deleteHabitModalVisible,
        deleteHabitMessage,


        openCreateModal,
        createHabit,
        closeCreateModal,

        openDeleteHabitModal,
        deleteHabit,
        closeDeleteHabitModal,

        updateStatus,
    }
}