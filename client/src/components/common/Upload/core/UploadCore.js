
export default class UploadCore {
  constructor(config = {}) {
    this.defaultConfig = {
      maxSize: 2,
      allowedTypes: ['image/jpg', 'image/jpeg', 'image/png'],
      uploadAPI: null,
      fieldName: 'image', // 默认字段名
      promptMessage: '点击上传后单击图片预览，双击重选',
      uploadText: 'Upload',
      ...config
    };
  }

  beforeUpload = (file) => {
    const { allowedTypes, maxSize } = this.defaultConfig;
    const isValidType = allowedTypes.includes(file.type);
    const isValidSize = file.size / 1024 / 1024 < maxSize;

    if (!isValidType) {
      message.error(`仅支持 ${allowedTypes.join(', ')} 格式`);
      return false;
    }

    if (!isValidSize) {
      message.error(`文件大小不能超过 ${maxSize}MB`);
      return false;
    }

    return true;
  };

  handleUpload = async (options) => {
    const { uploadAPI, fieldName } = this.defaultConfig;
    const { file, onSuccess, onError } = options;

    try {
      const formData = new FormData();
      formData.append(fieldName, file);
      const res = await uploadAPI(formData);
      onSuccess(res.data, file);
    } catch (error) {
      onError(error);
      console.error('Upload failed:', error);
    }
  };
}