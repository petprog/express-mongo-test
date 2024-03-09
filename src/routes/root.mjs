import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  // res.cookie("hello", "world", { maxAge: 60000 * 60, signed: true });
  res.status(201).send({ message: "Hello!" });
});
export default router;
