import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import '../../../css/styles.css'
import 'react-date-range/dist/styles.css'; // import styles
import 'react-date-range/dist/theme/default.css'; // import styles

function Equipment() {
  const [selectedYear, setSelectedYear] = useState('2023'); // Initialize with a default year
  const [selectedStartMonth, setSelectedStartMonth] = useState('Jan');
  const [selectedEndMonth, setSelectedEndMonth] = useState('Dec');

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const equipmentColumns = ['TRP', 'STBY', 'OFRD', 'MNT', 'NODRVR', 'OTH', 'TOTAL'];

  const handleStartMonthChange = (e) => {
    setSelectedStartMonth(e.target.value);
  };

  const handleEndMonthChange = (e) => {
    setSelectedEndMonth(e.target.value);
  };

  const getMonthsInRange = () => {
    const startIndex = months.indexOf(selectedStartMonth);
    const endIndex = months.indexOf(selectedEndMonth);
    return months.slice(startIndex, endIndex + 1);
  };
  
  const handleGenerateReport = () => {
    // You can use selectedYear, selectedStartMonth, and selectedEndMonth
    // to generate the report for the selected months here
    // For simplicity, we'll just log the selected values
    console.log('Selected Year:', selectedYear);
    console.log('Start Month:', selectedStartMonth);
    console.log('End Month:', selectedEndMonth);
  };

  return (
    <div>
      <h2>View Within Month Range</h2>

      {/* Year Selection Dropdown */}
      <div className="mb-4">
        <label htmlFor="yearDropdown" className="font-weight-bold">Select Year:</label>
        <br />
        <select
          id="yearDropdown"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          {/* Add more years as needed */}
        </select>
      </div>

      {/* Month Selection */}
      <div className="mb-4">
        <label htmlFor="startMonthDropdown" className="font-weight-bold">Select Start Month:</label>
        <select
          id="startMonthDropdown"
          value={selectedStartMonth}
          onChange={handleStartMonthChange}
        >
          {months.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        <label htmlFor="endMonthDropdown" className="font-weight-bold ml-4">Select End Month:</label>
        <select
          id="endMonthDropdown"
          value={selectedEndMonth}
          onChange={handleEndMonthChange}
        >
          {months.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      {/* Generate Report Button */}
      <button className="btn btn-primary" onClick={handleGenerateReport}>Generate Report</button>

      {/* Equipment Report */}
      <div className="mb-4 table-container">
        <h3>Equipment</h3>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Month</th>
              {equipmentColumns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getMonthsInRange().map((month, index) => (
              <tr key={month}>
                <td>{`${month}-${selectedYear.slice(2)}`}</td>
                {equipmentColumns.map((column) => (
                  <td key={column}> {/* Add your data here */}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Equipment;
