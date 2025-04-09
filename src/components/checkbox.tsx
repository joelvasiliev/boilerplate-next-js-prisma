'use client'

import { useState } from 'react'

interface StyledCheckboxProps {
  initialChecked?: boolean
  onChange?: (checked: boolean) => void
}

export function StyledCheckbox({ initialChecked = false, onChange }: StyledCheckboxProps) {
  const [isChecked, setIsChecked] = useState(initialChecked)

  const handleToggle = () => {
    const newChecked = !isChecked
    setIsChecked(newChecked)
    onChange?.(newChecked)
  }

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={handleToggle}
        />
        <div
          className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${
            isChecked ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></div>
        <div
          className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
            isChecked ? 'transform translate-x-full' : ''
          }`}
        ></div>
      </div>
    </label>
  )
}

