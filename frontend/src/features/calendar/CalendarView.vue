<script setup>
import { useModalsStore } from "../../shared/composables/store/modalsStore.js";

import NavMenu from "../navigation/NavMenu.vue";
import HabitsCalendar from "./calendar-items/HabitsCalendar.vue";
import ResetMenu from "./calendar-items/ResetMenu.vue"
import DayHabitsModal from "../../shared/ui/info-modals/DayHabitsModal.vue";
import ResetRecords from "../../shared/ui/delete-modals/ResetRecords.vue";

const { habitsRecordsModalVisible, resetRecordsModalVisible } = useModalsStore();
</script>

<template>
  <div class="flex justify-between h-[50px]">
    <NavMenu />
    <ResetMenu />
  </div>
   <HabitsCalendar />
  <transition name="modal" >
    <DayHabitsModal v-show="habitsRecordsModalVisible" />
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