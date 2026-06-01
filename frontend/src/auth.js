
export const isAuthenticated = () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return false;

    try {
        const parts = jwt.split(".");
        if (parts.length !== 3) return false;

        const payload = JSON.parse(atob(parts[1]));

        if (!payload.sub) return false;

        return true;
    } catch (error) {
        console.error("Greska pri dekodiranju JWT tokena:", error);
        return false;
    }
};

export const getCurrentUser = () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return null;

    try {
        const parts = jwt.split(".");
        if (parts.length !== 3) return null;
        return JSON.parse(atob(parts[1]));
    } catch {
        return null;
    }
};

export const isAdmin = () => {
    const user = getCurrentUser();
    return user?.role === "ADMIN";
};

export const logout = (navigate) => {
    localStorage.removeItem("jwt");
    navigate("/login");
};
