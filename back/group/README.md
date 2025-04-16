<<<<<<< HEAD
# Temp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.16.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
=======
 1. `http://localhost:8093/fournisseurs/api/suppliers/all`
   - Description : Cette URL fournit probablement une liste de tous les fournisseurs.
   - Objectif : Elle permet de récupérer tous les fournisseurs du système. Il s'agit probablement d'une requête `GET` qui retourne des données relatives aux fournisseurs.



 Service à `http://localhost:8089/SupplierContracts/api/suppliers/...`

Ces points de terminaison sont exposés par le service Supplier Contracts :

2. `http://localhost:8089/SupplierContracts/api/suppliers/all`
   - Description : Ce point de terminaison fournit une liste de tous les fournisseurs.
   - Objectif : Similaire au précédent, mais il s'agit probablement du service que vous souhaitez atteindre après avoir réécrit le chemin de `/fournisseurs/` vers `/SupplierContracts/`.

3. `http://localhost:8089/SupplierContracts/api/suppliers/add`
   - Description : Ce point de terminaison permet d'ajouter un nouveau fournisseur.
   - Objectif : Il permet de créer un nouveau fournisseur dans le système. Il est probable que ce soit une requête `POST` pour envoyer les informations du fournisseur.

4. `http://localhost:8089/SupplierContracts/api/suppliers/5`
   - Description : Ce point de terminaison récupère les informations d'un fournisseur spécifique avec l'ID `5`.
   - Objectif : Il permet de consulter les détails d'un fournisseur particulier. Cela devrait être une requête `GET` avec l'ID du fournisseur dans l'URL.

5. `PUT http://localhost:8089/SupplierContracts/api/suppliers/update/5`
   - Description : Ce point de terminaison met à jour les informations du fournisseur avec l'ID `5`.
   - Objectif : Il permet de mettre à jour les informations d'un fournisseur existant. C'est une requête `PUT` qui envoie des données modifiées pour ce fournisseur.

6. `DELETE http://localhost:8089/SupplierContracts/api/suppliers/delete/1`
   - Description : Ce point de terminaison supprime le fournisseur avec l'ID `1`.
   - Objectif : Il permet de supprimer un fournisseur spécifique. Il s'agit d'une requête `DELETE`.

7. `http://localhost:8089/SupplierContracts/api/suppliers/performance-report`
   - Description : Ce point de terminaison fournit un rapport de performance des fournisseurs.
   - Objectif : Il permet d'obtenir un rapport détaillant la performance des fournisseurs. Cela pourrait être une requête `GET` qui retourne des statistiques ou des données sur la performance.

8. `http://localhost:8089/SupplierContracts/api/suppliers/top5-by-reliability`
   - Description : Ce point de terminaison fournit un classement des 5 fournisseurs les plus fiables.
   - Objectif : Il permet d'obtenir les 5 meilleurs fournisseurs en fonction de leur fiabilité. Il s'agit probablement d'une requête `GET` qui retourne ces fournisseurs en fonction de critères spécifiques.

9. `http://localhost:8089/SupplierContracts/api/suppliers/status-distribution`
   - Description : Ce point de terminaison fournit la répartition des statuts des fournisseurs.
   - Objectif : Il permet de visualiser la distribution des différents statuts des fournisseurs (par exemple, actif, inactif, suspendu, etc.). Cela pourrait être une requête `GET` qui retourne des statistiques.

10. `http://localhost:8089/SupplierContracts/api/suppliers/new-suppliers-last-30-days`
    - Description : Ce point de terminaison fournit une liste des fournisseurs ajoutés au cours des 30 derniers jours.
    - Objectif : Il permet de voir les nouveaux fournisseurs ajoutés récemment. C'est probablement une requête `GET` qui renvoie cette liste.

11. `http://localhost:8089/SupplierContracts/api/suppliers/bulk-import`
    - Description : Ce point de terminaison permet d'importer en masse des fournisseurs.
    - Objectif : Il permet d'ajouter plusieurs fournisseurs en une seule fois, généralement via un fichier ou une autre méthode d'importation en masse.

12. `http://localhost:8089/SupplierContracts/api/suppliers/bulk-export`
    - Description : Ce point de terminaison permet d'exporter en masse les données des fournisseurs.
    - Objectif : Il permet d'exporter une grande quantité de données sur les fournisseurs dans un format comme CSV, Excel, etc.

13. `http://localhost:8089/SupplierContracts/api/suppliers/update-status/2`
    - Description : Ce point de terminaison permet de mettre à jour le statut du fournisseur avec l'ID `2`.
    - Objectif : Il permet de modifier le statut d'un fournisseur spécifique (par exemple, le rendre actif, suspendu, etc.). Cela pourrait être une requête `PUT` ou `PATCH` qui envoie un nouveau statut.
>>>>>>> 88d2d2fbe3359d480596097a7aed19af1d16351c
