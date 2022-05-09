import { Request, Response, Router } from "express";
import { prisma } from "../database.js";

const resetRouter = Router();

resetRouter.delete("/reset", async (req: Request, res: Response) => {
  await prisma.recommendation.deleteMany();
  res.sendStatus(200);
});

export default resetRouter;
