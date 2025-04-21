const form = document.getElementById('login_form');

// form.addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     const apiUrl = 'https://api.aif.uz/login';

//     const requestData = {
//         username: username,
//         password: password
//     };

//     try {
//         const response = await fetch(apiUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(requestData)
//         });

//         if (response.ok) {
//             const data = await response.json()
//             const role = data.data.user.role
//             if (role == 'Admin') {
//                 return window.location.href = `https://cp.aif.uz/identificate/index.html?token=${data.token}`
//             } else if (role == 'Cook') {
//                 return window.location.href = `https://cook.aif.uz/identificate/index.html?token=${data.token}`
//             } else if (role == 'Chef') {
//                 return window.location.href = `https://cook.aif.uz/identificate/index.html?token=${data.token}`
//             } else if (role == 'Waiter' || role == 'Waitress') {
//                 return window.location.href = `https://waiter.aif.uz/identificate/index.html?token=${data.token}`
//             }
//         } else {
//             alert('Login or password is wrong!');
//         }
//     } catch (error) {
//         console.log('Internal server error!');
//     }
// });

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const apiUrl = 'https://api.aif.uz/login';

    const requestData = {
        username: username,
        password: password
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            const data = await response.json()
            const role = data.user.role
            if (role == 'Admin') {
                return window.location.href = `https://cp.aif.uz/identificate/index.html?token=${data.token}`
            } else if (role == 'Cook') {
                return window.location.href = `https://cook.aif.uz/identificate/index.html?token=${data.token}`
            } else if (role == 'Chef') {
                return window.location.href = `https://cook.aif.uz/identificate/index.html?token=${data.token}`
            } else if (role == 'Waiter') {
                return window.location.href = `https://waiter.aif.uz/identificate/index.html?token=${data.token}`
            } else if (role == 'Waitress') {
                return window.location.href = `https://waiter.aif.uz/identificate/index.html?token=${data.token}`
            }
        } else {
            alert('Login or password is wrong!');
        }
    } catch (error) {
        console.log('Internal server error!');
    }
}