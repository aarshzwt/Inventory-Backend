import { Request, Response } from "express";
import SubCategory from "../models/SubCategory";
import Category from "../models/Category";

/**
 * CREATE SUB CATEGORY
 */
export const createSubCategory = async (req: Request, res: Response) => {
    try {
        const { name, category_id } = req.body;

        if (!name || !category_id) {
            return res
                .status(400)
                .json({ message: "Name and category_id are required" });
        }

        // Ensure parent category exists
        const category = await Category.findByPk(category_id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const existing = await SubCategory.findOne({
            where: { name, category_id },
        });

        if (existing) {
            return res
                .status(409)
                .json({ message: "Sub-category already exists for this category" });
        }

        const subCategory = await SubCategory.create({
            name,
            category_id,
        });

        return res.status(201).json({
            message: "Sub-category created successfully",
            subCategory,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create sub-category" });
    }
};

/**
 * GET ALL SUB CATEGORIES
 * Optional: ?category_id=1
 */
export const getSubCategories = async (req: Request, res: Response) => {
    try {
        const { category_id } = req.query;

        const where = category_id ? { category_id } : undefined;

        const subCategories = await SubCategory.findAll({ where });

        return res.status(200).json({ data: { subCategories: subCategories, message: "Sub-categories fetched successfully" } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch sub-categories" });
    }
};

/**
 * GET SUB CATEGORY BY ID
 */
export const getSubCategoryById = async (req: Request, res: Response) => {
    try {
        const subCategory = await SubCategory.findByPk(req.params.id);

        if (!subCategory) {
            return res.status(404).json({ message: "Sub-category not found" });
        }

        return res.status(200).json(subCategory);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch sub-category" });
    }
};

/**
 * UPDATE SUB CATEGORY
 */
export const updateSubCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, category_id } = req.body;

        const subCategory = await SubCategory.findByPk(id);
        if (!subCategory) {
            return res.status(404).json({ message: "Sub-category not found" });
        }

        if (category_id) {
            const category = await Category.findByPk(category_id);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        await subCategory.update({
            name: name ?? subCategory.name,
            category_id: category_id ?? subCategory.category_id,
        });

        return res.status(200).json({
            message: "Sub-category updated successfully",
            subCategory,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update sub-category" });
    }
};

/**
 * DELETE SUB CATEGORY (SOFT DELETE)
 */
export const deleteSubCategory = async (req: Request, res: Response) => {
    try {
        const subCategory = await SubCategory.findByPk(req.params.id);

        if (!subCategory) {
            return res.status(404).json({ message: "Sub-category not found" });
        }

        await subCategory.destroy(); // paranoid => soft delete

        return res.status(200).json({
            message: "Sub-category deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete sub-category" });
    }
};
