<script setup>
import { onMounted, watch } from "vue";
import { useUser } from "../../auth/composables/userComposable.js";
import { useHabits } from "../../habits/composables/useHabits.js";
import { useForms } from "../../../shared/composables/forms/useForms.js";

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
    <section class="flex justify-center py-13">
      <div class="w-[850px]">
          <ProfileStatusCards />
        <div class="flex flex-col justify-center items-center mt-30">
          <div>
            <h1 class="text-xl">Текущее имя пользователя: {{ user?.name }}</h1>
            <input type="text" v-model="updateForm.name" @input="toLower" placeholder="Имя пользователя"
                   class="bg-white shadow-xl w-[600px] placeholder:text-sm outline-none rounded-[4px] p-5 mt-6">
          </div>
          <span v-if="userErrors.newNameError" class="text-sm text-red-500 mt-3">{{ userErrors?.newNameMessage }}</span>
        </div>
        <div class="flex justify-center mt-5">
            <BaseButton button-type="Применить" variant="confirmEditProfile" @click="updateUser" />
        </div>
      </div>
      <transition name="modal" >
        <CreateHabitModal v-show="createHabitModalVisible" />
      </transition>
      <transition name="modal" >
        <DeleteUserModal v-show="deleteUserModalVisible" />
      </transition>
      <transition name="modal" >
        <LogoutModal v-show="logoutUserModalVisible" />
      </transition>
    </section>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>