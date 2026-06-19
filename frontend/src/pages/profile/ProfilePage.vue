<script setup lang="ts">
import { useModalsStore } from "../../shared/composables/store/modalsStore";

import ProfileView from "../../features/profile/ProfileView.vue";
import LogoutUser from "../../shared/ui/user-modals/LogoutUser.vue";
import CreateHabit from "../../shared/ui/habit-modals/CreateHabit.vue";
import DeleteUser from "../../shared/ui/user-modals/DeleteUser.vue";
import RollbackSeries from "../../shared/ui/habit-modals/restore/RollbackSeries.vue";
import DeleteHabit from "../../shared/ui/habit-modals/DeleteHabit.vue";

const { logoutUserVisible, deleteUserVisible, createHabitVisible, rollbackSeriesVisible, deleteHabitVisible } = useModalsStore();
</script>

<template>
  <ProfileView class="bg-indigo-200 min-h-screen"/>
  <transition name="modal" >
    <CreateHabit v-show="createHabitVisible" />
  </transition>
  <transition name="modal">
    <DeleteHabit v-show="deleteHabitVisible" />
  </transition>
  <transition name="modal" >
    <DeleteUser v-show="deleteUserVisible" />
  </transition>
  <transition name="modal" >
    <LogoutUser v-show="logoutUserVisible" />
  </transition>
  <transition name="modal">
    <RollbackSeries v-show="rollbackSeriesVisible" />
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