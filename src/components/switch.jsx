import { useState } from 'react';
import './switch.css'

const Switch = ({ onChange, checked: initialChecked }) => {
  
  const [checked, setChecked] = useState(initialChecked);

  const handleClick = () => {
    setChecked(!checked);
    onChange(!checked);
  };

  return (
    <div
      className={`switch ${checked ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div className="switch-handle" />
    </div>
  );
};

export default Switch;