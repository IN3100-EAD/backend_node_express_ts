import express from "express";

import {
  getAllUsers,
  getUserById,
} from "../controllers/userController";

import { protectedRoute } from "../controllers/authController";

export default (router: express.Router) => {
  router.get("/users", protectedRoute, getAllUsers);
  router.get("/users/:id", getUserById);
};
