
export class Ressource {
  idRessource!: number;
  nomRessource!: string;
  nombreRessource!: number;
  typesRessource!: string;
 
 
 
  constructor(idRessource: number, nomRessource: string, nombreRessource: number, typesRessource: string) {
    this.idRessource = idRessource;
    this.nomRessource = nomRessource;
    this.nombreRessource = nombreRessource;
    this.typesRessource = typesRessource;
  }
}
