import { Router } from "express";
import rootRouter from "./root.mjs";
import usersRouter from "./users.mjs";
import productsRouter from "./products.mjs";
import authRouter from "./auth.mjs";
import cartRouter from "./cart.mjs";

const router = Router();

router.use(rootRouter);
router.use(usersRouter);
router.use(authRouter);
router.use(productsRouter);
router.use(cartRouter);

export default router;
