const BASE_URL = `http://localhost:3000/api`;

export const handler = async (endpoints, options) => {
    options.credentials = 'include'

    const res = await fetch(`${BASE_URL}${endpoints}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        credentials: 'include',
        ...options
    })

    if(res.status === 401){
        localStorage.removeItem('userId')
        localStorage.removeItem('accessToken')
        try{
            const refreshRes = await fetch(`${BASE_URL}/refresh`, {
                method: 'POST',
                credentials: 'include'
            })
            if(refreshRes.ok){
                await fetch(`${BASE_URL}${endpoints}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    ...options
                })
            }else {
                localStorage.removeItem('userId')
                localStorage.removeItem('accessToken')

                throw new Error('Сессия истекла, авторизуйтесь заново');
            }
        }catch(err){
            console.log('Не удалось востановить ссесию');
            throw err;
        }
    }

    if(!res.ok){
        const errorData = await res.json().catch(() => ({}));

        const error = new Error(errorData.message || `Ошибка: ${res.status}`);
        error.response = { data: errorData };

        throw error;
    }
    if(res.status === 204 || (res.status === 200 && options.method === 'DELETE')){
        return null;
    }

    return res.json();
}