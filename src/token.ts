import jwt from "jsonwebtoken";
import httpStatus from "http-status-codes";

const generateToken = (payload: { username: string; user_id: number }) =>
  new Promise((resolve) => {
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "30 days",
    });
    resolve(token);
  });

const decodeToken = (token: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded);
    });
  });

const validateLogin = (authorization: string) =>
  new Promise(async (resolve, reject) => {
    if (!authorization)
      return reject(new Error("Missing authorization header"));

    const headerParts = authorization.split(" ");
    if (headerParts.length < 2) {
      return reject(new Error("Invalid Authorization Header"));
    }
    const token = headerParts[1].toString();
    try {
      const decodedToken = await decodeToken(token);
      resolve(decodedToken);
    } catch (error) {
      reject(error);
    }
  });

const authorizationMiddleware = async (req, res, next) => {
  try {
    console.log("token", req.headers.authorization);
    req.authInfo = await validateLogin(req.headers.authorization);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({ error: error.message });
  }
  next();
};

export { generateToken, decodeToken, authorizationMiddleware };
