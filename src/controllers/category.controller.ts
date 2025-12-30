import { Request, Response } from "express";
import Category from "../models/Category";
import SubCategory from "../models/SubCategory";
import Item from "../models/Item";

/**
 * CREATE CATEGORY
 */
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const existing = await Category.findOne({ where: { name, deletedAt: null } });
        if (existing) {
            return res.status(409).json({ message: "Category already exists" });
        }

        const category = await Category.create({ name });

        return res.status(201).json({
            message: "Category created successfully",
            category,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create category" });
    }
};

/**
 * GET ALL CATEGORIES
 */
export const getCategories = async (_req: Request, res: Response) => {
    try {
        const categories = await Category.findAll();

        return res.status(200).json({ data: { categories: categories, message: "Categories fetched successfully" } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch categories" });
    }
};

/**
 * GET CATEGORY BY ID
 */
export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json(category);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch category" });
    }
};

/**
 * UPDATE CATEGORY
 */
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const name = req.body?.name;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        await category.update({ name });

        return res.status(200).json({
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update category" });
    }
};

/**
 * DELETE CATEGORY (SOFT DELETE)
 */
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = Number(req.params.id);

        const deletedCount = await Category.destroy({
            where: { id: categoryId },
            individualHooks: true, // ✅ fully supported here
        });

        await SubCategory.destroy({
            where: { category_id: categoryId },
            individualHooks: true,
        });

        // await Item.destroy({
        //     where: { category_id: categoryId },
        //     individualHooks: true,
        // })

        if (!deletedCount) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete category" });
    }
};

