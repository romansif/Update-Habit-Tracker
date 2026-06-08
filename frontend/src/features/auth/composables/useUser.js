import { useRouter } from "vue-router";
import { handler } from '../../../shared/api/http.js';
import { useUserStore } from '../../../shared/composables/store/userStore';
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";

import { useForms } from "../../../shared/composables/forms/useForms.js";
import { useClearForms } from "../../../shared/composables/forms/clearForms.js";
import { useUserModals } from "../../../shared/composables/modal/useModals.js";

export const useUser = () => {
    const router = useRouter();
    const modals = useUserModals();

    const { users, user } = useUserStore();
    const { habitsCountForm } = useHabitsStore();

    const { clearRegisterForm, clearLoginForm } = useClearForms();
    const { registerForm, loginForm, updateForm, userErrors } = useForms();

    const resetErrors = () => {
        userErrors.value.emailMessage = '';
        userErrors.value.passwordMessage = '';
        userErrors.value.nameMessage = '';
    };

    const registerUser = async () => {
        resetErrors();
        try{
            const now = new Date();

            const dateCreatedAccount = now.toLocaleDateString();

            const newHabitsCount = await handler('/habits-count', {
                method: 'POST',
                body: JSON.stringify({
                    allHabits: habitsCountForm?.allHabits,
                    dayCompletedHabits: habitsCountForm?.dayCompletedHabits,
                    allCompletedHabits: habitsCountForm?.allCompletedHabits,
                })
            })

            const authData = await handler('/users/register', {
                method: 'POST',
                body: JSON.stringify({
                    name: registerForm.value.name,
                    email: registerForm.value.email,
                    password: registerForm.value.password,
                    dateCreatedAccount: dateCreatedAccount,
                    habitsCountId: newHabitsCount.id
                })
            });
            if(authData.accessToken) {
                localStorage.setItem("accessToken", authData.accessToken);
            }

            users.value = authData;

            localStorage.setItem('userId', authData.id);
            localStorage.setItem('habitsCountId', newHabitsCount.id);

            clearRegisterForm();
            router.push({ path: 'profile' });
        }catch(err){
           const errors = err.response.data.error;
           if(errors){
               userErrors.value.emailMessage = errors.email || '1';
               userErrors.value.passwordMessage = errors.password || '2';
               userErrors.value.nameMessage = errors.name || '3';
           }
           console.log(err.response?.data);
        }
    };

    const loginUser = async () => {
        resetErrors()
        try{
            const foundUser = await handler(`/users/login`, {
                method: 'POST',
                body: JSON.stringify({
                    email: loginForm.value.email,
                    password: loginForm.value.password,
                })
            });
            if(!foundUser || !foundUser.id){
                userErrors.value.emailMessage = 'Неверный email или пароль';
                return;
            }else{
                localStorage.setItem('userId', foundUser.id);
                localStorage.setItem("accessToken", foundUser.accessToken);
                localStorage.setItem('habitsCountId', foundUser.habitsCountId);
            }

            user.value = foundUser;

            clearLoginForm();
            router.push({ path: 'profile' });
        }catch(err){
            const errors = err.response?.data.error;
            if(errors){
                userErrors.value.emailMessage = errors.email || '';
                userErrors.value.passwordMessage = errors.password || '';
            }
            console.log(err.response?.data);
        }
    }

    const updateUser = async () => {
        const userId = localStorage.getItem('userId');

        try{
            const updatedUser = await handler(`/users/${userId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    name: updateForm.value.name,
                })
            });
            user.value = updatedUser;

            updateForm.value.name = '';
        }catch(err){
            console.log('Не удалось авторизовать пользователя');
            throw err;
        }
    }

    const logoutUser = async () => {
        try{
            await handler(`/users/logout`, {
                method: 'POST',
            })

            user.value = null;

            localStorage.removeItem('userId');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userRecordId');
            localStorage.removeItem('habitsCountId');

            modals.closeLogoutUser();
            router.push({ name: 'login' });
        }catch(err){
            console.log('Не удалось выйти из аккаунта');
            throw err;
        }
    }

    const deleteUserData = async () => {
        const userId = localStorage.getItem('userId');
        const habitsCountId = localStorage.getItem('habitsCountId');

        const allRecords = await handler(`/records?habitsCountId=${habitsCountId}`, {
            method: 'GET'
        });
        for(let record of allRecords){
            await handler(`/records/${record.id}`, {
                method: 'DELETE',
            })
        }

        const allHabits = await handler(`/habits?userId=${userId}`, {
            method: 'GET'
        });
        for(let habit of allHabits){
            await handler(`/habits/${habit.id}`, {
                method: 'DELETE',
            })
        }

        await handler(`/habits-count/${habitsCountId}`, {
            method: 'DELETE'
        });

        await handler(`/users/${userId}`, {
            method: 'DELETE'
        });
    }

    const deleteUser = async () => {
        try{
            await deleteUserData()

            localStorage.removeItem('userId');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userRecordId');
            localStorage.removeItem('habitsCountId');

            modals.closeDeleteUser();

            router.push({ name: 'login' });
        }catch(err){
            console.log('Ошибка при удалении данный пользователя');
            throw err;
        }
    }


    return{
        registerUser,
        loginUser,
        logoutUser,
        updateUser,
        deleteUser,
    }
}