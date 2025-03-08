const multer = require('multer')
const MAO = require('multer-aliyun-oss')
const OSS = require("ali-oss")
const { BadRequest } = require('http-errors')

// 配置阿里云信息
const config = {
    region: process.env.ALIYUN_REGION,
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    bucket: process.env.ALIYUN_BUCKET,
}

const client = new OSS(config)

// multer配置信息
const upload = multer({
    storage: MAO({
        config: config,
        destination: 'uploads'      // 自定义上传目录
    }),
    limits: {
        fileSize: 1 * 1024 * 1024,      // 限制上传图片大小为1M
    },
    fileFilter: function(req, file, cb) {
        // 只允许上传图片
        const fileType = file.mimetype.split('/')[0]
        const isImage = fileType === 'image'

        if (!isImage) {
            return cb(new BadRequest('只允许上传图片'))
        }

        cb(null, true)
    }
})

// 只单文件上传，指定表单字段名为file。注意和前端发送的字段保持一致
const singleFileUpload = upload.single('image')

module.exports = {
    config,
    client,
    singleFileUpload
}