import mongoose, { Schema } from "mongoose";

const userScehma: Schema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true, // Remove espaços extras no início e fim
    },
    email: {
      type: String,
      required: [true, "E-mail é obrigatório"],
      unique: true, 
      lowercase: true, 
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor, forneça um e-mail válido",
      ], 
    },
    password: {
      type: String,
      required: [true, "Senha é obrigatória"],
      minlength: [6, "A senha deve ter pelo menos 6 caracteres"],
      select: false, 
    },
    course: {
      type: String,
      default: null,
    },
    registration: {
      type: String,
      required: [true, "Matrícula é obrigatória"],
      unique: true, 
    },
    role: {
      type: String,
      enum: ["admin", "professor", "aluno"], 
      default: "aluno", 
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
    updatedAt: {
      type: Date,
      default: Date.now, 
    },
})


export default mongoose.model('User', userScehma);