<script setup lang="ts">
import { useHabitModals } from "../../../composables/modal/habitModals";
import { useHabitsStore } from "../../../composables/store/habitsStore";

const { restoreHabitsSeries, restoreMessage } = useHabitsStore();
const { closeRestoreSeries } = useHabitModals()
</script>

<template>
  <section class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
         flex items-center justify-center px-4" @click="closeRestoreSeries">
    <div @click.stop class="w-full max-w-md bg-white rounded-3xl shadow-2xl
           border border-gray-100 overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl">
            🔥
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">Восстановление серии</h2>
            <p class="text-sm text-gray-500">Возвращение прогресса привычек</p>
          </div>
        </div>
      </div>
      <div class="px-6 py-5 flex flex-col gap-5">
        <p class="text-gray-700 text-base leading-relaxed text-center">
          {{ restoreMessage }}
        </p>
        <div class="bg-gray-50 rounded-2xl p-4max-h-[180px] overflow-y-auto">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-lg">📋</span>
            <span class="font-semibold text-gray-700">
              Привычки
            </span>
          </div>
          <ul class="flex flex-col gap-2 max-h-[225px] overflow-y-auto no-scrollbar">
            <li v-for="restoreHabitSeries in restoreHabitsSeries" :key="restoreHabitSeries.id"
                class="flex items-center justify-betweenbg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
              <span class="text-gray-700 font-medium">
                {{ restoreHabitSeries }}
              </span>
              <span class="flex items-center gap-1text-orange-500 font-semibold">
                🔥 {{ restoreHabitSeries.currentSeries }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>