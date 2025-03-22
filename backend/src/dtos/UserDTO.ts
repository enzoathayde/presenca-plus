export interface UserDTO {
  name: string;
  email: string;
  password: string;
  course?: string;
  registration: string;
  role?: "admin" | "professor" | "aluno";
}


export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  course?: string;
  registration: string;
  role: "admin" | "professor" | "aluno";
  createdAt: Date;
  updatedAt: Date;
}