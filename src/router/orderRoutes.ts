import express from "express";

import { createOrder } from "../controllers/orderController";

export default (router: express.Router) => {
  router.post("/orders/create", createOrder);
};
