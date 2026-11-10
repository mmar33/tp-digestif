/* Corrections de notes après lecture des signalements des étudiants (toujours en leur faveur, jamais en baisse).
   Clé = équipe (séance-groupe-atelier-équipe) ou étudiant (séance~empreinte de l'identifiant~atelier) : aucun nom ici.
   note : note minimale ; plus : points ajoutés ; a3RepPlein / a3QuizPlein : repérage 3D / quiz de l'atelier 3 comptés justes ;
   a5A / a5B / a5C : puzzle 1 /4, puzzle 2 /4, défi /12 minimaux ; meilleurGroupe : meilleure note des équipes du groupe.
   Une note à la main saisie par un encadrant reste prioritaire. */
window.CORRECTIONS={
  "s20261110-G5-a5-e4":{a5B:4}, /* puzzle 2 non corrigé (l'appli est passée à l'étape suivante) */
  "s20261110-G5-a5-e3":{a5B:4}, /* puzzle 2 non corrigé (l'appli est passée à l'étape suivante) */
  "s20261110-G3-a3-e4":{a3RepPlein:true}, /* repérage 3D : 2 bonnes réponses comptées fausses */
  "s20261110-G4-a5-e5":{a5C:12}, /* Défi foie : clics non pris en compte, écran bloqué */
  "s20261110-G4-a5-e1":{plus:0.5}, /* Défi foie : question de position du foie du bœuf contestée */
  "s20261110-G4-a5-e4":{plus:0.5}, /* Défi foie : processus caudé impossible à toucher */
  "s20261110-G4-a5-e2":{a5B:4}, /* puzzle 2 : correcteur sans accès à la grille (4/4 donné) */
  "s20261110-G2-a3-e3":{a3RepPlein:true}, /* repérage 3D : point déplacé (côlon transverse) */
  "s20261110-G3-a5-e3":{a5A:4,a5B:4,a5C:11.5}, /* Défi foie 11,5/12 et puzzles 4/4 non reportés */
  "s20261110-G2-a2-e1":{meilleurGroupe:true}, /* duel : réponses impossibles à sélectionner, notes des 2 Romane échangées */
  "s20261110-G2-a2-e2":{meilleurGroupe:true}, /* duel : réponses impossibles à sélectionner, notes des 2 Romane échangées */
  "s20261110-G3-a2-e1":{meilleurGroupe:true}, /* duel : bouton de validation de la manche 1 absent */
  "s20261110-G3-a2-e2":{meilleurGroupe:true}, /* duel : bouton de validation de la manche 1 absent */
  "s20261110-G6-a2-e1":{meilleurGroupe:true}, /* duel : réponses impossibles à sélectionner */
  "s20261110-G6-a2-e2":{meilleurGroupe:true}, /* duel : réponses impossibles à sélectionner */
  "s20261110-G2-a4-e1":{note:20}, /* enquête faite en groupe entier à 20/20 */
  "s20261110-G2-a4-e2":{note:20}, /* enquête faite en groupe entier à 20/20 */
  "s20261110-G2-a5-e5":{a5C:12}, /* Défi foie tout juste mais 0/12 reporté */
  "s20261110-G6-a3-e4":{a3RepPlein:true}, /* repérage 3D : correction non affichée */
  "s20261110-G6-a3-e1":{a3RepPlein:true}, /* repérage 3D : modèle 3D non chargé (erreur WebGL), sac ventral compté faux */
  "s20261110-G2-a5-e2":{a5C:12}, /* Défi foie : page rechargée, quiz remis à zéro (tout juste) */
  "s20261110-G5-a3-e1":{a3RepPlein:true}, /* repérage 3D : artère splénique et lobe gauche du foie */
  "s20261110-G5-a3-e2":{a3RepPlein:true}, /* repérage 3D : lobes */
  "s20261110-G5-a3-e3":{a3QuizPlein:true}, /* quiz : question sur les lobes contestée */
  "s20261110-G1-a5-e3":{a5A:4,a5B:4,a5C:9.5}, /* fiche non validée (0/20) ; défi 16/20, puzzles jugés justes */
  "s20261110-G6-a5-e2":{plus:0.5}, /* Défi foie : processus caudé et papillaire du chat inversés ? */
  "s20261110-G6-a5-e4":{plus:0.5}, /* Défi foie : processus caudé et papillaire du chat inversés ? */
  "s20261110-G4-a3-e2":{a3RepPlein:true,a3QuizPlein:true}, /* écran bloqué (réseau) pendant l'évaluation 3D, demandé par l'enseignante */
  "s20261110~7775c385~a3":{a3RepPlein:true}, /* repérage 3D : duodénum et rein comptés faux */
  "s20261110~7e381a90~a3":{a3RepPlein:true}, /* repérage 3D : duodénum et rein comptés faux */
  "s20261110~6f7b0d28~a3":{a3RepPlein:true}, /* repérage 3D : sac dorsal du rumen compté faux */
  "s20261110~804a53e6~a3":{a3RepPlein:true}, /* repérage 3D : artère colique gauche */
  "s20261110~1c637c1c~a5":{plus:0.5}, /* Défi foie 11,5/12 reporté 11/12 */
  "s20261110~ca4be6b6~a5":{a5C:12}, /* Défi foie tout juste, coupé */
  "s20261110~7e381a90~a5":{a5C:12}, /* Défi foie tout juste, coupé */
  "s20261110~e71e08c3~a3":{a3RepPlein:true}, /* repérage 3D : 2 clics mal placés */
  "s20261110~ed2767~a3":{a3RepPlein:true}, /* repérage 3D : 2 clics mal placés */
  "s20261110~3c53cf28~a3":{a3RepPlein:true}, /* repérage 3D : mauvaise structure sélectionnée */
  "s20261110~8498d94c~a3":{a3RepPlein:true}, /* repérage 3D : 2 bonnes réponses comptées fausses */
  "s20261110~ef7eb974~a3":{a3RepPlein:true}, /* repérage 3D : 2 bonnes réponses comptées fausses */
  "s20261110~69993628~a3":{a3RepPlein:true}, /* repérage 3D : sacculus rotundus */
};
