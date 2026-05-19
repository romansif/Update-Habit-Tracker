import {ref} from "vue";

const users = ref([]);
const user = ref({});

const deleteUserMessage = ref('')
const logoutUserMessage = ref('')

export const useUserStore = () => {
    return{
        users,
        user,
        deleteUserMessage,
        logoutUserMessage,
    }
}