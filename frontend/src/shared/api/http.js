import router from '../../app/router/index.js'

const BASE_URL = `http://localhost:3000/api`;

export const handler = async (endpoints, options) => {
    options.credentials = 'include'

    const res = await fetch(`${BASE_URL}${endpoints}`, {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        ...options
    })

    if(res.status === 401){
        localStorage.removeItem('userId')
        location.removeItem('accessToken')
        try{
            const refreshRes = await fetch(`${BASE_URL}/refresh`, {
                method: 'POST',
                credentials: 'include'
            })
            if(refreshRes.ok){
                await fetch(`${BASE_URL}${endpoints}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    ...options
                })
            }else {
                await router.push({ name: 'login'})
                throw new Error('Сессия истекла, авторизуйтесь заново');
            }
        }catch(err){
            console.log('Не удалось востановить ссесию');
            throw err;
        }
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Ошибка: ${res.status}`);
    }

    if(!res.ok){
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Ошибка: ${res.status}`);
    }

    if(res.status === 204 || (res.status === 200 && options.method === 'DELETE')){
        return null;
    }

    return res.json();
}