import { Extension } from '@tiptap/core'
import { uploadAttachmentAPI } from '/src/apis/articles_platform/attachment'

export const ImageUpload = Extension.create({
  name: 'imageUpload',

  addCommands() {
    return {
      uploadImage: () => ({ commands, editor }) => {
        // 创建文件选择器
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/jpg,image/jpeg,image/png'

        // 处理文件选择
        input.onchange = async () => {
          const file = input.files?.[0]
          if (!file) return

          try {
            // 检查
            const isJpgOrPng = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
            if (!isJpgOrPng) throw new Error('图片格式不正确，请提交jpg/jpeg/png格式')
            const isLt2M = file.size / 1024 / 1024 < 1;
            if (!isLt2M) throw new Error('图片大小不能超过 1MB！')

            // 创建临时显示
            const reader = new FileReader()
            reader.onload = (e) => {
              // 先插入临时图片
              commands.setImage({ src: e.target?.result })
            }
            reader.readAsDataURL(file)

            // 上传图片到OSS，获取图片URL
            const formData = new FormData()
            formData.append('image', file)
            const res = await uploadAttachmentAPI(formData);
            const imageUrl = res.data.url;

            // 更新为真实URL
            if (imageUrl) {
              console.log('setImage success !!!!!!');
              editor.chain().focus().setImage({ src: imageUrl }).run()
            }
          } catch (error) {
            console.error('Upload failed:', error)
          }
        }

        // 触发文件选择
        input.click()

        return true
      }
    }
  }
})