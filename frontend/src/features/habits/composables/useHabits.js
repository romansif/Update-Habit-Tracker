import { ref, computed } from 'vue';

import { handler } from '../../../shared/api/http.js';
import { useUserStore } from "../../../shared/composables/store/useUserStore.js";

import { useGetHabits } from "./getHabits.js";
import { useGetRecords } from "../../calendar/composables/getRecords.js";
import { useRecords } from "../../calendar/composables/useRecords.js";

import { useForms } from "../../../shared/composables/useForms.js";
import { useValidation } from "../../../shared/composables/useValidation.js";
import { useClearForms } from "../../../shared/composables/clearForms.js";

const habitId = ref(null);


const deleteHabitMessage = ref('')

const createHabitModalVisible = ref(false);
const habitInfoModalVisible = ref(false);
const deleteHabitModalVisible = ref(false);

export const useHabits = () => {
    const { habits, seriesCount } = useUserStore();

    const { getHabits, getHabit } = useGetHabits();
    const { getRecords } = useGetRecords();

    const { validateHabitForm } = useValidation()
    const { habitForm, habitErrors } = useForms()
    const { clearHabitForm } = useClearForms();

    const { habitsCurrent, createRecord, updateHabitsCurrent, updateRecordStatus } = useRecords();

    const openCreateModal = () => {
        createHabitModalVisible.value = true;
        console.log('Открыть модалку привычек');
    }

    const createHabit = async (status) => {
        const userId = localStorage.getItem('userId');

        const isValid = validateHabitForm()

        if(!isValid) return
        try{
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
                    date.setFullYear(date.getFullYear() + 1)
                }else if(habitForm.value.term === '3 года'){
                    date.setFullYear(date.getFullYear() + 3)
                }

                return date.toLocaleDateString()
            })

            const newHabit = await handler('/habits', {
                method: 'POST',
                body: JSON.stringify({
                    userId: userId,
                    category: habitForm.value.category,
                    habit: habitForm.value.habit,
                    frequency: habitForm.value.frequency,
                    time: habitForm.value.time + 'мин',
                    series: seriesCount.value,
                    status: status,
                    term: habitForm.value.term,
                    date: now,
                    dateCreatedHabit: dateCreatedHabit,
                    timeCreatedHabit: timeCreatedHabit,
                    endDateHabit: endDate.value,
                })
            })
            habits.value.push(newHabit);

            await createRecord(newHabit.habit, newHabit.status);

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


    const openInfoModal = async (id) => {
        await getHabit(id)

        habitInfoModalVisible.value = true
    }

    const closeInfoModal = async () => {
        habitInfoModalVisible.value = false
    }

    const updateStatus = async (id, newStatus) => {
        try{
            const now = new Date()

            const date = now.toLocaleDateString()

            const time = now.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
            })

            const habit = habits.value.find(habit => habit.id === id);

            seriesCount.value = habit.value?.series || 0

            console.log(seriesCount.value)

            if(newStatus === 'Выполнено'){
                await handler(`/habits/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        series: seriesCount.value + 1,
                        status: newStatus,
                        lastDate: date,
                        lastTime: time
                    })
                })
            }else(
                await handler(`/habits/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        status: newStatus,
                        lastDate: date,
                        lastTime: time
                    })
                })
            )

            if(habits.value){
                if(habit){
                    habit.status = newStatus;
                    await getHabits()
                }

                await updateRecordStatus(habit.habit, habit.status, newStatus)
                await updateHabitsCurrent(newStatus)
            }
        }catch(err){
            console.log(err);
        }
    }


    const openDeleteHabitModal = (id, message) => {
        habitId.value = id;

        deleteHabitMessage.value = message;

        deleteHabitModalVisible.value = true;
    }

    const deleteHabit = async () => {
        const userRecordsId = localStorage.getItem('userRecordsId');

        const currentDayCompletedCounter = habitsCurrent.value?.dayCompletedHabits || 0;

        try{
            await handler(`/habits/${habitId.value}`, {
                method: 'DELETE',
            });
            if(habitsCurrent.value?.inProgressHabitsCounter > 0){
                await handler(`/current-records/${userRecordsId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        inProgressHabitsCounter: currentDayCompletedCounter - 1
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


    return{
        habits,
        habitForm,
        habitErrors,

        createHabitModalVisible,
        habitInfoModalVisible,
        deleteHabitModalVisible,
        deleteHabitMessage,

        openCreateModal,
        createHabit,
        closeCreateModal,

        openInfoModal,
        closeInfoModal,

        openDeleteHabitModal,
        deleteHabit,
        closeDeleteHabitModal,

        updateStatus,
    }
}