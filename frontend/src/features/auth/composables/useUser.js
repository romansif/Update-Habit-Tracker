import { useRouter } from "vue-router";

import { handler } from '../../../shared/api/http.js';

import { useUserStore } from '../../../shared/composables/store/userStore';
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";

import { useForms } from "../../../shared/composables/forms/useForms.js";
import { useValidation } from "../../../shared/composables/forms/useValidation.js";
import { useClearForms } from "../../../shared/composables/forms/clearForms.js";
import { useHabitModals } from "../../../shared/composables/modal/useModals.js";

import bcrypt from 'bcryptjs';

export const useUser = () => {
    const router = useRouter();
    const modals = useHabitModals();

    const { users, user } = useUserStore();
    const { habitsCountForm } = useHabitsStore();

    const { clearRegisterForm, clearLoginForm } = useClearForms();
    const { registerForm, loginForm, updateForm, userErrors } = useForms();

    const { validateRegisterForm, validateLoginForm, validateUpdateForm } = useValidation();

    const registerUser = async () => {
        const isValid = validateRegisterForm();

        if(!isValid) return;

        try{
            const now = new Date();

            const dateCreatedAccount = now.toLocaleDateString();

            const hashedPassword = await bcrypt.hash(registerForm.value.password, 10);

            const newUser = await handler('/users', {
                method: 'POST',
                body: JSON.stringify({
                    name: registerForm.value.name,
                    email: registerForm.value.email,
                    password: hashedPassword,
                    dateCreatedAccount: dateCreatedAccount
                })
            });

            const newHabitsCount = await handler('/habits-count', {
                method: 'POST',
                body: JSON.stringify({
                    allHabits: habitsCountForm?.allHabits,
                    dayCompletedHabits: habitsCountForm?.dayCompletedHabits,
                    allCompletedHabits: habitsCountForm?.allCompletedHabits,
                })
            })

            users.value = newUser;

            localStorage.setItem('userId', newUser.id);
            localStorage.setItem('habitsCountId', newHabitsCount.id);

            router.push({ path: 'profile' });
            clearRegisterForm();
        }catch(err){
            console.log(err);
        }
    };

    const loginUser = async () => {
        const isValid = validateLoginForm();

        if(!isValid) return;

        try{
            const users = await handler(`/users?email=${loginForm.value.email}`, {
                method: 'GET'
            });

            const foundUser = users[0];
            if(!foundUser){
                userErrors.value.emailMessage = 'Не удалось найти пользователя';
                return;
            }

            const passwordMatch = await bcrypt.compare(loginForm.value.password, foundUser.password);
            if(!passwordMatch){
                userErrors.value.passwordMessage = 'Не правильный пароль';
                return;
            }

            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            localStorage.setItem('userId', foundUser.id);

            user.value = foundUser;

            router.push({ path: 'profile' });
            clearLoginForm();
        }catch(err){
            console.log(err);
        }
    }

    const getUser = async () => {
        const userId = localStorage.getItem('userId');

        try{
            const res = await handler(`/users/${userId}`, {
                method: 'GET',
            });
            user.value = res;
        }catch(err){
            console.log(err);
        }
    }

    const updateUser = async () => {
        const userId = localStorage.getItem('userId');

        const isValid = validateUpdateForm();

        if(!isValid) return;

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
            console.log(err);
        }
    }

    const logoutUser = async () => {
        try{
            user.value = null;

            localStorage.removeItem('userId');
            localStorage.removeItem('currentUser');

            modals.closeLogoutUser();
            router.push({ name: 'login' });
        }catch(err){
            console.log(err);
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

            localStorage.removeItem('habitsCountId');

            localStorage.removeItem('userId');

            modals.closeDeleteUser();

            router.push({ name: 'login' });
        }catch(err){
            console.log(err);
        }
    }


    return{
        registerUser,
        loginUser,
        getUser,
        logoutUser,
        updateUser,
        deleteUser,
    }
}