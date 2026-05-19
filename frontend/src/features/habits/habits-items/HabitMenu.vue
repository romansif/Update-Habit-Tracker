<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

import { useHabits } from "../composables/useHabits.js";
import { useModals } from "../../../shared/composables/modal/useModals.js";

import options from "../../../app/assets/icons/options.png";

const { updateStatus } = useHabits()
const { openHabitInfoModal, openDeleteHabitModal } = useModals()

const route = useRoute()

const props = defineProps({
  status: {
    type: String,
  },
  id: {
    type: String,
  }
})

const isCompletedHabitsPage = computed(() => route.name !== 'completed-habits')
const isinProgressHabitsPage = computed(() => route.name !== 'in-progress-habits')

const canAddInCompletedHabits = computed(() => props.status !== 'Выполнено')
const canAddInProgressHabits = computed(() => props.status !== 'В процессе' && props.status !== 'Выполнено')
</script>

<template>
  <Menu as="div" class="relative inline-block">
    <MenuButton>
      <img :src="options" alt="" class="w-[20px]">
    </MenuButton>
    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems class="absolute z-10 w-34 divide-y divide-white/40 rounded-md bg-indigo-400 outline-1 -outline-offset-1 outline-white/10">
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <button @click="openHabitInfoModal(id, 'Выполнено')" class="w-full text-start">
              <span :class="[
                      active ? `bg-white/25 text-white outline-hidden` :
                      'text-white', 'block px-4 py-1 text-sm'
                  ]">
                  Детали
              </span>
            </button>
          </MenuItem>
        </div>
        <div v-if="isCompletedHabitsPage">
          <MenuItem v-if="canAddInCompletedHabits" v-slot="{ active }">
            <button @click="updateStatus(id, 'Выполнено')" class="w-full text-start">
              <span :class="[
                      active ? `bg-white/25 text-white outline-hidden` :
                      'text-white', 'block px-4 py-1 text-sm'
                  ]">
                  В Выполненные
              </span>
            </button>
          </MenuItem>
        </div>
        <div v-if="isinProgressHabitsPage">
          <MenuItem v-if="canAddInProgressHabits" v-slot="{ active }">
            <button @click="updateStatus(id, 'В процессе')" class="w-full text-start">
                <span :class="[
                        active ? 'bg-white/25 text-white outline-hidden' :
                        'text-white', 'block px-4 py-1 text-sm'
                    ]">
                    В процессе
                </span>
            </button>
          </MenuItem>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <button @click="openDeleteHabitModal(id, 'Хотите навсегда удалить привычку?')" class="w-full text-start">
                <span :class="[
                        active ? 'bg-white/25 text-white outline-hidden' :
                        'text-white', 'block px-4 py-1 text-sm'
                    ]">
                    Удалить
                </span>
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>