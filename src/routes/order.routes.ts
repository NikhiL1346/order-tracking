import express from "express";
import prisma from "../utils/prisma.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { Status } from "@prisma/client";

const router = Router();

// Create ORDER 

router.post("/",authMiddleware,async(req:Request, res:Response)=>{
    try {
        if(!req.user){
          return res.status(401).json({message:"Unauthorized"});
        }
        const order = await prisma.order.create({
            data:{
             userId:req.user.userId,
            },
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: "Failed to create order" });
    }
});

// get my orders

router.get("/myOrder",authMiddleware,async(req:Request, res:Response)=>{
    try {
        if(!req.user){
          return res.status(401).json({message:"Unauthorized"});
        }

        const orders = await prisma.order.findMany({
            where:{userId:req.user.userId},
            orderBy:{createdAt:"desc"},
        }); 
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

//UPDATE ORDER STATUS

router.patch(
  "/:id/status",
  authMiddleware,
  async (req: Request, res: Response) => {
   try {
     const orderId = Number(req.params.id);
     const { status } : { status:Status }=req.body;

     if (!Object.values(Status).includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
     }

     const order = await prisma.order.update({
        where:{id:orderId},
        data:{status},
     }); 
     res.json(order);

   } catch (error) {
     res.status(500).json({ message: "Failed to update order status" });
   }
  });

  export default router;