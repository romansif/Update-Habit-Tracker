<script setup>
import { useRecords } from "../composables/useRecords.js";

import reset_record from "../../../app/assets/icons/reset-record.png"

const { dayRecords, openResetRecordsModal } = useRecords();

const statusClass = (status) => ({
  'bg-green-500 italic text-white px-2 py-1 rounded': status === 'Выполнено',
  'bg-purple-500 italic text-white px-2 py-1 rounded': status === 'В процессе',
  'bg-rose-500 italic text-white px-2 py-1 rounded': status === 'Не выполнено'
});
</script>

<template>
  <li v-for="dayRecord in dayRecords" :key="dayRecord.id"
      class="mb-2 pb-4 border-b border-gray-400 flex flex-col gap-2">
    <span class="text-gray-500">
      Привычка создана в {{ dayRecord.timeCreatedRecord }}
    </span>
    <div class="flex items-center gap-2 py-1">
      <div class="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-1 rounded-lg">
        <span class="text-sm">🔥</span>
        <span class="font-semibold">{{ dayRecord.series }}</span>
      </div>
      <span class="text-lg font-medium">
        {{ dayRecord.habit }}
      </span>
      <button class="ml-auto" @click="openResetRecordsModal
          (
            dayRecord.id, 'историю выполенния этой привычки?', 'ONE'
          )">
        <img :src="reset_record" class="w-5 h-5 opacity-70 hover:opacity-100" />
      </button>
    </div>
    <div class="flex flex-col gap-4">
      <span v-if="dayRecord.firstStatus" class="text-sm">
        Добавлен статус —
        <span :class="statusClass(dayRecord.firstStatus)">
          {{ dayRecord.firstStatus }}
        </span>
      </span>
      <span v-if="dayRecord.secondStatus" class="text-sm">
        Статус обновлен в {{ dayRecord.timeUpdatedStatus }} —
        <span :class="statusClass(dayRecord.secondStatus)">
          {{ dayRecord.secondStatus }}
        </span>
      </span>
      <span v-if="dayRecord.thirdStatus" class="text-sm">
        Статус обновлен в {{ dayRecord.newTimeUpdatedStatus }} —
        <span :class="statusClass(dayRecord.thirdStatus)">
          {{ dayRecord.thirdStatus }}
        </span>
      </span>
    </div>
  </li>
</template>

<style scoped>

</style>