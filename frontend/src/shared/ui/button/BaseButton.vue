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
  login: `px-26 py-6 from-indigo-400 to-indigo-600
            shadow-indigo-500/40active:scale-95 transition`,
  register: `px-16 py-6 from-indigo-400 to-indigo-600
            shadow-indigo-500/40 active:scale-95 transition`,
  cancel: `px-10 py-3 from-rose-400 to-rose-600
            shadow-rose-500/40 active:scale-95 transition`,
  confirm:  `px-11 py-3 from-indigo-400 to-indigo-600
            shadow-indigo-500/40 active:scale-95 transition`,
  cancelHabit: `px-12 py-4 from-rose-400 to-rose-600
            shadow-rose-500/40 active:scale-95 transition`,
  confirmHabit: `px-9 py-4 from-indigo-400 to-indigo-600
            shadow-indigo-500/40 active:scale-95 transition`,
  prevPage: `mt-5 from-gray-400 to-gray-600
            shadow-gray-500/40 active:scale-95 transition py-4 px-8`,
  nextPage: `mt-5 from-gray-400 to-gray-600
            shadow-gray-500/40 active:scale-95 transition py-4 px-8`,
  openHabitCalendar: `mt-5 from-indigo-400 to-indigo-600
            shadow-indigo-500/40 active:scale-95 transition py-3 px-3`
}
</script>

<template>
  <button :class="['text-white rounded-lg bg-gradient-to-br shadow-xl text-sm', variantClasses[variant]]" v-bind="$attrs">
    <slot>{{ buttonType }}</slot>
  </button>
</template>