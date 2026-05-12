import { ref, computed } from 'vue';

import { handler } from '../../../shared/api/http.js';
import { useRecords } from "../../calendar/composables/useRecords.js";
import { useUserStore } from "../../../shared/composables/store/useUserStore.js";
import { useGetHabits } from "./getHabits.js";
import { useGetRecords } from "../../calendar/composables/getRecords.js";

const habitId = ref(null);

const habitForm = ref({
    habit: '',
    time: '',
    category: '',
    status: 'Не выполнено',
    frequency: '',
    term: '',
});

const habitErrors = ref({
    habitError: false,
    timeError: false,
    categoryError: false,
    frequencyError: false,
    termError: false,

    habitMessage: '',
    timeMessage: '',
    categoryMessage: '',
    frequencyMessage: '',
    termMessage: '',
})

const termToDays = {
    '1 месяц': 30,
    '3 месяца': 90,
    '6 месяцев': 180,
    '1 год': 365,
    '3 года': 1095
};

const deleteHabitMessage = ref('')

const createHabitModalVisible = ref(false);
const deleteHabitModalVisible = ref(false);

export const useHabits = () => {
    const { getHabits } = useGetHabits();
    const { getRecords } = useGetRecords();
    const { userRecordsCurrent, createRecords, updateStatusCurrent, updateDayRecordStatus } = useRecords();
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
        habitErrors.value.termError = !habitForm.value.term

        habitErrors.value.habitMessage = habitErrors.value.habitError ? 'Поле привычки должно быть заполненно' : ''
        habitErrors.value.timeMessage = habitErrors.value.timeError ? 'Поле времени на привычку должно быть заполненно' : ''
        habitErrors.value.categoryMessage = habitErrors.value.categoryError ? 'Поле категории привычки должно быть заполненно' : ''
        habitErrors.value.frequencyMessage = habitErrors.value.frequencyError ? 'Поле частоты выполнения привычки должно быть заполненно' : ''
        habitErrors.value.termMessage = habitErrors.value.termError ? 'Поле срока выполения привычки должно быть заполненно' : ''

        try{
            if(!habitForm.value.category || !habitForm.value.time ||
                !habitForm.value.habit || !habitForm.value.frequency || !habitForm.value.term
            ){
                console.log('Заполните таблицу');
                return;
            }

            const now = new Date();

            const dateCreatedHabit = now.toLocaleDateString()

            const timeCreatedHabit = now.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
            })

            const endDate = computed(() => {
                if(!habitForm.value.term) return null

                const date = new Date()

                if(habitForm.value.term === '1 месяц'){
                    date.setMonth(date.getMonth() + 1)
                }else if(habitForm.value.term === '3 месяца'){
                    date.setMonth(date.getMonth() + 3)
                }else if(habitForm.value.term === '6 месяцев'){
                    date.setMonth(date.getMonth() + 6)
                }else if(habitForm.value.term === '1 год'){
                    date.setFullYear(date.getFullYear() + 6)
                }else if(habitForm.value.term === '3 года'){
                    date.setFullYear(date.getFullYear() + 6)
                }
                return date.toLocaleDateString()
            })


            const newHabit = await handler('/habits', {
                method: 'POST',
                body: JSON.stringify({
                    userId: userId,
                    category: habitForm.value.category,
                    time: habitForm.value.time + 'мин',
                    habit: habitForm.value.habit,
                    status: status,
                    frequency: habitForm.value.frequency,
                    term: habitForm.value.term,
                    date: now,
                    dateCreatedHabit: dateCreatedHabit,
                    timeCreatedHabit: timeCreatedHabit,
                    endDateHabit: endDate.value,
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
            const now = new Date().toLocaleDateString()

            await handler(`/habits/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    status: newStatus,
                    lastDate: now
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

            await getHabits
        }catch(err){
            console.log(err);
        }
    }

    const clearHabitForm = () => {
        habitForm.value.habit = '';
        habitForm.value.time = ''
        habitForm.value.category = '';
        habitForm.value.status = '';
        habitForm.value.frequency = '';
        habitForm.value.term = '';

        habitErrors.value.habitError = false;
        habitErrors.value.timeError = false;
        habitErrors.value.categoryError = false;
        habitErrors.value.frequencyError = false;
        habitErrors.value.termError = false;
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