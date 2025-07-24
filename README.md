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

> **Alternative** : Vous pouvez aussi simplement ouvrir le fichier `public/index.html` directement dans votre navigateur pour une utilisation locale sans serveur.

-----

## 📱 Utilisation

1. **Créer une colonne** : Cliquez sur "➕ Ajouter Colonne" dans le header
2. **Ajouter une tâche** : Cliquez sur le menu "⋮" d'une colonne puis "Ajouter une tâche"
3. **Éditer** : Cliquez sur une tâche ou une colonne pour l'éditer
4. **Déplacer** : Glissez-déposez les tâches entre les colonnes
5. **Sauvegarder** : Utilisez "Exporter (.kanban)" pour sauvegarder votre tableau
6. **Restaurer** : Utilisez "Importer (.kanban)" pour charger un tableau sauvegardé

-----

## 🎨 Fonctionnalités Avancées

- **Couleurs personnalisées** : Chaque colonne et tâche peut avoir sa propre couleur
- **Thème sombre/clair** : Basculez avec le bouton 🌙 dans le header
- **Persistance automatique** : Vos données sont sauvegardées automatiquement dans le navigateur
- **Format d'export** : Les fichiers `.kanban` sont au format JSON pour une compatibilité maximale

-----

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

-----

## 👨‍💻 Auteur

**Noa Second**
- Site web : [noasecond.com](https://noasecond.com)
- GitHub : [@NoaSecond](https://github.com/NoaSecond)

-----

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à proposer une pull request.

-----

## ⭐ Support

Si ce projet vous plaît, n'hésitez pas à lui donner une étoile sur GitHub !