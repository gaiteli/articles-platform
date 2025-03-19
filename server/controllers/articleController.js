
const { Article } = require('@models');

exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    const updated = await article.update(req.body);

    // 1. 如果是作者且需要编辑自己的文章，额外检查所有权
    if (requiredPermission === 'article:edit-own') {
      const isOwner = req.resource?.userId === req.user.id;
      if (isOwner) {
        return next(); // 允许操作
      }
    }

    res.json({
      code: 'SUCCESS',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ code: 'UPDATE_FAILED' });
  }
};