const express = require('express');
const router = express.Router();
const { success, failure } = require('@utils/responses')
const { config, client, getUploadMiddleware  } = require('@utils/aliyun')
const { BadRequest } = require('http-errors')
const { Attachment } = require('@models')
const {authorize} = require("@middlewares/auth");

// 文章附图上传
router.post('/aliyun/uploads', authorize(['article:create'], '上传附图'),
  getUploadMiddleware('uploads', 1),
  uploadHandler
);

// 文章封面上传
router.post('/aliyun/cover', authorize(['article:create'], '上传封面图'),
  getUploadMiddleware('covers', 2),
  uploadHandler
);

// 背景图片上传
router.post('/aliyun/background', authorize(['article:create'], '上传首页背景'),
  getUploadMiddleware('backgroundImages', 2),
  uploadHandler
);

// 公共上传处理器
async function uploadHandler(req, res) {
    if (!req.file) {
        return failure(res, new BadRequest('请选择要上传的文件！'));
    }

    const { type } = req.query;

    try {
        await Attachment.create({
            ...req.file,
            type,
            userId: req.user.id,
            fullpath: `${req.file.destination}/${req.file.filename}`
        });
        success(res, '上传成功', { url: req.file.url });
    } catch (error) {
        failure(res, error);
    }
}

module.exports = router