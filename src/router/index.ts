import express from "express";

import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";

const router = express.Router();

export default (): express.Router => {
  authRoutes(router);
  userRoutes(router);
  productRoutes(router);
  return router;
};
