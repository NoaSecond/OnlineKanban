document.addEventListener('DOMContentLoaded', () => {
    // 1. État de l'application
    let boardData = {
        workflows: [
            { id: 1, title: 'À faire', color: '#ef4444', tasks: [] },
            { id: 2, title: 'En cours', color: '#f97316', tasks: [] },
            { id: 3, title: 'À tester', color: '#3b82f6', tasks: [] },
            { id: 4, title: 'Terminé', color: '#22c55e', tasks: [] }
        ]
    };

    const kanbanBoard = document.getElementById('kanban-board');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const exportBtn = document.getElementById('export-btn');
    const importInput = document.getElementById('import-input');

    // 2. Fonctions de Rendu
    function renderBoard() {
        kanbanBoard.innerHTML = '';
        boardData.workflows.forEach(workflow => {
            const columnEl = document.createElement('div');
            columnEl.className = 'workflow-column';
            columnEl.innerHTML = `
                <div class="workflow-header" style="border-left: 4px solid ${workflow.color};">
                    <h3>${workflow.title}</h3>
                    <button class="add-task-btn" data-workflow-id="${workflow.id}">+</button>
                </div>
                <div class="task-list" data-workflow-id="${workflow.id}">
                    ${workflow.tasks.map(task => `
                        <div class="task-card" data-task-id="${task.id}" style="border-top: 3px solid ${task.color};">
                            <h4>${task.title}</h4>
                            <p>${task.description}</p>
                        </div>
                    `).join('')}
                </div>
            `;
            kanbanBoard.appendChild(columnEl);
        });
        initDragAndDrop();
    }

    // 3. Logique du Drag and Drop
    function initDragAndDrop() {
        const lists = document.querySelectorAll('.task-list');
        lists.forEach(list => {
            new Sortable(list, {
                group: 'tasks',
                animation: 150,
                onEnd: (evt) => {
                    // Logique de mise à jour de l'état (à implémenter)
                    console.log(`Tâche déplacée.`);
                }
            });
        });
    }

    // 4. Gestion des événements
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    exportBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(boardData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'mon-kanban.kanban';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });

    importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.kanban')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    boardData = JSON.parse(event.target.result);
                    renderBoard();
                } catch (error) {
                    alert('Erreur: Fichier .kanban invalide.');
                }
            };
            reader.readAsText(file);
        } else {
            alert('Veuillez sélectionner un fichier .kanban valide.');
        }
    });

    kanbanBoard.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-task-btn')) {
            const workflowId = e.target.dataset.workflowId;
            const title = prompt('Titre de la tâche:');
            if (title) {
                const newTask = {
                    id: Date.now(),
                    title,
                    description: 'Nouvelle description...',
                    color: '#6b7280'
                };
                const workflow = boardData.workflows.find(w => w.id == workflowId);
                workflow.tasks.push(newTask);
                renderBoard();
            }
        }
    });

    // 5. Initialisation
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    renderBoard();
});