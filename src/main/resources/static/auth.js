const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
}

if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const submitButton = document.getElementById("submitBtn");
    const submitLabel = document.getElementById("submitLabel");

    submitButton.disabled = true;
    submitLabel.textContent = "Logging in...";

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error("Incorrect email or password");
        }

        const authResponse = await response.json();

        localStorage.setItem("token", authResponse.token);
        window.location.href = "chat.html";

    } catch (error) {
        alert(error.message);
    } finally {
        submitButton.disabled = false;
        submitLabel.textContent = "Log in";
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById("register-username").value.trim();
    const tag = document.getElementById("register-tag").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const submitButton = document.getElementById("submitBtn");
    const submitLabel = document.getElementById("submitLabel");

    submitButton.disabled = true;
    submitLabel.textContent = "Creating account...";

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                tag: tag
            })
        });

        if (!response.ok) {
            throw new Error("Could not create account");
        }

        const authResponse = await response.json();

        localStorage.setItem("token", authResponse.token);
        window.location.href = "chat.html";

    } catch (error) {
        alert(error.message);
    } finally {
        submitButton.disabled = false;
        submitLabel.textContent = "Create Account";
    }
}