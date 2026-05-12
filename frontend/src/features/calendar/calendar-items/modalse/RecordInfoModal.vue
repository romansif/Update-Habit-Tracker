<script setup>
import { useGetRecords } from "../../composables/getRecords.js";

import BaseButton from "../../../../shared/ui/BaseButton.vue";
import RecordInfo from "../lists/RecordInfo.vue";

const { resetDate, closeInfoModal } = useGetRecords()
</script>

<template>
  <div class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]
                      flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-[600px]">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl italic mt-1">Задачa за {{ resetDate }}</h3>
      </div>
      <RecordInfo />
      <div class="flex">
        <BaseButton button-type="Закрыть" variant="closeHabitsInDay" @click=closeInfoModal />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>