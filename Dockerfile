# Utilisation d'une image Node.js officielle
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port utilisé par ton application (par exemple 3000)
EXPOSE 4000

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]
