import * as express from 'express';
import * as controller from '@routes/users/users.controller';

const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/logout', controller.logout);

export default router;
