import { forwardRef } from 'react'

const Select = forwardRef(({
  options = [],
  placeholder = 'اختر...',
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div>
      <select
        ref={ref}
        className={`
          w-full px-4 py-2.5 
          border rounded-lg
          focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-all duration-200
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
