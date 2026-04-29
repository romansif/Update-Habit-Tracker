<script setup>
import { useRecords } from '../../shared/composables/user-composables/recordsComposable.js';

import Calendar from "./calendar-items/Calendar.vue";
import NavMenu from "../navigation/NavMenu.vue";
import RecordsDayModal from "./calendar-items/RecordsDayModal.vue";
import ResetRecords from "../../shared/ui/records-modals/ResetRecords.vue";
import BaseButton from "../../shared/ui/BaseButton.vue";


const { recordsModalVisible, resetRecordsModalVisible, openResetRecordsModal } = useRecords();
</script>

<template>
  <div class="flex justify-between h-[50px]">
    <NavMenu />
    <div class="p-6">
      <BaseButton button-type="Отчисть историю за все время" variant="openResRecordsModal"
                  @click="openResetRecordsModal
                  (
                    'All','Хотите отчистить всю историю выполнения привычек?','ALL'
                  )" />
    </div>
  </div>
  <Calendar />
  <RecordsDayModal v-show="recordsModalVisible" />
  <ResetRecords v-show="resetRecordsModalVisible" />
</template>

<style scoped>

</style>