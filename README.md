## pour lancer le backend (node express) : 
# au préalable :
créer une bdd mysql ainsi qu'un utilisateur et mettre les variables de connexion dans le fichier .env avant de lancer la commande. Le serveur va créer les tables à son lancement si celles ci n'existent pas encore.

node ./backend/server.js

## info
les mots de passes sont hashés et l'application utilise un token JWT pour l'authentification.