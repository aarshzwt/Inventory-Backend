import { Router } from "express";

import { authorizeRole } from "../middlewares/authorizeRole";
import { notification } from "../controllers/notification.controller";

const router = Router();

router.post("/subscribe", authorizeRole(["admin", "user"]), notification); //create


export { router as notification };
