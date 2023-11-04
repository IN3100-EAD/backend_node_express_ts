import express from "express";

import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";
import orderRoutes from "./orderRoutes";
import deliveryRoutes from "./deliveryRoutes";

const router = express.Router();

export default (): express.Router => {
  authRoutes(router);
  userRoutes(router);
  productRoutes(router);
  orderRoutes(router);
  deliveryRoutes(router);
  return router;
};
