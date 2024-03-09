import { Router } from "express";

const router = Router();

const verifyUserSession = (req, res, next) => {
  if (!req.session.user) return res.sendStatus(401);
  next();
};

router
  .post("/api/cart", verifyUserSession, (req, res) => {
    const { body: item } = req;

    const { cart } = req.session;
    if (cart) {
      cart.push(item);
    } else {
      req.session.cart = [item];
    }
    return res.status(201).send(item);
  })
  .get("/api/cart", verifyUserSession, (req, res) => {
    const { cart } = req.session;
    return res.send(cart ?? []);
  });
export default router;
