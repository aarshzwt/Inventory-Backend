import { Request, Response } from "express";
import SubCategory from "../models/SubCategory";
import Category from "../models/Category";
import Item from "../models/Item";
import { col, Op } from "sequelize";
import { getPagination, getPagingData, notify } from "../utils/utilityFunctions";

/**
 * CREATE ITEM
 */
export const createItem = async (req: Request, res: Response) => {
    try {
        const { name, sub_category_id, stock = 0, brand, price } = req.body;
        const image = req.file ? `/uploads/image/${req.file.filename}` : null;
        // Ensure sub-category exists
        const subCategory = await SubCategory.findByPk(sub_category_id);
        if (!subCategory) {
            return res.status(404).json({ message: "Sub-category not found" });
        }

        const item = await Item.create({
            name,
            sub_category_id,
            stock,
            ...brand && { brand },
            image,
            price
        });

        return res.status(200).json({
            message: "Item created successfully",
            item,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create item" });
    }
};

/**
 * GET ALL ITEMS
 * Optional: ?name=abc&brand=xyz&sub_category_id=1&category_id=1&minStock=10&maxStock=100
 */
export const getItems = async (req: Request, res: Response) => {
    try {
        const {
            sub_category_id,
            category_id,
            name,
            brand,
            minStock,
            maxStock,
            page,
            limit,
        } = req.query;

        const { _page, _limit, offset } = getPagination(
            page as string,
            limit as string
        );

        const itemWhere: any = {
            ...(name && { name: { [Op.like]: `%${name}%` } }),
            ...(brand && { brand: { [Op.like]: `%${brand}%` } }),
            ...(sub_category_id && { sub_category_id: Number(sub_category_id) }),
            ...(minStock && { stock: { [Op.gte]: Number(minStock) } }),
            ...(maxStock && {
                stock: {
                    ...(minStock ? { [Op.gte]: Number(minStock) } : {}),
                    [Op.lte]: Number(maxStock),
                },
            }),
        };

        const { rows: items, count } = await Item.findAndCountAll({
            limit: _limit,
            offset,
            where: itemWhere,
            include: [
                {
                    model: SubCategory,
                    as: "subCategory",
                    attributes: ["id", "name"],
                    required: true,
                    include: [
                        {
                            model: Category,
                            as: "category",
                            attributes: ["id", "name"],
                            ...(category_id && {
                                where: { id: Number(category_id) },
                            }),
                        },
                    ],
                },
            ],
        });

        const response = items.map((item: any) => ({
            id: item.id,
            name: item.name,
            stock: item.stock,
            brand: item.brand,
            price: item.price,
            description: item.description,
            image: item.image,
            sub_category_id: item.sub_category_id ?? null,
            category_id: item.subCategory?.category.id ?? null,
            subCategoryName: item.subCategory?.name ?? null,
            categoryName: item.subCategory?.category?.name ?? null,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));

        return res.status(200).json({
            data: {
                items: response,
                ...getPagingData(count, _page, _limit),
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch items" });
    }
};

/**
 * GET ITEM BY ID
 */
export const getItemById = async (req: Request, res: Response) => {
    try {
        const item = await Item.findOne({
            where: { id: req.params.id },
            attributes: [
                "id",
                "name",
                "stock",
                "brand",
                "price",
                "image",
                "description",
                [col("subCategory.name"), "subCategoryName"],
                [col("subCategory->category.name"), "categoryName"],
                "createdAt",
                "updatedAt",
            ],
            include: [
                {
                    model: SubCategory,
                    as: "subCategory",
                    attributes: [],
                    include: [
                        {
                            model: Category,
                            as: "category",
                            attributes: [],
                        },
                    ],
                },
            ],
            raw: true,
        });

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        return res.status(200).json({ data: { item } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch item" });
    }
};

/**
 * UPDATE ITEM(ADMIN ONLY)
 */
export const updateItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { sub_category_id, name, brand, stock, price, description } = req.body;
        console.log(price, description)

        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        /** IMAGE */
        let image: string | undefined;
        if (req.file) {
            image = `/uploads/image/${req.file.filename}`;
        }

        /** STOCK LOGIC */
        if (stock !== undefined) {
            if (stock > 100) {
                return res.status(400).json({
                    message: `Cannot restock beyond maximum limit of 100 units. Current stock: ${item.stock}`,
                });
            }
            // if (item.stock >= 5 && stock < 5) {
            //     notify(
            //         "admin",
            //         JSON.stringify({
            //             title: "LOW STOCK ALERT",
            //             message: `Stock for item ${item.name} is low: ${stock}`,
            //         })
            //     );
            // }
            // if (stock === 0) {
            //     notify(
            //         "admin",
            //         JSON.stringify({
            //             title: "OUT OF STOCK ALERT",
            //             message: `Item ${item.name} is out of stock.`,
            //         })
            //     );
            // }
            // if (stock === 100) {
            //     notify(
            //         "user",
            //         JSON.stringify({
            //             title: "MAX STOCK ALERT",
            //             message: `Stock for item ${item.name} restored.`,
            //         })
            //     );
            // }
        }

        /** SUB CATEGORY CHECK */
        if (sub_category_id) {
            const subCategory = await SubCategory.findByPk(sub_category_id);
            if (!subCategory) {
                return res.status(404).json({ message: "Sub-category not found" });
            }
        }

        // /** DUPLICATE NAME CHECK */
        // if (name) {
        //     const existing = await Item.findOne({
        //         where: {
        //             name,
        //             sub_category_id: sub_category_id || item.sub_category_id,
        //             brand: brand || item.brand,
        //             id: { [Op.ne]: id },
        //             deletedAt: null,
        //         },
        //     });

        //     if (existing) {
        //         return res
        //             .status(400)
        //             .json({ message: "Item with the same name already exists" });
        //     }
        // }

        /** UPDATE PAYLOAD */
        const updatedData = {
            ...(name && { name }),
            ...(sub_category_id && { sub_category_id }),
            ...(brand && { brand }),
            ...(stock !== undefined && { stock }),
            ...(image && { image }),
            ...(price && { price }),
            ...(description && { description })
        };

        await item.update(updatedData);

        return res.status(200).json({
            message: "Item updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update item" });
    }
};

// UPDATE ITEM STOCK (FOR ORDERS, USERS ONLY)
export const updateItemStock = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const existingItem = await Item.findOne({ where: { id } });
        if (!existingItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (existingItem.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock in the inventory!!" });
        }

        //alert admin when stock is below threshold
        if (existingItem.stock > 5 && existingItem.stock - quantity < 5 && existingItem.stock - quantity > 0) {
            console.log(`Alert: Stock for item ID ${id} has fallen below threshold. Current stock: ${existingItem.stock - quantity}`);
            const payload = JSON.stringify({
                title: "LOW STOCK ALERT",
                message: `Stock for item ${existingItem.name} is low: ${existingItem.stock - quantity} left in inventory.`,
            });
            notify('admin', payload);
        }
        //alert admin when item is out of stock
        if (existingItem.stock - quantity === 0) {
            console.log(`Alert: Item ID ${id} is out of stock. Current stock: ${existingItem.stock - quantity}`);
            const payload = JSON.stringify({
                title: "OUT OF STOCK ALERT",
                message: `Item ${existingItem.name} is now completely out of stock. Restore it ASAP.`,
            });
            notify('admin', payload);
        }

        existingItem.update({ stock: existingItem.stock - quantity });

        return res.status(200).json({
            message: "Item stock updated successfully",
            item: existingItem,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update item stock" });
    }
};

/**
 * DELETE ITEM (SOFT DELETE)
 */
export const deleteItem = async (req: Request, res: Response) => {
    try {
        const item = await Item.findByPk(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        await item.destroy(); // paranoid => soft delete

        return res.status(200).json({
            message: "Item deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete item" });
    }
};
