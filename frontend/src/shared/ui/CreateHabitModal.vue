<script setup>
import { watch } from 'vue';
import { useHabits } from "../../features/habits/composables/useHabits.js";

import BaseButton from '../ui/BaseButton.vue';

const { habitForm, habitErrors, createHabit, closeCreateModal } = useHabits()

watch(() => [
      habitForm.value.habit, habitForm.value.time,
      habitForm.value.category, habitForm.value.frequency,
      habitForm.value.term,
    ],
    ([habit, time, category, frequency, term]) => {
  if(habit){
    habitErrors.value.habitError = false
  }
  if(time){
    habitErrors.value.timeError = false
  }
  if(category){
    habitErrors.value.categoryError = false
  }
  if(frequency){
    habitErrors.value.frequencyError = false
  }
  if(term){
    habitErrors.value.termError = false
  }
})

</script>

<template>
  <div class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl w-[900px] p-6">
      <h2 class="text-xl font-semibold mb-6">
        Добавить новую привычку
      </h2>
      <div class="flex gap-10">
        <div class="w-1/2 flex flex-col gap-4">
          <div class="flex flex-col gap-2 min-h-[90px]">
            <input type="text" v-model="habitForm.habit" placeholder="Название привычки"
                   class="bg-gray-300 outline-none rounded-[4px] p-4 w-full"/>
            <span v-if="habitErrors.habitError" class="text-sm text-red-500">
              {{ habitErrors.habitMessage }}
            </span>
          </div>
          <div class="flex flex-col gap-2 min-h-[90px]">
            <input type="number" v-model="habitForm.time" placeholder="Время на выполнение (мин)"
                   class="bg-gray-300 outline-none rounded-[4px] p-4 w-full"/>
            <span v-if="habitErrors.timeError" class="text-sm text-red-500">
              {{ habitErrors.timeMessage }}
            </span>
          </div>
          <div class="flex flex-col gap-2 min-h-[90px]">
            <select v-model="habitForm.frequency" class="bg-gray-300 outline-none rounded-[4px] px-3 py-4 text-gray-500 w-full">
              <option disabled value="">
                Выберите частоту
              </option>
              <option>Ежедневно</option>
              <option>1 раз в неделю</option>
              <option>3 раза в неделю</option>
            </select>
            <span v-if="habitErrors.frequencyError" class="text-sm text-red-500">
              {{ habitErrors.frequencyMessage }}
            </span>
          </div>
        </div>
        <div class="w-1/2 flex flex-col gap-4">
          <div class="flex flex-col gap-2 min-h-[90px]">
            <input type="text" v-model="habitForm.category" placeholder="Категория (например, здоровье, учеба)"
                   class="bg-gray-300 outline-none rounded-[4px] p-4 w-full"/>
            <span v-if="habitErrors.categoryError" class="text-sm text-red-500">
              {{ habitErrors.categoryMessage }}
            </span>
          </div>
          <div class="flex flex-col gap-2 min-h-[90px]">
            <select v-model="habitForm.term" class="bg-gray-300 outline-none rounded-[4px] px-3 py-4 text-gray-500 w-full">
              <option disabled value="">
                Выберите срок выполнения
              </option>
              <option>1 месяц</option>
              <option>3 месяца</option>
              <option>6 месяцев</option>
              <option>1 год</option>
              <option>3 года</option>
            </select>
            <span v-if="habitErrors.termError" class="text-sm text-red-500">
              {{ habitErrors.termMessage }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <BaseButton button-type="Отмена" variant="cancelHabitModal" @click="closeCreateModal"/>
            <BaseButton button-type="Сохранить" variant="confirmHabitModal" @click="createHabit('Не выполнено')"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>