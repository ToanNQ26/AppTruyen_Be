// bootstrapAdmin.js

import User from '../model/User.js';
import { hash } from "../utils/hash.js";

export const bootstrapAdmin = async () => {
  const admin = await User.findOne({
    role: "admin"
  });

  if (admin) {
    return;
  }

  const hashedPassword = await hash(process.env.ADMIN_PASSWORD);


  await User.create({
    name: "Administrator",
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin"
  });

  console.log("Admin account created");
};