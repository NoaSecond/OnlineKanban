# 📅 OnlineKanban

Une application web moderne et responsive pour gérer vos projets avec un tableau Kanban intuitif.

## ✨ Fonctionnalités

- **Gestion de Colonnes** : Créez, renommez, supprimez et colorez vos colonnes de workflow
- **Gestion de Tâches** : Ajoutez, éditez (titre, description, couleur) et supprimez des tâches
- **Gestion de Projets** : Renommez votre projet et organisez vos tableaux
- **Drag & Drop** : Déplacez facilement les tâches entre les colonnes avec animations fluides
- **Drag & Drop Import** : Glissez directement un fichier `.kanban` sur la page pour l'importer
- **Persistance Locale** : Sauvegarde automatique dans votre navigateur (localStorage)
- **Import/Export** : Partagez ou sauvegardez vos tableaux au format `.kanban` (JSON)
- **Thème Clair & Sombre** : Interface adaptative selon vos préférences
- **Design Responsive** : Optimisé pour tous les appareils (mobile, tablette, desktop)
- **Notifications** : Retours visuels pour toutes les actions (ajout, modification, suppression)
- **Optimisé SEO** : Meta tags, Open Graph, Schema.org pour un meilleur référencement

-----

## 🛠️ Stack Technique

- **Frontend** : HTML5, CSS3, JavaScript (ES6+)
- **Styling** : CSS Grid, Flexbox, CSS Variables, Media Queries
- **Interactions** : Drag & Drop avec `SortableJS`, FileReader API
- **Storage** : localStorage pour la persistance côté client
- **SEO** : Meta tags, Open Graph, Twitter Cards, Schema.org
- **PWA Ready** : Web App Manifest, Service Worker ready
- **Déploiement** : Compatible Vercel, Apache, Nginx
- **Aucun backend** : Application 100% côté client

-----

## 🚀 Installation et Lancement

### Option 1 : Utilisation locale simple
```bash
# Clonez le dépôt
git clone https://github.com/NoaSecond/OnlineKanban
cd OnlineKanban

# Ouvrez directement le fichier HTML
# Double-cliquez sur public/index.html ou ouvrez-le dans votre navigateur
```

### Option 2 : Serveur de développement local
```bash
# Avec Python (si installé)
cd public
python -m http.server 3000

# Avec Node.js et serve
npx serve public -p 3000

# Avec PHP (si installé)
cd public
php -S localhost:3000
```

### Option 3 : Déploiement Vercel
```bash
# Installez la CLI Vercel
npm install -g vercel

# Déployez
vercel

# Ou en mode développement
vercel dev
```

Puis ouvrez votre navigateur sur `http://localhost:3000`

-----

## 📱 Utilisation

### Actions de base
1. **Renommer le projet** : Cliquez sur le titre du projet dans le header
2. **Créer une colonne** : Cliquez sur "➕ Ajouter Colonne" dans le header
3. **Ajouter une tâche** : Cliquez sur le menu "⋮" d'une colonne puis "Ajouter une tâche"
4. **Éditer** : Cliquez sur une tâche ou une colonne pour l'éditer
5. **Déplacer** : Glissez-déposez les tâches entre les colonnes
6. **Changer de thème** : Utilisez le bouton 🌙 dans le header

### Import/Export
- **Exporter** : Utilisez "Exporter (.kanban)" pour sauvegarder votre tableau
- **Importer par bouton** : Utilisez "Importer (.kanban)" pour charger un tableau
- **Importer par drag & drop** : Glissez directement un fichier `.kanban` sur la page

### Couleurs personnalisées
- Chaque colonne peut avoir sa propre couleur
- Chaque tâche peut être colorée individuellement
- Les couleurs sont sauvegardées avec vos données

-----

## 📁 Structure du Projet

```
OnlineKanban/
├── public/                 # Fichiers statiques
│   ├── index.html         # Page principale
│   ├── style.css          # Styles CSS
│   ├── script.js          # Logique JavaScript
│   ├── manifest.json      # Web App Manifest
│   └── *.png             # Icônes et favicons
├── sitemap.xml           # Plan du site
├── robots.txt            # Instructions pour les crawlers
├── .htaccess            # Configuration Apache
├── vercel.json          # Configuration Vercel
├── package.json         # Métadonnées du projet
└── README.md           # Documentation
```

## � Fonctionnalités Avancées

- **Design Responsive** : Adaptation automatique mobile/tablette/desktop
- **Notifications visuelles** : Feedback pour chaque action utilisateur
- **Animations fluides** : Transitions CSS pour une expérience agréable
- **Thème adaptatif** : Détection automatique des préférences système
- **SEO optimisé** : Meta tags complets pour le référencement
- **PWA Ready** : Peut être installée comme une app native
- **Performance** : Compression et cache optimisés
- **Accessibilité** : Structure sémantique et contrastes respectés

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