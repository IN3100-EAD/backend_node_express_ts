import express from "express";

import {
  assignOrder,
  getAllDeliveriesById,
  getDeliveryStatus,
} from "../controllers/deliveryController";

export default (router: express.Router) => {
  router.post("/delivery/assign", assignOrder);
  router.post("/delivery/:id", getDeliveryStatus);
};
