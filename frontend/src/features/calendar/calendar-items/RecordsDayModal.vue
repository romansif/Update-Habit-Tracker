<script setup>
import { useRecords } from "../../../shared/composables/user-composables/recordsComposable.js";

import BaseButton from '../../../shared/ui/BaseButton.vue';
import RecordsDayList from "./RecordsDayList.vue";
import options from '../../../app/assets/icons/options.png'

const { userDayRecords, selectedDate, currentMonth, currentYear, openResetRecordsModal, closeRecordsModal } = useRecords();

</script>
<template>
  <div class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]
                      flex items-center justify-center">
  <div class="bg-white rounded-lg p-6 w-[600px]">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl italic mt-1">Задачи за {{ selectedDate?.getDate() }}.{{ currentMonth + 1 }}.{{ currentYear }}</h3>
      <button @click="openResetRecordsModal
                      (
                      'Day','Хотите отчистить историю выполнения привычек за день?','DAY'
                      )">
        <img :src="options" alt="" class="w-[30px] h-[30px]">
      </button>
    </div>
    <ul v-if="userDayRecords?.length > 0" class="flex flex-col max-h-[505px] overflow-y-auto no-scrollbar">
      <RecordsDayList />
    </ul>
    <span v-else class="italic text-gray-500">Пустой день</span>
    <div class="flex">
      <BaseButton button-type="Закрыть" variant="closeHabitsInDay" @click=closeRecordsModal />
    </div>
  </div>
  </div>
</template>
