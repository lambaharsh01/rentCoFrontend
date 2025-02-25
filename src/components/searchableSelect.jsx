import React, { useState, useEffect } from 'react';
import "./searchableSelect.css"

const SearchableSelect = ({ options, onChange, inputClass = "", inputStyle = {}, inputPlaceHolder = "Select", labelKey="label", inputDisabled=false }) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
      const filtered = options.filter((option) => {  
          const keys = Object.keys(option);
            return keys.some((key) => {
                const value = option[key].toString().toLowerCase();
                    return value.includes(searchTerm?.toLowerCase());   
            });       
        });
    setFilteredOptions(filtered);
  }, [searchTerm, options]);


const handleSelect = (option) => {
    onChange(option);
    setSearchTerm(option[labelKey]);
};




  return (
    <div className="searchable-select">
    <input
        className={inputClass}
        style={inputStyle}
        type="text"
        value={searchTerm}
        onChange={(e)=>setSearchTerm(e.target.value)}
        onFocus={()=>setFocused(true)}
        onBlur={() => { setTimeout(() => { setFocused(false) }, 100) }}
        placeholder={inputPlaceHolder}
        disabled={inputDisabled}
      />
      {focused && (
        <ul className="options-list scrolMaxHeight150">
          {filteredOptions.map((option, index) => (
            <li 
              // className="text-sm"
              style={{fontSize:14}}
              key={`Searchable${index}`}
              onClick={() => handleSelect(option)}>
              {
                (option?.[labelKey]?.length || 0) > 13 ?
                option?.[labelKey].slice(0, 13) + '...' :
                option?.[labelKey]
              }
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;