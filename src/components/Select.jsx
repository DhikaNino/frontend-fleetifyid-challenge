import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from './icons';

const SelectComponent = ({ 
  value, 
  onValueChange, 
  options = [], 
  placeholder = "Pilih opsi...",
  disabled = false,
  className = ''
}) => {
  return (
    <Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <Select.Trigger className={`select-trigger ${className}`}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="select-content" position="popper" sideOffset={4}>
          <Select.Viewport>
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value || "none"}
                className="select-item"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default SelectComponent;
