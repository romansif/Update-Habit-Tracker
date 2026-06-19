import { ref } from "vue";

export interface HabitRecord {
    id: string,
    habitsCountId: string,
    recordId: string,
    date: string,
    dateCreatedRecord: string,
    monthCreatedRecord: number,
    timeCreatedRecord: string,
    habit: string,
    currentSeries: number,
    firstStatus: string,
    secondStatus: string,
    timeUpdatedStatus: string,
    thirdStatus: string,
    newTimeUpdatedStatus: string,

}
const records = ref<HabitRecord[]>([]);
const recordId = ref<string | Date>('')
const monthRecords = ref<HabitRecord[]>([])
const dayHabitsRecords = ref<HabitRecord[]>([]);
const habitRecords = ref<HabitRecord[]>([])
const dayHabitRecords = ref<HabitRecord[]>([])
const selectedDate = ref<string>('')
const resetDate = ref<string>('')
const selectedResetType = ref<string>('')
const resetMessage = ref<string>('')

export const useRecordsStore = () => {
    return{
        records,
        recordId,
        monthRecords,
        dayHabitsRecords,
        habitRecords,
        dayHabitRecords,

        selectedDate,
        selectedResetType,
        resetDate,
        resetMessage,
    }
}