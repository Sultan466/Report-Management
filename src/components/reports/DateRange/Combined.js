import React from 'react';
import PersonnelDateRange from './Personnel'; // Import PersonnelDateRange
import EquipmentDateRange from './Equipment'; // Import EquipmentDateRange

function Combined() {
  return (
    <div>
      <PersonnelDateRange />
      <EquipmentDateRange />
    </div>
  );
}

export default Combined;
