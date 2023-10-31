import express from "express";

import {
  getAllListings,
  addListing,
} from "../controllers/productController";

import { protectedRoute } from "../controllers/authController";

export default (router: express.Router) => {
  router.get("/products", getAllListings);
  router.post("/products/list", protectedRoute, addListing);
};
