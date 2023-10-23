import { Response } from 'express';

export const createJsonResponse = (
  res: Response,
  resObj: any,
  isSuccess = true,
) => {
  return res.json({ success: isSuccess, ...resObj });
};
