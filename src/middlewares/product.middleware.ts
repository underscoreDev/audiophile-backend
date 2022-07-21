import { Response, NextFunction, Request } from "express";

export const aliasTopProducts = (req: Request, _res: Response, next: NextFunction) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.select = "name,price,ratingsAverage,features,description";
  next();
};
