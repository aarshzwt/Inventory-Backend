import { Request, Response } from "express";
import sequelize from "../config/databse";
import Cart from "../models/Cart";
import CartItem from "../models/CartItem";
import Item from "../models/Item";
import { AuthenticatedRequest } from "types/middleware.type";
import { notify } from "../utils/utilityFunctions";
import { col, literal } from "sequelize";
import SubCategory from "../models/SubCategory";
import Category from "../models/Category";

//HELPER FUNCTION
const getOrCreateCart = async (userId: number) => {
    let cart = await Cart.findOne({
        where: { user_id: userId, status: "active" },
    });

    if (!cart) {
        cart = await Cart.create({ user_id: userId });
    }

    return cart;
};

export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.id;
    const { item_id, quantity } = req.body;

    const item = await Item.findByPk(item_id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (quantity > item.stock) {
        return res.status(400).json({ message: "Not enough stock available" });
    }

    const cart = await getOrCreateCart(userId!);

    const existing = await CartItem.findOne({
        where: { cart_id: cart.id, item_id },
    });

    if (existing) {
        const newQty = existing.quantity + quantity;

        if (newQty > item.stock) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        await existing.update({ quantity: newQty });
    } else {
        await CartItem.create({
            cart_id: cart.id,
            item_id,
            quantity,
            price: item.price,
        });
    }

    return res.status(200).json({ message: "Item added to cart" });
};

export const updateCartItem = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.id;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartItem.findByPk(cartItemId, {
        include: [{ model: Cart, as: "cart" }, { model: Item, as: "item" }],
    });

    if (!cartItem || cartItem.cart!.user_id !== userId) {
        return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity > cartItem.item!.stock) {
        return res.status(400).json({ message: "Stock exceeded" });
    }

    await cartItem.update({ quantity });
    return res.status(200).json({ message: "Cart updated" });
};

export const removeCartItem = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.id;
    const { cartItemId } = req.params;

    const cartItem = await CartItem.findByPk(cartItemId, {
        include: [{ model: Cart, as: "cart" }],
    });

    if (!cartItem || cartItem.cart!.user_id !== userId) {
        return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.destroy();
    return res.status(200).json({ message: "Item removed from cart" });
};

export const getCart = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.id;

    const cart = await Cart.findOne({
        where: {
            user_id: userId,
            status: "active",
        },
        attributes: ["id", "status", "createdAt"],
        include: [
            {
                model: CartItem,
                as: "items",
                attributes: [
                    "id",
                    "item_id",
                    "quantity",
                    "price",

                    // Item fields
                    [literal("`items->item`.`name`"), "item_name"],
                    [literal("`items->item`.`stock`"), "item_stock"],
                    [literal("`items->item`.`brand`"), "item_brand"],
                    [literal("`items->item`.`image`"), "item_image"],

                    // Only names of Catwgory and SubCategory
                    [literal("`items->item->subCategory`.`name`"), "sub_category_name"],
                    [literal("`items->item->subCategory->category`.`name`"), "category_name"],
                ],
                include: [
                    {
                        model: Item,
                        as: "item",
                        attributes: [],
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
                    },
                ],
            },
        ],
    });

    return res.status(200).json({ data: { cart } });
};

export const checkoutCart = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.id;

    const t = await sequelize.transaction(); // create transaction

    try {
        const cart = await Cart.findOne({
            where: {
                user_id: userId,
                status: "active",
            },
            include: [
                {
                    model: CartItem,
                    as: "items",
                    include: [
                        {
                            model: Item,
                            as: "item"
                        }
                    ],
                },
            ],
            transaction: t,
            lock: t.LOCK.UPDATE,
        });

        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        for (const cartItem of cart.items) {
            const item = cartItem.item;

            if (!item) {
                throw new Error("Item not found");
            }

            if (cartItem.quantity > item.stock) {
                throw new Error(`Stock insufficient for ${item.name}`);
            }

            const newStock = item.stock - cartItem.quantity;

            // Update item stock
            await item.update(
                { stock: newStock },
                { transaction: t }
            );

            // Admin notifications
            if (newStock === 0) {
                notify(
                    "admin",
                    JSON.stringify({
                        title: "OUT OF STOCK",
                        message: `${item.name} is now out of stock`,
                    })
                );
            } else if (newStock <= 5) {
                notify(
                    "admin",
                    JSON.stringify({
                        title: "LOW STOCK",
                        message: `${item.name} stock is low (${newStock})`,
                    })
                );
            }
        }

        // Mark cart as checked out
        await cart.update(
            { status: "checked_out" },
            { transaction: t }
        );

        await t.commit(); // commit transaction

        return res.status(200).json({
            message: "Checkout successful",
        });

    } catch (err: any) {
        await t.rollback(); // rollback on failure

        return res.status(400).json({
            message: err.message || "Checkout failed",
        });
    }
};



