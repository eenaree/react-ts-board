import { Op, Sequelize } from 'sequelize';
import { models } from '@models';
import { Request } from 'express';
import { Query } from 'express-serve-static-core';
import { IResponse } from '@typings/express';

const { Comment, File, Post, User } = models;

interface CustomQuery extends Query {
  [key: string]: string;
  search_type: 'all' | 'title' | 'contents' | 'writer';
}

interface IRequest extends Request {
  query: CustomQuery;
}

export const writePost = async (req: Request, res: IResponse) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      contents: req.body.contents,
      UserId: res.locals.user!.id,
    });

    if (Array.isArray(req.files)) {
      const saveFiles = req.files.map(file => {
        File.create({ fileUrl: file.path, PostId: newPost.id });
      });
      await Promise.all(saveFiles);
    }

    res.json({ success: true, message: '포스트 등록 성공', post: newPost });
  } catch (error) {
    console.error(error);
  }
};

export const getPosts = async (req: IRequest, res: IResponse) => {
  try {
    const { count, rows } = await Post.findAndCountAll({
      attributes: {
        include: [
          [
            Sequelize.fn(
              'DATE_FORMAT',
              Sequelize.col('Post.createdAt'),
              '%y.%m.%d'
            ),
            'createdAt',
          ],
        ],
      },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
      limit: 10,
      offset: parseInt(req.query.page) * 10 - 10,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      message: '포스트 목록 가져오기 성공',
      posts: rows,
      count,
    });
  } catch (error) {
    console.error(error);
    req.params;
  }
};

export const getPost = async (req: IRequest, res: IResponse) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      attributes: {
        include: [
          [
            Sequelize.fn(
              'DATE_FORMAT',
              Sequelize.col('Post.createdAt'),
              '%Y.%m.%d %H:%i'
            ),
            'createdAt',
          ],
        ],
      },
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        {
          model: User,
          as: 'recommenders',
          attributes: ['id'],
          through: { attributes: [] },
        },
        {
          model: Comment,
          paranoid: false,
          attributes: {
            include: [
              [
                Sequelize.fn(
                  'DATE_FORMAT',
                  Sequelize.col('Comments.createdAt'),
                  '%Y.%m.%d %H:%i'
                ),
                'createdAt',
              ],
            ],
          },
          include: [
            { model: User, attributes: { exclude: ['password'] } },
            {
              model: User,
              as: 'likers',
              attributes: ['id'],
              through: { attributes: [] },
            },
            {
              model: User,
              as: 'dislikers',
              attributes: ['id'],
              through: { attributes: [] },
            },
            {
              model: Comment,
              as: 'replies',
              paranoid: false,
              include: [
                { model: User, attributes: { exclude: ['password'] } },
                {
                  model: User,
                  as: 'likers',
                  attributes: ['id'],
                  through: { attributes: [] },
                },
                {
                  model: User,
                  as: 'dislikers',
                  attributes: ['id'],
                  through: { attributes: [] },
                },
              ],
              attributes: {
                include: [
                  [
                    Sequelize.fn(
                      'DATE_FORMAT',
                      Sequelize.col('Comments.createdAt'),
                      '%Y.%m.%d %H:%i'
                    ),
                    'createdAt',
                  ],
                ],
              },
              through: { attributes: [] },
            },
          ],
        },
        { model: File },
      ],
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: '포스트가 존재하지 않습니다.' });
    }
    res.json({ success: true, message: '포스트 가져오기 성공', post });
  } catch (error) {
    console.error(error);
  }
};

export const editPost = async (req: Request, res: IResponse) => {
  try {
    await Post.update(
      { title: req.body.title, contents: req.body.contents },
      { where: { id: req.params.id } }
    );

    if (Array.isArray(req.files)) {
      const saveFiles = req.files.map(file => {
        File.create({ fileUrl: file.path, PostId: parseInt(req.params.id) });
      });
      await Promise.all(saveFiles);
    }

    const updatedPost = await Post.findByPk(req.params.id);
    res.json({ success: true, message: '포스트 수정 성공', post: updatedPost });
  } catch (error) {
    console.error(error);
  }
};

export const removePost = async (req: Request, res: IResponse) => {
  try {
    await Post.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: '포스트 삭제 성공' });
  } catch (error) {
    console.error(error);
  }
};

export const recommendPost = async (req: Request, res: IResponse) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: '포스트가 존재하지 않습니다.' });
    }

    await post.addRecommender(res.locals.user);
    res.json({ success: true, message: '포스트 추천 성공' });
  } catch (error) {
    console.error(error);
  }
};

export const unrecommendPost = async (req: Request, res: IResponse) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: '포스트가 존재하지 않습니다.' });
    }

    await post.removeRecommender(res.locals.user);
    res.json({ success: true, message: '포스트 추천 취소 성공' });
  } catch (error) {
    console.error(error);
  }
};

export const searchPost = async (req: IRequest, res: IResponse) => {
  try {
    if (req.query.search_type === 'all') {
      const writer = await User.findOne({
        where: { nickname: req.query.keyword },
      });
      const { count, rows } = await Post.findAndCountAll({
        where: {
          [Op.or]: [
            { title: { [Op.substring]: req.query.keyword } },
            { contents: { [Op.substring]: req.query.keyword } },
            { UserId: writer ? writer.id : 0 },
          ],
        },
        attributes: {
          include: [
            [
              Sequelize.fn(
                'DATE_FORMAT',
                Sequelize.col('Post.createdAt'),
                '%y.%m.%d'
              ),
              'createdAt',
            ],
          ],
        },
        include: [{ model: User, attributes: { exclude: ['password'] } }],
        limit: 10,
        offset: parseInt(req.query.page) * 10 - 10,
        order: [['createdAt', 'DESC']],
      });

      return res.json({
        success: true,
        message: '포스트 검색 성공',
        posts: rows,
        count,
      });
    }

    if (req.query.search_type === 'title') {
      const { count, rows } = await Post.findAndCountAll({
        where: { title: { [Op.substring]: req.query.keyword } },
        attributes: {
          include: [
            [
              Sequelize.fn(
                'DATE_FORMAT',
                Sequelize.col('Post.createdAt'),
                '%y.%m.%d'
              ),
              'createdAt',
            ],
          ],
        },
        include: [{ model: User, attributes: { exclude: ['password'] } }],
        limit: 10,
        offset: parseInt(req.query.page) * 10 - 10,
        order: [['createdAt', 'DESC']],
      });

      return res.json({
        success: true,
        message: '포스트 검색 성공',
        posts: rows,
        count,
      });
    }

    if (req.query.search_type === 'contents') {
      const { count, rows } = await Post.findAndCountAll({
        where: { contents: { [Op.substring]: req.query.keyword } },
        attributes: {
          include: [
            [
              Sequelize.fn(
                'DATE_FORMAT',
                Sequelize.col('Post.createdAt'),
                '%y.%m.%d'
              ),
              'createdAt',
            ],
          ],
        },
        include: [{ model: User, attributes: { exclude: ['password'] } }],
        limit: 10,
        offset: parseInt(req.query.page) * 10 - 10,
        order: [['createdAt', 'DESC']],
      });

      return res.json({
        success: true,
        message: '포스트 검색 성공',
        posts: rows,
        count,
      });
    }

    if (req.query.search_type === 'writer') {
      const writer = await User.findOne({
        where: { nickname: req.query.keyword },
      });
      if (!writer) {
        return res.json({ success: true, posts: [], count: 0 });
      }

      const { count, rows } = await Post.findAndCountAll({
        where: { UserId: writer.id },
        attributes: {
          include: [
            [
              Sequelize.fn(
                'DATE_FORMAT',
                Sequelize.col('Post.createdAt'),
                '%y.%m.%d'
              ),
              'createdAt',
            ],
          ],
        },
        include: [{ model: User, attributes: { exclude: ['password'] } }],
        limit: 10,
        offset: parseInt(req.query.page) * 10 - 10,
        order: [['createdAt', 'DESC']],
      });

      return res.json({
        success: true,
        message: '포스트 검색 성공',
        posts: rows,
        count,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const addComment = async (req: Request, res: IResponse) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: '포스트가 존재하지 않습니다.' });
    }

    const newComment = await Comment.create({
      comment: req.body.comment,
      UserId: res.locals.user!.id,
      PostId: post.id,
    });

    const commentWithUserInfo = await Comment.findByPk(newComment.id, {
      attributes: {
        include: [
          [
            Sequelize.fn(
              'DATE_FORMAT',
              Sequelize.col('Comment.createdAt'),
              '%Y.%m.%d %H:%i'
            ),
            'createdAt',
          ],
        ],
      },
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: User, as: 'likers' },
        { model: User, as: 'dislikers' },
        { model: Comment, as: 'replies' },
      ],
    });

    res.json({
      success: true,
      message: '댓글 추가 성공',
      comment: commentWithUserInfo,
    });
  } catch (error) {
    console.error(error);
  }
};

export const removeComment = async (req: Request, res: IResponse) => {
  try {
    await Comment.destroy({ where: { id: req.params.id } });

    const removedComment = await Comment.findByPk(req.params.id, {
      paranoid: false,
    });
    res.json({
      success: true,
      message: '댓글 삭제 성공',
      deletedAt: removedComment!.deletedAt,
    });
  } catch (error) {
    console.error(error);
  }
};

export const addReplyComment = async (req: Request, res: IResponse) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: '댓글이 존재하지 않습니다.' });
    }

    const newReplyComment = await Comment.create({
      comment: req.body.comment,
      UserId: res.locals.user!.id,
    });
    await comment.addReply(newReplyComment);

    const commentWithUserInfo = await Comment.findByPk(newReplyComment.id, {
      attributes: {
        include: [
          [
            Sequelize.fn(
              'DATE_FORMAT',
              Sequelize.col('Comment.createdAt'),
              '%Y.%m.%d %H:%i'
            ),
            'createdAt',
          ],
        ],
      },
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: User, as: 'likers' },
        { model: User, as: 'dislikers' },
      ],
    });
    res.json({
      success: true,
      message: '대댓글 추가 성공',
      comment: commentWithUserInfo,
    });
  } catch (error) {
    console.error(error);
  }
};

export const removeReplyComment = async (req: Request, res: IResponse) => {
  try {
    await Comment.destroy({ where: { id: req.params.id } });

    const removedComment = await Comment.findByPk(req.params.id, {
      paranoid: false,
    });
    res.json({
      success: true,
      message: '대댓글 삭제 성공',
      deletedAt: removedComment!.deletedAt,
    });
  } catch (error) {
    console.error(error);
  }
};

export const addLikeComment = async (req: Request, res: IResponse) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: '댓글이 존재하지 않습니다.' });
    }

    await comment.addLiker(res.locals.user);
    res.json({ success: true, message: '좋아요 추가 성공' });
  } catch (error) {
    console.error(error);
  }
};

export const addDislikeComment = async (req: Request, res: IResponse) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: '댓글이 존재하지 않습니다.' });
    }

    await comment.addDisliker(res.locals.user);
    res.json({ success: true, message: '싫어요 추가 성공' });
  } catch (error) {
    console.error(error);
  }
};

export const removeLikeComment = async (req: Request, res: IResponse) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: '댓글이 존재하지 않습니다.' });
    }

    await comment.removeLiker(res.locals.user);
    res.json({ success: true, message: '좋아요 제거 성공' });
  } catch (error) {
    console.error(error);
  }
};

export const removeDislikeComment = async (req: Request, res: IResponse) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: '댓글이 존재하지 않습니다.' });
    }

    await comment.removeDisliker(res.locals.user);
    res.json({ success: true, message: '싫어요 제거 성공' });
  } catch (error) {
    console.error(error);
  }
};

export const removeFile = async (req: Request, res: IResponse) => {
  try {
    await File.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: '첨부파일 삭제 성공' });
  } catch (error) {
    console.error(error);
  }
};

export const incrementViews = async (req: Request, res: IResponse) => {
  try {
    await Post.increment({ views: 1 }, { where: { id: req.params.id } });
    res.json({ success: true, message: '포스트 조회수 1 증가 성공' });
  } catch (error) {
    console.error(error);
  }
};
