import {handler} from "../../../shared/api/http.js";
import {useUserStore} from "../../../shared/composables/store/userStore.js";

const { user, users } = useUserStore()

export const useGetUsers = () => {
    const getUser = async () => {
        const userId = localStorage.getItem('userId');

        try{
            const res = await handler(`/users/${userId}`, {
                method: 'GET',
            });
            user.value = res;
        }catch(err){
            console.log('Ошибка при получении данных пользователя');
            throw err;
        }
    }

    const getUsers = async () => {
        try{
            users.value = await handler(`/users`, {
                method: 'GET'
            })
        }catch(err){
            console.log('Ошибка при получении всех пользователей');
            throw err;
        }
    }

    return{
        getUsers,
        getUser,
    }
}
