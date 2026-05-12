import { ref } from 'vue';
import { useRouter } from "vue-router";
import { handler } from '../../../shared/api/http.js';
import { useForms } from "../../../shared/composables/useForms.js";
import { useValidation } from "../../../shared/composables/useValidation.js";

import bcrypt from 'bcryptjs';

const users = ref([]);
const user = ref(null);


const updateForm = ref({
        name: ''
})

const recordsCounters = ref({
        allHabitsCounter: 0,
        completedHabitsCounter: 0,
        inProgressHabitsCounter: 0,
        incompletedHabitsCounter: 0,
})

const delUserMessage = ref('')
const logoutUserMessage = ref('')

const deleteUserModalVisible = ref(false);
const logoutUserModalVisible = ref(false);

export const useUser = () => {
    const { validateRegisterForm, validateLoginForm } = useValidation();
    const { registerForm, loginForm, userErrors } = useForms();

    const router = useRouter();

    const registerUser = async () => {
        const isValid = validateRegisterForm()

        if(!isValid) return

        try{
            const now = new Date();

            const dateCreatedAccount = now.toLocaleDateString()

            const hashedPassword = await bcrypt.hash(registerForm.value.password, 10)

            const newUser = await handler('/users', {
                method: 'POST',
                body: JSON.stringify({
                    name: registerForm.value.name,
                    email: registerForm.value.email,
                    password: hashedPassword,
                    dateCreatedAccount: dateCreatedAccount
                })
            });

            const newRecords = await handler('/current-records', {
                method: 'POST',
                body: JSON.stringify({
                    allHabitsCounter: recordsCounters.value.allHabitsCounter,
                    completedHabitsCounter: recordsCounters.value.completedHabitsCounter,
                    inProgressHabitsCounter: recordsCounters.value.inProgressHabitsCounter,
                    incompletedHabitsCounter: recordsCounters.value.incompletedHabitsCounter,
                })
            })

            users.value = newUser;

            localStorage.setItem('userId', newUser.id);
            localStorage.setItem('userRecordsId', newRecords.id);

            router.push({ path: 'profile' });
            clearRegisterForm();
        }catch(err){
            console.log(err);
        }
    };

    const loginUser = async () => {
        const isValid = validateLoginForm()

        if(!isValid) return

        try{
            const users = await handler(`/users?email=${loginForm.value.email}`, {
                method: 'GET'
            })

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
            })
            user.value = res;
        }catch(err){
            console.log(err);
        }
    }

    const updateUser = async () => {
        const userId = localStorage.getItem('userId');

        userErrors.value.newNameError = !updateForm.value.name

        userErrors.value.newNameMessage = userErrors.value.newNameError ? 'Поле для нового имени пользователя обязательно должно быть заполненно' : ''

        if(!updateForm.value.name){
            return;
        }

        try{
            const updatedUser = await handler(`/users/${userId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    name: updateForm.value.name,
                })
            })
            user.value = updatedUser;

            updateForm.value.name = '';
        }catch(err){
            console.log(err);
        }
    }

    const openLogoutUserModal = (message) => {
        logoutUserMessage.value = message;
        logoutUserModalVisible.value = true;
    }

    const logoutUser = async () => {
        try{
            localStorage.removeItem('userId');
            user.value = null;

            closeLogoutUserModal();

            router.push({ name: 'login' });
        }catch(err){
            console.log(err);
        }
    }

    const closeLogoutUserModal = () => {
        logoutUserMessage.value = '';

        logoutUserModalVisible.value = false;
    }

    const openDeleteUserModal = (message) => {
        delUserMessage.value = message;

        deleteUserModalVisible.value = true;
    }

    const deleteUser = async () => {
        const userId = localStorage.getItem('userId');
        const userRecordsId = localStorage.getItem('userRecordsId');

        try{
            const allHabits = await handler(`/habits?userId=${userId}`, {
                method: 'GET'
            })

            await Promise.all(
                allHabits.map(habit => {
                    handler(`/habits/${habit.id}`, {
                        method: 'DELETE',
                    })
                })
            )

            await handler(`/records-user/${userRecordsId}`, {
                method: 'DELETE'
            });
            localStorage.removeItem('userRecordsId');


            const allRecords = await handler(`/calendar-records?userRecordsId=${userRecordsId}`, {
                method: 'GET'
            })
            await Promise.all(
                allRecords.map(record =>
                    handler(`/calendar-records/${record.id}`, {
                        method: 'DELETE',
                    })
                )
            )

            await handler(`/users/${userId}`, {
                method: 'DELETE'
            });
            localStorage.removeItem('userId');

            closeDeleteUserModal();

            router.push({ name: 'login' });
        }catch(err){
            console.log(err);
        }
    }

    const closeDeleteUserModal = () => {
        delUserMessage.value = '';

        deleteUserModalVisible.value = false;
    }

    const clearRegisterForm = () => {
        registerForm.value.name = '';
        registerForm.value.email = '';
        registerForm.value.password = '';

        userErrors.value.nameError = false;
        userErrors.value.emailError = false;
        userErrors.value.passwordError = false;
    }

    const clearLoginForm = () => {
        loginForm.value.email = '';
        loginForm.value.password = '';

        userErrors.value.emailError = false;
        userErrors.value.passwordError = false;
    }

    return{
        user,
        updateForm,

        delUserMessage,
        logoutUserMessage,
        deleteUserModalVisible,
        logoutUserModalVisible,

        registerUser,
        loginUser,

        clearRegisterForm,
        clearLoginForm,

        openLogoutUserModal,
        logoutUser,
        closeLogoutUserModal,

        getUser,
        updateUser,

        openDeleteUserModal,
        deleteUser,
        closeDeleteUserModal,
    }
}