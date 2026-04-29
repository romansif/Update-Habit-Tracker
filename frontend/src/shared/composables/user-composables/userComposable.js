import bcrypt from 'bcryptjs';
import { ref } from 'vue';
import { handler } from '../../api/http.js';
import { useRouter } from "vue-router";

const users = ref([]);
const user = ref(null);

const registerForm = ref({
    name: '',
    email: '',
    password: '',
})

const loginForm = ref({
        email: '',
        password: '',
})

const updateForm = ref({
        name: ''
})

const recordsCounters = ref({
        allHabitsCounter: 0,
        completedHabitsCounter: 0,
        inProgressHabitsCounter: 0,
        incompletedHabitsCounter: 0,
})

const userErrors = ref({
    nameError: false,
    emailError: false,
    passwordError: false,
    newNameError: false,

    nameMessage: '',
    emailMessage: '',
    passwordMessage: '',
    newNameMessage: '',
})

const delUserMessage = ref('')
const logoutUserMessage = ref('')

const deleteUserModalVisible = ref(false);
const logoutUserModalVisible = ref(false);

export const useUser = () => {
    const router = useRouter();

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const registerUser = async () => {
        userErrors.value.nameError = !registerForm.value.name
        userErrors.value.emailError = !isValidEmail(registerForm.value.email)
        userErrors.value.passwordError = !registerForm.value.password

        userErrors.value.nameMessage = userErrors.value.nameError ? 'Поле имени пользоватея обязательно должно быть заполненно' : ''
        userErrors.value.emailMessage = userErrors.value.emailError ? 'Поле почты обязательно должно быть заполненно' : ''
        userErrors.value.passwordMessage = userErrors.value.passwordError ? 'Поле пароля обязательно должно быть заполненно' : ''

        if(!registerForm.value.name || !registerForm.value.email || !registerForm.value.password) {
            return;
        }

        try{
            const hashedPassword = await bcrypt.hash(registerForm.value.password, 10)

            const newUser = await handler('/users', {
                method: 'POST',
                body: JSON.stringify({
                    name: registerForm.value.name,
                    email: registerForm.value.email,
                    password: hashedPassword,
                })
            });

            const newRecords = await handler('/records-user', {
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
        userErrors.value.emailError = !isValidEmail(loginForm.value.email)
        userErrors.value.passwordError = !loginForm.value.password

        userErrors.value.emailMessage = userErrors.value.emailError ? 'Поле почты обязательно должно быть заполненно' : ''
        userErrors.value.passwordMessage = userErrors.value.passwordError ? 'Поле пароля обязательно должно быть заполненно' : ''

        if(!loginForm.value.email || !loginForm.value.password){
            return;
        }

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


            const allRecords = await handler(`/records-user-calendar?userRecordsId=${userRecordsId}`, {
                method: 'GET'
            })

            await Promise.all(
                allRecords.map(record =>
                    handler(`/records-user-calendar/${record.id}`, {
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

    return {
        registerForm,
        loginForm,
        userErrors,

        user,
        updateForm,

        delUserMessage,
        logoutUserMessage,
        deleteUserModalVisible,
        logoutUserModalVisible,

        registerUser,
        loginUser,

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