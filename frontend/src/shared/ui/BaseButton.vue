<script setup>
const props = defineProps({
  buttonType: {
    type: String,
    default: 'base'
  },
  variant: {
    type: String,
    default: 'base'
  }
})

const variantClasses = {
  login: `px-26 py-6 text-white rounded-lg bg-gradient-to-b from-indigo-400 to-indigo-600
            shadow-xl shadow-indigo-500/40active:scale-95 transition`,
  register: `px-16 py-6 text-white rounded-lg bg-gradient-to-b from-indigo-400 to-indigo-600
            shadow-xl shadow-indigo-500/40 active:scale-95 transition`,
  cancelHabitModal: `px-7 py-4 text-white rounded-lg bg-gradient-to-b from-rose-400 to-rose-600
            shadow-xl shadow-rose-500/40 active:scale-95 transition`,
  confirmHabitModal: `p-4 text-white rounded-lg bg-gradient-to-b from-indigo-400 to-indigo-600
            shadow-xl shadow-indigo-500/40 active:scale-95 transition`,
  cancelExitModal: `px-10 py-3 text-white rounded-lg bg-gradient-to-br from-rose-400 to-rose-600
            shadow-xl shadow-rose-500/40 active:scale-95 transition`,
  confirmExitModal: `px-11 py-3 text-white rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600
            shadow-xl shadow-indigo-500/40 active:scale-95 transition`,
  cancelDelHabit: `px-10 py-3 text-white rounded-lg bg-gradient-to-br from-rose-400 to-rose-600
            shadow-xl shadow-rose-500/40 active:scale-95 transition`,
  confirmDelHabit: `px-11 py-3 text-white rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600
            shadow-xl shadow-indigo-500/40 active:scale-95 transition`,
  confirmEditProfile: `px-10 py-5 text-white rounded-lg bg-gradient-to-b from-indigo-400 to-indigo-600
            shadow-xl shadow-indigo-500/40 active:scale-95 transition`,
  closeHabitsInDay: `mt-5 bg-gradient-to-b from-rose-400 to-rose-600 shadow-xl text-white
            shadow-rose-500/40 active:scale-95 transition py-3 px-6 text-sm rounded-[6px]`,
  cancelResRecords: `px-10 py-3 text-white rounded-lg bg-gradient-to-br from-rose-400 to-rose-600
            shadow-xl shadow-rose-500/40 active:scale-95 transition`,
  confirmResRecords: `px-11 py-3 text-white rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600
            shadow-xl shadow-indigo-500/40 active:scale-95 transition`,
  openResRecordsModal: `p-4 text-white text-sm rounded-md bg-gradient-to-br from-indigo-400 to-indigo-600
            shadow-xl shadow-indigo-500/40 active:scale-95 transition`
}
</script>

<template>
  <button :class="['', variantClasses[variant]]" v-bind="$attrs">
    <slot>{{ buttonType }}</slot>
  </button>
</template>