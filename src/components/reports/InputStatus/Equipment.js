import React, { useState } from 'react';
import '../../../css/styles.css'; // Import custom CSS
import { useEffect } from 'react';  

function Equipment() {
  
  // State to manage selected month and year
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().toLocaleString('default', { month: 'short' }),
    year: new Date().getFullYear().toString(),
  });

  const equipmentStatusOptions = ['TRP', 'STBY', 'OFRD', 'MNT', 'NODRVR', 'OTH'];

  const updateStatusInDatabase = (type, identifier, date, newStatus) => {
    const formattedDate = `${new Date(date).getDate()}/${new Date(date).getMonth() + 1}/${new Date(date).getFullYear()}`;
    const endpoint = type === 'personnel' ? 'personnel/addPersonnelDailyStatus' : 'equipment/addEquipmentDailyStatus';
    console.log(formattedDate,'formattedDate in /add/')
    fetch(`http://localhost:8000/api/${endpoint}?identifier=${identifier}&date=${formattedDate}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (response.ok) {
          // Update the status in your local state
          if (type === 'personnel') {
            setStatusData((prevStatusData) => ({
              ...prevStatusData,
              [`${identifier}-${date}`]: newStatus,
            }));
          } else {
            // Handle equipment status update
          }
        } else {
          console.error('Failed to update status data:', response.statusText);
        }
      })
      .catch((error) => {
        console.error('Error updating status data:', error);
      });
  };
  
  const [statusData, setStatusData] = useState({});

  const [equipmentData, setEquipmentData] = useState([]);

  useEffect(() => {
    // Fetch equipment data from the API when the component mounts
    fetch('http://localhost:8000/api/equipment/equipmentInfo')
      .then((response) => response.json())
      .then((data) => setEquipmentData(data))
      .catch((error) => console.error('Error fetching equipment data:', error));
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate({ ...selectedDate, [event.target.name]: event.target.value });
  };

  const generateDateHeaders = () => {
    const month = selectedDate.month;
    const year = selectedDate.year;
    const daysInMonth = new Date(year, new Date(month + ' 1, ' + year).getMonth() + 1, 0).getDate();
    const dateHeaders = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const twoDigitYear = new Date(year).getFullYear().toString().slice(-2); // Extract the last two digits of the year
      const shortenedMonth = month.slice(0, 3)
      dateHeaders.push(`${day}-${shortenedMonth}-${twoDigitYear}`);
    }

    return dateHeaders;
  };

  const dateHeaders = generateDateHeaders();

  return (
    <div>
      <div className="mb-1"></div>
      <br />
      {/* Year and Month Selection Dropdown */}
      <div className="mb-4">
        <label htmlFor="dateSelect" className="font-weight-bold">Select Year and Month:</label>
        <br />
        <select
          className="form-control w-25" // Adjust the width class as needed
          name="year"
          value={selectedDate.year}
          onChange={handleDateChange}
        >
          <option value="">Select Year</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          {/* Add more years */}
        </select>
      </div>
      <div>
        <select
          className="form-control w-25 ml-2"
          id="dateSelect"
          name="month"
          value={selectedDate.month}
          onChange={handleDateChange}
        >
          <option value="">Select Month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>
      <br />
      <div className="mb-1"></div>

      {/* Table for Equipment */}
      <div className="mb-4 table-container">
        <h3>Equipment</h3>
        <table className="table table-bordered table-striped">
        <thead>
            <tr>
              <th>Sr. No</th>
              <th>Eqpt Reg Number</th>
              <th>Make</th>
              <th>Model</th>
              <th>Location</th>
              <th>Eqpt Type</th>
              {dateHeaders.map((date, index) => (
                <th key={index} className="vertical-text">{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {equipmentData.map((equipment, index) => (
              <tr key={equipment.id}>
                <td>{index + 1}</td>
                <td>{equipment.EqptRegNumber}</td>
                <td>{equipment.Make}</td>
                <td>{equipment.Model}</td>
                <td>{equipment.Location}</td>
                <td>{equipment.EqptType}</td>
                {dateHeaders.map((date, dateIndex) => (
                  <td key={dateIndex}>
                    <select
                      value={statusData[`${equipment.EqptRegNumber}-${date}`]}
                      onChange={(e) => {
                        const updatedStatusData = { ...statusData };
                        updatedStatusData[`${equipment.EqptRegNumber}-${date}`] = e.target.value;
                        setStatusData(updatedStatusData);
                        updateStatusInDatabase('equipment', equipment.EqptRegNumber, date, e.target.value);
                      }}
                    >
                      <option value="">Select Status</option>
                      {equipmentStatusOptions.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-success">Add Equipment</button>
      </div>
    </div>
  );
}

export default Equipment;
