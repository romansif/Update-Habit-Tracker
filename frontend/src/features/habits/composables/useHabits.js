import { ref, computed } from 'vue';

import { useGetHabits } from "./getHabits.js";
import { handler } from '../../../shared/api/http.js';
import { useRecords } from "../../calendar/composables/useRecords.js";
import { useForms } from "../../../shared/composables/forms/useForms.js";
import { useGetRecords } from "../../calendar/composables/getRecords.js";
import { useModals } from "../../../shared/composables/modal/useModals.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";
import { useValidation } from "../../../shared/composables/forms/useValidation.js";

export const useHabits = () => {
    const modals = useModals();

    const { habitForm } = useForms()
    const { getHabits } = useGetHabits();
    const { getRecords } = useGetRecords();
    const { validateHabitForm } = useValidation()
    const { habits, habitId, habitsCount, seriesCount } = useHabitsStore();
    const { createRecord, updateHabitsCurrentCount, updateRecordStatus } = useRecords();

    const createHabit = async (status) => {
        const userId = localStorage.getItem('userId');

        const isValid = validateHabitForm();

        if(!isValid) return;
        try{
            const timeInDay = `${habitForm.value.time} мин в день`;

            const now = new Date();

            const dateCreatedHabit = now.toLocaleDateString();

            const timeCreatedHabit = now.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
            });

            const endDate = computed(() => {
                if(!habitForm.value.term) return null;

                const date = new Date();

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
            });

            const newHabit = await handler('/habits', {
                method: 'POST',
                body: JSON.stringify({
                    userId: userId,
                    category: habitForm.value.category,
                    habit: habitForm.value.habit,
                    frequency: habitForm.value.frequency,
                    time: timeInDay,
                    series: seriesCount.value,
                    status: status,
                    term: habitForm.value.term,
                    date: now,
                    dateCreatedHabit: dateCreatedHabit,
                    timeCreatedHabit: timeCreatedHabit,
                    endDateHabit: endDate.value,
                    progress: 0
                })
            });
            habits.value.push(newHabit);

            await createRecord(newHabit.habit, newHabit.series, newHabit.status);

            await getRecords();

            modals.closeCreateHabitModal();
        }catch(err){
            console.log(err)
        }
    };

    const updateProgress = async (id) => {
        const habit = habits.value.find(habit => habit.id === id);

        const progressRatio = computed(() => {
            if(!habit) return null;

            const days = ref(null)

            const progressCount = ref(null)

            if(habit.term === '1 месяц'){
                days.value = 30
            }else if(habit.term === '3 месяца'){
                days.value = 90
            }else if(habit.term === '6 месяцев'){
                days.value = 120
            }else if(habit.term === '1 год'){
                days.value = 365
            }else if(habit.term === '3 года') {
                days.value = 1095
            }

            return (progressCount.value = 100 / days.value)
        })

        try{
            await handler(`/habits/${habit.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    progress: Math.ceil(100, habit.progress + progressRatio.value)
                })
            })
        }catch(err){
            console.log(err)
        }
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
            if(!habit) return null

            seriesCount.value = habit.series || 0

            if(newStatus === 'Выполнено'){
                const update = await handler(`/habits/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        series: seriesCount.value + 1,
                        status: newStatus,
                        lastDate: date,
                        lastTime: time
                    })
                })
                seriesCount.value = update.series

                await updateProgress(habit.id);
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
            habit.status = newStatus;

            await updateRecordStatus(habit.habit, seriesCount.value, habit.status, newStatus)

            await updateHabitsCurrentCount(newStatus)

            await getHabits()
        }catch(err){
            console.log(err);
        }
    }

    const deleteHabit = async () => {
        const userRecordsId = localStorage.getItem('userRecordsId');

        const currentDayCompletedCounter = habitsCount?.dayCompletedHabits || 0;

        try{
            await handler(`/habits/${habitId.value}`, {
                method: 'DELETE',
            });
            habits.value = habits.value.filter(habit => habit.id !== habitId.value);

            const res = await handler(`/habits-count/${userRecordsId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    dayCompletedHabits: Math.max(0, currentDayCompletedCounter - 1)
                })
            })
            habitsCount.value = res

            modals.closeDeleteHabitModal()

            await modals.closeHabitInfoModal()
        }catch(err){
            console.log(err);
        }
    }

    return{
        createHabit,
        deleteHabit,
        updateStatus,
    }
}