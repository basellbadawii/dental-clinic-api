import { forwardRef } from 'react'

const Textarea = forwardRef(({
  placeholder,
  rows = 4,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div>
      <textarea
        ref={ref}
        rows={rows}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2.5 
          border rounded-lg
          focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-all duration-200
          resize-none
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
