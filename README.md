# **JO Telesport** 🏅  


L'application **JO Telesport** est une application construite sur le Framework Angular qui permet de visualiser les données relatives aux Jeux Olympiques.  
L'application est développée dans le cadre de la formation [OpenClassroom](https://openclassrooms.com) Java Dev FullStack Projet 2 "Développez le front-end en utilisant Angular".  
L'application propose un Dashboard permettant d'avoir une vision d'ensemble des données Olympiques.  
Un Drill down dans le graphique permet d'accéder à des détails concernant un pays en particulier.  

---

## **Fonctionnalités principales**  
- **Chiffres clés** : Affichage de compteurs globaux pour le nombre de participations, médailles et athlètes par pays.  
- **Graphs interactifs** : Affichage des données sous forme de graphiques via la librairie ngx-graphs

---

## **Installer l'application**
*Prérequis*:
Avant de commencer, installer : 
- Node.js
- Angular CLI


*Cloner le repos*: 

   ```shell
   git clone https://github.com/jceintrey/JO-Telesport-front.git
   cd JO-Telesport-front
   ```  
*Installer les dépendances*:

   ```shell
   npm install
   ```  

---

## **Lancer l'application**  

   Lancer l'application localement :  
   ```bash
   ng serve
   ```  
   Ouvrir [http://localhost:4200](http://localhost:4200) 


  

---

## **Structure du projet**  
- **`src/app/core/models`** : Contient les interfaces Typescript
--**`src/app/core/services`** : Contient les services
--**`src/app/pages`** : Contient les composants
- **`src/assets`** : Contient les fichiers statiques
- **`src/styles.scss`** : Fichier global pour les styles SCSS.  


---

## **Documentation**  
La documentation est générée avec **Compodoc**.  

Elle est générée à chaque merge sur la branche via github Pages main mais peut être générée en locale.

   ```bash
   npm run compodoc
   ```  
   Ouvrir [http://localhost:8080](http://localhost:8080) pour visualiser la documentation générée.  

---

## **Contribution**  
Ce code est un fork de [Developpez-le-front-end-en-utilisant-Angular](https://github.com/OpenClassrooms-Student-Center/Developpez-le-front-end-en-utilisant-Angular)

---

## **Auteur**  
Créé par **jceintrey**, étudiant développeur d'application Full Stack.

---

