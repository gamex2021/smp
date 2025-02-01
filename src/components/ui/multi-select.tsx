import React, { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type Option = {
  label: string
  value: string
}

interface SimpleMultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
}

export function MultiSelect({ options, selected, onChange, placeholder = "Select items..." }: SimpleMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const handleRemove = (value: string) => {
    onChange(selected.filter(item => item !== value))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start text-left font-normal"
        variant="outline"
      >
        <div className="flex flex-wrap gap-1">
          {selected.length > 0 ? (
            selected.map(value => {
              const option = options.find(o => o.value === value)
              return (
                <Badge key={value} variant="secondary" className="mr-1">
                  {option?.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(value)
                    }}
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
      </Button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border-b"
          />
          <ul className="max-h-60 overflow-auto">
            {filteredOptions.map(option => (
              <li
                key={option.value}
                className={`px-2 py-1 cursor-pointer hover:bg-accent hover:text-accent-foreground ${selected.includes(option.value) ? 'bg-accent' : ''
                  }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
