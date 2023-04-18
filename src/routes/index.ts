import { Router } from "express";
import lottoRoute from "./lottoRoute";

const router = Router();

router.use("/lotto", lottoRoute);

export default router;
