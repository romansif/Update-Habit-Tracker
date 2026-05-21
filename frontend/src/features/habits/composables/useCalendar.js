import { ref, computed } from 'vue';

import { useRecordsStore } from "../../../shared/composables/store/recordsStore.js";

const currentDate = ref(new Date());

const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

export const useCalendar = () => {
    const { habitRecords } = useRecordsStore();

    const currentMonth = computed(() => currentDate.value.getMonth());
    const currentYear = computed(() => currentDate.value.getFullYear());

    const currentMonthName = computed(() => monthNames[currentMonth.value]);

    const daysInMonth = computed(() =>
        new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
    );

    const firstDayOfMonth = computed(() => {
        const day = new Date(currentYear.value, currentMonth.value, 1).getDay();
        return day === 0 ? 6 : day - 1
    });

    const calendarDays = computed(() => {
        const daysArray = Array.from({ length: daysInMonth.value }, (_, i) => i + 1);
        const emptyCeils = Array.from({length: firstDayOfMonth.value }, () => null);
        return [...emptyCeils, ...daysArray]
    });

    const isSameDay = (d1, d2) => {
        return(
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear()
        );
    };

    const lastMonth = () => {
        currentDate.value = new Date(
            currentYear.value,
            currentMonth.value - 1,
            1,
        )
    }

    const nextMonth = () => {
        currentDate.value = new Date(
            currentYear.value,
            currentMonth.value + 1,
            1
        )
    }

    const isToday = (day) => {
        if(!day) return false

        const dateToCheck = new Date(currentYear.value, currentMonth.value, day)

        const today = new Date()

        return isSameDay(dateToCheck, today)
    }

    const isTodayWeekend = (day) => {
        if(!day) return false
        const dateToCheck = new Date(currentYear.value, currentMonth.value, day)

        const today = new Date()

        const isWeekend = dateToCheck.getDay() === 0 || dateToCheck.getDay() === 7

        return isSameDay(dateToCheck, today) && isWeekend
    }

    const isWeekend = (day) => {
        if(!day) return false

        const dateToCheck = new Date(currentYear.value, currentMonth.value, day)

        const dayOfWeek = dateToCheck.getDay()

        return dayOfWeek === 0 || dayOfWeek === 7
    }

    const isPastDay = (day) => {
        if(!day) return false

        const dateToCheck = new Date(currentYear.value, currentMonth.value, day)

        const today = new Date()

        today.setHours(0, 0, 0, 0)

        return dateToCheck < today
    }

    const hasStatus = (day, status) => {
        return habitRecords.value?.some(record => {
            const date = new Date(record.date);

            return(
                date.getDate() === day &&
                date.getMonth() === currentMonth.value &&
                date.getFullYear() === currentYear.value &&
                (
                    record.firstStatus === status ||
                    record.secondStatus === status ||
                    record.thirdStatus === status
                )
            );
        });
    };

    return{
        currentMonth,
        currentMonthName,
        currentYear,
        calendarDays,

        isSameDay,
        lastMonth,
        nextMonth,
        isPastDay,
        isToday,
        isTodayWeekend,
        isWeekend,
        hasStatus
    }
}