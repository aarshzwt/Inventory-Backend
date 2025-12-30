import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthenticatedRequest } from "../types/middleware.type";
import { getPagination, getPagingData, verifyRefreshToken } from "../utils/utilityFunctions";

/**
 * Helper to sign JWT
 */
const signToken = (user: User) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "1h" }
    );
};

const signRefreshToken = (user: User) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "7d" }
    );
};

/**
 * REGISTER
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role = "user" } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingUser = await User.findOne({
            where: { email, deletedAt: null },
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            username,
            email,
            password,
            role,
        });

        const userWithoutPassword = await User.scope('defaultScope').findByPk(user.id);

        return res.status(200).json({
            message: "User registered successfully",
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Registration failed" });
    }
};

/**
 * LOGIN
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await User.scope("withPassword").findOne({
            where: { email, deletedAt: null },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = signToken(user);
        const refreshToken = signRefreshToken(user);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        const userWithoutPassword = await User.scope('defaultScope').findByPk(user.id);
        const data = {
            message: "Login successful",
            user: userWithoutPassword,
            token,
        }

        return res.status(200).json({ data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Login failed" });
    }
};

/**
 * GET ALL USERS
 */
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const {
            page,
            limit,
        } = req.query;

        const { _page, _limit, offset } = getPagination(
            page as string,
            limit as string
        );
        const { rows: users, count } = await User.findAndCountAll({
            limit: _limit,
            offset,
        });
        return res.status(200).json({
            data: {
                users,
                ...getPagingData(count, _page, _limit),
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch users" });
    }
};

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = req.id;
        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch user" });
    }
}

/**
 * GET USER BY ID
 */
export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.id !== Number(req.params.id)) {
            return res.status(403).json({ message: "Authorization Denied" }) // user can get only his profile info
        }
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch user" });
    }
};

/**
 * UPDATE USER
 */
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.update({
            ...(username && { username }),
            ...(email && { email }),
            ...(password && { password }),
        });

        return res.status(200).json({
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Update failed" });
    }
};

/**
 * DELETE USER (SOFT DELETE)
 */
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.destroy(); // paranoid → soft delete

        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Delete failed" });
    }
};

/**
 * REFRESH THE ACCESS TOKEN
 */
export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        console.log("REFRESH COOKIE:", refreshToken);

        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const payload = verifyRefreshToken(refreshToken);
        if (!payload) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        const user = await User.findByPk(payload.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const newAccessToken = signToken(user);

        return res.status(200).json({ accessToken: newAccessToken });
    } catch {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};

