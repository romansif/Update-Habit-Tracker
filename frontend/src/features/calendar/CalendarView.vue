<script setup>
import { useGetRecords } from "./composables/getRecords.js";
import { useRecords } from "./composables/useRecords.js";

import Calendar from "./calendar-items/Calendar.vue";
import NavMenu from "../navigation/NavMenu.vue";
import RecordsModal from "../../shared/ui/info-modals/RecordsModal.vue";
import ResetRecords from "../../shared/ui/delete-modals/ResetRecords.vue";
import ResetMenu from "./calendar-items/ResetMenu.vue"

const { recordsModalVisible } = useGetRecords();
const { resetRecordsModalVisible } = useRecords();
</script>

<template>
  <div class="flex justify-between h-[50px]">
    <NavMenu />
    <ResetMenu />
  </div>
  <Calendar />
  <RecordsModal v-show="recordsModalVisible" />
  <ResetRecords v-show="resetRecordsModalVisible" />
</template>

<style scoped>

</style>