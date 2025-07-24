document.addEventListener('DOMContentLoaded', () => {
    // --- Éléments du DOM ---
    const kanbanBoard = document.getElementById('kanban-board');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const exportBtn = document.getElementById('export-btn');
    const importInput = document.getElementById('import-input');
    const addWorkflowBtn = document.getElementById('add-workflow-btn');
    const addModal = document.getElementById('add-modal');
    const addModalTitle = document.getElementById('add-modal-title');
    const addModalInput = document.getElementById('add-modal-input');
    const addModalType = document.getElementById('add-modal-type');
    const addModalWorkflowId = document.getElementById('add-modal-workflow-id');
    const saveAddBtn = document.getElementById('save-add-btn');
    const taskModal = document.getElementById('task-modal');
    const taskForm = {
        id: document.getElementById('task-id-input'),
        title: document.getElementById('task-title-input'),
        description: document.getElementById('task-desc-input'),
        color: document.getElementById('task-color-input'),
        saveBtn: document.getElementById('save-task-btn'),
        deleteBtn: document.getElementById('delete-task-btn'),
    };
    const workflowModal = document.getElementById('workflow-modal');
    const workflowForm = {
        id: document.getElementById('workflow-id-input'),
        title: document.getElementById('workflow-title-input'),
        color: document.getElementById('workflow-color-input'),
        saveBtn: document.getElementById('save-workflow-btn'),
        deleteBtn: document.getElementById('delete-workflow-btn'),
    };

    // --- Données par défaut ---
    const getDefaultData = () => ({
        workflows: [
            { id: Date.now() + 1, title: 'À faire', color: '#ef4444', tasks: [] },
            { id: Date.now() + 2, title: 'En cours', color: '#f97316', tasks: [] },
            { id: Date.now() + 3, title: 'À tester', color: '#3b82f6', tasks: [] },
            { id: Date.now() + 4, title: 'Terminé', color: '#22c55e', tasks: [] }
        ]
    });

    // --- État de l'application ---
    let boardData;
    try {
        const savedData = JSON.parse(localStorage.getItem('kanbanBoard'));
        if (savedData && savedData.workflows && Array.isArray(savedData.workflows)) {
            boardData = savedData;
        } else {
            boardData = getDefaultData();
        }
    } catch (e) {
        boardData = getDefaultData();
    }
    
    // --- Fonctions ---
    const saveData = () => localStorage.setItem('kanbanBoard', JSON.stringify(boardData));

    const renderBoard = () => {
        kanbanBoard.innerHTML = '';
        if (!boardData.workflows || boardData.workflows.length === 0) {
            kanbanBoard.innerHTML = '<p style="text-align: center; width: 100%; opacity: 0.7;">Votre tableau est vide. Ajoutez une colonne pour commencer !</p>';
        } else {
            boardData.workflows.forEach(workflow => {
                const columnEl = document.createElement('div');
                columnEl.className = 'workflow-column';
                columnEl.dataset.workflowId = workflow.id;

                columnEl.innerHTML = `
                    <div class="workflow-header">
                        <h3>${workflow.title}</h3>
                        <div class="workflow-actions">
                            <button class="workflow-menu-btn" title="Options de la colonne">
                                <span class="material-symbols-outlined">more_vert</span>
                            </button>
                            <div class="workflow-menu">
                                <button class="edit-workflow-btn" data-workflow-id="${workflow.id}">Éditer</button>
                                <button class="add-task-btn-menu" data-workflow-id="${workflow.id}">Ajouter une tâche</button>
                                <button class="delete-workflow-btn delete" data-workflow-id="${workflow.id}">Supprimer</button>
                            </div>
                        </div>
                    </div>
                    <div class="task-list" data-workflow-id="${workflow.id}"></div>
                `;

                const taskList = columnEl.querySelector('.task-list');
                workflow.tasks.forEach(task => {
                    const taskCard = document.createElement('div');
                    taskCard.className = 'task-card';
                    taskCard.dataset.taskId = task.id;
                    taskCard.style.borderLeftColor = task.color;
                    taskCard.innerHTML = `<h4>${task.title}</h4><p>${task.description}</p>`;
                    taskList.appendChild(taskCard);
                });
                kanbanBoard.appendChild(columnEl);
            });
        }
        initDragAndDrop();
        saveData();
    };

    const initDragAndDrop = () => {
        new Sortable(kanbanBoard, {
            group: 'columns', animation: 150, handle: '.workflow-header',
            onEnd: (evt) => {
                const [movedItem] = boardData.workflows.splice(evt.oldIndex, 1);
                boardData.workflows.splice(evt.newIndex, 0, movedItem);
                renderBoard();
            }
        });
        document.querySelectorAll('.task-list').forEach(list => {
            new Sortable(list, {
                group: 'tasks', animation: 150,
                onEnd: (evt) => {
                    const taskId = evt.item.dataset.taskId;
                    const oldWorkflow = boardData.workflows.find(w => w.id == evt.from.dataset.workflowId);
                    const taskIndex = oldWorkflow.tasks.findIndex(t => t.id == taskId);
                    const [task] = oldWorkflow.tasks.splice(taskIndex, 1);
                    const newWorkflow = boardData.workflows.find(w => w.id == evt.to.dataset.workflowId);
                    newWorkflow.tasks.splice(evt.newIndex, 0, task);
                    renderBoard();
                }
            });
        });
    };

    const openModal = (modal) => modal.classList.add('visible');
    const closeModal = (modal) => modal.classList.remove('visible');

    const openAddModal = (type, workflowId = null) => {
        addModalType.value = type;
        addModalInput.value = '';
        addModalTitle.textContent = type === 'workflow' ? 'Ajouter une colonne' : 'Ajouter une tâche';
        addModalInput.placeholder = type === 'workflow' ? 'Nom de la nouvelle colonne' : 'Titre de la nouvelle tâche';
        if (workflowId) addModalWorkflowId.value = workflowId;
        openModal(addModal);
        addModalInput.focus();
    };

    // --- Logique CRUD ---
    saveAddBtn.addEventListener('click', () => {
        const type = addModalType.value;
        const title = addModalInput.value.trim();
        if (title) {
            if (type === 'workflow') {
                boardData.workflows.push({ id: Date.now(), title, color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`, tasks: [] });
            } else {
                const workflow = boardData.workflows.find(w => w.id == addModalWorkflowId.value);
                if (workflow) workflow.tasks.push({ id: Date.now(), title, description: 'Cliquez pour éditer...', color: '#6b7280' });
            }
            renderBoard();
            closeModal(addModal);
        }
    });

    workflowForm.saveBtn.addEventListener('click', () => {
        const workflow = boardData.workflows.find(w => w.id == workflowForm.id.value);
        if (workflow) {
            workflow.title = workflowForm.title.value;
            workflow.color = workflowForm.color.value;
            renderBoard();
        }
        closeModal(workflowModal);
    });

    taskForm.saveBtn.addEventListener('click', () => {
        for (const workflow of boardData.workflows) {
            const task = workflow.tasks.find(t => t.id == taskForm.id.value);
            if (task) {
                task.title = taskForm.title.value;
                task.description = taskForm.description.value;
                task.color = taskForm.color.value;
                renderBoard();
                break;
            }
        }
        closeModal(taskModal);
    });

    taskForm.deleteBtn.addEventListener('click', () => {
        if (!confirm('Voulez-vous vraiment supprimer cette tâche ?')) return;
        boardData.workflows.forEach(w => { w.tasks = w.tasks.filter(t => t.id != taskForm.id.value) });
        renderBoard();
        closeModal(taskModal);
    });

    // --- Gestionnaires d'Événements ---
    addWorkflowBtn.addEventListener('click', () => openAddModal('workflow'));

    kanbanBoard.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('.workflow-menu-btn');
        if (menuBtn) {
            const menu = menuBtn.nextElementSibling;
            const isVisible = menu.classList.contains('visible');
            document.querySelectorAll('.workflow-menu').forEach(m => m.classList.remove('visible'));
            if (!isVisible) menu.classList.add('visible');
            return;
        }

        const editWorkflowBtn = e.target.closest('.edit-workflow-btn');
        if (editWorkflowBtn) {
            const workflow = boardData.workflows.find(w => w.id == editWorkflowBtn.dataset.workflowId);
            if (workflow) {
                workflowForm.id.value = workflow.id;
                workflowForm.title.value = workflow.title;
                workflowForm.color.value = workflow.color;
                openModal(workflowModal);
            }
        }

        const addTaskMenuBtn = e.target.closest('.add-task-btn-menu');
        if (addTaskMenuBtn) {
            openAddModal('task', addTaskMenuBtn.dataset.workflowId);
        }
        
        const deleteWorkflowBtn = e.target.closest('.delete-workflow-btn');
        if(deleteWorkflowBtn) {
            if (!confirm('Voulez-vous vraiment supprimer cette colonne et toutes ses tâches ?')) return;
            boardData.workflows = boardData.workflows.filter(w => w.id != deleteWorkflowBtn.dataset.workflowId);
            renderBoard();
        }
        
        const taskCard = e.target.closest('.task-card');
        if(taskCard) {
            const workflow = boardData.workflows.find(w => w.id == taskCard.parentElement.dataset.workflowId);
            const task = workflow.tasks.find(t => t.id == taskCard.dataset.taskId);
            if(task) {
                taskForm.id.value = task.id;
                taskForm.title.value = task.title;
                taskForm.description.value = task.description;
                taskForm.color.value = task.color;
                openModal(taskModal);
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.workflow-actions')) {
            document.querySelectorAll('.workflow-menu.visible').forEach(m => m.classList.remove('visible'));
        }
    });

    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    exportBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(boardData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mon-kanban.kanban';
        a.click();
        URL.revokeObjectURL(url);
    });

    importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.kanban')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    if (importedData.workflows && Array.isArray(importedData.workflows)) {
                        boardData = importedData;
                        renderBoard();
                    } else { throw new Error('Format de fichier invalide.'); }
                } catch (error) { alert(`Erreur: ${error.message}`); }
            };
            reader.readAsText(file);
        } else { alert('Veuillez sélectionner un fichier .kanban valide.'); }
        e.target.value = ''; // Permet de réimporter le même fichier
    });

    [addModal, taskModal, workflowModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-close-btn')) {
                closeModal(modal);
            }
        });
    });

    addModalInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') saveAddBtn.click() });

    // --- Initialisation ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.textContent = '☀️';
    }
    renderBoard();
});