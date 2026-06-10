import { computed } from 'vue';

import { useGetHabits } from "./getHabits.js";
import { handler } from '../../../shared/api/http.js';
import { useRecords } from "../../calendar/composables/useRecords.js";
import { useForms } from "../../../shared/composables/forms/useForms.js";
import { useGetRecords } from "../../calendar/composables/getRecords.js";
import { useHabitModals } from "../../../shared/composables/modal/useModals.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";
import { useRecordsStore } from "../../../shared/composables/store/recordsStore.js";

export const useHabits = () => {
    const modals = useHabitModals();

    const { habitForm, habitErrors } = useForms()
    const { recordId } = useRecordsStore()
    const { getHabits, getFilteredHabits } = useGetHabits();
    const { getRecords, getRecordsCurrent } = useGetRecords();
    const { createRecord, updateHabitsCurrentCount, updateRecordStatus } = useRecords();
    const { habits, habitId, selectedDeleteType, seriesCount, termsValue } = useHabitsStore();

    const createHabit = async (status) => {
        const userId = localStorage.getItem('userId');

        try{
            const now = new Date();
            const dateCreated = now.toLocaleDateString();
            const month = Number(now.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
            }));
            const time = now.toLocaleTimeString("ru-RU", {
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
                    ...(habitForm.value.linkedHabit &&{
                        linkedHabit: habitForm.value.linkedHabit
                    }),
                    totalSeries: seriesCount.value,
                    currentSeries: seriesCount.value,
                    status: status,
                    term: habitForm.value.term,
                    date: now,
                    dateCreatedHabit: dateCreated,
                    monthCreatedRecord: month,
                    timeCreatedHabit: time,
                    endDateHabit: endDate.value,
                    progress: 0
                })
            });
            await getRecords();
            await getFilteredHabits()
            await createRecord(newHabit.habit, newHabit.currentSeries, newHabit.status, newHabit.id);

            modals.closeCreateHabit();
        }catch(err){
            const errors = err.response?.data?.errors;
            console.log(err);
            if(errors){
                habitErrors.value.categoryError = !!errors.category
                habitErrors.value.habitError = !!errors.habit
                habitErrors.value.timeError = !!errors.time
                habitErrors.value.frequencyError = !!errors.frequency
                habitErrors.value.termError = !!errors.term

                habitErrors.value.categoryMessage = errors.category || '';
                habitErrors.value.habitMessage =  errors.habit || '';
                habitErrors.value.timeMessage =  errors.time || '';
                habitErrors.value.frequencyMessage =  errors.frequency || '';
                habitErrors.value.termMessage =  errors.term || '';
            }
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
            console.log('Не удалось обновить прогресс привычки пользователя');
            throw err;
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

            seriesCount.value = habit.currentSeries || 0

            if(newStatus === 'Выполнено'){
                const update = await handler(`/habits/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        totalSeries: seriesCount.value + 1,
                        currentSeries: seriesCount.value + 1,
                        status: newStatus,
                        lastDate: date,
                        lastTime: time
                    })
                })
                seriesCount.value = update.currentSeries

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
            await getFilteredHabits()
            await updateHabitsCurrentCount(newStatus)
            await updateRecordStatus(seriesCount.value, newStatus)
        }catch(err){
            console.log('Не удалось обновить статус привычки пользователя');
            throw err;
        }
    }

    const restoreSeries = async () => {
        const habit = habits.value.find(habit => habit.id === habitId.value);
        if(!habit) return null

        seriesCount.value = habit.totalSeries || 0
        try{
            await handler(`/habits/${habit.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    currentSeries: seriesCount.value
                })
            });
            await handler(`/records?recordId=${recordId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    currentSeries: seriesCount.value,
                })
            });

            alert('Ваша серия восстановлена')

            modals.closeRestoreSeries()
        }catch(err){
            console.log('Не удалось восстановить серию привычки пользователя');
            throw err;
        }
    }

    const deleteHabitById = async (id) => {
        await handler(`/habits/${id}`, {
            method: 'DELETE',
        });
    }

    const updateHabitCount = async (id) => {
        await handler(`/habits-count/${id}`, {
            method: 'PATCH',
        })
    }

    const methods = {
        'ONE': async () => {
            const habitsCountId = localStorage.getItem('habitsCountId');

            await deleteHabitById(habitId.value);
            await updateHabitCount(habitsCountId);

            await getFilteredHabits();
            await getRecordsCurrent();
        },
        'ALL': async () => {
            const allHabits = await getHabits();

            for(let habit of allHabits){
                await deleteHabitById(habit.id);
            }
            await getHabits();
        }
    }

    const deleteHabits = async () => {
        try{
            methods[selectedDeleteType.value]?.()

            modals.closeDeleteHabit()
        }catch(err){
            console.log('Ошибка при удалении привычки(чек) пользователя');
            throw err;
        }
    }

    return{
        restoreSeries,
        createHabit,
        deleteHabits,
        updateStatus,
    }
}