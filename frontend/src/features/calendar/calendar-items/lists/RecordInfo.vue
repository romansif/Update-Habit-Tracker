<script setup>
import { useUserStore } from "../../../../shared/composables/store/useUserStore.js";
import { useGetRecords } from "../../composables/getRecords.js";

const { recordInfo } = useUserStore();
const { openInfoModal } = useGetRecords();


const statusClass = (status) => ({
  'text-green-500': status === 'Выполнено',
  'text-purple-500': status === 'В процессе',
  'text-rose-500': status === 'Не выполнено'
});
</script>

<template>
  <div class="mb-2 pb-4 border-b border-gray-400 flex flex-col gap-2">
    <span class="text-gray-500">
      Привычка создана в {{ recordInfo.timeCreatedRecord }}
    </span>
    <div class="flex items-center gap-2 py-1">
      <span class="text-lg font-medium" @click="openInfoModal(recordInfo.id)">
        {{ recordInfo.habit }}
      </span>
    </div>
    <span v-if="recordInfo.firstStatus" class="text-sm">
      Добавлен статус —
      <span :class="statusClass(recordInfo.firstStatus)">
        {{ recordInfo.firstStatus }}
      </span>
    </span>
    <span v-if="recordInfo.secondStatus" class="text-sm">
      Статус обновлен в {{ recordInfo.timeUpdatedStatus }} —
      <span :class="statusClass(recordInfo.secondStatus)">
        {{ recordInfo.secondStatus }}
      </span>
    </span>
    <span v-if="recordInfo.thirdStatus" class="text-sm">
      Статус обновлен в {{ recordInfo.newTimeUpdatedStatus }} —
      <span :class="statusClass(recordInfo.thirdStatus)">
        {{ recordInfo.thirdStatus }}
      </span>
    </span>
  </div>
</template>

<style scoped>

</style>