
export class Ressource {
  idRessource!: number;
  nomRessource!: string;
  nombreRessource!: number;
  typesRessource!: string;
<<<<<<< HEAD
  cost!: number;
  idProjet!: number;
 
 
  constructor(idRessource: number, nomRessource: string, nombreRessource: number, typesRessource: string , cost: number  ) {
=======
 
 
 
  constructor(idRessource: number, nomRessource: string, nombreRessource: number, typesRessource: string) {
>>>>>>> bbc09263752fd81e2de7d11252022ae32ee04bc3
    this.idRessource = idRessource;
    this.nomRessource = nomRessource;
    this.nombreRessource = nombreRessource;
    this.typesRessource = typesRessource;
<<<<<<< HEAD
    this.cost=cost;
    this.idProjet;
=======
>>>>>>> bbc09263752fd81e2de7d11252022ae32ee04bc3
  }
}
