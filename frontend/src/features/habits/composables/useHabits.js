import { computed } from 'vue';

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
    const { habits, habitId, selectedDeleteType, seriesCount, termsValue } = useHabitsStore();
    const { createRecord, updateHabitsCurrentCount, updateRecordStatus } = useRecords();

    const createHabit = async (status) => {
        const userId = localStorage.getItem('userId');

        const isValid = validateHabitForm();

        if(!isValid) return;
        try{
            const now = new Date();
            const dateCreated = now.toLocaleDateString();
            const month =Number(now.toLocaleDateString('ru-RU', {
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
                    series: seriesCount.value,
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
            await getHabits()

            await createRecord(newHabit.habit, newHabit.series, newHabit.status, newHabit.id);

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

            await updateRecordStatus(habit.habit, seriesCount.value, newStatus)

            await updateHabitsCurrentCount(newStatus)
        }catch(err){
            console.log(err);
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
            const userRecordsId = localStorage.getItem('userRecordsId');

            await deleteHabitById(habitId.value);
            await updateHabitCount(userRecordsId);

            await getHabits();
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
        methods[selectedDeleteType.value]?.()

        modals.closeDeleteHabitModal()

        await modals.closeHabitInfoModal()

    }

    return{
        createHabit,
        deleteHabits,
        updateStatus,
    }
}