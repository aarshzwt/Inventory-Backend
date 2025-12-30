import { Router } from "express";

import { authorizeRole } from "../middlewares/authorizeRole";
import { createItem, deleteItem, getItemById, getItems, updateItem, updateItemStock } from "../controllers/item.controller";
import { validate } from "../middlewares/validate";
import { CREATE_ITEM_SCHEMA, UPDATE_ITEM_SCHEMA, UPDATE_ITEM_STOCK_SCHEMA } from "../validationSchemas/schemas";

const router = Router();

router.post("/", authorizeRole(["admin"]), validate(CREATE_ITEM_SCHEMA), createItem); //create
router.get("/", authorizeRole(["admin", "user"]), getItems); //get all
router.get("/:id", authorizeRole(["admin", "user"]), getItemById); //get by id
router.patch("/:id", authorizeRole(["admin"]), validate(UPDATE_ITEM_SCHEMA), updateItem); //update/restock
router.patch('/stock/:id', authorizeRole(['admin', 'user']), validate(UPDATE_ITEM_STOCK_SCHEMA), updateItemStock); //update stock only
router.delete("/:id", authorizeRole(["admin"]), deleteItem); //delete

export { router as item };
