import * as Yup from "yup";

// ITEMS VALIDATION SCHEMAS 
export const CREATE_ITEM_SCHEMA = Yup.object().shape({
    name: Yup.string().required("Item name is required"),
    sub_category_id: Yup.number().required("Sub-category is required"),
    stock: Yup.number().optional().integer("Limit must be an integer")
        .min(0, "Limit must be at least 0")
        .max(100, "Limit cannot exceed 100").optional(),
    brand: Yup.string().required("Brand is required"),
});

export const UPDATE_ITEM_SCHEMA = Yup.object().shape({
    name: Yup.string().optional(),
    sub_category_id: Yup.number().optional(),
    brand: Yup.string().optional(),
    stock: Yup.number().optional().integer("Limit must be an integer")
        .min(0, "Limit must be at least 0")
        .max(100, "Limit cannot exceed 100"),
});

export const UPDATE_ITEM_STOCK_SCHEMA = Yup.object().shape({
    quantity: Yup.number().positive().optional(),
});


//USER VALIDATION SCHEMAS
export const CREATE_USER_SCHEMA = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    role: Yup.string().oneOf(["admin", "user"], "Invalid role").optional(),
});

export const LOGIN_USER_SCHEMA = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

export const UPDATE_USER_SCHEMA = Yup.object().shape({
    username: Yup.string().optional(),
    email: Yup.string().email("Invalid email").optional(),
    password: Yup.string().optional(),
});