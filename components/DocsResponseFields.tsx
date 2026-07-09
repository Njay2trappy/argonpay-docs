import { fieldGroupClassName } from '../utils/docsFieldGroups'
import { DocsResponseField } from '../utils/docsTryIt'

type DocsResponseFieldsProps = {
  fields?: DocsResponseField[]
  title?: string
}

export default function DocsResponseFields({
  fields,
  title = 'Response fields',
}: DocsResponseFieldsProps) {
  if (!fields?.length) return null

  return (
    <div className="docs-schema" aria-label={title}>
      <div className="docs-schema-head">
        <h3 className="docs-schema-title">{title}</h3>
        <p className="docs-schema-copy">Types for values returned by this operation.</p>
      </div>
      <div className="docs-schema-list">
        {fields.map((field) => (
          <div key={field.path} className="docs-schema-row">
            <div className="docs-schema-row-top">
              <code className={`docs-schema-path ${fieldGroupClassName(field.path)}`}>
                {field.path}
              </code>
              <span className="docs-try-type">{field.valueType}</span>
            </div>
            <p className="docs-schema-desc">{field.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
