import { Router } from "express";
import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller";
import { authorizeRole } from "../middlewares/authorizeRole";

const router = Router();

router.post("/", authorizeRole(["admin"]), createCategory); //create
router.get("/", getCategories); //get all
router.get("/:id", authorizeRole(["admin", "user"]), getCategoryById); //get by id
router.patch("/:id", authorizeRole(["admin"]), updateCategory); //update
router.delete("/:id", authorizeRole(["admin"]), deleteCategory); //soft delete

export { router as category };
