const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

async function loadChats() {
    try {
        const response = await fetch("/api/chats", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Could not load chats");
        }

        const chats = await response.json();

        console.log(chats);

    } catch (error) {
        console.error(error);
    }
}

loadChats();