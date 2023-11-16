import React, { useState } from 'react';
import '../../../css/styles.css'; // Import custom CSS
import { useEffect } from 'react';  

function Personnel() {
  
  // State to manage selected month and year
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().toLocaleString('default', { month: 'short' }),
    year: new Date().getFullYear().toString(),
  });

  const personnelStatusOptions = ['TRP', 'BSE', 'RTA', 'SCK', 'CL', 'ANL', 'OTH'];

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
  
  const [personnelData, setPersonnelData] = useState([]);
  const [statusData, setStatusData] = useState({});

  useEffect(() => {
    // Fetch personnel data from the API when the component mounts
    fetch('http://localhost:8000/api/personnel/personnelInfo')
      .then((response) => response.json())
      .then((data) => setPersonnelData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    // Fetch status data when the selected date or personnel data changes
    if (selectedDate.year && selectedDate.month) {
      // Create an array of promises for fetching status data for each EGNumber
      const promises = personnelData.map((personnel) => {
        const egNumber = personnel.EGNumber;
        var monthShortened = selectedDate.month.slice(0, 3)
        const date = `${monthShortened}/${selectedDate.year}`;
        console.log(date, 'date in client side')
        console.log(egNumber, 'egNumber in client side')
        // Fetch personnel monthly status data based on EGNumber and date
        return fetch(`http://localhost:8000/api/personnel/personnelMonthlyStatus?egNumber=${egNumber}&date=${date}`)
          .then((response) => response.json())
          .then((data) => ({
            egNumber,
            date,
            status: data.status, // Assuming the API response contains a 'status' field
          }))
          .catch((error) => {
            console.error(`Error fetching status data for EGNumber ${egNumber} and date ${date}:`, error);
            // Return a default value or handle the error as needed
            return {
              egNumber,
              date,
              status: 'N/A', // Default status in case of an error
            };
          });
      });
  
      // Wait for all promises to resolve and update statusData
      Promise.all(promises)
        .then((results) => {
          const newStatusData = {};
          results.forEach((result) => {
            newStatusData[`${result.egNumber}-${result.date}`] = result.status;
          });
          setStatusData(newStatusData);
        })
        .catch((error) => console.error('Error fetching status data:', error));
    }
  }, [selectedDate, personnelData]);
  


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
      <h2>Input Data</h2>

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

        {/* Table for Personnel */}
        <div className="mb-4 table-container">
            <h3>Personnel</h3>
            <table className="table table-bordered table-striped">
            <thead>
                <tr>
                <th>Sr. No</th>
                <th>Name</th>
                <th>EG #</th>
                <th>DOB</th>
                <th>Location</th>
                <th>Job Type</th>
                {dateHeaders.map((date, index) => (
                    <th key={index} className="vertical-text">{date}</th>
                ))}
                </tr>
            </thead>
            <tbody>
                {personnelData.map((personnel, index) => (
                <tr key={personnel.id}>
                    <td>{index + 1}</td> {/* Display Sr. No */}
                    <td>{personnel.Name}</td>
                    <td>{personnel.EGNumber}</td>
                    <td>{personnel.DOB}</td>
                    <td>{personnel.Location}</td>
                    <td>{personnel.JobType}</td>
                    {dateHeaders.map((date, dateIndex) => (
                    <td key={dateIndex}>
                    <select
                        value={statusData[`${personnel.EGNumber}-${date}`]}
                        onChange={(e) => {
                            const updatedStatusData = { ...statusData };
                            updatedStatusData[`${personnel.EGNumber}-${date}`] = e.target.value;
                            setStatusData(updatedStatusData);
                            updateStatusInDatabase('personnel', personnel.EGNumber, date, e.target.value);
                        }}
                        >
                        <option value="">Select Status</option>
                        {personnelStatusOptions.map((statusOption) => (
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
            <button className="btn btn-success">Add Personnel</button>
        </div>

    </div>
  );
}

export default Personnel;
