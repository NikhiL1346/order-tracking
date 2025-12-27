import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";

const router = Router();

//Register -- new user

router.post("/register",async (req:Request,res:Response)=>{
    try {
           const { name, email, password } = req.body;
           const existingUser = await prisma.user.findUnique({
            where:{email},
           });  
           if(existingUser){
            return res.status(400).json({message:"User already exists!"});
           }
           const hashedPassword = await bcrypt.hash(password,10);
           const user = await prisma.user.create({
            data:name,
            email,
            password:hashedPassword
        }
        );
        res.status(201).json({
            message: "User registered successfully",
            userId: user.id,
        });
    } catch (error) {
         res.status(500).json({ message: "Registration failed" });
    }
});


//LOGIN -- 

router.post("/login",async (req:Request,res:Response)=>{
    try {
        const {email,password}=req.body;
        const user = await prisma.user.findUnique({
            where:{email},
        });
        if(!user){
            return res.status(400).json({message:"Invalid Credentials!"});
        }

        const isMatch =await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials!"});
        } 

        const token = jwt.sign(
            {userId:user.id,role:user.role},
            process.env.JWT_SECRET as string,
            {expiresIn:"1d"}
        );
        res.json({token});
    } catch (error) {
         res.status(500).json({ message: "Login failed" });
    }
});

export default router;
