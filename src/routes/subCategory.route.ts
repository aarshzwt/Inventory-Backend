import { Router } from "express";

import { authorizeRole } from "../middlewares/authorizeRole";
import { createSubCategory, deleteSubCategory, getSubCategories, getSubCategoryById, updateSubCategory } from "../controllers/subCategory.controller";

const router = Router();

router.post("/", authorizeRole(["admin"]), createSubCategory); //create
router.get("/", authorizeRole(["admin", "user"]), getSubCategories); //get all
router.get("/:id", authorizeRole(["admin", "user"]), getSubCategoryById); //get by id
router.patch("/:id", authorizeRole(["admin"]), updateSubCategory); // update
router.delete("/:id", authorizeRole(["admin"]), deleteSubCategory); //delere

export { router as subCategory };
