<script setup>
import { useModalsStore } from "../../shared/composables/store/modalsStore.js";

import NavMenu from "../navigation/NavMenu.vue";
import Calendar from "./calendar-items/Calendar.vue";
import ResetMenu from "./calendar-items/ResetMenu.vue"
import DayRecords from "../../shared/ui/info-modals/dayRecords.vue";
import ResetRecords from "../../shared/ui/delete-modals/ResetRecords.vue";

const { recordsModalVisible, resetRecordsModalVisible } = useModalsStore();
</script>

<template>
  <div class="flex justify-between h-[50px]">
    <NavMenu />
    <ResetMenu />
  </div>
   <Calendar />
  <transition name="modal" >
    <DayRecords v-show="recordsModalVisible" />
  </transition>
  <transition name="modal" >
    <ResetRecords v-show="resetRecordsModalVisible" />
  </transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>