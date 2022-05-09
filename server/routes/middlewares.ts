import * as path from 'path';
import * as fs from 'fs';
import * as multer from 'multer';
import { NextFunction, Request } from 'express';
import { models } from '@models';
import { IResponse } from '@typings/express';

const { User } = models;

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = path.basename(file.originalname, ext);
    cb(null, filename + '_' + Date.now() + ext);
  },
});

const uploader = multer({
  storage: diskStorage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, false);
    }
    cb(null, true);
  },
});

export const isLoggedIn = async (
  req: Request,
  res: IResponse,
  next: NextFunction
) => {
  try {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ success: false, message: '로그인 상태가 아닙니다.' });
    }
    const user = await User.findOne({
      where: { email: req.session.user.email },
    });
    res.locals.user = user!;
    next();
  } catch (error) {
    console.error(error);
  }
};

export const uploadFiles = async (
  req: Request,
  res: IResponse,
  next: NextFunction
) => {
  !fs.existsSync('uploads') && fs.mkdirSync('uploads');

  try {
    uploader.array('files')(req, res, error => {
      if (error instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: error.message });
      } else if (error) {
        return res.status(400).json({
          success: false,
          message: '허용되지 않은 파일 확장자입니다.',
        });
      }
      next();
    });
  } catch (error) {
    console.error(error);
  }
};
