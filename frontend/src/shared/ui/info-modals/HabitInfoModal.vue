<script setup>
import { useUserStore } from "../../composables/store/useUserStore.js";
import { useHabits } from "../../../features/habits/composables/useHabits.js";

import BaseButton from "../BaseButton.vue";
import reset_record from "../../../app/assets/icons/reset-record.png";

const { habit } = useUserStore();
const { openDeleteHabitModal, closeInfoModal } = useHabits();

const statusClass = (status) => ({
  'bg-green-500 italic text-white px-2 py-1 rounded': status === 'Выполнено',
  'bg-purple-500 italic text-white px-2 py-1 rounded': status === 'В процессе',
  'bg-rose-500 italic text-white px-2 py-1 rounded': status === 'Не выполнено'
});
</script>

<template>
  <div class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]
                      flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-[600px]">
      <div class="flex flex-col gap-4 mb-4">
        <div class="flex justify-between items-center">
          <span class="text-gray-700">
            Дата и время создания привычки — {{ habit?.dateCreatedHabit }}, {{ habit?.timeCreatedHabit }}
          </span>
          <button @click="openDeleteHabitModal(habit?.id, 'Хотите навсегда удалить привычку?')">
            <img :src="reset_record" class="w-5 h-5 opacity-70 hover:opacity-100" />
          </button>
        </div>
          <h1 class="text-xl italic">Категория — {{ habit?.category }}</h1>
      </div>
      <div>
          <h2 class="text-lg">Привычка — {{ habit?.habit }}</h2>
      </div>
      <div class="flex justify-between items-center py-2 border-b mb-4">
        <div class="flex flex-col gap-2">
            <span class="text-gray-500 text-md px-2">Частота выполнения привычки - {{ habit?.frequency }}</span>
            <span class="text-gray-500 text-md px-2">Время на выполнение привычки - {{ habit?.time }}</span>
            <span class="text-gray-500 text-md px-2">Срок выполнения привычки - {{ habit?.term }}</span>
        </div>
      </div>
      <div class="flex flex-col border-b gap-2 mb-4 pb-4">
          <span>
            Текущий статус —
           <span :class="statusClass(habit?.status)"> {{ habit?.status }}</span>
          </span>
        <span v-if="habit?.lastTime" class="text-gray-700">Последнее время обновления — {{ habit?.lastTime }}</span>
      </div>
      <div class="flex items-center border-b gap-2 mb-4 pb-4">
        <span>Серия выполнения привычки — </span>
        <div class="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-1 rounded-lg">
          <span class="text-sm">🔥</span>
          <span class="font-semibold">{{ habit?.series }} дней подряд</span>
        </div>
      </div>
      <div>
        <span class="text-gray-700">Конечная дата выполнения привычки — {{ habit?.endDateHabit }}</span>
      </div>
      <div class="flex">
        <BaseButton button-type="Закрыть" variant="closeHabitsInDay" @click=closeInfoModal />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>