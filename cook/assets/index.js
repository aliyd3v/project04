const apiUrl = 'https://api.aif.uz';

// (async () => {
//     const token = localStorage.getItem('token')
//     if (!token) {
//         return window.location.href = 'https://aif.uz'
//     } else {
//         const response = await fetch(`${apiUrl}/check-token`, {
//             method: 'get',
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         })
//         const res = await response.json()
//         if (!response.ok) {
//             alert('fatal error')
//         } else {
//             if (res.status != 'success') {
//                 localStorage.removeItem('token')
//                 return window.location.href = 'https://aif.uz'
//             }
//         }
//     }
// })()

const socket = io(apiUrl)
const token = localStorage.getItem('token');



let Orders = []
let orderTimesArr = []
const ordersDiv = document.getElementById('orders-container')
const verifyPreparedPopupBg = document.querySelector('.verify-prepared-bg')
const verifyPreparedPopup = document.querySelector('.verify-prepared')
const selectedMeal = document.querySelector('.meal-info')
const verifyMealInfo = document.getElementById('verify-meal-info')

function getOrders() {
    socket.emit('get-orders', { token })
}

socket.on('new-order', ({ order, order_items, error }) => {
    let haveNotReadyProduct = order_items.some(i => !i.meal.is_ready_product)
    if (haveNotReadyProduct) {
        getOrders()
        newOrderAudioPlay()
    }
})

socket.on('orders', ({ orders }) => {
    Orders = orders
    renderOrders(Orders)
})

socket.on('prepared', ({ ok, table, error }) => {
    if (ok) {
        getOrders()
    } else {
        alert((error || 'Fatal error!'))
    }
})

// Render orders function.
function renderOrders(Orders) {
    ordersDiv.innerHTML = ''
    Orders.forEach(order => {
        if (order.status === 'Pending') {
            let div = document.createElement('div')
            div.classList.add('order')
            div.innerHTML = `
            <div class="table">
                <h3>${order.table.number} - Stol</h3>
                <h4 id="order-${order.id}"></h4>
            </div>`
            let products = document.createElement('div')
            products.classList.add('products')
            let havePendingProduct = false
            order.order_items.forEach(meal => {
                if (
                    meal.status == 'Pending' && !meal.meal.is_ready_product ||
                    meal.status == 'Prepared' && !meal.meal.is_ready_product
                ) {
                    if (meal.status == 'Pending') {
                        if (havePendingProduct != true) {
                            havePendingProduct = true
                        }
                    }
                    products.innerHTML += `
                    <div class="product ${meal.status == 'Prepared' ? 'product-prepared' : ''}" ${meal.status != 'Prepared' ? `onclick = "openPreparedVerify(${meal.id}, '${meal.meal.name}', '${meal.meal.image_url}', ${meal.quantity})"` : ''}>
                        <div class="order-img">
                            <img src="${meal.meal.image_url}" alt="${meal.meal.name}">
                        </div>
                        <div class="order-name">
                            <h3>${meal.meal.name}</h3>
                        </div>
                        <div class="order-quantity">
                            <p>x${meal.quantity}</p>
                        </div>
                    </div>`
                }
            })
            let orderActionsBox = document.createElement("div");
            orderActionsBox.className = "order-actions-box actions-box";
            orderActionsBox.innerHTML = `
                <button class="accept-order-button button button-green">Buyurtmani qabul qilish</button>
            `;
            if (havePendingProduct == true) {
                div.appendChild(products);
                div.appendChild(orderActionsBox);
                ordersDiv.appendChild(div)
                orderTimesArr.push({
                    element: document.getElementById(`order-${order.id}`),
                    created_at: new Date(order.created_at)
                })
            }
        }
    });
    timeShower()
}

// Show the difference from now with created_at.

function timeShower() {
    const now = new Date()
    for (const i of orderTimesArr) {
        const difference = Math.floor((now - i.created_at) / 1000)
        const hours = Math.floor(difference / 3600)
        const minutes = Math.floor((difference % 3600) / 60)
        const seconds = difference % 60
        i.element.innerHTML = `${hours ? `${hours}:` : ''}${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds} <span>dan beri</span>`
    }
    requestAnimationFrame(timeShower)
}

// Open verify prepared page function.


function openPreparedVerify(id, name, image_url, quantity) {
    verifyMealInfo.dataset.order_item = id;
    verifyPreparedPopupBg.classList.add("active");
    verifyPreparedPopup.classList.add("active");
    verifyMealInfo.innerHTML = `
        <div class="meal-info-img">
            <img src="${image_url}" alt="${name}"></div>
        <div>
            <p>Miqdori: ${quantity}x</p>
        </div>
        <div>
            <p>Nomi: ${name}</p>
        </div>
    `
    verifyPreparedPopup.classList.add("active");
}

// Close verify prepared page.
function closePreparedVerify() {
    verifyPreparedPopupBg.classList.remove('active');
    verifyPreparedPopup.classList.remove('active');
    verifyMealInfo.removeAttribute('data-order_item')
    verifyMealInfo.innerHTML = '';
}

// Verify prepared.
function verifyPrepared() {
    const id = verifyMealInfo.dataset.order_item
    productPrepared(id)
}

// Prepared request to server.
function productPrepared(id) {
    socket.emit('order-item-prepared', { token, order_item_id: id })
    closePreparedVerify()
}

// Audio notification.
function newOrderAudioPlay() {
    new Audio('../audio/notification.mp3').play()
    setTimeout(() => {
        new Audio('./audio/новый_заказ.mp3').play()
    }, 1500)
}

// function notifyMe() {
//     if (!("Notification" in window)) {
//         alert("This browser does not support Desktop notifications");
//     }
//     if (Notification.permission === "granted") {
//         callNotify(title, msg, icon);
//         return;
//     }
//     if (Notification.permission !== "denied") {
//         Notification.requestPermission((permission) => {
//             if (permission === "granted") {
//                 callNotify(title, msg, icon);
//             }
//         });
//         return;
//     }
// }

// function callNotify(title, msg, icone) {
//     new Notification(title, { body: msg, icon: icone });
//     new Audio(song).play();
// }


document.addEventListener("DOMContentLoaded", getOrders);