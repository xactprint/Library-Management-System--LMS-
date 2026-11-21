# Système de gestion de bibliothèque
## Rapport de conception, modélisation et implémentation

**Projet :** Library Management System (LMS)  
**Langage d’implémentation :** TypeScript  
**Approche :** Analyse et conception orientées objet (OOA/OOD)  
**Version :** Rapport révisé en français

---

## Résumé

Ce projet porte sur l’analyse, la conception et l’implémentation technique partielle d’un système simplifié de gestion de bibliothèque. L’objectif est de traduire les besoins fonctionnels en modèles orientés objet, en diagrammes UML et en composants TypeScript illustrant les principales règles métier.

Le système distingue les ouvrages bibliographiques de leurs exemplaires physiques et modélise les utilisateurs, les membres, les bibliothécaires, les administrateurs et les emprunts. L’architecture cible repose sur trois couches : présentation, logique métier et accès aux données. La couche métier est représentée par cinq services TypeScript ; quatre repositories en mémoire illustrent les responsabilités d’accès aux données.

Les tests exécutés couvrent les services, les repositories et un scénario d’intégration de bout en bout au niveau applicatif. Les sept suites dédiées totalisent 127 tests réussis. Onze tests métier initiaux, exécutés séparément depuis le point d’entrée `src/index.ts`, ont également réussi. Ces résultats valident les scénarios testés, sans constituer une preuve exhaustive de l’absence de défauts.

Le prototype reste volontairement limité : il n’intègre ni base de données persistante ni interface graphique, et les repositories ne sont pas encore connectés aux services. Huit exigences fonctionnelles sont considérées comme implémentées au niveau de la logique métier et trois comme partiellement implémentées.

## Introduction générale

La gestion d’une bibliothèque nécessite de suivre les ouvrages, leurs exemplaires physiques, les membres inscrits et les transactions d’emprunt et de retour. Un système informatique peut faciliter ces opérations, réduire les erreurs de suivi et fournir des informations sur la disponibilité des documents et les retards.

Le présent travail consiste à concevoir un système simplifié de gestion de bibliothèque en appliquant les principes de l’analyse et de la conception orientées objet. Le projet couvre l’analyse des besoins, la définition d’une architecture logicielle, la modélisation UML, la modélisation des données et une démonstration technique en TypeScript.

Le périmètre est académique. Il ne vise pas à produire une application commerciale complète, mais à montrer comment les concepts étudiés peuvent être traduits en classes, services, repositories et tests.

## Partie 1 – Analyse des besoins

### 1.1 Présentation du système

Le Library Management System (LMS) est un système destiné à organiser les principales activités d’une bibliothèque : gestion du catalogue, gestion des membres, recherche d’ouvrages, contrôle de disponibilité, emprunts, retours, suivi des échéances et production de statistiques.

Le modèle distingue :
- **Book** : la notice bibliographique d’un titre.
- **BookCopy** : un exemplaire physique individuel associé à un titre.
- **Member** : une personne inscrite pouvant emprunter des exemplaires.
- **Loan** : une transaction reliant un membre à un exemplaire pendant une période donnée.
- **User** : le compte commun aux différents rôles du système.

### 1.2 Acteurs

| Acteur | Responsabilités principales |
|---|---|
| Membre (Member) | Rechercher des ouvrages, consulter leur disponibilité, consulter son historique et ses échéances. |
| Bibliothécaire (Librarian) | Gérer les ouvrages et les membres, traiter les emprunts et les retours, surveiller les retards. |
| Administrateur (Administrator) | Gérer les comptes du personnel, administrer les paramètres et consulter les rapports. |

Ces responsabilités décrivent le périmètre fonctionnel attendu. Toutes ne sont pas matérialisées par une interface dans le prototype.

### 1.3 Exigences fonctionnelles

| ID | Exigence fonctionnelle |
|---|---|
| FR01 | Ajouter, modifier et supprimer des ouvrages. |
| FR02 | Rechercher des ouvrages par titre, auteur ou ISBN. |
| FR03 | Inscrire et gérer les membres. |
| FR04 | Vérifier la disponibilité des exemplaires. |
| FR05 | Enregistrer l’emprunt d’un exemplaire par un membre. |
| FR06 | Enregistrer le retour d’un exemplaire. |
| FR07 | Suivre les dates d’emprunt et les dates limites de retour. |
| FR08 | Identifier les emprunts en retard. |
| FR09 | Consulter l’historique des emprunts. |
| FR10 | Gérer les comptes des bibliothécaires et les paramètres du système. |
| FR11 | Générer des rapports statistiques. |

### 1.4 Exigences non fonctionnelles

Les exigences non fonctionnelles retenues comme objectifs de conception sont :

- **Facilité d’utilisation :** les opérations courantes doivent être compréhensibles.
- **Sécurité :** les comptes et les opérations doivent être protégés par une authentification et des autorisations adaptées.
- **Performance :** les recherches et opérations usuelles doivent rester réactives.
- **Fiabilité :** les règles métier doivent empêcher les états incohérents.
- **Maintenabilité :** le code doit être organisé en composants aux responsabilités distinctes.
- **Évolutivité :** l’architecture doit permettre l’ajout ultérieur d’une base de données et d’interfaces.

Ces éléments constituent des objectifs de conception ; ils ne sont pas tous mesurés par des tests de performance ou de sécurité dans le prototype.

### 1.5 Règles métier

Les principales règles métier définies sont :

1. Seul un membre inscrit et actif peut emprunter.
2. Un exemplaire doit être disponible au moment de l’emprunt.
3. Chaque emprunt possède une date d’emprunt et une date limite de retour.
4. La date limite doit être postérieure à la date d’emprunt.
5. Un membre peut avoir au maximum trois emprunts actifs.
6. Un exemplaire ne peut pas être emprunté simultanément dans deux emprunts actifs.
7. Lorsqu’un emprunt est retourné, son statut devient `Returned` et l’exemplaire redevient `Available`.
8. Un emprunt actif est considéré en retard lorsque la date de référence dépasse sa date limite.
9. Le retard est calculé à partir des dates ; il ne constitue pas un statut supplémentaire de l’emprunt.

La limite de trois emprunts actifs est une règle retenue pour ce projet.

## Partie 2 – Conception de l’architecture du système

### 2.1 Architecture en trois couches

L’architecture cible est organisée en trois couches :

1. **Couche de présentation (Presentation Layer)** : interfaces destinées aux membres, bibliothécaires et administrateurs.
2. **Couche de logique métier (Business Logic Layer)** : services chargés d’appliquer les règles et de coordonner les opérations.
3. **Couche d’accès aux données (Data Access Layer)** : repositories responsables des opérations de lecture et d’écriture des données.

Cette séparation vise à limiter le couplage entre l’interface, les règles métier et le stockage.

### 2.2 Couche de présentation

La conception prévoit trois espaces :
- Interface membre ;
- tableau de bord du bibliothécaire ;
- tableau de bord de l’administrateur.

Ces interfaces sont décrites dans l’architecture conceptuelle, mais elles ne sont pas développées dans la version TypeScript actuelle.

### 2.3 Couche de logique métier

Cinq services ont été implémentés :

| Service | Responsabilité |
|---|---|
| `AuthenticationService` | Enregistrer des utilisateurs en mémoire, vérifier les identifiants via une abstraction et gérer l’utilisateur courant. |
| `BookService` | Gérer le catalogue, rechercher les ouvrages et gérer les exemplaires. |
| `MemberService` | Inscrire, rechercher, activer et désactiver les membres. |
| `LoanService` | Coordonner les emprunts, les retours et les consultations d’emprunts. |
| `ReportService` | Produire des statistiques à partir de `BookService` et `LoanService`. |

### 2.4 Couche d’accès aux données

Quatre repositories ont été créés :
- `BookRepository`
- `MemberRepository`
- `LoanRepository`
- `UserRepository`

Ils fournissent des opérations de base sur des collections en mémoire. Ils sont testés séparément, mais ne sont pas connectés aux cinq services dans cette version. Il ne faut donc pas présenter la couche d’accès aux données comme entièrement intégrée.

### 2.5 Modèle de données conceptuel

Le modèle de données proposé comprend cinq entités principales :

| Entité | Rôle |
|---|---|
| USER | Informations communes aux comptes utilisateur. |
| MEMBER | Informations propres à l’adhésion d’un membre. |
| BOOK | Informations bibliographiques d’un titre. |
| BOOK_COPY | Exemplaire physique d’un ouvrage. |
| LOAN | Transaction d’emprunt reliant un membre à un exemplaire. |

Principales relations :
- Un `USER` peut être associé à un `MEMBER` ; le modèle prévoit une relation un-à-un via `user_id`.
- Un `BOOK` peut posséder plusieurs `BOOK_COPY`.
- Un `MEMBER` peut avoir plusieurs `LOAN`.
- Un `BOOK_COPY` peut apparaître dans plusieurs emprunts successifs au cours du temps, mais un seul emprunt actif à la fois.

### 2.6 Responsabilités et limites de l’architecture

La structure en trois couches constitue l’architecture cible. Dans le prototype, la logique métier est la partie la plus développée. La couche de présentation demeure conceptuelle, les repositories fonctionnent indépendamment et aucune base de données persistante n’est connectée.

## Partie 3 – Analyse orientée objet et modélisation UML

### 3.1 Principes de modélisation

L’analyse orientée objet identifie les entités du domaine, leurs attributs, leurs opérations et leurs relations. La conception utilise notamment l’encapsulation, l’abstraction, l’héritage et le polymorphisme.

### 3.2 Classes principales

| Classe | Rôle |
|---|---|
| `User` | Classe abstraite contenant les informations communes aux utilisateurs. |
| `Member` | Représente un membre et son statut d’adhésion. |
| `Librarian` | Représente un bibliothécaire. |
| `Administrator` | Représente un administrateur. |
| `Book` | Représente un titre bibliographique. |
| `BookCopy` | Représente un exemplaire physique. |
| `Loan` | Représente une transaction d’emprunt. |

`Member`, `Librarian` et `Administrator` héritent de `User`. La classe `User` déclare notamment la méthode abstraite `getRole()`, implémentée par les sous-classes.

### 3.3 Relations entre les classes

- **Héritage :** `Member`, `Librarian` et `Administrator` étendent `User`.
- **Association :** `Loan` référence un `Member` et un `BookCopy`.
- **Relation titre/exemplaires :** un `Book` peut être associé à plusieurs `BookCopy`.

Dans le code, `BookCopy` conserve une référence vers `Book`. Cette implémentation établit une association objet. Si le diagramme UML utilise une composition, celle-ci doit être justifiée par une véritable contrainte de cycle de vie ; sinon, une association simple ou une agrégation est plus fidèle au code.

### 3.4 Modèle de cas d’utilisation

Les acteurs sont le membre, le bibliothécaire et l’administrateur. Les cas d’utilisation décrivent notamment la recherche d’ouvrages, la consultation de disponibilité, la gestion des ouvrages et des membres, l’emprunt, le retour, le suivi des retards et la génération de rapports.

Le cas d’utilisation « Emprunter un ouvrage » comprend les contrôles nécessaires : validation du membre, vérification de la limite d’emprunts, vérification de disponibilité et mise à jour du statut de l’exemplaire.

**Emplacement du diagramme :** insérer ici le diagramme UML de cas d’utilisation réellement produit.

### 3.5 Diagramme de classes

Le diagramme de classes doit représenter les sept classes métier, leurs attributs essentiels, leurs opérations et les relations d’héritage et d’association décrites ci-dessus.

**Emplacement du diagramme :** insérer ici le diagramme de classes final, après vérification de sa conformité au code.

### 3.6 Diagrammes de séquence

Deux scénarios ont été modélisés :

**Emprunt :** le bibliothécaire sélectionne le membre et l’exemplaire ; le service vérifie les conditions ; un emprunt est créé ; l’exemplaire passe à `Issued`. En cas d’échec d’une validation, l’opération est rejetée.

**Retour :** le bibliothécaire sélectionne l’emprunt actif ; le système vérifie l’emprunt, calcule éventuellement le retard, enregistre la date de retour, passe le prêt à `Returned` et l’exemplaire à `Available`.

Les diagrammes décrivent le comportement architectural attendu. Ils ne prouvent pas que l’interface, les repositories et une base de données sont tous intégrés dans le prototype.

**Emplacements des diagrammes :** insérer les diagrammes de séquence d’emprunt et de retour.

### 3.7 Diagramme d’état

Deux notions doivent être distinguées :

- `CopyStatus` décrit l’état de l’exemplaire physique : `Available` ou `Issued`.
- `LoanStatus` décrit l’état de la transaction : `Active` ou `Returned`.

Ainsi, `Returned` n’est pas une valeur de `CopyStatus`. Lorsqu’un emprunt est retourné, le `LoanStatus` devient `Returned` et le `CopyStatus` de l’exemplaire revient à `Available`.

**Emplacement du diagramme :** insérer le diagramme d’état corrigé. Il doit représenter les états de l’objet qu’il décrit et ne pas mélanger les deux énumérations.

## Partie 4 – Modélisation des données, des fonctions et du comportement

### 4.1 Modélisation des données

Le schéma relationnel proposé repose sur les entités suivantes :

**USER**
- `user_id` : clé primaire ;
- `full_name` ;
- `email` : unique ;
- `password_hash` ;
- `role`.

**MEMBER**
- `member_id` : clé primaire ;
- `user_id` : clé étrangère unique vers USER ;
- `membership_number` : unique ;
- `registration_date` ;
- `is_active`.

**BOOK**
- `book_id` : clé primaire ;
- `title` ;
- `author` ;
- `isbn` : unique dans le modèle proposé ;
- `publisher`.

**BOOK_COPY**
- `copy_id` : clé primaire ;
- `book_id` : clé étrangère vers BOOK ;
- `status` ;
- `shelf_location`.

**LOAN**
- `loan_id` : clé primaire ;
- `member_id` : clé étrangère vers MEMBER ;
- `copy_id` : clé étrangère vers BOOK_COPY ;
- `issue_date` ;
- `due_date` ;
- `return_date` ;
- `status`.

L’ISBN identifie une édition bibliographique et non un exemplaire physique individuel. Le `copy_id` identifie chaque exemplaire.

### 4.2 Intégrité et règles de cohérence

Les contraintes envisagées comprennent :
- unicité des clés primaires et des identifiants métier concernés ;
- validité des clés étrangères ;
- existence des références membre, ouvrage et exemplaire ;
- cohérence entre statut et date de retour ;
- au plus un emprunt actif par exemplaire ;
- respect de la limite de trois emprunts actifs par membre.

Dans le prototype, plusieurs contrôles sont appliqués par les classes et services. Les contraintes relationnelles ne sont pas imposées par un véritable moteur de base de données, puisque celui-ci n’est pas connecté.

### 4.3 Modélisation fonctionnelle

Les opérations fonctionnelles principales sont l’ajout et la recherche d’ouvrages, la création d’exemplaires, l’inscription des membres, la vérification de disponibilité, l’emprunt, le retour, le suivi des échéances et la génération de rapports.

### 4.4 Modélisation comportementale

Le comportement est principalement déterminé par les événements d’emprunt et de retour. Le système valide le membre, contrôle la disponibilité, vérifie la limite d’emprunts, crée ou clôture une transaction et met à jour l’état de l’exemplaire.

**Emplacement du diagramme :** insérer le diagramme entité-association et les modèles fonctionnels/comportementaux effectivement produits.

## Partie 5 – Passage de la conception à l’implémentation

### 5.1 Environnement et organisation du projet

L’implémentation est réalisée en TypeScript. Le projet est organisé autour des dossiers `models`, `repositories`, `security`, `services` et `tests`, ainsi que du fichier d’entrée `src/index.ts`.

Les vérifications de compilation sont effectuées avec :

```powershell
npx tsc --noEmit
```

Les tests sont exécutés avec `ts-node`.

### 5.2 Classe Book

La classe `Book` représente une notice bibliographique. Elle encapsule notamment l’identifiant, le titre, l’auteur, l’ISBN et l’éditeur. Des accesseurs permettent de consulter les informations et une méthode de mise à jour modifie les informations bibliographiques autorisées.

### 5.3 Classe BookCopy

La classe `BookCopy` représente un exemplaire physique. Elle conserve un identifiant, une référence vers le `Book`, un statut et un emplacement en rayon.

L’énumération `CopyStatus` comporte uniquement `Available` et `Issued`. Les méthodes `markAsIssued()` et `markAsAvailable()` contrôlent les transitions de disponibilité.

### 5.4 Classe User et classe Member

`User` est une classe abstraite contenant les attributs communs : identifiant utilisateur, nom complet, adresse électronique et empreinte de mot de passe. Elle déclare `getRole()` et délègue la vérification du mot de passe à l’interface `PasswordVerifier`.

`Member` étend `User` et ajoute l’identifiant de membre, le numéro d’adhésion, la date d’inscription et le statut actif/inactif.

### 5.5 Classes Librarian et Administrator

`Librarian` et `Administrator` étendent `User` et implémentent `getRole()`. Le bibliothécaire possède notamment un identifiant d’employé et une date d’embauche. L’administrateur possède un niveau d’accès descriptif. La modélisation des rôles ne signifie pas qu’un système complet de permissions est opérationnel.

### 5.6 Classe Loan

`Loan` représente une transaction entre un membre et un exemplaire. Elle contient notamment les dates d’emprunt, d’échéance et de retour, ainsi que le statut.

L’énumération `LoanStatus` définit `Active` et `Returned`. Le constructeur vérifie le statut du membre, la cohérence des dates, la limite d’emprunts et la disponibilité de l’exemplaire. Lors de la création, l’exemplaire passe à `Issued`.

La méthode `markAsReturned()` enregistre le retour, modifie le statut du prêt et rend l’exemplaire disponible. `getOverdueDays()` calcule le retard à partir de la date limite et de la date de référence ou de retour.

### 5.7 Tests initiaux des modèles et règles métier

Onze tests initiaux exécutés depuis `src/index.ts` ont vérifié les interactions entre les modèles et plusieurs règles métier : création d’emprunt, changement de statut, retour, rejet d’un double retour, rejet d’un exemplaire déjà emprunté, rejet d’un membre inactif, limite de trois emprunts et validation des dates.

Résultat rapporté : 11 tests réussis, 0 échec. Ces onze tests sont distincts des sept suites dédiées présentées dans la partie 6.

## Partie 6 – Implémentation de l’architecture du système

### 6.1 Service LoanService

`LoanService` coordonne les emprunts et les retours. Il crée les objets `Loan`, attribue les identifiants, recherche les emprunts, retourne la liste des emprunts et calcule le nombre d’emprunts actifs d’un membre. Les données sont conservées dans un tableau en mémoire.

Tests : 17/17 réussis.

### 6.2 Service BookService

`BookService` gère deux collections en mémoire : les notices `Book` et les exemplaires `BookCopy`. Il permet d’ajouter et de rechercher des ouvrages par identifiant, titre, auteur ou ISBN, de créer des exemplaires et de récupérer les exemplaires disponibles.

Tests : 17/17 réussis.

### 6.3 Service MemberService

`MemberService` permet d’inscrire des membres, de les rechercher par identifiant, numéro d’adhésion ou adresse électronique, de récupérer les membres actifs, d’activer ou désactiver un compte et de calculer des statistiques simples.

Tests : 19/19 réussis.

### 6.4 Service AuthenticationService

`AuthenticationService` gère une collection d’utilisateurs en mémoire, la recherche par adresse électronique, la connexion, la déconnexion, l’utilisateur courant et l’identification du rôle. Les membres inactifs ne peuvent pas se connecter.

L’interface `PasswordVerifier` sépare le service d’authentification de la méthode de vérification. Le vérificateur utilisé dans les tests compare directement les chaînes ; il s’agit d’un substitut de test et non d’un mécanisme sécurisé de production.

Tests : 18/18 réussis.

### 6.5 Service ReportService

`ReportService` reçoit `BookService` et `LoanService` par injection dans son constructeur. Il produit quatre rapports :
- nombre d’ouvrages et d’exemplaires ;
- disponibilité des exemplaires ;
- nombre d’emprunts actifs et retournés ;
- identification des emprunts actifs en retard.

Les résultats sont des objets de données en mémoire, sans tableau de bord graphique ni export PDF/Excel.

Tests : 11/11 réussis.

### 6.6 Repositories

Quatre repositories en mémoire ont été développés et testés indépendamment.

| Repository | Opérations principales | Tests réussis |
|---|---|---:|
| `BookRepository` | Ajouter, rechercher, lister, modifier, supprimer | 8/8 |
| `MemberRepository` | Ajouter, rechercher, lister, filtrer les actifs, modifier, supprimer | 9/9 |
| `LoanRepository` | Ajouter, rechercher, lister, filtrer les prêts actifs et par membre, modifier, supprimer | 8/8 |
| `UserRepository` | Ajouter, rechercher par identifiant ou courriel, lister, modifier, supprimer | 10/10 |
| **Total** | | **35/35** |

Limite importante : ces repositories possèdent leurs propres collections et ne sont pas utilisés par les services. Les services conservent leurs propres tableaux. Les repositories illustrent donc le rôle attendu de la couche d’accès aux données, sans intégration complète.

### 6.7 Revue de cohérence

#### 6.7.1 Structure du projet

Le code est organisé en cinq dossiers principaux : `models`, `repositories`, `security`, `services` et `tests`. Le fichier `index.ts` sert de point d’entrée. La couche de présentation et la base de données externe ne sont pas implémentées.

#### 6.7.2 Cohérence entre les modèles et UML

Les classes TypeScript reflètent globalement les concepts du modèle objet : héritage des rôles depuis `User`, distinction entre `Book` et `BookCopy`, et association de `Loan` avec `Member` et `BookCopy`.

La cohérence des diagrammes doit respecter les distinctions suivantes : `CopyStatus` comprend `Available` et `Issued`, tandis que `LoanStatus` comprend `Active` et `Returned`. La relation entre `Book` et `BookCopy` doit être représentée comme une association, sauf si une contrainte de cycle de vie justifie explicitement une composition.

#### 6.7.3 Cohérence des services et repositories

Les cinq services correspondent aux responsabilités attendues de la logique métier. `ReportService` collabore effectivement avec `BookService` et `LoanService`. Les quatre repositories ont été testés, mais restent indépendants des services.

#### 6.7.4 Tests d’intégration

Le fichier `integration.test.ts` vérifie un scénario applicatif complet :
1. enregistrer un ouvrage ;
2. créer un exemplaire ;
3. enregistrer un membre ;
4. emprunter l’exemplaire ;
5. vérifier le nombre d’emprunts actifs ;
6. retourner l’exemplaire ;
7. vérifier la fin de l’emprunt actif ;
8. générer le rapport des ouvrages ;
9. générer le rapport de disponibilité ;
10. générer le rapport des emprunts.

Résultat : 10 tests réussis, 0 échec. Ces tests utilisent les services et des données en mémoire ; ils ne valident ni une base de données externe ni une interface graphique.

### 6.8 Traçabilité des exigences fonctionnelles

#### 6.8.1 Exigences FR01 à FR04

| ID | Exigence | Composants | État |
|---|---|---|---|
| FR01 | Ajouter, modifier et supprimer des ouvrages | `BookService`, `BookRepository` | Partiel |
| FR02 | Rechercher par titre, auteur ou ISBN | `BookService` | Implémenté |
| FR03 | Inscrire et gérer les membres | `MemberService`, `MemberRepository` | Partiel |
| FR04 | Vérifier la disponibilité | `BookService`, `BookCopy` | Implémenté |

FR01 est partielle : `BookService` permet l’ajout, tandis que la modification et la suppression existent dans `BookRepository`, non intégré au service.

FR02 est implémentée par `findBooksByTitle()`, `findBooksByAuthor()` et `findBookByISBN()`. Les recherches par titre et auteur acceptent une correspondance partielle et ignorent la casse.

FR03 est partielle : le service permet l’inscription, la recherche, l’activation et la désactivation. Les opérations de modification et de suppression du repository ne sont pas intégrées au service.

FR04 est implémentée par la récupération des exemplaires et le filtrage des exemplaires disponibles. La disponibilité est également contrôlée lors de l’emprunt.

#### 6.8.2 Exigences FR05 à FR08

| ID | Exigence | Composants | État |
|---|---|---|---|
| FR05 | Enregistrer un emprunt | `LoanService`, `Loan` | Implémenté |
| FR06 | Enregistrer un retour | `LoanService`, `Loan`, `BookCopy` | Implémenté |
| FR07 | Suivre les échéances | `Loan`, `LoanService` | Implémenté |
| FR08 | Identifier les retards | `Loan`, `ReportService` | Implémenté |

FR05 vérifie l’activité du membre, la disponibilité de l’exemplaire, la limite de trois emprunts et la cohérence des dates.

FR06 enregistre la date de retour, passe l’emprunt à `Returned` et l’exemplaire à `Available`. Un double retour est rejeté.

FR07 conserve les dates d’emprunt et d’échéance. `getOverdueDays()` calcule le nombre de jours de retard pour un emprunt actif ou retourné.

FR08 identifie les emprunts actifs dont le retard calculé est supérieur à zéro. Les emprunts déjà retournés ne figurent pas dans le rapport des retards actuels.

#### 6.8.3 Exigences FR09 à FR11

| ID | Exigence | Composants | État |
|---|---|---|---|
| FR09 | Consulter l’historique des emprunts | `LoanService`, `LoanRepository` | Implémenté au niveau des composants |
| FR10 | Gérer les comptes du personnel et les paramètres | `User`, `Librarian`, `Administrator`, `AuthenticationService`, `UserRepository` | Partiel |
| FR11 | Générer des rapports | `ReportService` | Implémenté au niveau métier |

FR09 : les données d’emprunt peuvent être récupérées par membre à partir de `LoanRepository.findByMemberId()`, qui inclut les emprunts actifs et retournés. Toutefois, cette méthode n’est pas intégrée à `LoanService` et aucune interface de consultation n’est fournie. L’état « implémenté » concerne donc la capacité des composants, pas une fonctionnalité complète pour l’utilisateur final.

FR10 est partielle : les rôles, l’authentification de base et les opérations élémentaires du repository utilisateur existent. L’administration complète des comptes du personnel, les permissions détaillées et la configuration du système ne sont pas développées.

FR11 est implémentée au niveau métier : les quatre rapports sont produits sous forme d’objets de données. Aucun tableau de bord ni export documentaire n’est inclus.

#### 6.8.4 Bilan de traçabilité

Huit exigences sur onze sont classées comme implémentées au niveau des composants ou de la logique métier ; trois sont partielles : FR01, FR03 et FR10. Cette classification ne signifie pas que toutes les fonctionnalités sont accessibles depuis une interface utilisateur.

### 6.9 Validation finale et limites techniques

#### 6.9.1 Validation technique

La compilation TypeScript a été exécutée sans erreur avec `npx tsc --noEmit`.

| Suite de tests | Résultat |
|---|---:|
| `LoanService` | 17/17 |
| `BookService` | 17/17 |
| `MemberService` | 19/19 |
| `AuthenticationService` | 18/18 |
| `ReportService` | 11/11 |
| Repositories | 35/35 |
| Tests d’intégration | 10/10 |
| **Total des sept suites dédiées** | **127/127** |

En complément, onze tests initiaux de règles métier ont réussi depuis `src/index.ts`. Ils sont distincts des sept suites ci-dessus. Le total arithmétique des vérifications rapportées est donc de 138, réparties en 127 tests dédiés et 11 tests initiaux. Il ne s’agit pas nécessairement de 138 scénarios uniques, car certains contrôles peuvent se recouper.

#### 6.9.2 Cohérence de l’architecture

La logique métier est représentée par cinq services. La couche d’accès aux données est représentée par quatre repositories testés indépendamment. La présentation demeure conceptuelle. Les repositories ne sont pas intégrés aux services et aucune base de données persistante n’est connectée.

Le projet constitue donc une implémentation technique partielle de l’architecture proposée, et non une application trois couches entièrement opérationnelle.

#### 6.9.3 Limites techniques

- **Persistance :** les données sont stockées dans des tableaux en mémoire et sont perdues à l’arrêt du programme.
- **Base de données :** aucun moteur relationnel n’est connecté.
- **Intégration des repositories :** les repositories fonctionnent indépendamment des services.
- **Présentation :** aucune interface graphique n’est développée.
- **Sécurité :** le vérificateur de mot de passe utilisé dans les tests compare directement les chaînes. Il ne convient pas à une utilisation réelle.
- **Authentification :** les sessions persistantes, les jetons et leur expiration ne sont pas implémentés.
- **Autorisation :** les rôles sont modélisés, mais les permissions détaillées ne sont pas appliquées.
- **Rapports :** les statistiques sont produites sous forme d’objets ; aucun tableau de bord ni export PDF/Excel n’est fourni.

#### 6.9.4 Améliorations futures

Les évolutions possibles comprennent l’intégration d’une base relationnelle, la connexion des repositories aux services, le développement des interfaces, l’ajout d’un hachage sécurisé des mots de passe, la gestion des sessions, le contrôle d’accès par rôle, l’enrichissement des rapports et des tests supplémentaires portant sur la persistance et la sécurité.

Ces évolutions constituent des perspectives et ne font pas partie du périmètre implémenté.

#### 6.9.5 Conclusion de validation

La validation montre que le prototype démontre les principaux modèles métier, les règles d’emprunt et de retour, les responsabilités des services et des abstractions élémentaires d’accès aux données. Il ne constitue pas une application de production complète, mais une démonstration technique cohérente des concepts d’analyse objet, de modélisation UML et d’architecture en couches.

## Conclusion générale

Ce projet a porté sur l’analyse, la conception et l’implémentation technique partielle d’un système simplifié de gestion de bibliothèque, en appliquant les principes de l’analyse et de la conception orientées objet.

Le travail a commencé par l’identification des acteurs, des exigences fonctionnelles et des exigences non fonctionnelles. Une architecture cible en trois couches a ensuite été définie : présentation, logique métier et accès aux données.

La modélisation a permis d’identifier les principales entités du domaine et leurs relations. Les diagrammes UML décrivent les cas d’utilisation, les classes, les interactions d’emprunt et de retour ainsi que les états des objets concernés. Une distinction essentielle a été maintenue entre l’ouvrage bibliographique, son exemplaire physique et la transaction d’emprunt.

La phase d’implémentation a traduit une partie de ces modèles en classes et services TypeScript. Les règles métier les plus importantes concernent l’éligibilité du membre, la disponibilité de l’exemplaire, la limite de trois emprunts actifs, la validation des dates, le retour et le calcul des retards.

Les tests exécutés ont validé les scénarios couverts : 127 tests répartis dans sept suites dédiées et onze tests métier initiaux supplémentaires ont réussi. Ces résultats apportent des éléments de validation, sans démontrer l’absence de tout défaut.

Le projet présente néanmoins des limites clairement identifiées : stockage en mémoire, absence de base de données et d’interface graphique, repositories non intégrés aux services et sécurité limitée à une abstraction accompagnée d’un vérificateur simplifié pour les tests.

En conclusion, le projet atteint son objectif académique principal : montrer comment les exigences d’un système, l’analyse orientée objet, les diagrammes UML et une architecture logicielle peuvent être traduits en une implémentation TypeScript démontrant les principales règles métier d’une bibliothèque. Il fournit également une base structurée pour des évolutions futures, notamment la persistance des données, l’intégration complète des couches, les interfaces et le renforcement de la sécurité.

## Annexes

### Annexe A – Structure du projet

```text
src/
├── index.ts
├── models/
│   ├── Administrator.ts
│   ├── Book.ts
│   ├── BookCopy.ts
│   ├── Librarian.ts
│   ├── Loan.ts
│   ├── Member.ts
│   └── User.ts
├── repositories/
│   ├── BookRepository.ts
│   ├── LoanRepository.ts
│   ├── MemberRepository.ts
│   └── UserRepository.ts
├── security/
│   └── PasswordVerifier.ts
├── services/
│   ├── AuthenticationService.ts
│   ├── BookService.ts
│   ├── LoanService.ts
│   ├── MemberService.ts
│   └── ReportService.ts
└── tests/
    ├── authenticationService.test.ts
    ├── bookService.test.ts
    ├── integration.test.ts
    ├── loanService.test.ts
    ├── memberService.test.ts
    ├── reportService.test.ts
    └── repository.test.ts
```

### Annexe B – Commandes de validation

```powershell
npx tsc --noEmit
npx ts-node src/index.ts
npx ts-node src/tests/loanService.test.ts
npx ts-node src/tests/bookService.test.ts
npx ts-node src/tests/memberService.test.ts
npx ts-node src/tests/authenticationService.test.ts
npx ts-node src/tests/reportService.test.ts
npx ts-node src/tests/repository.test.ts
npx ts-node src/tests/integration.test.ts
```

### Annexe C – Diagrammes à insérer

Insérer les versions finales effectivement réalisées des éléments suivants :
1. Diagramme de cas d’utilisation.
2. Diagramme de classes.
3. Diagramme de séquence – emprunt.
4. Diagramme de séquence – retour.
5. Diagramme d’état corrigé.
6. Diagramme entité-association (ERD).
7. Diagrammes fonctionnels et comportementaux réalisés.

### Annexe D – Références et sources

La version source fournie ne contient pas de bibliographie vérifiable. Ajouter ici uniquement les ouvrages, supports de cours, documentations et références réellement consultés pendant le travail. Ne pas inventer de références bibliographiques.
