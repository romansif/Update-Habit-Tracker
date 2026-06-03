const BASE_URL = `http://localhost:3000`;

export const handler = async (endpoints, options) => {
    const res = await fetch(`${BASE_URL}${endpoints}`, {
        headers: {
            "Content-Type": "application/json",
        },
        ...options
    })

    if(!res.ok){
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Ошибка: ${res.status}`);
    }

    if(res.status === 204 || (res.status === 200 && options.method === 'DELETE')){
        return null;
    }

    return res.json();
}