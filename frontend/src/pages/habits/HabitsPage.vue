<script setup lang="ts">
import { useModalsStore } from "../../shared/composables/store/modalsStore";
import { useHabitsStore } from "../../shared/composables/store/habitsStore";

import HabitsList from "../../features/habits/HabitsList.vue";
import NavBar from "../../features/navigation/NavBar.vue";
import HabitCalendar from "../../features/habits/habit-calendar/HabitCalendar.vue";
import DeleteHabit from "../../shared/ui/habit-modals/DeleteHabit.vue";
import DayHabit from "../../shared/ui/habit-modals/info/DayHabit.vue";
import RestoreSeries from "../../shared/ui/habit-modals/restore/RestoreSeries.vue";
import RollbackSeries from "../../shared/ui/habit-modals/restore/RollbackSeries.vue";
import Pagination from "../../features/footer/Pagination.vue";
import HabitInfo from "../../shared/ui/habit-modals/info/HabitInfo.vue";
import DeleteRecords from "../../shared/ui/records-modals/DeleteRecords.vue";

const { habits } = useHabitsStore()

const { habitInfoVisible, deleteHabitVisible, calendarVisible, habitRecordsVisible,
  resetRecordsVisible, rollbackSeriesVisible, restoreSeriesVisible
} = useModalsStore()
</script>

<template>
  <div class="bg-indigo-300 min-h-screen">
    <NavBar />
    <HabitsList />
  </div>
  <Pagination v-if="habits && habits.length > 0"/>
  <transition name="modal" >
    <HabitInfo v-show="habitInfoVisible" />
  </transition>
  <transition name="modal">
    <HabitCalendar v-show="calendarVisible"/>
  </transition>
  <transition name="modal">
    <DayHabit v-show="habitRecordsVisible" />
  </transition>
  <transition name="modal">
    <DeleteRecords v-show="resetRecordsVisible"/>
  </transition>
  <transition name="modal">
    <DeleteHabit v-show="deleteHabitVisible" />
  </transition>
  <transition name="modal">
    <RollbackSeries v-show="rollbackSeriesVisible" />
  </transition>
  <transition name="modal">
    <RestoreSeries v-show="restoreSeriesVisible" />
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