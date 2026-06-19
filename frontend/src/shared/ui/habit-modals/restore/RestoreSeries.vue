<script setup lang="ts">
import { useHabitModals } from "../../../composables/modal/habitModals";
import { useHabits } from "../../../../features/habits/composables/useHabits";

import BaseButton from '../../button/BaseButton.vue';

const { restoreSeries } = useHabits()
const { closeRestoreSeries } = useHabitModals();
</script>

<template>
  <section class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]
                                flex items-center justify-center">
    <div class="bg-white rounded-2xl w-[400px] h-[200px] shadow-xl">
      <div class="flex flex-col justify-center items-center py-8 px-4 gap-6">
        <h2 class="text-2xl text-center">Хотите восстановить серию этой привычки?</h2>
        <div class="flex justify-center gap-6">
          <BaseButton button-type="Нет" variant="cancel" @click=closeRestoreSeries />
          <BaseButton button-type="Да" variant="confirm" @click=restoreSeries />
        </div>
      </div>
    </div>
  </section>
</template>