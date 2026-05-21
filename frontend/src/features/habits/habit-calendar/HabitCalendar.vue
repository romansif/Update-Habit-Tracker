<script setup>
import { useCalendar } from '../composables/useCalendar.js';
import { useModals } from "../../../shared/composables/modal/useModals.js";

import arrow from '../../../app/assets/icons/arrow.png'
import close from '../../../app/assets/icons/close.png'

const {
  currentMonthName, currentYear, calendarDays, lastMonth, nextMonth,
  isToday, isPastDay, isWeekend, isTodayWeekend, hasStatus
} = useCalendar();

const { openHabitRecordsModal, closeCalendarModal } = useModals();
</script>

<template>
  <div class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]
                              flex justify-center items-center">
    <div class="w-[600px] bg-white rounded-3xl shadow-xl p-3">
      <img :src="close" alt="" class="w-[25px] h-[25px] ml-auto" @click="closeCalendarModal">
      <div class="px-4 ">
        <div class="flex justify-between items-center mt-5">
          <button @click="lastMonth" class="hover:bg-slate-100 rounded-xl transition">
            <img :src="arrow" class="w-[20px] rotate-180">
          </button>
          <h2 class="text-2xl font-bold text-slate-800">{{ currentMonthName }} {{ currentYear }}</h2>
          <button @click="nextMonth" class="hover:bg-slate-100 rounded-xl transition">
            <img :src="arrow" class="w-[20px]">
          </button>
        </div>
        <div class="grid grid-cols-7 text-center text-xs font-semibold text-black uppercase tracking-widest mt-12">
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>
        <div class="grid grid-cols-7 mt-4">
          <div v-for="(day, index) in calendarDays" :key="index" @click="day && openHabitRecordsModal(day)"
               :class="[ 'h-20 flex flex-col items-center justify-between py-4 rounded-2xl transition-all duration-300',
               day ? 'cursor-pointer' : 'border-transparent',
               isPastDay(day) ? 'opacity-50' : '',
               isWeekend(day) ? 'text-red-500' : 'text-slate-800',
               isToday(day) ? 'border-2 border-gray-300' : '',
               isTodayWeekend(day) ? 'border-2 border-red-500' : '',
             ]">
          <span :class="['w-8 h-8 flex items-center justify-center text-sm font-bold',
               isToday(day) ?  '' : ''
          ]">
            {{ day }}
          </span>
            <div class="flex gap-x-1.5">
              <span v-if="hasStatus(day, 'Не выполнено')" class="w-2 h-2 bg-rose-500 rounded-full shadow-sm"></span>
              <span v-if="hasStatus(day, 'В процессе')" class="w-2 h-2 bg-purple-500 rounded-full shadow-sm"></span>
              <span v-if="hasStatus(day, 'Выполнено')" class="w-2 h-2 bg-green-500 rounded-full shadow-sm"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>