export const login = (rq, onSuccess, onError) => {
    const { email, password } = rq;
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ email, password }),
    })
        .then(async (res) => {
            const text = await res.text();
            let data = {};
            try {
                const parsed = JSON.parse(text);
                if (typeof parsed === "string") {
                    data = { token: parsed };
                } else if (typeof parsed === "object" && parsed !== null) {
                    data = parsed;
                }
            } catch {
                if (text) data = { token: text };
            }
            onSuccess({ ...data, ok: res.ok, status: res.status });
        })
        .catch(onError);
};

export const register = (rq, onSuccess, onError) => {
    const { name, email, password } = rq;
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    })
        .then(async (res) => {
            const data = await res.json();
            onSuccess({ ...data, ok: res.ok, status: res.status });
        })
        .catch(onError);
};
