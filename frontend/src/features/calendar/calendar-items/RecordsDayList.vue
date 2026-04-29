<script setup>
import { useRecords } from "../../../shared/composables/user-composables/recordsComposable.js";

import reset_record from "../../../app/assets/icons/reset-record.png"

const { userDayRecords, openResetRecordsModal } = useRecords();

const formateTime = () => {
  return new Date().toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

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
      Привычка создана в {{ formateTime(dayRecord.timeCreatedRecord) }}
    </span>
    <div class="flex items-center gap-2 py-1">
      <button @click="openResetRecordsModal
          (
            dayRecord.id, 'Хотите отчитить историю выполенния этой привычки?', 'This'
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
      Статус обновлен в {{ formateTime(dayRecord.timeUpdatedStatus) }} —
      <span :class="statusClass(dayRecord.secondStatus)">
        {{ dayRecord.secondStatus }}
      </span>
    </span>
    <span v-if="dayRecord.thirdStatus" class="text-sm">
      Статус обновлен в {{ formateTime(dayRecord.newTimeUpdatedStatus) }} —
      <span :class="statusClass(dayRecord.thirdStatus)">
        {{ dayRecord.thirdStatus }}
      </span>
    </span>
  </li>
</template>

<style scoped>

</style>