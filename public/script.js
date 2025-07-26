document.addEventListener('DOMContentLoaded', () => {
    // --- Système de Log et Gestion d'Erreurs ---
    const Logger = {
        levels: {
            ERROR: { emoji: '🚨', color: '#ef4444', level: 0 },
            WARN: { emoji: '⚠️', color: '#f97316', level: 1 },
            INFO: { emoji: 'ℹ️', color: '#3b82f6', level: 2 },
            SUCCESS: { emoji: '✅', color: '#22c55e', level: 3 },
            DEBUG: { emoji: '🔍', color: '#8b5cf6', level: 4 }
        },
        
        currentLevel: 4, // Afficher tous les logs en développement
        
        log(level, message, data = null) {
            const logLevel = this.levels[level];
            if (!logLevel || logLevel.level > this.currentLevel) return;
            
            const timestamp = new Date().toLocaleTimeString();
            const logMessage = `${logLevel.emoji} [${timestamp}] ${message}`;
            
            console.log(
                `%c${logMessage}`,
                `color: ${logLevel.color}; font-weight: bold;`
            );
            
            if (data) {
                console.log('📊 Données associées:', data);
            }
        },
        
        error(message, error = null) {
            this.log('ERROR', message, error);
            if (error && error.stack) {
                console.error('📋 Stack trace:', error.stack);
            }
        },
        
        warn(message, data = null) {
            this.log('WARN', message, data);
        },
        
        info(message, data = null) {
            this.log('INFO', message, data);
        },
        
        success(message, data = null) {
            this.log('SUCCESS', message, data);
        },
        
        debug(message, data = null) {
            this.log('DEBUG', message, data);
        }
    };

    // --- Gestionnaire d'Erreurs Global ---
    const ErrorHandler = {
        handle(error, context = 'Application') {
            Logger.error(`Erreur dans ${context}`, error);
            
            // Afficher une notification à l'utilisateur si nécessaire
            if (error.userFacing) {
                this.showUserNotification(error.message, 'error');
            }
        },
        
        showUserNotification(message, type = 'info') {
            // Créer une notification temporaire
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <span class="notification-icon">${type === 'error' ? '🚨' : type === 'success' ? '✅' : 'ℹ️'}</span>
                <span class="notification-message">${message}</span>
            `;
            
            document.body.appendChild(notification);
            
            // Supprimer après 5 secondes
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 5000);
        },
        
        wrapAsync(fn, context) {
            return async (...args) => {
                try {
                    return await fn(...args);
                } catch (error) {
                    this.handle(error, context);
                    throw error;
                }
            };
        },
        
        wrapSync(fn, context) {
            return (...args) => {
                try {
                    return fn(...args);
                } catch (error) {
                    this.handle(error, context);
                    throw error;
                }
            };
        }
    };

    Logger.info('🚀 Application OnlineKanban démarrée');

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
    const projectTitle = document.getElementById('project-title');
    const projectModal = document.getElementById('project-modal');
    const projectNameInput = document.getElementById('project-name-input');
    const saveProjectBtn = document.getElementById('save-project-btn');
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
        projectName: 'Online Kanban',
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
        Logger.debug('🔄 Chargement des données depuis localStorage');
        const savedData = JSON.parse(localStorage.getItem('kanbanBoard'));
        if (savedData && savedData.workflows && Array.isArray(savedData.workflows)) {
            boardData = savedData;
            // Assurer la compatibilité avec les anciens fichiers sans nom de projet
            if (!boardData.projectName) {
                boardData.projectName = 'Online Kanban';
            }
            Logger.success('📂 Données chargées avec succès', { workflows: savedData.workflows.length });
        } else {
            Logger.warn('⚠️ Données invalides ou inexistantes, utilisation des données par défaut');
            boardData = getDefaultData();
            Logger.info('🔄 Données par défaut chargées');
        }
    } catch (e) {
        Logger.error('💥 Erreur lors du chargement des données', e);
        boardData = getDefaultData();
        Logger.info('🔄 Données par défaut chargées');
    }
    
    // Mettre à jour le titre du projet
    const updateProjectTitle = ErrorHandler.wrapSync(() => {
        if (boardData.projectName) {
            projectTitle.textContent = boardData.projectName;
            // Mise à jour SEO dynamique du titre de la page
            document.title = `${boardData.projectName} - Online Kanban`;
            
            // Mise à jour des meta tags dynamiques
            updateMetaTags(boardData.projectName);
            
            Logger.debug('🏷️ Titre du projet mis à jour', { title: boardData.projectName });
        }
    }, 'Mise à jour du titre du projet');
    
    // Fonction pour mettre à jour les meta tags dynamiquement
    const updateMetaTags = (projectName) => {
        // Mise à jour de la description avec le nom du projet
        const description = `Gérez votre projet "${projectName}" avec notre outil Kanban gratuit. Interface intuitive, drag & drop, colonnes personnalisables pour une productivité optimale.`;
        
        // Meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        }
        
        // Open Graph title
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', `${projectName} - Online Kanban`);
        }
        
        // Open Graph description
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.setAttribute('content', description);
        }
        
        // Twitter title
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.setAttribute('content', `${projectName} - Online Kanban`);
        }
        
        // Twitter description
        const twitterDescription = document.querySelector('meta[property="twitter:description"]');
        if (twitterDescription) {
            twitterDescription.setAttribute('content', description);
        }
        
        Logger.debug('🔍 Meta tags SEO mis à jour', { projectName, description });
    };
    
    // Fonction pour générer les mots-clés dynamiques basés sur le contenu
    const generateDynamicKeywords = () => {
        const keywords = ['kanban', 'gestion projet', 'tâches', 'productivité'];
        
        // Ajouter les titres des colonnes comme mots-clés
        if (boardData.workflows) {
            boardData.workflows.forEach(workflow => {
                if (workflow.title && workflow.title.length > 2) {
                    keywords.push(workflow.title.toLowerCase());
                }
            });
        }
        
        // Ajouter le nom du projet
        if (boardData.projectName && boardData.projectName !== 'Online Kanban') {
            keywords.push(boardData.projectName.toLowerCase());
        }
        
        // Mise à jour des meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords.join(', '));
        }
        
        Logger.debug('🔍 Mots-clés dynamiques générés', { keywords });
    };
    
    // Fonction pour tracker les événements (Google Analytics ready)
    const trackEvent = (action, category = 'Kanban', label = null, value = null) => {
        // Si Google Analytics est installé
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
        
        Logger.debug('📊 Événement tracké', { action, category, label, value });
    };
    
    // --- Fonctions ---
    const saveData = ErrorHandler.wrapSync(() => {
        Logger.debug('💾 Sauvegarde des données');
        localStorage.setItem('kanbanBoard', JSON.stringify(boardData));
        Logger.success('✅ Données sauvegardées avec succès');
    }, 'Sauvegarde des données');

    const renderBoard = ErrorHandler.wrapSync(() => {
        Logger.debug('🎨 Rendu du tableau Kanban');
        kanbanBoard.innerHTML = '';
        if (!boardData.workflows || boardData.workflows.length === 0) {
            Logger.info('📋 Aucune colonne à afficher');
            kanbanBoard.innerHTML = '<p style="text-align: center; width: 100%; opacity: 0.7;">Votre tableau est vide. Ajoutez une colonne pour commencer !</p>';
        } else {
            Logger.debug('🏗️ Rendu des colonnes', { count: boardData.workflows.length });
            boardData.workflows.forEach(workflow => {
                const columnEl = document.createElement('div');
                columnEl.className = 'workflow-column';
                columnEl.dataset.workflowId = workflow.id;

                columnEl.innerHTML = `
                    <div class="workflow-header" style="border-left: 4px solid ${workflow.color || '#1a73e8'}">
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
        Logger.success('✨ Tableau rendu avec succès');
        initDragAndDrop();
        generateDynamicKeywords(); // Mise à jour SEO des mots-clés
        saveData();
    }, 'Rendu du tableau');

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
    saveAddBtn.addEventListener('click', ErrorHandler.wrapSync(() => {
        const type = addModalType.value;
        const title = addModalInput.value.trim();
        if (title) {
            if (type === 'workflow') {
                const newWorkflow = { 
                    id: Date.now(), 
                    title, 
                    color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`, 
                    tasks: [] 
                };
                boardData.workflows.push(newWorkflow);
                trackEvent('create_workflow', 'Workflow', title);
                Logger.success('🆕 Nouvelle colonne créée', { id: newWorkflow.id, title, color: newWorkflow.color });
                ErrorHandler.showUserNotification(`✅ Colonne "${title}" créée !`, 'success');
            } else {
                const workflow = boardData.workflows.find(w => w.id == addModalWorkflowId.value);
                if (workflow) {
                    const newTask = { id: Date.now(), title, description: 'Cliquez pour éditer...', color: '#6b7280' };
                    workflow.tasks.push(newTask);
                    trackEvent('create_task', 'Task', title);
                    Logger.success('📝 Nouvelle tâche créée', { 
                        taskId: newTask.id, 
                        title, 
                        workflowTitle: workflow.title 
                    });
                    ErrorHandler.showUserNotification(`✅ Tâche "${title}" créée !`, 'success');
                } else {
                    Logger.error('❌ Impossible de trouver la colonne pour ajouter la tâche');
                }
            }
            renderBoard();
            closeModal(addModal);
        } else {
            Logger.warn('⚠️ Tentative d\'ajout avec titre vide');
            ErrorHandler.showUserNotification('⚠️ Veuillez entrer un titre', 'error');
        }
    }, 'Ajout d\'élément'));

    workflowForm.saveBtn.addEventListener('click', ErrorHandler.wrapSync(() => {
        const workflow = boardData.workflows.find(w => w.id == workflowForm.id.value);
        if (workflow) {
            const oldTitle = workflow.title;
            const oldColor = workflow.color;
            workflow.title = workflowForm.title.value;
            workflow.color = workflowForm.color.value;
            Logger.success('✏️ Colonne modifiée', { 
                id: workflow.id,
                oldTitle,
                newTitle: workflow.title,
                oldColor,
                newColor: workflow.color
            });
            renderBoard();
            ErrorHandler.showUserNotification(`✅ Colonne "${workflow.title}" modifiée !`, 'success');
        } else {
            Logger.error('❌ Impossible de trouver la colonne à modifier');
            ErrorHandler.showUserNotification('❌ Erreur lors de la modification de la colonne', 'error');
        }
        closeModal(workflowModal);
    }, 'Modification de colonne'));

    taskForm.saveBtn.addEventListener('click', () => {
        for (const workflow of boardData.workflows) {
            const task = workflow.tasks.find(t => t.id == taskForm.id.value);
            if (task) {
                const oldTitle = task.title;
                task.title = taskForm.title.value;
                task.description = taskForm.description.value;
                task.color = taskForm.color.value;
                Logger.success('✏️ Tâche modifiée', { 
                    id: task.id,
                    oldTitle,
                    newTitle: task.title,
                    workflowTitle: workflow.title
                });
                renderBoard();
                ErrorHandler.showUserNotification(`✅ Tâche "${task.title}" modifiée !`, 'success');
                break;
            }
        }
        closeModal(taskModal);
    });

    taskForm.deleteBtn.addEventListener('click', () => {
        if (!confirm('Voulez-vous vraiment supprimer cette tâche ?')) return;
        
        // Trouver le titre de la tâche avant suppression pour la notification
        let deletedTaskTitle = '';
        for (const workflow of boardData.workflows) {
            const task = workflow.tasks.find(t => t.id == taskForm.id.value);
            if (task) {
                deletedTaskTitle = task.title;
                break;
            }
        }
        
        boardData.workflows.forEach(w => { w.tasks = w.tasks.filter(t => t.id != taskForm.id.value) });
        Logger.success('🗑️ Tâche supprimée', { title: deletedTaskTitle });
        renderBoard();
        ErrorHandler.showUserNotification(`🗑️ Tâche "${deletedTaskTitle}" supprimée`, 'success');
        closeModal(taskModal);
    });

    // --- Gestionnaires d'Événements ---
    addWorkflowBtn.addEventListener('click', () => openAddModal('workflow'));

    // Gestionnaire pour le titre du projet
    projectTitle.addEventListener('click', ErrorHandler.wrapSync(() => {
        Logger.info('✏️ Ouverture de la modale de renommage du projet');
        projectNameInput.value = boardData.projectName || 'Online Kanban';
        projectModal.classList.add('visible');
        projectNameInput.focus();
        projectNameInput.select();
    }, 'Ouverture modale projet'));

    saveProjectBtn.addEventListener('click', ErrorHandler.wrapSync(() => {
        const newName = projectNameInput.value.trim();
        if (newName) {
            boardData.projectName = newName;
            updateProjectTitle();
            saveData();
            projectModal.classList.remove('visible');
            Logger.success('🏷️ Nom du projet modifié', { newName });
            ErrorHandler.showUserNotification('📝 Nom du projet modifié avec succès !', 'success');
        }
    }, 'Sauvegarde nom du projet'));

    projectNameInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') saveProjectBtn.click();
        if (e.key === 'Escape') projectModal.classList.remove('visible');
    });

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
            
            // Trouver le titre de la colonne avant suppression pour la notification
            const deletedWorkflow = boardData.workflows.find(w => w.id == deleteWorkflowBtn.dataset.workflowId);
            const deletedWorkflowTitle = deletedWorkflow ? deletedWorkflow.title : 'Colonne';
            const deletedTasksCount = deletedWorkflow ? deletedWorkflow.tasks.length : 0;
            
            boardData.workflows = boardData.workflows.filter(w => w.id != deleteWorkflowBtn.dataset.workflowId);
            Logger.success('🗑️ Colonne supprimée', { 
                title: deletedWorkflowTitle, 
                tasksDeleted: deletedTasksCount 
            });
            renderBoard();
            ErrorHandler.showUserNotification(
                `🗑️ Colonne "${deletedWorkflowTitle}" et ${deletedTasksCount} tâche(s) supprimée(s)`, 
                'success'
            );
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

    themeToggleBtn.addEventListener('click', ErrorHandler.wrapSync(() => {
        Logger.debug('🎨 Changement de thème');
        const isDark = document.body.classList.toggle('dark-mode');
        themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        Logger.success(`✅ Thème changé vers ${isDark ? 'sombre' : 'clair'}`);
    }, 'Changement de thème'));

    exportBtn.addEventListener('click', ErrorHandler.wrapSync(() => {
        Logger.info('📤 Début de l\'export des données');
        trackEvent('export_project', 'Data', boardData.projectName);
        const dataStr = JSON.stringify(boardData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Utiliser le nom du projet pour le nom du fichier, avec fallback
        const projectName = (boardData.projectName || 'Online Kanban').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `${projectName}.kanban`;
        a.click();
        URL.revokeObjectURL(url);
        Logger.success('📦 Export terminé avec succès', { 
            projectName: boardData.projectName,
            workflows: boardData.workflows.length,
            totalTasks: boardData.workflows.reduce((sum, w) => sum + w.tasks.length, 0)
        });
        ErrorHandler.showUserNotification('📦 Tableau exporté avec succès !', 'success');
    }, 'Export des données'));

    importInput.addEventListener('change', ErrorHandler.wrapSync((e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.kanban')) {
            Logger.info('📥 Début de l\'import des données', { fileName: file.name });
            processImportFile(file);
        } else { 
            Logger.warn('⚠️ Fichier invalide sélectionné', { fileName: file?.name });
            ErrorHandler.showUserNotification('⚠️ Veuillez sélectionner un fichier .kanban valide.', 'error');
        }
        e.target.value = ''; // Permet de réimporter le même fichier
    }, 'Import des données'));

    [addModal, taskModal, workflowModal, projectModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-close-btn')) {
                closeModal(modal);
            }
        });
    });

    addModalInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') saveAddBtn.click() });

    // --- Drag and Drop pour Import ---
    let dragCounter = 0;

    const handleDragEnter = (e) => {
        e.preventDefault();
        dragCounter++;
        document.body.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        dragCounter--;
        if (dragCounter === 0) {
            document.body.classList.remove('drag-over');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = ErrorHandler.wrapSync((e) => {
        e.preventDefault();
        dragCounter = 0;
        document.body.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.kanban')) {
                Logger.info('📥 Import par drag & drop', { fileName: file.name });
                processImportFile(file);
            } else {
                Logger.warn('⚠️ Fichier non supporté glissé', { fileName: file.name });
                ErrorHandler.showUserNotification('⚠️ Seuls les fichiers .kanban sont supportés', 'error');
            }
        }
    }, 'Drag and Drop');

    const processImportFile = (file) => {
        const reader = new FileReader();
        reader.onload = ErrorHandler.wrapSync((event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (importedData.workflows && Array.isArray(importedData.workflows)) {
                    const oldWorkflowsCount = boardData.workflows.length;
                    boardData = importedData;
                    // Assurer la compatibilité avec les anciens fichiers sans nom de projet
                    if (!boardData.projectName) {
                        boardData.projectName = 'Online Kanban';
                    }
                    updateProjectTitle();
                    renderBoard();
                    trackEvent('import_project', 'Data', boardData.projectName);
                    Logger.success('📋 Import terminé avec succès', { 
                        method: 'drag-drop',
                        oldWorkflows: oldWorkflowsCount,
                        newWorkflows: boardData.workflows.length,
                        totalTasks: boardData.workflows.reduce((sum, w) => sum + w.tasks.length, 0)
                    });
                    ErrorHandler.showUserNotification('📋 Tableau importé avec succès !', 'success');
                } else { 
                    throw new Error('Format de fichier invalide.'); 
                }
            } catch (error) { 
                Logger.error('💥 Erreur lors de l\'import', error);
                ErrorHandler.showUserNotification(`❌ Erreur: ${error.message}`, 'error');
            }
        }, 'Lecture du fichier d\'import par drag & drop');
        reader.readAsText(file);
    };

    // Événements drag and drop sur le document
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    // --- Initialisation ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.textContent = '☀️';
        Logger.debug('🌙 Thème sombre appliqué');
    }
    
    // Rendu initial et finalisation de l'initialisation
    updateProjectTitle();
    renderBoard();
    Logger.success('🎉 Application OnlineKanban initialisée avec succès !');
});