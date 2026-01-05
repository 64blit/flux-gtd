// State
let tasks = JSON.parse(localStorage.getItem('flux_tasks')) || [];
let projects = JSON.parse(localStorage.getItem('flux_projects')) || [];
let currentView = 'inbox';
let currentProject = null;
let contextMenuTarget = null;
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

    // Context Menu Listeners
    document.getElementById('rename-project').addEventListener('click', () =>
    {
        if (contextMenuTarget) renameProject(contextMenuTarget);
        hideContextMenu();
    });
    document.getElementById('delete-project').addEventListener('click', () =>
    {
        if (contextMenuTarget) deleteProject(contextMenuTarget);
        hideContextMenu();
    });
    window.addEventListener('click', hideContextMenu);
});

// Navigation
function setView(view, projectId = null)
{
    currentView = view;
    currentProject = projectId;
    // Update Sidebar UI
    document.querySelectorAll('.nav-links li, .project-list li').forEach(li => li.classList.remove('active'));
    if (view === 'project')
    {
        const projectLi = document.querySelector(`li[data-project-id='${projectId}']`);
        if (projectLi) projectLi.classList.add('active');
    } else
    {
        const viewLi = document.querySelector(`li[onclick="setView('${view}')"]`);
        if (viewLi) viewLi.classList.add('active');
    }


    // Update Header
    const titles = {
        'inbox': 'Inbox',
        'next': 'Next Actions',
        'waiting': 'Waiting For',
        'done': 'Completed',
        'project': projects.find(p => p.id === projectId)?.name || 'Project'
    };
    const descs = {
        'inbox': 'Capture everything. Sort later.',
        'next': 'What needs to be done now?',
        'waiting': 'Delegated or blocked tasks.',
        'done': 'History of your productivity.',
        'project': `Tasks for this project.`
    };
    document.getElementById('view-title').innerText = titles[ view ];
    document.getElementById('view-desc').innerText = descs[ view ];

    renderTasks();
}

// Tasks
function addTask()
{
    const input = document.getElementById('task-input');
    const projectSelect = document.getElementById('project-select');
    const text = input.value.trim();
    if (!text) return;

    const task = {
        id: Date.now(),
        text: text,
        status: 'inbox', // inbox, next, waiting, done
        projectId: projectSelect.value ? parseInt(projectSelect.value) : null,
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

function saveTasks()
{
    localStorage.setItem('flux_tasks', JSON.stringify(tasks));
}

function renderTasks()
{
    const list = document.getElementById('task-list');
    list.innerHTML = '';

    let filtered = tasks;

    if (currentView === 'project')
    {
        filtered = tasks.filter(t => t.projectId === currentProject);
    } else
    {
        filtered = tasks.filter(t => t.status === currentView);
    }

    filtered.forEach(task =>
    {
        const li = document.createElement('li');
        li.className = `task-item ${task.status === 'done' ? 'done' : ''}`;
        li.innerHTML = `
            <div class="task-content">
                <div class="checkbox" onclick="toggleDone(${task.id})">
                    ${task.status === 'done' ? '✓' : ''}
                </div>
                <span>${task.text}</span>
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
        list.innerHTML = `<li style="text-align:center; color: var(--text-muted); margin-top: 2rem;">No tasks in ${currentView}. time to relax? 🌴</li>`;
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

// Context Menu
function showContextMenu(x, y, projectId)
{
    const menu = document.getElementById('context-menu');
    menu.style.display = 'block';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    contextMenuTarget = projectId;
}

function hideContextMenu()
{
    document.getElementById('context-menu').style.display = 'none';
    contextMenuTarget = null;
}

// Projects
function addProject()
{
    const name = prompt("Enter project name:");
    if (!name) return;

    const project = {
        id: Date.now(),
        name: name,
        createdAt: new Date().toISOString()
    };
    projects.push(project);
    saveProjects();
    renderProjects();
}

function renameProject(id)
{
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const newName = prompt("Enter new project name:", project.name);
    if (newName)
    {
        project.name = newName;
        saveProjects();
        renderProjects();
        if (currentProject === id)
        {
            setView('project', id);
        }
    }
}

function deleteProject(id)
{
    if (!confirm("Are you sure? This will also delete all tasks in this project.")) return;
    projects = projects.filter(p => p.id !== id);
    tasks = tasks.filter(t => t.projectId !== id);
    saveProjects();
    saveTasks();
    renderProjects();
    if (currentProject === id)
    {
        setView('inbox');
    }
}

function saveProjects()
{
    localStorage.setItem('flux_projects', JSON.stringify(projects));
}

function renderProjects()
{
    const list = document.getElementById('project-list');
    const select = document.getElementById('project-select');
    list.innerHTML = '';
    select.innerHTML = '<option value="">No Project</option>';

    projects.forEach(p =>
    {
        const li = document.createElement('li');
        li.dataset.projectId = p.id;
        li.innerText = p.name;
        li.onclick = () => setView('project', p.id);
        li.oncontextmenu = (e) =>
        {
            e.preventDefault();
            e.stopPropagation(); // Prevent window click listener from hiding immediately
            showContextMenu(e.pageX, e.pageY, p.id);
        };
        list.appendChild(li);

        const option = document.createElement('option');
        option.value = p.id;
        option.innerText = p.name;
        select.appendChild(option);
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
