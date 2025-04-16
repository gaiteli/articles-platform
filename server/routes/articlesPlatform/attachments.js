const express = require('express');
const router = express.Router();
const {Attachment} = require('@models');
const {NotFound} = require('http-errors');
const {success, failure} = require('@utils/responses');
const {client} = require('@utils/aliyun');
const {ROLE_PERMISSIONS} = require("@constants/permissions")

/**
 * 获取用户自己上传过的附件/封面图/背景图...
 * GET /article-platform/attachments
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id
    const { type = 'all', currentPage = 1, pageSize = 10} = req.query;

    const offset = (currentPage - 1) * pageSize;

    const condition = {
      order: [['id', 'DESC']],
      limit: Number(pageSize),
      offset: Number(offset),
    }

    if (type === 'all') {
      condition.where = { userId }
    } else {
      condition.where = { userId, type }
    }

    const {count, rows: rows} = await Attachment.findAndCountAll(condition);

    success(res, '用户历史上传获取成功', {
      attachments: rows,
      pagination: {
        total: count,
        currentPage: Number(currentPage),
        pageSize: Number(pageSize),
      },
    });
  } catch (error) {
    failure(res, error);
  }
});


/**
 * 删除用户附件
 * DELETE /article-platform/attachments/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const attachment = await Attachment.findByPk(id);
    if (!attachment) throw new NotFound(`attachments ID: ${id} not found`)

    // 权限判定
    const canEdit = ROLE_PERMISSIONS[req.user.role].includes('admin:access')
      || req.user.id === attachment.userId
    if (!canEdit) {
      throw new Forbidden('没有删除该附件的权限！');
    }

    await client.delete(attachment.fullpath);
    await attachment.destroy();

    success(res, '附件删除成功');
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;