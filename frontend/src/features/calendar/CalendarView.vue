<script setup lang="ts">
import { useModalsStore } from "../../shared/composables/store/modalsStore";

import NavMenu from "../navigation/NavMenu.vue";
import HabitsCalendar from "./calendar-items/HabitsCalendar.vue";
import ResetMenu from "./calendar-items/ResetMenu.vue"
import DayHabits from "../../shared/ui/habit-modals/info/DayHabits.vue";
import DeleteRecords from "../../shared/ui/records-modals/DeleteRecords.vue";

const { habitsRecordsVisible, resetRecordsVisible } = useModalsStore();
</script>

<template>
  <div class="flex justify-between h-[50px]">
    <NavMenu />
    <ResetMenu />
  </div>
   <HabitsCalendar />
  <transition name="modal" >
    <DayHabits v-show="habitsRecordsVisible" />
  </transition>
  <transition name="modal" >
    <DeleteRecords v-show="resetRecordsVisible" />
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