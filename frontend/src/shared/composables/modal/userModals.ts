import { useUserStore } from "../store/userStore";
import { useModalsStore } from "../store/modalsStore";

export const useUserModals = () => {
    const userStore = useUserStore();
    const modalsStore = useModalsStore();

    const openLogoutUser = (message: string) => {
        userStore.logoutUserMessage.value = message;
        modalsStore.logoutUserVisible.value = true;
    }
    const closeLogoutUser = () => {
        modalsStore.logoutUserVisible.value = false;
    }

    const openDeleteUser = (message: string) => {
        userStore.deleteUserMessage.value = message;
        modalsStore.deleteUserVisible.value = true;
    }
    const closeDeleteUser = () => {
        modalsStore.deleteUserVisible.value = false;
    }

    return {
        openLogoutUser,
        openDeleteUser,

        closeLogoutUser,
        closeDeleteUser,
    }
}