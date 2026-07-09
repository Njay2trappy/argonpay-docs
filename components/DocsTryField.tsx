import { DocsTryField as DocsTryFieldType, inputKindLabel } from '../utils/docsTryIt'

type DocsTryFieldProps = {
  field: DocsTryFieldType
  value: string
  onChange: (value: string) => void
}

export default function DocsTryFieldInput({ field, value, onChange }: DocsTryFieldProps) {
  return (
    <label className="docs-try-field">
      <span className="docs-try-field-label">
        <span className="docs-try-field-name">
          {field.label}
          {field.required ? <em>*</em> : null}
        </span>
        <span className="docs-try-type" title={`API type: ${field.valueType}`}>
          {field.valueType}
        </span>
      </span>
      <input
        type={field.type === 'password' ? 'password' : field.type === 'number' ? 'number' : 'text'}
        value={value}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        spellCheck={false}
      />
      <small className="docs-try-field-meta">
        <span className="docs-try-kind">{inputKindLabel(field)}</span>
        {field.help ? <span>{field.help}</span> : null}
      </small>
    </label>
  )
}
