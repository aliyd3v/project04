const domain = 'https://api.aif.uz'
const token = localStorage.getItem('token');

(async () => {
    if (!token) {
        window.location.href = 'https://aif.uz'
    } else {
        const response = await fetch(`${domain}/check-token`, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const res = await response.json()
        if (!response.ok) {
            alert('fatal error')
        } else {
            if (res.status != 'success') {
                localStorage.removeItem('token')
                window.location.href = 'https://aif.uz'
            }
        }
    }
})()

const socket = io(domain)

let Orders = []
let orderTimesArr = []
let ordersDiv = document.getElementById('orders-container')
let verifyDeliveredPopup = document.querySelector('.verify-delivered')
let verifyDeliveredPopupBg = document.querySelector('.verify-delivered-bg')
let selectedMeal = document.querySelector('.product-info')
let verifyMealInfo = document.getElementById('verify-product-info');
let progressLoader = document.querySelector(".progress-loader");

function getOrders() {
    progressLoader.classList.add("active")
    socket.emit('get-orders', { token })
}

socket.on('new-order', ({ order, order_items, error }) => {
    let haveReadyProduct = order_items.some(i => i.meal.is_ready_product)
    if (haveReadyProduct) {
        getOrders()
        newOrderAudioPlay(order.table.number)
    }
})

socket.on('orders', ({ orders }) => {
    Orders = orders
    renderOrders(Orders)
})

socket.on('prepared', ({ ok, table, error }) => {
    if (ok) {
        getOrders()
        if (table) {
            newOrderAudioPlay(table.number)
        }
    } else {
        alert((error || 'Fatal error!'))
    }
})

socket.on('delivered', ({ ok, table, error }) => {
    if (ok) {
        getOrders()
    } else {
        alert((error || 'Fatal error!'))
    }
})

// Render orders function.
function renderOrders(Orders) {
    ordersDiv.innerHTML = '';
    Orders.forEach(order => {
        if (order.status == 'Pending' || order.status == 'Prepared') {
            let div = document.createElement('div')
            div.classList.add('order')
            div.innerHTML = `
            <div class="table">
                <div class="table-number">${order.table.number}-stol</div>
                <div id="order-${order.id}" class="table-timer"></div>
            </div>`
            let products = document.createElement('div')
            products.classList.add('products')
            let haveProduct = false
            order.order_items.forEach(item => {
                if (
                    (item.status == 'Pending' && item.meal.is_ready_product) ||
                    item.status == 'Prepared' /* || item.status == 'Delivered' */
                ) {
                    if (haveProduct != true) {
                        haveProduct = true
                    }
                    let onclickFunction = '';
                    if (
                        item.meal.is_ready_product && item.status == 'Pending' ||
                        !item.meal.is_ready_product && item.status == 'Prepared'
                    ) {
                        onclickFunction = `onclick = "openDeliveredVerify(${item.id}, '${item.meal.name}', '${item.meal.image_url}', ${item.quantity})"`
                    }
                    products.innerHTML += `
                    <div class="product ${item.status == 'Delivered' ? 'product-delivered' : ''}" ${onclickFunction}>
                        <div class="product-img">
                            <img src="${item.meal.image_url || './images/no-image.png'}" alt="${item.meal.name}">
                        </div>
                        <h3 class="product-name">${item.meal.name}</h3>
                        <p class="product-quantity">${item.quantity}x</p>
                        <div class="product-status">
                            <div>
                                <span>${item.status}</span>
                            </div>
                        </div>
                    </div>`
                }
            })
            if (haveProduct) {
                div.appendChild(products)
                ordersDiv.appendChild(div)
                orderTimesArr.push({
                    element: document.getElementById(`order-${order.id}`),
                    created_at: new Date(order.created_at)
                })
            }
        }
    });
    timeShower()
    progressLoader.classList.remove("active")
}

// Show the difference from now with created_at.
function timeShower() {
    const now = new Date()
    for (const i of orderTimesArr) {
        const difference = Math.floor((now - i.created_at) / 1000)
        const hours = Math.floor(difference / 3600)
        const minutes = Math.floor((difference % 3600) / 60)
        const seconds = difference % 60
        i.element.innerHTML = `${hours ? `${hours}:` : ''}${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
    }
    requestAnimationFrame(timeShower)
}

// Open verify delivered page function.
function openDeliveredVerify(id, name, image_url, quantity) {
    verifyMealInfo.dataset.order_item = id
    verifyMealInfo.innerHTML = `
    <div class="product-info-img">
        <img src="${image_url}" alt="${name}">
    </div>
    <div class="product-info-text">
        <p>Taom: ${name}</p>
        <p>Miqdori: ${quantity}x</p>
    </div>`
    verifyDeliveredPopup.classList.add("active");
    verifyDeliveredPopupBg.classList.add("active");
}

// Close verify delivered page.
function closeDeliveredVerify() {
    verifyMealInfo.removeAttribute('data-order_item')
    verifyMealInfo.innerHTML = '';
    verifyDeliveredPopup.classList.remove("active")
    verifyDeliveredPopupBg.classList.remove("active")
}

// Verify delivered.
function verifyDelivered() {
    const id = verifyMealInfo.dataset.order_item
    productDelivered(id)
}

// Delivered request to server.
function productDelivered(id) {
    socket.emit('order-item-delivered', { token, order_item_id: id })
    closeDeliveredVerify()
}

// Audio notification.
function newOrderAudioPlay(number) {
    new Audio('./audio/notification.mp3').play()
    setTimeout(() => {
        new Audio('./audio/заказ_готова.mp3').play()
    }, 1000)
    setTimeout(() => {
        new Audio('./audio/stol.mp3').play()
    }, 2200)
    setTimeout(() => {
        new Audio(`./audio/number/${number}.mp3`).play()
    }, 2700)
}


document.addEventListener("DOMContentLoaded", getOrders);