import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// hashing plain password
export async function hashPassword(password) {
  try {
    const saltRounds = 10; // You can adjust this as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}

// comparting password
export async function comparePassword(plainPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch; // Returns true if match, false otherwise
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
}

// JWT token generator
export async function generateJWTToken(payload) {
  try {
    // Secret key
    const SECRET = "HELd31LO31KE@Y";
    // generating and returning Token
    return jwt.sign(payload, SECRET);
  } catch (error) {
    throw new Error("Error: ", error);
  }
}
