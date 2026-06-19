<script setup lang="ts">
import { useRecordsModals } from "../../composables/modal/recordModals";
import { useRecordsStore } from "../../composables/store/recordsStore";
import { useRecords } from "../../../features/calendar/composables/useRecords";

import BaseButton from '../button/BaseButton.vue';

const { resetRecords } = useRecords()
const { resetMessage } = useRecordsStore();
const { closeResetRecords } = useRecordsModals();
</script>

<template>
  <section class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]
                                flex items-center justify-center">
    <div class="bg-white rounded-2xl w-[400px] h-[200px] shadow-xl">
      <div class="flex flex-col justify-center items-center py-8 px-4 gap-6">
        <h2 class="text-2xl text-center">Хотите отчистить {{ resetMessage }}</h2>
        <div class="flex justify-center gap-6">
          <BaseButton button-type="Нет" variant="cancel" @click=closeResetRecords />
          <BaseButton button-type="Да" variant="confirm" @click=resetRecords />
        </div>
      </div>
    </div>
  </section>
</template>