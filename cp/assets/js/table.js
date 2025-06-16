const socket = io('https://api.aif.uz')
const token = localStorage.getItem('token')
const tablesBox = document.querySelector('.table-box')
const createForm = document.getElementById('create-form')
const updateForm = document.getElementById('update-form')
let progressLoader = document.querySelector(".progress-loader");

document.querySelector(".progress-loader").classList.add("active");
socket.emit('get-tables', { token })
socket.on('tables', ({ tables, error }) => {
    if (error) {
        document.querySelector(".progress-loader").classList.remove("active");
        alert('Failed to get meals: ' + (error.message || error))
        return;
    }
    tablesBox.innerHTML = '';
    tables.forEach(el => {
        const tableItem = document.createElement("div");

        tableItem.className = "table";

        tableItem.innerHTML = `
            <h3>${el.number}</h3> 
            <div>
                <button class="update-btn" onclick="openUpdateModal('${el.id}', '${el.number}')">Tahrirlash</button>
                <button class="delete-btn" onclick="openDeletePopup('${el.id}', '${el.number}')">O'chirish</button>
            </div>
        `;

        tablesBox.appendChild(tableItem)
        document.querySelector(".progress-loader").classList.remove("active");

    })
})


// Open and close functions for create form modal.
function openCreateModal() {
    document.getElementById('tables').style.display = 'none';
    document.getElementById('create').style.display = 'block';
}
function closeCreateModal() {
    createForm.reset();
    document.getElementById('create').style.display = 'none';
    document.getElementById('tables').style.display = 'block';
}

// Open and close functions for update form modal.
function openUpdateModal(id, number) {
    document.getElementById('updating-table-data-id').dataset.id = id;
    document.getElementById('number-in-update').value = number;
    document.getElementById('tables').style.display = 'none';
    document.getElementById('update').style.display = 'block';
}
function closeUpdateModal() {
    document.getElementById('updating-table-data-id').removeAttribute('data-id')
    updateForm.reset();
    document.getElementById('update').style.display = 'none';
    document.getElementById('tables').style.display = 'block';
}

// Open and close functions for delete popup.
function openDeletePopup(id, number) {
    document.querySelector('.del-popup').classList.add("active")
    document.querySelector('.del-popup-background').classList.add("active")
    document.querySelector('.del-popup').dataset.id = id
    document.querySelector('.del-popup').innerHTML = `
        <div class="del-title">
            <h3>Stol o'chirilsinmi?</h3>
        </div>
        <div class="del-name">
            <p>${number}</p>
        </div>
        <div class="del-actions">
            <button class="cancel-btn" onclick="closeDeletePopup()">Bekor qilish</button>
            <button class="delete-btn" onclick="deleteTable()">O'chirish</button>
        </div>
    `;
}

function closeDeletePopup() {
    document.querySelector('.del-popup').classList.remove("active");
    document.querySelector('.del-popup-background').classList.remove("active");
    document.querySelector('.del-popup').removeAttribute('data-id')
    document.querySelector('.del-popup').innerHTML = '';
}


// Create category fetch function.
createForm.addEventListener('submit', async e => {
    e.preventDefault();
    try {
        progressLoader.classList.add("active")
        const params = { number: document.getElementById('number-in-create').value }
        const response = await fetch('https://api.aif.uz/table', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        const res = await response.json();
        if (res.status !== 'success') {
            alert('Failed : ' + res.message)
        } else {
            closeCreateModal();
            socket.emit('get-tables', { token });
        }
    } catch (error) {
        console.error(error)
    } finally {
        progressLoader.classList.remove("active");
    }
})

// Update category fetch function.
updateForm.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('updating-table-data-id').dataset.id
    const formData = { number: document.getElementById('number-in-update').value }
    try {
        progressLoader.classList.add("active");
        const response = await fetch(`https://api.aif.uz/table/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const res = await response.json()
        if (!response.ok) {
            alert('Failed to update category: ' + res.message || 'Unknown error!')
        }
        closeUpdateModal()
        socket.emit('get-tables', { token })
    } catch (error) {
        alert('Error: ' + error || 'Unknown error')
    } finally {
        progressLoader.classList.remove("active")
    }
})

// Delete category fetch function.
async function deleteTable() {
    const id = document.querySelector('.del-popup').dataset.id
    try {
        document.querySelector(".progress-loader").classList.add("active");
        const response = await fetch(`https://api.aif.uz/table/${id}`, {
            method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
        })
        const res = await response.json()
        if (res.status !== 'success') { alert(res.message) }
        closeDeletePopup();
        document.querySelector('.del-popup').removeAttribute('data-id');
        socket.emit('get-tables', { token });
    } catch (error) {
        console.error(error)
    } finally {
        document.querySelector(".progress-loader").classList.remove("active");
    }
}