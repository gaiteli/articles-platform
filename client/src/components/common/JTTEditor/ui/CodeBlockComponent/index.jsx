import styles from './index.module.scss'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'

export default ({ node: { attrs: { language: defaultLanguage } }, updateAttributes, extension }) => (
  <NodeViewWrapper className={styles.codeBlock}>
    <select
    className={styles.select}
      contentEditable={false}
      defaultValue={defaultLanguage}
      onChange={event => updateAttributes({ language: event.target.value })}
    >
      <option value="null">
        自动
      </option>
      <option disabled>
        ——
      </option>
      {extension.options.lowlight.listLanguages().map((lang, index) => (
        <option key={index} value={lang}>
          {lang}
        </option>
      ))}
    </select>
    <pre>
      <NodeViewContent as="code" />
    </pre>
  </NodeViewWrapper>
)