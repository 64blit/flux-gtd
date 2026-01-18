// State
let tasks = JSON.parse(localStorage.getItem('flux_tasks')) || [];
let projects = JSON.parse(localStorage.getItem('flux_projects')) || [ { id: 1, name: 'Personal' } ];
let currentView = 'inbox';
let selectedProject = null;
let timerInterval;
let timeLeft = 25 * 60;

// Init
document.addEventListener('DOMContentLoaded', () =>
{
    checkPermissions();
    renderTasks();
    renderProjects();
    updateCounts();
    document.getElementById('add-project-btn').addEventListener('click', addProject);
});

// Navigation
function setView(view)
{
    currentView = view;
    selectedProject = null;
    // Update Sidebar UI
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('#project-list li').forEach(li => li.classList.remove('active'));
    document.querySelector(`li[onclick="setView('${view}')"]`).classList.add('active');

    // Update Header
    const titles = {
        'inbox': 'Inbox',
        'next': 'Next Actions',
        'waiting': 'Waiting For',
        'done': 'Completed'
    };
    const descs = {
        'inbox': 'Capture everything. Sort later.',
        'next': 'What needs to be done now?',
        'waiting': 'Delegated or blocked tasks.',
        'done': 'History of your productivity.'
    };
    document.getElementById('view-title').innerText = titles[ view ];
    document.getElementById('view-desc').innerText = descs[ view ];

    renderTasks();
}

// Tasks
function addTask()
{
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    if (!text) return;

    const priority = document.getElementById('priority-select').value;

    const task = {
        id: Date.now(),
        text: text,
        status: selectedProject ? 'inbox' : currentView,
        priority: priority,
        projectId: selectedProject,
        subtasks: [],
        createdAt: new Date().toISOString()
    };

    tasks.unshift(task);
    saveTasks();
    renderTasks();
    updateCounts();
    input.value = '';
}

function handleInput(e)
{
    if (e.key === 'Enter') addTask();
}

function moveTask(id, newStatus)
{
    const task = tasks.find(t => t.id === id);
    if (task)
    {
        task.status = newStatus;
        saveTasks();
        renderTasks();
        updateCounts();
    }
}

function deleteTask(id)
{
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateCounts();
}

function toggleDone(id)
{
    const task = tasks.find(t => t.id === id);
    if (task)
    {
        if (task.status === 'done')
        {
            task.status = 'inbox'; // Return to inbox if unchecked
        } else
        {
            task.status = 'done';
            // Celebrate
            if (Notification.permission === "granted")
            {
                // new Notification("Task Completed! Great job.");
            }
        }
        saveTasks();
        renderTasks();
        updateCounts();
    }
}

function addSubtask(taskId, text)
{
    const task = tasks.find(t => t.id === taskId);
    if (task && text.trim())
    {
        if (!task.subtasks) task.subtasks = [];
        task.subtasks.push({
            id: Date.now(),
            text: text.trim(),
            done: false
        });
        saveTasks();
        renderTasks();
    }
}

function toggleSubtask(taskId, subtaskId)
{
    const task = tasks.find(t => t.id === taskId);
    if (task)
    {
        if (!task.subtasks) return;
        const subtask = task.subtasks.find(st => st.id === subtaskId);
        if (subtask)
        {
            subtask.done = !subtask.done;
            saveTasks();
            renderTasks();
        }
    }
}

function deleteSubtask(taskId, subtaskId)
{
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks)
    {
        task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
        saveTasks();
        renderTasks();
    }
}

function saveTasks()
{
    localStorage.setItem('flux_tasks', JSON.stringify(tasks));
}

function saveProjects()
{
    localStorage.setItem('flux_projects', JSON.stringify(projects));
}

function renderTasks()
{
    const list = document.getElementById('task-list');
    list.innerHTML = '';

    let filtered = [];
    if (currentView === 'project')
    {
        filtered = tasks.filter(t => t.projectId === selectedProject);
    } else
    {
        filtered = tasks.filter(t => t.status === currentView && !t.projectId);
    }


    filtered.forEach(task =>
    {
        const li = document.createElement('li');
        li.className = `task-item ${task.status === 'done' ? 'done' : ''} priority-${task.priority || 'medium'}`;

        const subtasksHtml = (task.subtasks || []).map(st => `
            <li class="subtask-item ${st.done ? 'done' : ''}">
                <div class="checkbox small" onclick="toggleSubtask(${task.id}, ${st.id})">
                    ${st.done ? '✓' : ''}
                </div>
                <span class="subtask-text">${st.text}</span>
                <button class="action-btn small-btn" onclick="deleteSubtask(${task.id}, ${st.id})">×</button>
            </li>
        `).join('');

        li.innerHTML = `
            <div class="task-content-group">
                <div class="task-header">
                    <div class="checkbox" onclick="toggleDone(${task.id})">
                        ${task.status === 'done' ? '✓' : ''}
                    </div>
                    <span>${task.text}</span>
                </div>

                ${subtasksHtml ? `<ul class="subtask-list">${subtasksHtml}</ul>` : ''}

                <div class="add-subtask-wrapper">
                    <input type="text" class="subtask-input" placeholder="+ Subtask" onkeydown="if(event.key === 'Enter'){ addSubtask(${task.id}, this.value); }">
                </div>
            </div>
            <div class="actions">
                ${currentView !== 'next' && currentView !== 'done' ? '<button class="action-btn" title="Move to Next" onclick="moveTask(' + task.id + ', \'next\')">🔥</button>' : ''}
                ${currentView !== 'waiting' && currentView !== 'done' ? '<button class="action-btn" title="Waiting For" onclick="moveTask(' + task.id + ', \'waiting\')">⏳</button>' : ''}
                <button class="action-btn" title="Delete" onclick="deleteTask(${task.id})">🗑</button>
            </div>
        `;
        list.appendChild(li);
    });

    if (filtered.length === 0)
    {
        const viewName = selectedProject ? projects.find(p => p.id === selectedProject).name : currentView;
        list.innerHTML = `<li style="text-align:center; color: var(--text-muted); margin-top: 2rem;">No tasks in ${viewName}. Time to relax? 🌴</li>`;
    }
}

function updateCounts()
{
    const counts = {
        inbox: tasks.filter(t => t.status === 'inbox').length,
        next: tasks.filter(t => t.status === 'next').length,
        waiting: tasks.filter(t => t.status === 'waiting').length
    };

    document.getElementById('count-inbox').innerText = counts.inbox;
    document.getElementById('count-next').innerText = counts.next;
    document.getElementById('count-waiting').innerText = counts.waiting;
}

// Projects
function addProject()
{
    const input = document.getElementById('project-input');
    const name = input.value.trim();
    if (!name) return;

    const project = {
        id: Date.now(),
        name: name,
    };

    projects.push(project);
    saveProjects();
    renderProjects();
    input.value = '';
    selectProject(project.id);
}

function selectProject(id)
{
    selectedProject = id;
    currentView = 'project';
    // Update UI
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    renderProjects();

    // Update Header
    const project = projects.find(p => p.id === id);
    document.getElementById('view-title').innerText = project.name;
    document.getElementById('view-desc').innerText = `Tasks in ${project.name}`;

    renderTasks();
}

function renderProjects()
{
    const list = document.getElementById('project-list');
    list.innerHTML = '';
    projects.forEach(project =>
    {
        const li = document.createElement('li');
        li.addEventListener('click', () => selectProject(project.id));
        li.innerText = project.name;
        if (selectedProject === project.id)
        {
            li.classList.add('active');
        }
        list.appendChild(li);
    });
}

// Timer
function startTimer(minutes)
{
    clearInterval(timerInterval);
    timeLeft = minutes * 60;
    updateTimerDisplay();

    timerInterval = setInterval(() =>
    {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0)
        {
            clearInterval(timerInterval);
            notify("Timer Finished!", "Time to take a break or switch tasks.");
            playAlarm();
        }
    }, 1000);
}

function resetTimer()
{
    clearInterval(timerInterval);
    timeLeft = 25 * 60;
    updateTimerDisplay();
}

function updateTimerDisplay()
{
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById('timer-display').innerText =
        `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

    document.title = `${m}:${s.toString().padStart(2, '0')} - Flux GTD`;
}

function checkPermissions()
{
    if (Notification.permission !== "granted")
    {
        Notification.requestPermission();
    }
}

function notify(title, body)
{
    if (Notification.permission === "granted")
    {
        new Notification(title, { body });
    }
}

function playAlarm()
{
    // Simple beep
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.5);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);
}
