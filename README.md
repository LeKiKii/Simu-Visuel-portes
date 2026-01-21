# Simulateur de Menuiserie

Une application web interactive permettant de visualiser des portes sur une photo de façade ou d'intérieur en ajustant la perspective.

## Fonctionnalités

- **Import de photo** : Chargez une photo de votre environnement.
- **Sélection de modèle** : Choisissez parmi différents modèles de portes.
- **Ajustement de perspective** : Utilisez les 4 points de contrôle pour adapter la porte à l'ouverture de votre photo (correction de perspective).

## Installation et Lancement

Pour lancer le projet localement, vous avez besoin de [Node.js](https://nodejs.org/) installé sur votre machine.

1. **Installer les dépendances**
   Ouvrez un terminal dans le dossier du projet et exécutez :
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement**
   Une fois l'installation terminée, lancez :
   ```bash
   npm run dev
   ```

3. **Accéder à l'application**
   Le terminal vous indiquera une adresse locale (généralement `http://localhost:5173`). Ouvrez ce lien dans votre navigateur.

## Technologies

- React
- Vite
- Tailwind CSS
- Mathématiques de transformation homographique (Matrix3D)
