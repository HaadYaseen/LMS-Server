import { ApiResponse } from "@/shared";
import { Request, Response } from "express";
import { validationResult } from 'express-validator';
import { JWTEncryptedData, Login } from "./types";
import { prisma } from "@/shared/prisma";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';




export const LoginHandler = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as Login;
        const user = await prisma.user.findFirst({
            where: { email: { equals: email, mode: "insensitive" }, }
        });
        if (!user) {
            return ApiResponse(false, "User not found", null, 404, res);
        }
        if (!(bcrypt.compareSync(password, user?.password as string))) {
            return ApiResponse(false, "Please provide valid user email and password", null, 401, res);
        }
        const token = jwt.sign({ id: user?.id, email:user?.email, name:user?.name,role:user?.role, joinDate:user?.createdAt } as JWTEncryptedData, process.env.JWT_SECRET as string, { expiresIn: '1d' });
        return ApiResponse(true, "Login successful", token, 200, res);
    }
    catch (error) {
        return ApiResponse(false, "Validation Error", error, 500, res);
    }
}