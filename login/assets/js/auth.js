const form = document.getElementById('login_form');
let errorAlert = document.querySelector(".error-alert");
let errorAlertText = document.querySelector(".error-alert h3");

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    document.querySelector("#submit").disabled = true;

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const apiUrl = 'https://api.aif.uz/login';

    const requestData = {
        username: username,
        password: password
    };

    try {
        document.querySelector(".progress-loader").classList.add("active");
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            const data = await response.json()
            const role = data.data.user.role
            if (role == 'Admin') {
                return window.location.href = `https://cp.aif.uz/identificate/index.html?token=${data.token}`
            } else if (role == 'Cook') {
                return window.location.href = `https://cook.aif.uz/identificate/index.html?token=${data.token}`
            } else if (role == 'Chef') {
                return window.location.href = `https://cook.aif.uz/identificate/index.html?token=${data.token}`
            } else if (role == 'Waiter' || role == 'Waitress') {
                return window.location.href = `https://waiter.aif.uz/identificate/index.html?token=${data.token}`
            }
            
        } else {
            document.querySelector(".progress-loader").classList.remove("active");
            errorAlertText.textContent = "Login yoki parol noto'g'ri";
            errorAlert.classList.add("error");

            setTimeout(() => {
                errorAlert.classList.remove("error");
            }, 4000);

        }
    } catch (error) {
        document.querySelector(".progress-loader").classList.remove("active");
        errorAlertText.textContent = "Ichki server xatosi";
        errorAlert.classList.add("error");
        console.log('Internal server error!');

        setTimeout(() => {
            errorAlert.classList.remove("error");
        }, 4000);
    } finally {
        document.querySelector(".progress-loader").classList.remove("active");
        document.querySelector("#submit").disabled = false;
    }
});

function removeErrorAlert() {
    errorAlert.classList.remove("error");
}