import { mergeAttributes, getMarkRange, Mark } from '@tiptap/core';
import TiptapLink from '@tiptap/extension-link'
import { message } from 'antd'

export const JttLink = TiptapLink.extend({
  name: 'JttLink',
  inclusive: false,

  // bubble组件保存callbacks
  addStorage() {
    return {
      openMenu: () => { console.warn('LinkBubble openMenu function not initialized'); },
      closeMenu: () => { console.warn('LinkBubble closeMenu function not initialized'); },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(), // 继承父commands：setLink, unsetLink...

      // 打开弹窗
      openLinkEditor: () => ({ editor }) => {
        console.log('openLinkEditor function');
        const { state } = editor;
        const { selection } = state;
        const { from, to, empty } = selection;

        let initialHref = '';
        let initialText = state.doc.textBetween(from, to, '');
        let isNew = empty;

        // 检查选区中是否有link
        const range = getMarkRange(state.selection.$from, state.tr.doc.type.schema.marks.link);
        if (range) {
          const mark = state.doc.resolve(range.from).marks().find(m => m.type.name === this.type.name);
          if (mark) {
            initialHref = mark.attrs.href || '';
            // If selection was empty but we are *inside* an existing link, treat as edit not new
            if (empty) {
              isNew = false;
              // Optionally select the whole link text when opening for edit
              // editor.commands.setTextSelection(range);
              // initialText = state.doc.textBetween(range.from, range.to, ''); // Get text of the whole link
            }
          }
        } else if (!empty) {
          // Text is selected, but it's not currently a link - treat as new link creation
          isNew = true;
        }

        this.storage.openMenu({
          href: initialHref,
          text: initialText,
          isNew: isNew,
        });
        return true;
      },

      // 根据用户输入更新Link
      setLinkWithOptions: (options) => ({ editor, commands }) => {
        const { href, text, isNew } = options;

        // 取消（删除）Link
        if (href === null || href === '') {
          return commands.unsetLink();
        }

        // 校验URL（待增加更多规则）
        try {
          new URL(href);
        } catch (e) {
          console.error("Invalid URL provided:", href)
          message.error("无效URL！")
          return false
        }

        const { state, chain } = editor;
        const { from, to, empty } = state.selection;

        const linkAttrs = {
          href: href,
          target: '_blank',
          rel: 'noopener noreferrer nofollow',
        };

        let transactionChain = editor.chain().focus();

        if (isNew && text && empty) {
          transactionChain = transactionChain.insertContent(
            `<a href="${href}">${text}</a>`
          );
        } else if (!empty) {
          transactionChain = transactionChain.extendMarkRange(this.type.name).setMark(this.type.name, linkAttrs);
        } else {
          // 点击已有链接 - update it
          const range = getMarkRange(state.selection.$from, state.tr.doc.type.schema.marks.link);
          if (range) {
            transactionChain = transactionChain.extendMarkRange(this.type.name).setMark(this.type.name, linkAttrs);
          } else {
            console.warn("Trying to update link with cursor, but no link mark found.");
            return false;
          }
        }

        const success = transactionChain.run();
        if (success) {
          this.storage.closeMenu(); // 关闭bubble
        }
        return success;

      },
    };
  },

  // addProseMirrorPlugins() {
  //   const { editor } = this;
  //   return [
  //     ...(this.parent?.() || []), 
  //     new Plugin({
  //       props: {
  //         handleKeyDown: (view, event) => {
  //           const { selection } = editor.state;
  //           if (event.key === 'Escape' && selection.empty !== true) {
  //             editor.commands.focus(selection.to, { scrollIntoView: false });
  //             return true;
  //           }
  //           return false; // Let other plugins handle
  //         },
  //         // 可选：点击bubble外关闭
  //       },
  //     }),
  //   ];
  // },
}).configure({
  openOnClick: true,
  autolink: true,
  defaultProtocol: 'https',
  validate: href => /^https?:\/\//.test(href),
});

export default JttLink