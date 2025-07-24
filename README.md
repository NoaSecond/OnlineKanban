# 📅 OnlineKanban

Une application web simple et moderne pour visualiser les tâches d'un projet sous forme de Kanban.

[App Web Vercel](https://online-kanban.vercel.app/)

## 📖 Sommaire

- [✨ Fonctionnalités](#-fonctionnalités)
- [🛠️ Stack Technique](#️-stack-technique)
- [🚀 Installation et Lancement](#-installation-et-lancement)
- [🤝 Contribuer](#-contribuer)

-----

## ✨ Fonctionnalités

  - **Thème Clair & Sombre** : Adaptez l'interface à vos préférences.

-----

## 🛠️ Stack Technique

  - **Frontend** : HTML5, CSS3, JavaScript (ES6+)
  - **Backend** : Node.js, Vercel Serverless Functions
  - **Parsing ICS** : `node-ical` pour l'analyse des fichiers calendrier
  - **Requêtes HTTP** : `axios` pour les appels API
  - **Gestion des Dates** : JavaScript natif avec support des fuseaux horaires

-----

## 🚀 Installation et Lancement

Pour lancer le projet en local sur votre machine, suivez ces étapes :

1.  **Clonez le dépôt**

    ```bash
    git clone https://github.com/NoaSecond/OnlineKanban
    cd OnlineKanban
    ```

2.  **Installez les dépendances**
    (Assurez-vous d'avoir Node.js et npm installés)

    ```bash
    npm install
    ```

3.  **Installez la CLI de Vercel**
    Si vous ne l'avez pas déjà, installez l'outil en ligne de commande de Vercel.

    ```bash
    npm install -g vercel
    ```

4.  **Lancez le serveur de développement local**
    Cette commande va simuler l'environnement Vercel sur votre machine.

    ```bash
    vercel dev --listen 3001
    ```

5.  **Ouvrez votre navigateur** et rendez-vous sur [http://localhost:3001](http://localhost:3001).

-----

## 🤝 Contribuer

Les contributions sont les bienvenues ! Si vous souhaitez améliorer ce projet, n'hésitez pas à proposer des modifications.

1.  **Forkez** le projet.
2.  Créez une nouvelle branche pour votre fonctionnalité (`git checkout -b feature/NouvelleFonctionnalite`).
3.  Faites vos modifications et **committez-les**.
      - **Important** : Ce projet utilise **Gitmoji** pour les messages de commit. Veuillez préfixer vos commits avec l'emoji approprié pour décrire le changement. La liste complète est disponible sur [gitmoji.dev](https://gitmoji.dev/).
      - Exemple : `git commit -m "✨ Ajout d'une nouvelle fonctionnalité incroyable"`
4.  **Poussez** vos changements vers votre fork (`git push origin feature/NouvelleFonctionnalite`).
5.  Ouvrez une **Pull Request**.