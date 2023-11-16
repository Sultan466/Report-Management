import React from 'react';
import PersonnelMonthRange from './Personnel';
import EquipmentMonthRange from './Equipment';

function Combined() {
  return (
    <div>
      <PersonnelMonthRange />
      <EquipmentMonthRange />
    </div>
  );
}

export default Combined;
