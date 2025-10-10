export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;  // Le "?" rend ce champ optionnel
  phone: string;
  role: Role; // Utilisation d'une énumération pour le rôle
  teamId: number | null; // Ajoutez cette propriété
}

export enum Role {
  Client = 'Client',
  Admin = 'Admin',
  Project_Manager = 'Project_Manager',
  Employer = 'Employer'
}
