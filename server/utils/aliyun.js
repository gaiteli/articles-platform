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
const getUploadMiddleware = (folder = 'uploads', maxSize = 2) => {
    return multer({
        // 存储配置
        storage: MAO({
            config: config,
            destination: `${folder}`.replace(/\/$/, '') // 自动处理路径斜杠
        }),
        // 文件大小限制
        limits: {
            fileSize: maxSize * 1024 * 1024
        },
        // 文件类型过滤
        fileFilter: function(req, file, cb) {
            const isImage = file.mimetype.split('/')[0] === 'image';
            isImage ? cb(null, true) : cb(new BadRequest('只允许上传图片'));
        }
    }).single('image'); // 单文件上传，注意保持字段名一致
};

module.exports = {
    config,
    client,
    getUploadMiddleware
};