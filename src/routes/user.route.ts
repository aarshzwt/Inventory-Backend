import { Router } from "express";
import { authorizeRole } from "../middlewares/authorizeRole";
import { deleteUser, getUser, getUserById, getAllUsers, login, register, updateUser, refreshToken } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { CREATE_USER_SCHEMA, LOGIN_USER_SCHEMA, UPDATE_USER_SCHEMA } from "../validationSchemas/schemas";

const router = Router();

router.post("/register", validate(CREATE_USER_SCHEMA), register); // create/register
router.post("/login", validate(LOGIN_USER_SCHEMA), login); // login
router.get("/refresh", refreshToken); // refresh token

router.get("/all", authorizeRole(["admin"]), getAllUsers); // get all
router.get("/", authorizeRole(["admin", "user"]), getUser); // get user (self)
router.get("/:id", authorizeRole(["admin"]), getUserById); // get by id
router.patch("/:id", authorizeRole(["admin"]), validate(UPDATE_USER_SCHEMA), updateUser); // update
router.delete("/:id", authorizeRole(["admin"]), deleteUser); // delete

export { router as user };
