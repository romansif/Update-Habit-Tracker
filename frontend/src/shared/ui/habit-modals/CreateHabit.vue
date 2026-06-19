<script setup lang="ts">
import { computed, watch } from 'vue';

import { useForms } from "../../composables/forms/useForms";
import { useHabitModals } from "../../composables/modal/habitModals";
import { useHabitsStore } from "../../composables/store/habitsStore";
import { useHabits } from "../../../features/habits/composables/useHabits";

import BaseButton from '../button/BaseButton.vue';

const { categoriesForm, frequenciesForm, termsForm, habits } = useHabitsStore();
const { createHabit } = useHabits();
const { habitForm, habitErrors } = useForms();
const { closeCreateHabit } = useHabitModals();

const unCompletedHabits = computed(() => {
  return habits.value.filter(habit => habit.status !== 'Выполнено')
})

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
            <select v-model="habitForm.category" name="" id="" class="bg-gray-300 outline-none rounded-[4px] px-3 py-4 text-black w-full">
              <option disabled value="">
                Выберите категорию
              </option>
              <option v-for="category in categoriesForm">
                {{ category.icon }}{{ category.category }}
              </option>
            </select>
            <span v-if="habitErrors.categoryError" class="text-sm text-red-500">
              {{ habitErrors.categoryMessage }}
            </span>
          </div>
          <div class="flex flex-col gap-2 min-h-[90px]">
            <input type="text" v-model="habitForm.habit" placeholder="Название привычки"
                   class="bg-gray-300 outline-none rounded-[4px] p-4 w-full placeholder:text-black"/>
            <span v-if="habitErrors.habitError" class="text-sm text-red-500">
              {{ habitErrors.habitMessage }}
            </span>
          </div>
          <div class="flex flex-col gap-2 min-h-[90px]">
            <input type="text" list="time-choice" id="ti-me-choice" name="ti-me-choice" v-model="habitForm.time"
                   class="bg-gray-300 outline-none rounded-[4px] p-4 w-full placeholder:text-black"
                   placeholder="Время на выполнение (мин)" />
            <datalist id="time-choice">
              <option value="от 1 до 5"></option>
              <option value="от 5 до 10"></option>
              <option value="от 10 до 20"></option>
              <option value="от 30 до 60"></option>
            </datalist>
            <span v-if="habitErrors.timeError" class="text-sm text-red-500">
              {{ habitErrors.timeMessage }}
            </span>
          </div>
        </div>
        <div class="w-1/2 flex flex-col gap-4">
          <div class="flex flex-col gap-2 min-h-[90px]">
            <select v-model="habitForm.frequency" class="bg-gray-300 outline-none rounded-[4px] px-3 py-4 text-black w-full">
              <option disabled value="">
                Выберите частоту
              </option>
              <option v-for="frequency in frequenciesForm">{{ frequency }}</option>
            </select>
            <span v-if="habitErrors.frequencyError" class="text-sm text-red-500">
              {{ habitErrors.frequencyMessage }}
            </span>
          </div>
          <div class="flex flex-col gap-2 min-h-[90px]">
            <select v-model="habitForm.term" class="bg-gray-300 outline-none rounded-[4px] px-3 py-4 text-black w-full">
              <option disabled value="">
                Выберите срок выполнения
              </option>
              <option v-for="term in termsForm">{{ term }}</option>
            </select>
            <span v-if="habitErrors.termError" class="text-sm text-red-500">
              {{ habitErrors.termMessage }}
            </span>
          </div>
          <div class="flex flex-col gap-2 min-h-[90px]">
            <select v-model="habitForm.linkedHabit" class="bg-gray-300 outline-none rounded-[4px] px-3 py-4 text-black w-full">
              <option value="">
                Без связи
              </option>
              <option v-for="habit in unCompletedHabits" :key="habit.id">{{ habit.habit }}</option>
            </select>
            <span class="text-sm text-gray-500">
              Не обязательно
            </span>
          </div>
          <div class="flex justify-between items-center">
            <BaseButton button-type="Отмена" variant="cancelHabit" @click="closeCreateHabit"/>
            <BaseButton button-type="Сохранить" variant="confirmHabit" @click="createHabit('Не выполнено')"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>