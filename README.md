# 📅 OnlineKanban

Une application web simple et moderne pour visualiser les tâches d'un projet sous forme de Kanban.

## ✨ Fonctionnalités

- **Gestion de Colonnes** : Créez, renommez, supprimez et colorez vos colonnes de workflow.
- **Gestion de Tâches** : Ajoutez, éditez (titre, description, couleur) et supprimez des tâches.
- **Drag & Drop** : Déplacez facilement les tâches entre les colonnes.
- **Persistance Locale** : Votre tableau est automatiquement sauvegardé dans votre navigateur.
- **Import/Export** : Partagez ou sauvegardez vos tableaux au format `.kanban` (JSON).
- **Thème Clair & Sombre** : Adaptez l'interface à vos préférences.

-----

## 🛠️ Stack Technique

- **Frontend** : HTML5, CSS3, JavaScript (ES6+)
- **Drag & Drop** : Bibliothèque `SortableJS`
- **Déploiement** : Vercel
- **Aucun backend** : Application entièrement côté client.

-----

## 🚀 Installation et Lancement

Pour lancer le projet en local sur votre machine, suivez ces étapes :

1.  **Clonez le dépôt**
    ```bash
    git clone https://github.com/NoaSecond/OnlineKanban
    cd OnlineKanban
    ```

2.  **Installez la CLI de Vercel** (si nécessaire)
    ```bash
    npm install -g vercel
    ```

3.  **Lancez le serveur de développement local**
    ```bash
    vercel dev
    ```

4.  **Ouvrez votre navigateur** et rendez-vous sur `http://localhost:3000`.