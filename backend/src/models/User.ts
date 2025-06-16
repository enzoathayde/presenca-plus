import mongoose, { Schema } from "mongoose";
import { UserDTO } from "../dtos/UserDTO";
import bcrypt from "bcrypt";

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
      required: [false, "Matrícula é facultativa"],
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


userScehma.pre('save', async function (next) {
  const user = this as any;

  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});


export default mongoose.model<UserDTO>('User', userScehma, "users");