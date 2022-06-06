import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller";

const usersRouter = Router();

usersRouter.route("/").get(getAllUsers);

export default usersRouter;
