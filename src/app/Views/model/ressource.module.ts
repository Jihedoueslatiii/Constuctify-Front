
export class Ressource {
  idRessource!: number;
  nomRessource!: string;
  nombreRessource!: number;
  typesRessource!: string;
  cost!: number;
  idProjet!: number;
 
 
  constructor(idRessource: number, nomRessource: string, nombreRessource: number, typesRessource: string , cost: number  ) {
    this.idRessource = idRessource;
    this.nomRessource = nomRessource;
    this.nombreRessource = nombreRessource;
    this.typesRessource = typesRessource;
    this.cost=cost;
    this.idProjet;
  }
}
