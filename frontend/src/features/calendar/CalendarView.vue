<script setup>
import { useGetRecords } from "./composables/getRecords.js";
import { useRecords } from "./composables/useRecords.js";

import Calendar from "./calendar-items/Calendar.vue";
import NavMenu from "../navigation/NavMenu.vue";
import RecordsModal from "./calendar-items/modalse/RecordsModal.vue";
import ResetRecords from "../../shared/ui/records-modals/ResetRecords.vue";
import ResetMenu from "./calendar-items/ResetMenu.vue"
import RecordInfoModal from "./calendar-items/modalse/RecordInfoModal.vue";

const { recordsModalVisible, infoModalVisible } = useGetRecords();
const { resetRecordsModalVisible } = useRecords();
</script>

<template>
  <div class="flex justify-between h-[50px]">
    <NavMenu />
    <ResetMenu />
  </div>
  <Calendar />
  <RecordsModal v-show="recordsModalVisible" />
  <RecordInfoModal v-show="infoModalVisible" />
  <ResetRecords v-show="resetRecordsModalVisible" />
</template>

<style scoped>

</style>