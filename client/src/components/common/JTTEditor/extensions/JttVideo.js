import { mergeAttributes, Node, nodePasteRule } from '@tiptap/core';


/**
 * @typedef {object} JttVideoOptions
 * @property {boolean} addPasteHandler Controls if the paste handler should be added.
 * @property {boolean} allowFullscreen Controls if the video iframe should allow fullscreen. **(Default: true)**
 * @property {boolean} autoplay Controls if the video should attempt to autoplay. **(Default: false)** Requires `allow="autoplay"` attribute.
 * @property {boolean} controls Controls if the video player controls should be shown (if supported by the source). **(Default: true)**
 * @property {Record<string, any>} HTMLAttributes Custom HTML attributes for the wrapper div.
 * @property {boolean} inline Controls if the node should be inline or block.
 * @property {number} width Default width of the video iframe.
 * @property {number} height Default height of the video iframe.
 * @property {Array<RegExp|Function>} allowedSources Array of regex patterns or validation functions.
 */

/**
 * @typedef {object} SetJttVideoOptions
 * @property {string} src The video URL.
 * @property {number} [width] Optional width override.
 * @property {number} [height] Optional height override.
 * @property {boolean} [allowfullscreen] Optional fullscreen override.
 * @property {boolean} [autoplay] Optional autoplay override.
 * @property {boolean} [controls] Optional controls override.
 */

// Extend Tiptap core commands
/**
 * @typedef {import('@tiptap/core').Commands<ReturnType>} Commands
 */
/**
 * @callback SetJttVideoCommand
 * @param {SetJttVideoOptions} options The video attributes.
 * @returns {boolean}
 */
/**
 * @typedef {object} JttVideoCommands
 * @property {SetJttVideoCommand} setJttVideo Insert a video iframe.
 */
/**
 * @typedef {Commands & { jttVideo: JttVideoCommands }} ExtendedCommands
 */


// 基础格式检查
const VIDEO_URL_REGEX_GLOBAL = /^(https?:)\/\/[^\s]+/g;

/**
 * 检查给定的URL是否有效，并与任何允许的源模式匹配。
 * @param {string} url 要验证的URL。
 * @param {Array<RegExp|Function>} allowedSources 允许的源模式数组，可以是RegExp模式或验证函数。
 * 如果为空或null，则允许任何符合基本格式的URL。
 * @returns {boolean} 如果URL有效且被允许，则返回true，否则返回false。
 */
const isValidVideoUrl = (url, allowedSources) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const basicUrlPattern = /^(https?:)\/\/.+/i;
  if (!basicUrlPattern.test(url)) {
    return false;
  }

  if (!allowedSources || allowedSources.length === 0) {
    return true;
  }

  // 检查源模式数组中的各项
  for (const source of allowedSources) {
    if (source instanceof RegExp && source.test(url)) {
      return true;
    }
    if (typeof source === 'function' && source(url)) {
      return true;
    }
  }

  // no match
  return false;
};


/**
 * 视频扩展 (JttVideo)
 */
export const JttVideo = Node.create({
  name: 'JttVideo',

  addOptions() {
    return {
      addPasteHandler: true,
      allowFullscreen: true,
      autoplay: false,
      HTMLAttributes: {},
      inline: false,
      width: 640,
      height: 480,
      allowedSources: [], // 默认值: 任意有效url
    };
  },

  inline() { return this.options.inline; },
  group() { return this.options.inline ? 'inline' : 'block'; },
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: null, // 默认, 可稍后在选项中设置
        parseHTML: (element) => element.querySelector('iframe')?.getAttribute('width') || element.getAttribute('width'),
      },
      height: {
        default: null, // 默认, 可稍后在选项中设置
        parseHTML: (element) => element.querySelector('iframe')?.getAttribute('height') || element.getAttribute('height'),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `div[data-jtt-video]`,   // 匹配后面的wrapper
        // 若直接解析 iframe，而不需要特定的包装器：
        // tag: 'iframe[src]',
        // getAttrs: (element) => ({ src: element.getAttribute('src') }),
        getAttrs: (element) => {
          const iframe = element.querySelector('iframe');
          if (!iframe) return false;

          return {
            src: iframe.getAttribute('src'),
            width: iframe.getAttribute('width'),
            height: iframe.getAttribute('height'),
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const finalWidth = HTMLAttributes.width ?? this.options.width;
    const finalHeight = HTMLAttributes.height ?? this.options.height;
    const finalSrc = HTMLAttributes.src;

    const allow = [];
    if (this.options.allowFullscreen) {
      allow.push('fullscreen');
    }
    if (this.options.autoplay) {
      allow.push('autoplay');
    }
    const allowString = allow.join('; ');

    // iframe属性, node属性优先于options属性
    const iframeAttrs = {
      src: finalSrc,
      width: finalWidth,
      height: finalHeight,
      allow: allowString || undefined,  // Add the 'allow' attribute string if features are enabled in options
      frameborder: '0',           // 惯用做法
      // The 'allowfullscreen' attribute is somewhat legacy, 'allow="fullscreen"' is preferred
      // We can include it for broader compatibility if desired, based on the option
      allowfullscreen: this.options.allowFullscreen ? '' : undefined,
    };

    // 去除undefined属性
    Object.keys(iframeAttrs).forEach(key => {
      if (iframeAttrs[key] === undefined) delete iframeAttrs[key];
    });

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, { 'data-jtt-video': '' }),
      ['iframe', iframeAttrs],
    ];
  },

  addCommands() {
    return {
      setJttVideo: (options) => ({ commands }) => {
        if (!isValidVideoUrl(options.src, this.options.allowedSources)) {
          console.warn('Invalid or disallowed video URL provided to setJttVideo:', options.src);
          return false;
        }

        const attrsToSet = {
          src: options.src,
          width: options.width ?? this.options.width ?? null,
          height: options.height ?? this.options.height ?? null,
        };

        return commands.insertContent({
          type: this.name,
          attrs: attrsToSet
        });
      },
    };
  },

  addPasteRules() {
    if (!this.options.addPasteHandler) return []

    return [
      nodePasteRule({
        find: VIDEO_URL_REGEX_GLOBAL,
        type: this.type,
        getAttributes: (match) => {
          const url = match[0];
          if (isValidVideoUrl(url, this.options.allowedSources)) {
            return {
              src: url,
            };
          }
          return false;   // 忽略粘贴
        },
      }),
    ];
  },
});


/* 正则 */
const YOUTUBE_REGEX = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?((?:youtube\.com|youtu.be|youtube-nocookie\.com))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/
// export const YOUTUBE_REGEX_GLOBAL = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?((?:youtube\.com|youtu.be|youtube-nocookie\.com))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/g
const BILIBILI_REGEX = /^(?:https?:)?\/\/(?:www|m)\.(?:bilibili\.com)\/(?:video\/[AVBV]+)(\d+)(\S+)?$/;
const YOUKU_REGEX = /^(?:https?:)?\/\/(?:v|player)\.youku\.com\/(?:v_show\/id|player\/player\.php\/sid)\/[Xx]+(\d+)(\S+)?$/;
const TENCENT_VIDEO_REGEX = /^(?:https?:)?\/\/v\.qq\.com\/(?:x\/cover|page)\/[mM]+\d+(\S+)?$/;

export const jttVideoConfig = {
  width: 640,
  height: 480,
  addPasteHandler: true,
  HTMLAttributes: {
    class: 'jtt-embedded-video',    // 给container添加class
  },
  allowFullscreen: true,
  autoplay: false,
  // --- 定义允许的视频源url ---
  allowedSources: [
    YOUTUBE_REGEX,      // 油管
    BILIBILI_REGEX,     // B站
    YOUKU_REGEX,        // 优酷
    TENCENT_VIDEO_REGEX,  // 腾讯
    // --- 通过任意有效url则设置为空 ---
    // allowedSources: [],
  ],
};