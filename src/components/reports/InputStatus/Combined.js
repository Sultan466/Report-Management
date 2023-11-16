import React from 'react';
import PersonnelInputStatus from './Personnel'; // Import PersonnelDateRange
import EquipmentInputStatus from './Equipment'; // Import EquipmentDateRange

function Combined() {
  return (
    <div>
      <PersonnelInputStatus />
      <EquipmentInputStatus />
    </div>
  );
}

export default Combined;
