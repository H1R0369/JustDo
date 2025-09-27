import {gs} from './index-gsap.js';

const taskListEl = document.querySelector('.task-list');
const addTaskLinkEl = document.querySelector('.add-task-link');
const deleteIconLarge = document.querySelector('.delete-icon-large');
const taskArr = [];
const finishedTaskArr = [];

async function init() {
    await loadTasks();
    renderTasks();
    gs.attachPermanantAnimations();
};

async function renderTasks() {
    console.log(taskArr)

    let taskHtmls = '';
    taskArr.forEach(task => {
        taskHtmls += generateTaskHtml(task);
    });

    finishedTaskArr.forEach(task => {
        taskHtmls += generateFinishedTaskHtml(task);
    });

    taskListEl.innerHTML = taskHtmls;
    attachEventListeners();
};

async function loadTasks() {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    tasks.tasks.forEach(t => taskArr.push(t));
    tasks.finishedTasks.forEach(t => finishedTaskArr.push(t));
};

async function saveTasks() {
    try {
        await fetch('/save', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({tasks: taskArr, finishedTasks: finishedTaskArr})
        });

    } catch (err) {
        console.log("Error saving tasks:", err);
    }
};

function generateTaskHtml(task) {
    return `
        <li class="task-li" data-id="${task.id}">
            <img
                src="../assets/svg/tick-false.svg"
                class="tickbox gsap-pop"
                width="15px"
                data-id=${task.id}
                data-state="false"
                data-pop-scale="1.5"
            >
            <input 
                class="task-inp" 
                type="text" name="task" 
                placeholder="Untitled" 
                value="${task.text}"
                data-id="${task.id}"
                autocomplete="off"
            >
            <img 
                src="../assets/svg/trash-can.svg" 
                class="delete-icon-small gsap-pop"
                data-id="${task.id}"
                data-state="trash"
                data-pop-scale="1.3"
                width="13px" 
                alt="trash-can-delete-icon"
            >

            <button type="submit" hidden></button> 
        </li>  
    `;
};

function generateFinishedTaskHtml(task) {
    return `
        <li class="finished-task-li" data-id="${task.id}">
            <img
                src="../assets/svg/tick-true.svg"
                class="tickbox gsap-pop"
                width="10px"
                data-id="${task.id}"
                data-state="true"
                data-pop-scale="1.5"
            >
            ${task.text}
            <img 
                src="../assets/svg/trash-can.svg" 
                class="delete-icon-tiny gsap-pop" 
                width="10px" 
                data-id="${task.id}"
                data-state="trash"
                data-pop-scale="1.3"
                alt="trash-can-delete-icon"
            >
        </li>   
    `
}

function attachEventListeners() {
    const taskInpEls = Array.from(document.querySelectorAll('.task-inp'));
    const tickboxEls = document.querySelectorAll('.tickbox');
    const deleteIconSmall = document.querySelectorAll('.delete-icon-small');
    const deleteIconTiny = document.querySelectorAll('.delete-icon-tiny');
    
    taskInpEls.forEach((inp, idx) => {
        inp.addEventListener('change', () => {
            const taskIdx = taskArr.findIndex(t => t.id === inp.dataset.id);
            taskArr[taskIdx].text = inp.value;

            if (idx + 1 < taskInpEls.length && taskInpEls[idx+1].value === '') {
                taskInpEls[idx + 1].focus();
            } else {
                inp.blur();
                renderTasks();
            };

            saveTasks();
        })
    });

    tickboxEls.forEach(box => {
        gs.pop(box, box.dataset.popScale);
        box.addEventListener('click', () => {

            const taskIdx = taskArr.findIndex(t => t.id === box.dataset.id);
            const task = taskArr[taskIdx]

            if (task) {
                box.setAttribute('src', '../assets/svg/tick-true.svg');

                if (!(task.text === '')) {
                    const removedTaskArr = taskArr.splice(taskIdx, 1);
                    finishedTaskArr.unshift(removedTaskArr[0]);

                } else {
                    taskArr.splice(taskIdx, 1);
                };
                saveTasks();
                setTimeout(() => {
                    renderTasks();
                }, 200);

            } else {
                const taskIdx = finishedTaskArr.findIndex(t => t.id === box.dataset.id);
                const finishedTask = finishedTaskArr[taskIdx];
                box.setAttribute('src', '../assets/svg/tick-false.svg');

                const removedTaskArr = finishedTaskArr.splice(taskIdx, 1);
                taskArr.unshift(removedTaskArr[0]);

                saveTasks();
                setTimeout(() => {
                    renderTasks();
                }, 200);
            }
            box.setAttribute('data-state', box.dataset.state === 'false' ? 'true' : 'false');
        })
    });

    deleteIconSmall.forEach(icon => {
        gs.pop(icon, icon.dataset.popScale);
        icon.addEventListener('click', (e) => {

            if (icon.dataset.state === 'trash') {
                const taskIdx = taskArr.findIndex(t => t.id === icon.dataset.id);
                taskArr.splice(taskIdx, 1);
                saveTasks();
                setTimeout(() => {
                    renderTasks();
                }, 200);
            } else if (icon.dataset.state === 'false') {
                icon.setAttribute('src', '../assets/svg/checkbox-delete-true.svg');
                icon.setAttribute('data-state', 'true');
            } else {
                icon.setAttribute('src', '../assets/svg/checkbox-delete-false.svg');
                icon.setAttribute('data-state', 'false');
            }
        })     
    });

    deleteIconTiny.forEach(icon => {
        gs.pop(icon, icon.dataset.popScale)
        icon.addEventListener('click', () => {
            if (icon.dataset.state === 'trash') {
                const taskIdx = finishedTaskArr.findIndex(t => t.id === icon.dataset.id);
                finishedTaskArr.splice(taskIdx, 1);
                saveTasks();
                setTimeout(() => {
                    renderTasks();
                }, 200);
            } else if (icon.dataset.state === 'false') {
                icon.setAttribute('src', '../assets/svg/checkbox-delete-true.svg');
                icon.setAttribute('data-state', 'true');
            } else {
                icon.setAttribute('src', '../assets/svg/checkbox-delete-false.svg');
                icon.setAttribute('data-state', 'false');
            }
        })
    })
}

addTaskLinkEl.addEventListener('click', (req, res) => {
    gs.pop(addTaskLinkEl, addTaskLinkEl.dataset.popScale, undefined, false);
    const newTask = {
        id: crypto.randomUUID(),
        text: ''
    }
    taskArr.unshift(newTask);
    renderTasks();
    saveTasks();
})

deleteIconLarge.addEventListener('click', () => {

    if (deleteIconLarge.dataset.state === 'none') {
        gs.bubble(deleteIconLarge, deleteIconLarge.dataset.bubbleScale);
    }


    deleteIconLarge.setAttribute('data-state', deleteIconLarge.dataset.state === 'none' ? 'active' : 'none');

    const taskEls = taskListEl.querySelectorAll('.task-li');
    taskEls.forEach(li => {
        const deleteIconSmall = li.querySelector('.delete-icon-small');
        
        switch (deleteIconSmall.dataset.state) {
            
            case 'trash':
                deleteIconSmall.setAttribute('src', '../assets/svg/checkbox-delete-false.svg');
                deleteIconSmall.dataset.state = 'false';    
                break;
            case 'false':
                deleteIconSmall.setAttribute('src', '../assets/svg/trash-can.svg');
                deleteIconSmall.dataset.state = 'trash';    
                break;
            case 'true':
                const taskIdx = taskArr.findIndex(t => t.id === li.dataset.id);
                taskArr.splice(taskIdx, 1);
                deleteIconSmall.dataset.state = 'trash';
                break;
        }
    });

    const finishedTaskEls = taskListEl.querySelectorAll('.finished-task-li');
    finishedTaskEls.forEach(li => {
        const deleteIconTiny = li.querySelector('.delete-icon-tiny');

        switch (deleteIconTiny.dataset.state) {
            
            case 'trash':
                deleteIconTiny.setAttribute('src', '../assets/svg/checkbox-delete-false.svg');
                deleteIconTiny.dataset.state = 'false';    
                break;
            case 'false':
                deleteIconTiny.setAttribute('src', '../assets/svg/trash-can.svg');
                deleteIconTiny.dataset.state = 'trash';    
                break;
            case 'true':
                const taskIdx = finishedTaskArr.findIndex(t => t.id === li.dataset.id);
                finishedTaskArr.splice(taskIdx, 1);
                deleteIconTiny.dataset.state = 'trash';
                break;
        }
    })

    if (deleteIconLarge.dataset.state === 'none') {
        saveTasks();
        setTimeout(() => {
            renderTasks();
        }, 200);
    }

})

init();