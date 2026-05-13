<script setup>
import { onMounted, watch } from "vue";
import { useUser } from "../../auth/composables/userComposable.js";
import { useHabits } from "../../habits/composables/useHabits.js";
import { useForms } from "../../../shared/composables/useForms.js";

import BaseButton from "../../../shared/ui/BaseButton.vue";
import ProfileStatusCards from "./ProfileStatusCards.vue";
import ProfileMenu from "./ProfileMenu.vue";
import CreateHabitModal from "../../../shared/ui/CreateHabitModal.vue";
import DeleteUserModal from "../../../shared/ui/delete-modals/DeleteUserModal.vue";
import LogoutModal from "../../../shared/ui/LogoutModal.vue";

const { user, logoutUserModalVisible, deleteUserModalVisible, getUser, updateUser } = useUser();
const { userErrors, updateForm } = useForms();
const { createHabitModalVisible } = useHabits();

const toLower = () => {
  updateForm.value.name = updateForm.value.name.toLowerCase()
}

watch(() => updateForm.value.name, (newValue) => {
  if(newValue) {
    userErrors.value.newNameError = false
  }
})

onMounted(async () => {
  await getUser();
})
</script>

<template>
  <div class="bg-indigo-200 min-h-screen">
    <div class="flex justify-between items-center gap-4">
      <router-link :to="{ name: 'habits' }" class="px-8 py-5 text-white rounded-lg bg-gradient-to-b
                            from-indigo-400 to-indigo-600 shadow-xl shadow-indigo-500/40
                            active:scale-95 transition mx-5">
        Вернуться
      </router-link>
      <ProfileMenu />
    </div>
    <ProfileStatusCards />
    <section class="flex justify-center py-13">
      <div class="w-[850px]">
        <div class="flex flex-col gap-6">
          <span class="text-2xl">Текущее имя пользователя:</span>
          <span class="text-xl px-2">{{ user?.name }}</span>
          <div class="flex flex-col gap-3">
            <input type="text" v-model="updateForm.name" @input="toLower" placeholder="Имя пользователя"
                   class="bg-white shadow-xl w-full placeholder:text-sm outline-none rounded-[4px] p-5 mt-6">
            <span v-if="userErrors.newNameError" class="text-sm text-red-500">{{ userErrors?.newNameMessage }}</span>
          </div>
        </div>
        <div class="flex justify-end mt-12">
          <div class="flex flex-col">
            <BaseButton button-type="Применить" variant="confirmEditProfile" @click="updateUser" />
          </div>
        </div>
      </div>
      <CreateHabitModal v-show="createHabitModalVisible" />
      <DeleteUserModal v-show="deleteUserModalVisible" />
      <LogoutModal v-show="logoutUserModalVisible" />
    </section>
  </div>
</template>

<style scoped>

</style>