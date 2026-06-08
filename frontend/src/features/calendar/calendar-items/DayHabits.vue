<script setup>
import { useRecordsModals } from "../../../shared/composables/modal/useModals.js";
import { useRecordsStore } from "../../../shared/composables/store/recordsStore.js";

import reset_record from "../../../app/assets/icons/reset-record.png"

const { dayHabitsRecords } = useRecordsStore();
const { openResetRecords } = useRecordsModals();

const statusClass = (status) => ({
  'bg-green-500 italic text-white px-2 py-1 rounded': status === 'Выполнено',
  'bg-purple-500 italic text-white px-2 py-1 rounded': status === 'В процессе',
  'bg-rose-500 italic text-white px-2 py-1 rounded': status === 'Не выполнено'
});
</script>

<template>
  <li v-for="dayHabitRecord in dayHabitsRecords" :key="dayHabitRecord.id"
      class="mb-2 pb-4 border-b border-gray-400 flex flex-col gap-2">
    <span class="text-gray-500">
      Привычка создана в {{ dayHabitRecord.timeCreatedRecord }}
    </span>
    <div class="flex items-center gap-2 py-1">
      <div v-if="dayHabitRecord.currentSeries > 0" class="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-1 rounded-lg text-sm">
        <span>🔥</span>
        <span class="font-semibold">{{ dayHabitRecord.currentSeries }}</span>
      </div>
      <span class="text-lg font-medium">
          {{ dayHabitRecord.habit }}
      </span>
      <img :src="reset_record" class="w-5 h-6 opacity-70 hover:opacity-100 ml-auto"
             @click="openResetRecords(dayHabitRecord.id, 'историю выполенния этой привычки?', 'ONE')" />
    </div>
    <div class="flex flex-col gap-4">
      <span v-if="dayHabitRecord.firstStatus" class="text-sm">
        Добавлен статус —
        <span :class="statusClass(dayHabitRecord.firstStatus)">
          {{ dayHabitRecord.firstStatus }}
        </span>
      </span>
      <span v-if="dayHabitRecord.secondStatus" class="text-sm">
        Статус обновлен в {{ dayHabitRecord.timeUpdatedStatus }} —
        <span :class="statusClass(dayHabitRecord.secondStatus)">
          {{ dayHabitRecord.secondStatus }}
        </span>
      </span>
      <span v-if="dayHabitRecord.thirdStatus" class="text-sm">
        Статус обновлен в {{ dayHabitRecord.newTimeUpdatedStatus }} —
        <span :class="statusClass(dayHabitRecord.thirdStatus)">
          {{ dayHabitRecord.thirdStatus }}
        </span>
      </span>
    </div>
  </li>
</template>

<style scoped>

</style>