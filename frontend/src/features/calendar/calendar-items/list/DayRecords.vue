<script setup>
import { useRecords } from "../../composables/useRecords.js";

import reset_record from "../../../../app/assets/icons/reset-record.png"

const { userDayRecords, openResetRecordsModal } = useRecords();

const statusClass = (status) => ({
  'text-green-500': status === 'Выполнено',
  'text-purple-500': status === 'В процессе',
  'text-rose-500': status === 'Не выполнено'
});
</script>

<template>
  <li v-for="dayRecord in userDayRecords" :key="dayRecord.id"
      class="mb-2 pb-4 border-b border-gray-400 flex flex-col gap-2">
    <span class="text-gray-500">
      Привычка создана в {{ dayRecord.timeCreatedRecord }}
    </span>
    <div class="flex items-center gap-2 py-1">
      <button @click="openResetRecordsModal
          (
            dayRecord.id, 'историю выполенния этой привычки?', 'ONE'
          )">
        <img :src="reset_record" class="w-5 h-5 opacity-70 hover:opacity-100" />
      </button>
      <span class="text-lg font-medium">
        {{ dayRecord.habit }}
      </span>
    </div>
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
  </li>
</template>

<style scoped>

</style>