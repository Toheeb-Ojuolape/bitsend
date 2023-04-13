import React, { useState } from 'react';
import { InputBase, MenuItem, OutlinedInput, Select } from '@mui/material';
import { MdSearch } from 'react-icons/md';

const SearchForm = ({ options, label, value, onChange,defaultValue }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Select
      labelId={`${label}-label`}
      id={label}
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
      input={
        <OutlinedInput
          label={label}
          startAdornment={
            <InputBase
              placeholder='Search…'
              startAdornment={<MdSearch />}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          }
        />
      }
      displayEmpty
      renderValue={(selected) => selected || label}
      MenuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        getContentAnchorEl: null,
      }}
      style={{ width: '100%' }}
    >
      <MenuItem value='' disabled>
        {label}
      </MenuItem>
      {filteredOptions.map((option) => (
        <MenuItem key={option.id} value={option.name}>
          {option.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SearchForm;
