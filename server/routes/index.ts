import * as express from 'express';
import usersRouter from '@routes/users';
import postsRouter from '@routes/posts';

const router = express.Router();

router.use('/users', usersRouter);
router.use('/posts', postsRouter);

export default router;
