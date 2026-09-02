# AGENTS.md

Instructions durables pour les agents travaillant sur ce depot.

## Regle de demarrage

- Lire ce fichier avant de traiter toute nouvelle requete.
- Si la requete contient une correction, une preference ou une exigence qui peut se reutiliser plus tard, mettre a jour ce fichier avant d'implementer la correction.
- Ne pas transformer en regle generale une demande clairement ponctuelle ou limitee a un seul fichier/schema, sauf si l'utilisateur demande explicitement de la generaliser.

## Preferences generales utilisateur

- Respecter les schemas fournis par l'utilisateur comme reference principale pour le dessin des composants.
- Quand un symbole est modifie sur le canvas, synchroniser aussi la miniature du panneau de selection gauche afin qu'elle soit fidele au composant place.
- Les miniatures de la palette doivent rester centrees et non rognees.
- Les labels et textes ajoutes sur les schemas doivent rester lisibles, non miroitables et peu intrusifs; les labels d'equipements doivent rester proches, positionnables autour du symbole et ajustables par offsets X/Y quand la lisibilite depend du circuit.
- Si un croquis ou une demande explicite impose un prefixe de nomenclature, respecter ce prefixe meme s'il depasse la convention courte habituelle.
- Les symboles doivent rester compacts : rapprocher les leviers, fleches, X et marqueurs d'etat du corps principal quand cela ne nuit pas a la lisibilite.
- Garder la logique de simulation existante intacte quand la demande concerne uniquement le rendu graphique.
- Pour les exports, conserver un export image simple et privilegier des formats vectoriels editables lorsque SVG/DXF sont demandes.
- Pour les composants avec plusieurs etats visuels, le symbole doit refleter clairement l'etat simule.
- Quand un composant supporte le flip, le dessin, les ports de connexion et la logique de simulation doivent rester coherents avec le cote fonctionnel reel.
- Quand un symbole montre un port externe nomme, ce port doit etre modelise comme une vraie connexion simulee et ne doit pas etre remplace par un comportement interne implicite.
- Pour les pilotes DCS, le chemin F-C n'est pas un clapet anti-retour : il doit equilibrer les pressions via une conductance reglable separee de la conductance C-EX.
- Quand une variante process d'un composant pneumatique est demandee, basculer ses ports fonctionnels en domaine process et utiliser un echappement process explicite quand une purge process raccordable est necessaire.
- Appliquer les memes conventions aux variantes pneumatiques et process quand elles representent le meme type d'equipement.
- Preserver la compatibilite des anciens fichiers sauvegardes quand des options sont ajoutees.

## Interface et edition

- Les commandes d'edition et de simulation doivent rester visibles et garder une surbrillance claire quand un mode est actif.
- Dans le panneau de selection, garder la famille BASIC en premier et la famille PROCESS en dernier; les miniatures process y utilisent un fond rouge clair sans modifier le rendu des composants sur la feuille de travail.
- Les options de composant servent aux reglages; les actions d'edition comme flip/rotate restent des boutons d'edition, sauf demande explicite contraire.
- Les options d'un composant s'ouvrent uniquement via le mode Options, sauf demande explicite contraire.
- Regrouper les options par famille logique afin de limiter le nombre d'invites successives.

## Build et verification

- Apres une modification de `source/index.html`, executer le build Vite pour regenerer `docs/index.html`.
- Apres le build, recopier les fichiers `.txt` racine de `source` vers `docs`, en excluant `ToDo.txt`.
- Verifier au minimum la syntaxe JavaScript integree avant ou pendant la validation.
- Ajouter des tests cibles ou des controles VM quand la modification touche la simulation, les connexions, les options ou le chargement/sauvegarde.

## Message de commit

- A la fin d'une intervention, synthetiser les modifications effectuees de facon a pouvoir rediger facilement le message de commit.
- La synthese doit indiquer les comportements changes, les fichiers principaux modifies et les validations executees.
