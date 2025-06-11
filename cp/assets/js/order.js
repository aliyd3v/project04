// import { receiptLogo } from "../icons/myCafe-dark.png"
const url = 'https://api.aif.uz'
const socket = io(url)
const token = localStorage.getItem('token')

const ordersDiv = document.getElementById('orders-container')
let Orders = []
let orderTimesArr = []
const delPopup = document.querySelector('.del-popup');
const delPopupBackground = document.querySelector('.del-popup-background');
const closeDelPopup = document.getElementById('close-del-btn')
const deleteOrderBtn = document.getElementById('order-del-btn')


function getOrders() {
    socket.emit('get-orders', { token })
}

socket.on('new-order', ({ order }) => {
    getOrders()
})

socket.on('prepared', ({ ok, table, error }) => {
    if (ok) {
        getOrders()
    }
})

socket.on('delivered', ({ ok, table, error }) => {
    if (ok) {
        getOrders()
    }
})

socket.on('orders', ({ orders }) => {
    Orders = orders
    renderOrders(Orders)
})

document.querySelector(".progress-loader").classList.add("active");

function renderOrders(Orders) {
    ordersDiv.innerHTML = ''
    Orders.forEach(order => {
        const div = document.createElement('div')
        div.classList.add('order')
        div.innerHTML = `

        <div class="table">
            <div class="table-header">
                <h2>MY CAFE</h2>
                <p>Mehmonimiz bo‘lganingiz uchun tashakkur!</p>
            </div>
            <div class="order-number">
                ID #2546453
            </div>
            <div class="table-number">
                Table ${order.table.number}
            </div>
            <div class="order-timer">
                <p id="order-${order.id}"></p>
                <p>dan beri</p>
            </div>
        </div>`
        let totalPrice = 0;
        const products = document.createElement('div')
        products.classList.add('products')
        order.order_items.forEach(meal => {
            let orderItemStatus
            let color
            if (meal.status == 'Pending' && !meal.meal.is_ready_product) {
                orderItemStatus = 'fa-cauldron'
                color = 'yellow'
            } else if (meal.status == 'Pending' && meal.meal.is_ready_product) {
                orderItemStatus = 'fa-person-running-fast'
                color = 'blue'
            } else if (meal.status == 'Prepared') {
                orderItemStatus = 'fa-person-running-fast'
                color = 'blue'
            } else if (meal.status == 'Delivered') {
                orderItemStatus = 'fa-check-circle'
                color = 'green'
            }
            products.innerHTML += `
                <div class="meals-list">
                
                <div class="meal-name">
                    <i class="fa-regular ${orderItemStatus} ${color}"></i>
                    ${meal.meal.name}
                </div>
                <div class="meal-quantity">x${meal.quantity} </div>
                </div>
            `
            totalPrice += meal.quantity * meal.meal.price
        })
        const totalPriceDiv = document.createElement('div');
        totalPriceDiv.classList.add('total-price-div');
        totalPriceDiv.innerHTML = `
            <div class="price-tag">
                Jami:
                <span>${totalPrice} so'm</span>
            </div>
            <div class="button-box">

                <button class="details-btn">
                    <i class="fa-regular fa-list"></i>
                </button>

                <button class="del-btn" onclick="openDelPopup(${order.id})">
                    <i class="fa-regular fa-hand"></i>
                </button>

                <button class="done-btn">
                    <i class="fa-regular fa-badge-check"></i>
                </button>

            </div>
        `

        products.appendChild(totalPriceDiv)
        div.appendChild(products)
        ordersDiv.appendChild(div)
        orderTimesArr.push({
            element: document.getElementById(`order-${order.id}`),
            created_at: new Date(order.created_at)
        })
    });
    timeShower()
    document.querySelector(".progress-loader").classList.remove("active");
}


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

// Open del pop-up.
function openDelPopup(id) {
    delPopup.dataset.id = id
    delPopup.classList.add("active");
    delPopupBackground.classList.add("active");
}

// Close del pop-up.
closeDelPopup.addEventListener('click', (event) => {
    event.preventDefault();

    delPopup.classList.remove("active")
    delPopupBackground.classList.remove("active")
    delPopup.removeAttribute('data-id')
})

// Del order button onclick function.
deleteOrderBtn.addEventListener('click', e => {
    e.preventDefault();
    const id = delPopup.dataset.id
    delOrder(id)
})

// Del order function.
function delOrder(id) {
    document.querySelector(".progress-loader").classList.add("active")
    fetch(`${url}/order/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(res => {
            delPopup.classList.add('hidden')
            delPopup.removeAttribute('data-id')
            if (res.status != 'success') {
                console.error('Error on delete order: ' + (res.message || 'unknown error'))
            }
            socket.emit('update-orders', { token })
        })
        .catch(err => {
            console.error('Fatal error: ' + (err.message || 'unknown error'))
        }).finally(
            delPopup.classList.remove("active"),
            delPopupBackground.classList.remove("active"),
            delPopup.removeAttribute('data-id'),
            document.querySelector(".progress-loader").classList.remove("active"),
        )
}



document.addEventListener("DOMContentLoaded", getOrders);