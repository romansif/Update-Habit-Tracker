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
    const { getRecords, getRecordsCurrent } = useGetRecords();
    const { validateHabitForm } = useValidation()
    const { habits, habitId, habitsCount, seriesCount, termsValue } = useHabitsStore();
    const { createRecord, updateHabitsCurrentCount, updateRecordStatus } = useRecords();

    const createHabit = async (status) => {
        const userId = localStorage.getItem('userId');

        const isValid = validateHabitForm();

        if(!isValid) return;
        try{
            const now = new Date();
            const dateCreatedHabit = now.toLocaleDateString();
            const timeCreatedHabit = now.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
            });

            const endDate = computed(() => {
                if(!habitForm.value.term) return null;

                const termValue = termsValue[habitForm.value.term]

                const date = new Date();

                if(termValue.type === 'month') {
                    date.setMonth(date.getMonth() + termValue.value)
                }
                if(termValue.type === 'year') {
                    date.setFullYear(date.getFullYear() + termValue.value)
                }

                return date.toLocaleDateString()
            });

            const timeInDay = `${habitForm.value.time} мин в день`;

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
            await getHabits()

            await createRecord(newHabit.habit, newHabit.series, newHabit.status);

            await getRecords();

            modals.closeCreateHabitModal();
        }catch(err){
            console.log(err)
        }
    };

    const updateProgress = async (id) => {
        const habit = habits.value.find(habit => habit.id === id);

        const termValue = termsValue[habit.term];
        const progressRatio = 100 / termValue.days
        const newProgress = +(habit.progress + progressRatio).toFixed(2)

        try{
            await handler(`/habits/${habit.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    progress: newProgress
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
            await getHabits()

            await updateRecordStatus(habit.habit, seriesCount.value, habit.status, newStatus)

            await updateHabitsCurrentCount(newStatus)
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
            await getHabits()

            await handler(`/habits-count/${userRecordsId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    dayCompletedHabits: Math.max(0, currentDayCompletedCounter - 1)
                })
            })
            await getRecordsCurrent

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