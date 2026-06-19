import { ref } from "vue";

export interface Habit {
    id: string;
    habit: string;
    category: string;
    frequency: string;
    time: string;
    totalSeries: number;
    currentSeries: number;
    status: string;
    term: string;
    date: string;
    dateCreatedHabit: string;
    monthCreatedHabit: number;
    timeCreatedHabit: string;
    endDateHabit: string;
    progress: number;
    lastDate: string;
    lastTime: string;
}

export interface CategoryItem {
    category: string;
    icon: string;
}

export interface HabitsCount {
    allHabits: number;
    dayCompletedHabits: number;
    allCompletedHabits: number;
    incompletedHabits: number;
}

export interface TermDetail {
    type: 'month' | 'year';
    value: number;
    days: number;
}

const categoriesForm: CategoryItem[] = [
    { category: 'Сон', icon: '😴'},
    { category: 'Вода',  icon: '💧'},
    { category: 'Спорт', icon: '🏋️'},
    { category: 'Учёба', icon: '📚'},
    { category: 'Уборка',  icon: '🧹'},
    { category: 'Работа', icon: '💼'},
    { category: 'Чтение',  icon: '📖'},
    { category: 'Финансы',  icon: '💰'},
    { category: 'Питание', icon: '🍎'},
    { category: 'Здоровье', icon: '❤️'},
    { category: 'Медитация', icon: '🧘'},
    { category: 'Саморазвитие',  icon: '🧠'},
];

const frequenciesForm: Record<string, string> = {
    everyDay: 'Ежедневно',
    oneTimeInWeek: '1 раз в неделю',
    threeTimeInWeek: '3 раза в неделю'
};

const termsForm: Record<string, string> = {
    oneMonth: '1 месяц',
    threeMonth: '3 месяца',
    sixMonth: '6 месяцев',
    oneYear: '1 год',
    threeYear: '3 года',
    sixYear: '6 лет'
};

const termsValue: Record<string, TermDetail> = {
    '1 месяц': { type: 'month', value: 1, days: 30 },
    '3 месяца': { type: 'month', value: 3, days: 90 },
    '6 месяцев': { type: 'month', value: 6, days: 120 },
    '1 год': { type: 'year', value: 1, days: 365 },
    '3 года': { type: 'year', value: 3, days: 1095 },
};

const habitsCountForm: HabitsCount = {
    allHabits: 0,
    dayCompletedHabits: 0,
    allCompletedHabits: 0,
    incompletedHabits: 0,
};

const habits = ref<Habit[]>([]);
const restoreHabitsSeries = ref<any[]>([]);

const searchForm = ref<{ search: string }>({
    search: ''
});

const habit = ref<Habit>({} as Habit);
const habitsCount = ref<HabitsCount>({
    allHabits: 0,
    dayCompletedHabits: 0,
    allCompletedHabits: 0,
    incompletedHabits: 0,
});

const habitId = ref<string>('');
const seriesCount = ref<number>(0);
const selectedDeleteType = ref<string>('');
const restoreMessage = ref<string>('');
const deleteHabitMessage = ref<string>('');
const currentPage = ref<number>(1);
const totalPages = ref<number>(1);

export const useHabitsStore = () => {
    return {
        habits,
        restoreHabitsSeries,
        categoriesForm,
        frequenciesForm,
        termsForm,
        termsValue,
        habitsCount,
        habitsCountForm,
        searchForm,
        habitId,
        habit,
        seriesCount,
        selectedDeleteType,
        restoreMessage,
        deleteHabitMessage,
        currentPage,
        totalPages,
    };
};