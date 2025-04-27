export interface UserDTO {
  name: string;
  email: string;
  password: string;
  course?: string;
  registration: string;
  role?: "admin" | "professor" | "aluno";
}

export interface userEmailDTO {
  email: string;
}

