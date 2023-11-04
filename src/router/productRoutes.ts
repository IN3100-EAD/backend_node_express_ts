import express from "express";

import {
  getAllListings,
  addListing,
  getAllListingsByUser,
  updatePriceListing,
} from "../controllers/productController";

import { protectedRoute } from "../controllers/authController";

export default (router: express.Router) => {
  router.get("/products", getAllListings);
  router.post("/products/list", protectedRoute, addListing);
  router.get("/products/:id", getAllListingsByUser);
  router.patch(
    "/products/:id/price",
    protectedRoute,
    updatePriceListing
  );
};
