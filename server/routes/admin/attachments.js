const express = require('express')
const router = express.Router()
const {Attachment, User} = require('@models')
const {NotFound} = require('http-errors')
const {success, failure} = require('@utils/responses')
const {client} = require('@utils/aliyun')

/**
 * 查询附件列表
 * GET /admin/attachments
 */
router.get('/', async (req, res) => {
  try {
    const query = req.query
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize

    const condition = {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar'],
        }
      ],
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset,
    }

    const {count, rows} = await Attachment.findAndCountAll(condition)

    success(res, '附件列表查询成功', {
      attachments: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      }
    })
  } catch (error) {
    failure(res, error)
  }
})


/**
 * 删除附件
 * DELETE /admin/attachments/:id
 */
router.delete('/:id', async function (req, res) {
  try {
    const attachment = await getAttachment(req)

    // 删除aliyun OSS中的文件
    await client.delete(attachment.fullpath)

    await attachment.destroy()

    success(res, '删除附件成功')
  } catch (error) {
    failure(res, error)
  }
})


/**
 * 公共方法：
 * 查询当前附件
 */
async function getAttachment(req) {
  const {id} = req.params

  const attachment = await Attachment.findByPk(id)
  if (!attachment) {
    throw new NotFound(`attachments ID: ${id} not found`)
  }

  return attachment
}

module.exports = router