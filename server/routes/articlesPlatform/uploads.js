const express = require('express');
const router = express.Router();
const { success, failure } = require('@utils/responses')
const { config, client, singleFileUpload } = require('@utils/aliyun')
const { BadRequest } = require('http-errors')
const { Attachment } = require('@models')
const {authorize} = require("@middlewares/auth");

router.post('/aliyun', authorize(['article:create'], '上传文件'), function (req, res, next) {
    try {
        singleFileUpload(req, res, async function(error) {
            if (error) {
                return failure(res, error)
            }
            if (!req.file) {
                return failure(res, new BadRequest('请选择要上传的文件！'))
            }

            await Attachment.create({
                ...req.file,
                userId: req.user.id,
                fullpath: req.file.path + '/' + req.file.filename,
            })
            success(res, '上传成功', {url: req.file.url})
        })
    } catch (error) {
        failure(res, error)
    }
})

module.exports = router