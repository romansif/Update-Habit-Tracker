<script setup>
import { useRecords } from './composables/recordsComposable.js';

import Calendar from "./calendar-items/Calendar.vue";
import NavMenu from "../navigation/NavMenu.vue";
import RecordsDayModal from "./calendar-items/RecordsDayModal.vue";
import ResetRecords from "../../shared/ui/records-modals/ResetRecords.vue";
import ResetRecordsMenu from "../calendar/calendar-items/ResetRecordsMenu.vue"

const { recordsModalVisible, resetRecordsModalVisible } = useRecords();
</script>

<template>
  <div class="flex justify-between h-[50px]">
    <NavMenu />
    <ResetRecordsMenu />
  </div>
  <Calendar />
  <RecordsDayModal v-show="recordsModalVisible" />
  <ResetRecords v-show="resetRecordsModalVisible" />
</template>

<style scoped>

</style>