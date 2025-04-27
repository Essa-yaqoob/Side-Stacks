import { verifyJwt } from "../utils/jwtToken.js";

export const authentication = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1] || req?.cookies?.token;

    if (!token) {
      return res.status(401).json({
        erros: {
          user: "unAuthorized",
        },
      });
    }
    const decodeToken = verifyJwt(token);

    if (!decodeToken) {
      return res.status(400).json({
        errors: {
          token: "Invalid token",
        },
      });
    }
    req.user = decodeToken;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: "Something went wrong, Please try again",
    });
  }
};
