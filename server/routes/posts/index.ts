import * as express from 'express';
import * as controller from '@routes/posts/posts.controller';
import { isLoggedIn, uploadFiles } from '@routes/middlewares';

const router = express.Router();

router.post('/', isLoggedIn, uploadFiles, controller.writePost);
router.get('/', controller.getPosts);
router.get('/search', controller.searchPost);
router.get('/:id', controller.getPost);
router.patch('/:id', isLoggedIn, uploadFiles, controller.editPost);
router.delete('/:id', isLoggedIn, controller.removePost);
router.post('/:id/recommend', isLoggedIn, controller.recommendPost);
router.delete('/:id/recommend', isLoggedIn, controller.unrecommendPost);

router.post('/:id/comment', isLoggedIn, controller.addComment);
router.delete('/:id/comment', isLoggedIn, controller.removeComment);
router.post('/comment/:id/reply', isLoggedIn, controller.addReplyComment);
router.delete('/comment/:id/reply', isLoggedIn, controller.removeReplyComment);
router.post('/comment/:id/like', isLoggedIn, controller.addLikeComment);
router.post('/comment/:id/dislike', isLoggedIn, controller.addDislikeComment);
router.delete('/comment/:id/like', isLoggedIn, controller.removeLikeComment);
router.delete(
  '/comment/:id/dislike',
  isLoggedIn,
  controller.removeDislikeComment
);

router.delete('/:id/file', isLoggedIn, controller.removeFile);
router.post('/:id/views', controller.incrementViews);

export default router;
