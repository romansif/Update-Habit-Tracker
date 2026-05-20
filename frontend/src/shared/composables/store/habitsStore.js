import { ref } from "vue";

const habits = ref([]);
const categoriesForm = [
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
]
const frequenciesForm = {
    everyDay: 'Ежедневно',
    oneTimeInWeek: '1 раз в неделю',
    threeTimeInWeek: '3 раза в неделю'
}
const termsForm = {
    oneMonth: '1 месяц',
    threeMonth: '3 месяца',
    sixMonth: '6 месяцев',
    oneYear: '1 год',
    threeYear: '3 года',
    sixYear: '6 лет'
}
const termsValue = {
    '1 месяц': {type: 'month', value: 1, days: 30},
    '3 месяца': {type: 'month', value: 3, days: 90},
    '6 месяцев': {type: 'month', value: 6, days: 120},
    '1 год': {type: 'year', value: 1, days: 365},
    '3 года': {type: 'year', value: 3, days: 1095},
}
const habitsCount = ref(null);
const habitsCountForm = {
    allHabits: 0,
    dayCompletedHabits: 0,
    allCompletedHabits: 0,
    incompletedHabits: 0,
}
const habit = ref({})
const habitId = ref(null);
const seriesCount = ref(0);
const deleteHabitMessage = ref('')

export const useHabitsStore = () => {
    return{
        habits,
        categoriesForm,
        frequenciesForm,
        termsForm,
        termsValue,
        habitsCount,
        habitsCountForm,
        habitId,
        habit,
        seriesCount,
        deleteHabitMessage,
    }
}