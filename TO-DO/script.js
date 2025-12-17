const selectedEmoji = document.getElementById('selectedEmoji');
const emojiPickerBtn = document.getElementById('emojiPickerBtn');
const emojiPicker = document.getElementById('emojiPicker');
const emojiGrid = document.getElementById('emojiGrid');
const emojiSearch = document.getElementById('emojiSearch');
const emojiCategories = document.querySelectorAll('.emoji-category');
const createNewBoardBtn = document.getElementById('createNewBoard');
const boardModal = document.getElementById('boardModal');
const taskModal = document.getElementById('taskModal');
const deleteModal = document.getElementById('deleteModal');
const createBoardBtn = document.getElementById('createBoardBtn');
const addTaskBtn = document.getElementById('addTaskBtn');
const boardsContainer = document.getElementById('boardsContainer');
const helloPopup = document.getElementById('helloPopup');
const closeGreeting = document.getElementById('closeGreeting');
const characterSection = document.getElementById('characterSection');
const sleepingGirl = document.getElementById('sleepingGirl');
const progressFill = document.getElementById('progressFill');
const taskCount = document.getElementById('taskCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');
const hoverDog = document.getElementById('hoverDog');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');
const deleteMessage = document.getElementById('deleteMessage');
const progressCard = document.getElementById('progressCard');
const progressPanel = document.getElementById('progressPanel');
const closeProgressBtn = document.getElementById('closeProgress');
const currentStreakEl = document.getElementById('currentStreak');
const totalCompletedEl = document.getElementById('totalCompleted');
const activityList = document.getElementById('activityList');
const dailyTipEl = document.getElementById('dailyTip');
const progressGif = document.getElementById('progressGif');
let boards = [];
let currentBoardId = null;
let selectedPriority = 'medium';
let selectedColor = '#ffcccc';
let totalTasksCompleted = 0;
let currentStreak = 0;
let activities = [];
let deleteType = null;
let deleteBoardId = null;
let deleteTaskId = null;
const sampleBoards = []; 

function initEmojiPicker() {
    const emojiCategoriesData = {
        frequent: ['📋', '🛒', '⭐', '📚', '🎯', '💡', '🏠', '💼', '📅', '🎮', '🎵', '🎨'],
        food: ['🍎', '🍕', '🍔', '🥗', '🍜', '🍩', '☕', '🍪', '🍇', '🍓', '🍌', '🥑'],
        objects: ['📱', '💻', '📷', '🎧', '👟', '👗', '👔', '🎁', '💎', '📦', '🛍️', '🎒'],
        activities: ['⚽', '🏀', '🎾', '🏊', '🚴', '🎮', '🎬', '🎤', '🎹', '🎸', '🎭', '🎪'],
        symbols: ['✅', '⭐', '🔥', '💯', '🎯', '📌', '📍', '💡', '✨', '🌟', '💎', '💖']
    };

    function loadEmojis(category = 'frequent') {
        emojiGrid.innerHTML = '';
        const emojis = emojiCategoriesData[category] || emojiCategoriesData.frequent;
        
        emojis.forEach(emoji => {
            const emojiItem = document.createElement('div');
            emojiItem.className = 'emoji-item';
            emojiItem.textContent = emoji;
            emojiItem.addEventListener('click', () => {
                selectedBoardEmoji = emoji;
                selectedEmoji.textContent = emoji;
                emojiPicker.classList.remove('show');
            });
            emojiGrid.appendChild(emojiItem);
        });
    }
    loadEmojis('frequent');
    emojiPickerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        emojiPicker.classList.toggle('show');
        emojiSearch.value = '';
        loadEmojis('frequent');
    });

    emojiCategories.forEach(categoryBtn => {
        categoryBtn.addEventListener('click', () => {
            emojiCategories.forEach(btn => btn.classList.remove('active'));
            categoryBtn.classList.add('active');
            const category = categoryBtn.dataset.category;
            loadEmojis(category);
        });
    });

    emojiSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const allEmojis = Object.values(emojiCategoriesData).flat();
        
        if (searchTerm === '') {
            const activeCategory = document.querySelector('.emoji-category.active').dataset.category;
            loadEmojis(activeCategory);
            return;
        }

        emojiGrid.innerHTML = '';
        const filteredEmojis = allEmojis.filter(emoji => {
            
            return emoji.includes(searchTerm) || 
                   searchTerm.includes('food') && ['🍎','🍕','🍔','🥗'].includes(emoji) ||
                   searchTerm.includes('shop') && ['🛒','🛍️','📦'].includes(emoji) ||
                   searchTerm.includes('book') && ['📚','📖'].includes(emoji);
        });

        if (filteredEmojis.length > 0) {
            filteredEmojis.forEach(emoji => {
                const emojiItem = document.createElement('div');
                emojiItem.className = 'emoji-item';
                emojiItem.textContent = emoji;
                emojiItem.addEventListener('click', () => {
                    selectedBoardEmoji = emoji;
                    selectedEmoji.textContent = emoji;
                    emojiPicker.classList.remove('show');
                });
                emojiGrid.appendChild(emojiItem);
            });
        } else {
            emojiGrid.innerHTML = '<div class="no-results">No emojis found</div>';
        }
    });

    document.addEventListener('click', (e) => {
        if (!emojiPicker.contains(e.target) && !emojiPickerBtn.contains(e.target) && !selectedEmoji.contains(e.target)) {
            emojiPicker.classList.remove('show');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && emojiPicker.classList.contains('show')) {
            emojiPicker.classList.remove('show');
        }
    });
}

function initProgressPanel() {
    const savedStreak = localStorage.getItem('notesforever-streak');
    const savedActivities = localStorage.getItem('notesforever-activities');

    if (savedStreak) currentStreak = parseInt(savedStreak);
    if (savedActivities) activities = JSON.parse(savedActivities);

    if (activities.length === 0) addActivity("🎉 Welcome to Notes Forever!");

    if (progressCard && progressPanel) {
        progressCard.addEventListener('click', () => {
            progressPanel.classList.add('show');
            progressCard.style.display = 'none';
            updateProgressPanel();
        });
    }
    if (closeProgressBtn && progressPanel) {
        closeProgressBtn.addEventListener('click', () => {
            progressPanel.classList.remove('show');
            progressCard.style.display = 'block';
        });
    }
    if (progressCard && progressGif) {
        progressCard.addEventListener('mouseenter', () => {
            progressGif.src = progressGif.src; 
        });
    }

    updateDailyTip();
}

function updateProgressPanel() {
    const totalCompleted = boards.reduce((sum, b) => sum + b.tasks.filter(t => t.completed).length, 0);
    if (totalCompletedEl) totalCompletedEl.textContent = `${totalCompleted} task${totalCompleted !== 1 ? 's' : ''}`;
    updateStreakDisplay();
    updateActivityFeed();
}

function updateStreakDisplay() {
    if (currentStreakEl) currentStreakEl.textContent = `${currentStreak} day${currentStreak !== 1 ? 's' : ''}`;
}

function updateActivityFeed() {
    if (!activityList) return;
    if (activities.length === 0) {
        activityList.innerHTML = '<p>No activity yet</p>';
        return;
    }
    activityList.innerHTML = activities.slice(0, 3).map(a => `<p>${a}</p>`).join('');
}

function addActivity(msg) {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const activity = `${msg} (${time})`;
    activities.unshift(activity);
    if (activities.length > 5) activities = activities.slice(0, 5);
    localStorage.setItem('notesforever-activities', JSON.stringify(activities));
    updateActivityFeed();
}

function updateDailyTip() {
    if (!dailyTipEl) return;
    const tips = [
        "Break tasks into smaller chunks!",
        "Complete 3 tasks to start a streak!",
        "Morning is the best time for hard tasks",
        "Review your progress weekly",
        "Celebrate small wins!",
        "Use the progress tracker to stay motivated",
        "Set daily goals for better productivity",
        "Take breaks between tasks"
    ];
    dailyTipEl.textContent = tips[Math.floor(Math.random() * tips.length)];
}

function updateStreakCounter() {
    const today = new Date().toDateString();
    const lastActivity = localStorage.getItem('notesforever-lastActivityDate');
    if (!lastActivity || lastActivity !== today) {
        currentStreak++;
        if (lastActivity) addActivity(`🔥 Streak: ${currentStreak} days!`);
        localStorage.setItem('notesforever-lastActivityDate', today);
        localStorage.setItem('notesforever-streak', currentStreak.toString());
        updateStreakDisplay();
    }
}
function initApp() {
    const visitedBefore = localStorage.getItem('notesforever-visited');
    if (!visitedBefore) {
        setTimeout(() => {
            if (helloPopup) helloPopup.style.display = 'flex';
            localStorage.setItem('notesforever-visited', 'true');
        }, 1000);
    }

    const savedBoards = localStorage.getItem('notesforever-boards');
    boards = savedBoards ? JSON.parse(savedBoards) : [...sampleBoards];
    saveBoards();
    renderBoards();
    updateStats();
    setupEventListeners();
    initProgressPanel();
    initEmojiPicker();
}

function setupEventListeners() {
    if (createNewBoardBtn) createNewBoardBtn.addEventListener('click', openBoardModal);
    if (createBoardBtn) createBoardBtn.addEventListener('click', createNewBoard);
    if (addTaskBtn) addTaskBtn.addEventListener('click', addNewTask);
    if (cancelDelete) cancelDelete.addEventListener('click', () => { deleteModal.style.display = 'none'; });
    if (confirmDelete) confirmDelete.addEventListener('click', handleDelete);

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            boardModal.style.display = 'none';
            taskModal.style.display = 'none';
            deleteModal.style.display = 'none';
        });
    });

    if (closeGreeting && helloPopup) {
        closeGreeting.addEventListener('click', () => helloPopup.style.display = 'none');
    }

    window.addEventListener('click', (e) => {
        if (e.target === boardModal) boardModal.style.display = 'none';
        if (e.target === taskModal) taskModal.style.display = 'none';
        if (e.target === deleteModal) deleteModal.style.display = 'none';
        if (e.target === helloPopup) helloPopup.style.display = 'none';
    });

    document.querySelectorAll('.color-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedColor = opt.dataset.color;
        });
    });

    document.querySelectorAll('.priority-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedPriority = btn.dataset.priority;
        });
    });

    const createCard = document.getElementById('createNewBoard');
    if (createCard && hoverDog) {
        createCard.addEventListener('mouseenter', () => hoverDog.src = hoverDog.src);
    }
}

function openBoardModal() {
    if (!boardModal) return;
    boardModal.style.display = 'flex';
    const boardTitleInput = document.getElementById('boardTitle');
    if (boardTitleInput) { boardTitleInput.value = ''; boardTitleInput.focus(); }

    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    const firstColorOption = document.querySelector('.color-option');
    if (firstColorOption) firstColorOption.classList.add('selected');
    selectedColor = '#ffcccc';


    selectedBoardEmoji = '📋';
    selectedEmoji.textContent = '📋';
    if (emojiPicker) emojiPicker.classList.remove('show');
}

function createNewBoard() {
    const boardTitleInput = document.getElementById('boardTitle');
    if (!boardTitleInput) return;

    const title = boardTitleInput.value.trim();
    if (!title) { alert('Please enter a board title!'); return; }

    const newBoard = {
        id: Date.now(),
        title,
        category: 'todo', 
        color: selectedColor,
        emoji: selectedBoardEmoji, 
        tasks: []
    };

    boards.push(newBoard);
    saveBoards();
    renderBoards();
    updateStats();
    addActivity(`Created new board: "${title}"`);
    boardModal.style.display = 'none';
    showSuccessAnimation();
}

function openTaskModal(boardId) {
    currentBoardId = boardId;
    const board = boards.find(b => b.id === boardId);
    const modalTitle = document.getElementById('modalBoardTitle');
    const taskInput = document.getElementById('taskInput');

    if (modalTitle && board) modalTitle.textContent = `Add to ${board.title}`;
    if (taskInput && board) { 
        taskInput.placeholder = "Enter your task...";
        taskInput.value = ''; 
        taskInput.focus(); 
    }

    const prioritySelector = document.querySelector('.priority-selector');
    if (prioritySelector) prioritySelector.style.display = 'block'; 

    taskModal.style.display = 'flex';
    document.querySelectorAll('.priority-btn').forEach(btn => btn.classList.remove('selected'));
    const mediumBtn = document.querySelector('.priority-btn.medium');
    if (mediumBtn) mediumBtn.classList.add('selected');
    selectedPriority = 'medium';
}

function addNewTask() {
    const taskInput = document.getElementById('taskInput');
    if (!taskInput || !currentBoardId) return;
    const text = taskInput.value.trim();
    if (!text) { alert('Please enter a task!'); return; }

    const board = boards.find(b => b.id === currentBoardId);
    if (!board) return;

    const newTask = { 
        id: Date.now(), 
        text, 
        completed: false, 
        priority: selectedPriority 
    };
    
    board.tasks.push(newTask);
    saveBoards();
    renderBoards();
    updateStats();
    addActivity(`Added to ${board.title}: "${text}"`);
    taskModal.style.display = 'none';
}

function toggleTask(e) {
    const checkbox = e.currentTarget;
    const boardId = parseInt(checkbox.dataset.boardId);
    const taskId = parseInt(checkbox.dataset.taskId);
    const board = boards.find(b => b.id === boardId);
    if (!board) return;
    const task = board.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    saveBoards();
    renderBoards();
    updateStats();

    if (task.completed) { 
        showMiniCelebration(); 
        addActivity(`Completed: "${task.text}"`); 
        updateStreakCounter(); 
    }
}

function showDeleteConfirmation(type, boardId, taskId = null) {
    deleteType = type; deleteBoardId = boardId; deleteTaskId = taskId;
    const board = boards.find(b => b.id === boardId);
    if (type === 'board' && board) deleteMessage.textContent = `Delete "${board.title}" and all its tasks?`;
    else if (type === 'task' && board) {
        const task = board.tasks.find(t => t.id === taskId);
        if (task) deleteMessage.textContent = `Delete task: "${task.text}"?`;
    }
    deleteModal.style.display = 'flex';
}

function handleDelete() {
    if (deleteType === 'board' && deleteBoardId) {
        boards = boards.filter(b => b.id !== deleteBoardId);
        saveBoards(); renderBoards(); updateStats();
    } else if (deleteType === 'task' && deleteBoardId && deleteTaskId) {
        const board = boards.find(b => b.id === deleteBoardId);
        if (board) board.tasks = board.tasks.filter(t => t.id !== deleteTaskId);
        saveBoards(); renderBoards(); updateStats();
    }
    deleteModal.style.display = 'none';
    deleteType = deleteBoardId = deleteTaskId = null;
}

function renderBoards() {
    if (!boardsContainer) return;
    boardsContainer.innerHTML = '';
    if (boards.length === 0) {
        boardsContainer.innerHTML = `<div class="empty-state"><h3>No boards yet</h3><p>Create your first board!</p></div>`;
        return;
    }

    boards.forEach(board => {
        const boardEl = document.createElement('div');
        boardEl.className = 'board-card';
        boardEl.style.borderTopColor = board.color;
        boardEl.style.background = `linear-gradient(135deg, ${board.color}20, ${board.color}05)`;

        const completedTasks = board.tasks.filter(t => t.completed).length;

        boardEl.innerHTML = `
            <div class="board-header">
                <h3>${board.emoji} ${board.title}</h3>
                <span class="board-count">${completedTasks}/${board.tasks.length}</span>
            </div>
            <button class="delete-board-btn" data-board-id="${board.id}">🗑️</button>
            <ul class="task-list" data-board-id="${board.id}">
                ${board.tasks.map(task => `
                    <li class="task-item">
                        <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-board-id="${board.id}" data-task-id="${task.id}">
                            ${task.completed ? '✓' : ''}
                        </div>
                        <span class="task-text ${task.completed ? 'completed' : ''}" data-task-id="${task.id}" data-board-id="${board.id}">${task.text}</span>
                        <button class="delete-task-btn" data-board-id="${board.id}" data-task-id="${task.id}">🗑️</button>
                        <div class="task-priority priority-${task.priority}"></div>
                    </li>
                `).join('')}
            </ul>
            <button class="add-task-btn" data-board-id="${board.id}">➕ Add Task</button>
        `;
        boardsContainer.appendChild(boardEl);
    });

    document.querySelectorAll('.task-checkbox').forEach(cb => cb.addEventListener('click', toggleTask));
    document.querySelectorAll('.add-task-btn').forEach(btn => btn.addEventListener('click', e => openTaskModal(parseInt(e.currentTarget.dataset.boardId))));
    document.querySelectorAll('.delete-board-btn').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); showDeleteConfirmation('board', parseInt(btn.dataset.boardId)); }));
    document.querySelectorAll('.delete-task-btn').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); showDeleteConfirmation('task', parseInt(btn.dataset.boardId), parseInt(btn.dataset.taskId)); }));
}

function updateStats() {
    let total = 0, completed = 0;
    boards.forEach(b => { total += b.tasks.length; completed += b.tasks.filter(t => t.completed).length; });
    totalTasksCompleted = completed;
    if (taskCount) taskCount.textContent = completed;
    if (completedCount) completedCount.textContent = completed;
    if (pendingCount) pendingCount.textContent = total - completed;

    const progress = total > 0 ? (completed / total) * 100 : 0;
    if (progressFill) progressFill.style.width = `${progress}%`;

    if (characterSection && sleepingGirl) {
        if (total > 0 && completed === total) { characterSection.style.display = 'none'; sleepingGirl.style.display = 'block'; }
        else { characterSection.style.display = 'block'; sleepingGirl.style.display = 'none'; }
    }
    updateProgressPanel();
}

function showMiniCelebration() {
    const mini = document.createElement('div');
    mini.innerHTML = '✨';
    mini.style.cssText = `position: fixed; top:${Math.random()*window.innerHeight}px; left:${Math.random()*window.innerWidth}px; font-size:20px; color:#ff7518; z-index:1000; pointer-events:none; animation: float 1s ease-out forwards;`;
    document.body.appendChild(mini);
    setTimeout(() => mini.remove(), 1000);
}

function saveBoards() { localStorage.setItem('notesforever-boards', JSON.stringify(boards)); }

function showSuccessAnimation() {
    const success = document.createElement('div');
    success.innerHTML = '✅';
    success.style.cssText = `position: fixed; top:50%; left:50%; transform: translate(-50%,-50%) scale(0); font-size:80px; color:#7cfc00; z-index:1000; pointer-events:none; animation: successAnim 1s ease forwards;`;
    document.body.appendChild(success);
    setTimeout(() => success.remove(), 1000);
}

document.addEventListener('DOMContentLoaded', initApp);

const style = document.createElement('style');
style.textContent = `
@keyframes successAnim {
    0% { transform: translate(-50%, -50%) scale(0); opacity:0; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity:1; }
    100% { transform: translate(-50%, -50%) scale(1); opacity:0; }
}
@keyframes float {
    0% { transform: translateY(0); opacity:1; }
    100% { transform: translateY(-50px); opacity:0; }
}`;
document.head.appendChild(style);