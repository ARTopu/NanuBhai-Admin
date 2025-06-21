import React, { useEffect, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface EditCategorySelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  initialValue?: string | number;
}

const EditCategorySelect: React.FC<EditCategorySelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  initialValue = "",
}) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  // Initialize the select with the initialValue
  useEffect(() => {
    console.log('EditCategorySelect initialValue changed:', initialValue, 'type:', typeof initialValue);

    if (initialValue !== undefined && initialValue !== null) {
      const valueStr = initialValue.toString();
      setSelectedValue(valueStr);
      console.log('EditCategorySelect initialized with:', valueStr, 'type:', typeof valueStr);

      // Also trigger the onChange to ensure parent component is updated
      if (valueStr) {
        onChange(valueStr);
      }
    } else {
      setSelectedValue("");
      console.log('EditCategorySelect initialized with empty value');
    }
  }, [initialValue, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    onChange(newValue);
    console.log('EditCategorySelect changed to:', newValue);
  };

  return (
    <div>
      <select
        className={`h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`}
        value={selectedValue}
        onChange={handleChange}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {option.label}
          </option>
        ))}
      </select>
      {/* Removed debug text */}
    </div>
  );
};

export default EditCategorySelect;
