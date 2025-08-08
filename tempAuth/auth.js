import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const hashPassword = async (password) => bcrypt.hash(password, 12);

export const verifyPassword = async (password, hash) =>
  bcrypt.compare(password, hash);

export const signToken = (user) =>
  jwt.sign({ userId: user.userId, role: user.status }, JWT_SECRET, {
    expiresIn: "7d",
  });

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};
