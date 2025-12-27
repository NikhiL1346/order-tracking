import express from "express";


const app = express();

app.use(express.json());
app.use("/auth",authRoutes);    
app.use("/orders",orderRoutes);


export default app;
