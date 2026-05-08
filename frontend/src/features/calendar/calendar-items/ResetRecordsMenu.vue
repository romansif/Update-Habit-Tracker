<script setup>
import { computed } from 'vue'
import { useRecords } from "../composables/recordsComposable.js";
import { useCalendar } from "../composables/calendarComposable.js";

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const { openResetRecordsModal } = useRecords()
const { currentMonth, currentYear } = useCalendar()

const month = computed(() => {
  return String(currentMonth.value + 1).padStart(2, '0') + '.' + currentYear.value
})
</script>

<template>
  <Menu as="div" class="relative inline-block p-6">
    <MenuButton class="inline-flex w-full justify-center gap-x-1.5 rounded-md text-white rounded-lg
                                bg-gradient-to-b from-indigo-400 to-indigo-600 shadow-lg
                                shadow-indigo-500/40 active:scale-95 transition py-4 px-6 text-sm font-semibold
                                text-white inset-ring-1 inset-ring-white/5 hover:bg-gray-500">
      Календарь
      <ChevronDownIcon class="-mr-1 size-5 text-white" aria-hidden="true" />
    </MenuButton>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems class="absolute right-6 z-10 mt-2 w-46 origin-top-right divide-y divide-white/40 rounded-md bg-indigo-400 outline-1 -outline-offset-1 outline-white/10">
        <div>
          <MenuItem v-slot="{ active }">
            <button @click="openResetRecordsModal
                    (
                      'Month', 'историю выполенния привычек за месяц?', 'MONTH',
                      month
                    )">
              <span :class="[
                      active ? `bg-white/25 text-white outline-hidden` :
                      'text-white', 'block px-4 py-2 text-sm'
                  ]">
                  Отчистить историю за месяц
              </span>
            </button>
          </MenuItem>
        </div>
        <div>
          <MenuItem v-slot="{ active }">
            <button @click="openResetRecordsModal
                  (
                    'All','всю историю выполнения привычек?','ALL'
                  )">
                <span :class="[
                        active ? 'bg-white/25 text-white outline-hidden' :
                        'text-white', 'block px-4 py-2 text-sm'
                    ]">
                    Отчистить всю историю
                </span>
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>