import jwt from "jsonwebtoken";

export const generateJwt = (id, email, name) => {
  return jwt.sign({ id, email, name }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const verifyJwt = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log(`JWT verification failed: ${error.message}`);
    return null;
  }
};
