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
  login: `px-26 py-6 from-indigo-400 to-indigo-600 shadow-indigo-500/4`,
  register: `px-16 py-6 from-indigo-400 to-indigo-600 shadow-indigo-500/40`,
  cancel: `px-10 py-3 from-rose-400 to-rose-600 shadow-rose-500/40`,
  confirm:  `px-11 py-3 from-indigo-400 to-indigo-600 shadow-indigo-500/40`,
  cancelHabit: `px-12 py-4 from-rose-400 to-rose-600 shadow-rose-500/40`,
  confirmHabit: `px-9 py-4 from-indigo-400 to-indigo-600 shadow-indigo-500/40`,
  confirmEditUser: `px-12 py-5 from-indigo-400 to-indigo-600 shadow-indigo-500/40`,
  prevPage: `mt-5 from-gray-400 to-gray-600 shadow-gray-500/40 py-4 px-8`,
  nextPage: `mt-5 from-gray-400 to-gray-600 shadow-gray-500/40 py-4 px-8`,
  openHabitCalendar: `mt-5 from-indigo-400 to-indigo-600 shadow-indigo-500/40 py-3 px-3`
}
</script>

<template>
  <button :class="['text-white rounded-lg bg-gradient-to-br shadow-xl text-sm active:scale-95 transition', variantClasses[variant]]" v-bind="$attrs">
    <slot>{{ buttonType }}</slot>
  </button>
</template>