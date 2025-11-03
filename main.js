var db = new PouchDB('my_database');

const inputName = document.getElementById('nombre');
const inputFecha = document.getElementById('fecha');
const btnAdd = document.getElementById('btnAdd');
const btnList = document.getElementById('btnList');
const modalOverlay = document.querySelector('.modal-overlay');
const modal = document.querySelector('fieldset');
const btnOpenModal = document.getElementById('btnOpenModal');
const taskList = document.querySelector('.task-list');

btnOpenModal.addEventListener('click', () => {
    modal.classList.add('active');
    modalOverlay.classList.add('active');
});

modalOverlay.addEventListener('click', () => {
    modal.classList.remove('active');
    modalOverlay.classList.remove('active');
});

if('serviceWorker' in navigator){
    window.addEventListener('load', () =>{
        navigator.serviceWorker.register('./sw.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    })
}

btnAdd.addEventListener('click', (event) => {
    event.preventDefault();
    const nombre = inputName.value;
    const fecha = inputFecha.value;
    const tarea = {
        _id : new Date().toISOString(),
        nombre: nombre,
        fecha: fecha,
        estatus: true
    }
    db.put(tarea)
    .then((result)=>{
        console.log('Tarea agregada', result);
        inputName.value = '';
        inputFecha.value = '';
        modal.classList.remove('active');
        modalOverlay.classList.remove('active');
    })
    .catch((error)=>{
        console.log('Error al agregar tarea', error);
    })
    .finally(() => {
        renderTasks();
    })
}); 

btnList.addEventListener('click', (event) => {
    event.preventDefault();
    renderTasks();
});


function renderTasks() {
    db.allDocs(
        { 
            include_docs: true
        }
    )
    .then((result) => {
        taskList.innerHTML = '';
        result.rows.forEach(row => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-card');
            const taskContent = document.createElement('p');
            taskContent.textContent = `Tarea: ${row.doc.nombre}, Fecha: ${row.doc.fecha}`;
            const doneButton = document.createElement('button');
            doneButton.textContent = 'Hecho';
            doneButton.addEventListener('click', () => {
                row.doc.estatus = false;
                db.put(row.doc)
                    .then(() => {
                        console.log(`Tarea ${row.doc.nombre} marcada como completada`);
                        taskItem.remove(); 
                    }
                    )
                    .catch((error) => {
                        console.log('Error al marcar la tarea como completada', error);
                    });     
            });
            taskItem.appendChild(taskContent);
            taskItem.appendChild(doneButton);
            taskList.appendChild(taskItem);
        });
    })
    .catch((error) => {
        console.log('Error al listar tareas', error);
    });
}
