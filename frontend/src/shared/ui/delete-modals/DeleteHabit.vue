<script setup>
import { useModals } from "../../composables/modal/useModals.js";
import { useHabitsStore } from "../../composables/store/habitsStore.js";
import { useHabits } from "../../../features/habits/composables/useHabits.js";

import BaseButton from '../button/BaseButton.vue';

const { deleteHabit } = useHabits();
const { deleteHabitMessage } = useHabitsStore();
const { closeDeleteHabitModal } = useModals();
</script>

<template>
  <section class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]
                                flex items-center justify-center">
    <div class="bg-white rounded-2xl w-[400px] h-[200px] shadow-xl">
      <div class="flex flex-col justify-center items-center py-8 px-2 gap-6">
        <h2 class="text-2xl text-center">{{ deleteHabitMessage }}</h2>
        <div class="flex justify-center gap-6">
          <BaseButton button-type="Нет" variant="cancelDelHabit" @click=closeDeleteHabitModal />
          <BaseButton button-type="Да" variant="confirmDelHabit" @click=deleteHabit />
        </div>
      </div>
    </div>
  </section>
</template>