import { ref } from "vue";

interface User {
    id: string
    name: string
    email: string
    password: string
    dateCreatedAccount: string,
    refreshTokens: object,
    habitsCountId: string,
}
const users = ref<User[]>([])
const user = ref<User>({} as User);

const deleteUserMessage = ref<string>('')
const logoutUserMessage = ref<string>('')

export const useUserStore = () => {
    return{
        users,
        user,
        deleteUserMessage,
        logoutUserMessage,
    }
}