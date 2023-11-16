import React, { useState, useEffect } from 'react';
import '../../../css/styles.css';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Import date picker styles
import 'react-date-range/dist/theme/default.css'; // Import date picker theme
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


function Equipment() {
  const [equipmentDateRange, setEquipmentDateRange] = useState([new Date(), new Date()]); // Equipment date range
  const [equipmentData, setEquipmentData] = useState([]);
  const [equipmentStatusData, setEquipmentStatusData] = useState({}); // Define equipment status data state
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false); // State for equipment modal
  const [newEquipmentStatus, setNewEquipmentStatus] = useState({
    date: new Date(),
    status: '',
  });
  const [selectedEquipmentDate, setSelectedEquipmentDate] = useState([new Date(), new Date()]);
  const [newStatus, setNewStatus] = useState({ date: null, status: '' }); // State for new status input
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with the current date

  

  useEffect(() => {
    fetch('http://localhost:8000/api/equipment/equipmentInfo')
      .then((response) => response.json())
      .then((data) => setEquipmentData(data))
      .catch((error) => console.error('Error fetching equipment data:', error));
  }, []);

  useEffect(() => {
    // Fetch equipment status data when the equipment date range or equipment data changes
    const startDate = equipmentDateRange[0].toISOString().split('T')[0];
    const endDate = equipmentDateRange[1].toISOString().split('T')[0];

    // Create an array of dates within the selected equipment date range
    const dateArray = [];
    let currentDate = new Date(startDate);
    while (currentDate <= equipmentDateRange[1]) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fetch equipment status data for each date and equipment
    const promises = dateArray.map((date) => {
      return equipmentData.map((equipment) => {
        const eqptRegNumber = equipment.EqptRegNumber;

        return fetch(
          `http://localhost:8000/api/equipmentDailyStatus?eqptRegNumber=${eqptRegNumber}&date=${date.toISOString().split('T')[0]}`
        )
          .then(async (response) => {
            if (response.status === 404) {
              return { eqptRegNumber, date, status: 'N/A' };
            } else if (response.ok) {
              const data = await response.json();
              console.log(data,'data for equipment daily status from backend')
              if (data.length > 0) {
                return { eqptRegNumber, date, status: data[0].StatusCode };
              } else {
                return { eqptRegNumber, date, status: 'N/A' };
              }
            } else {
              throw new Error('Failed to fetch equipment status data');
            }
          })
          .catch((error) => console.error('Error fetching equipment status data:', error));
      });
    });

    // Wait for all promises to resolve and update equipmentStatusData
    Promise.all(promises.flat())
      .then((results) => {
        const newStatusData = { ...equipmentStatusData };
        results.forEach((result) => {
          if (!newStatusData[result.eqptRegNumber]) {
            newStatusData[result.eqptRegNumber] = {};
          }
          newStatusData[result.eqptRegNumber][result.date] = result.status;
        });
        setEquipmentStatusData(newStatusData);
      })
      .catch((error) => console.error('Error fetching equipment status data:', error));
  }, [equipmentDateRange, equipmentData]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  function generateDateRangeArray(startDate, endDate) {
    const dateArray = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }
  

  function generateDateHeaders(startDate, endDate) {
    const dateHeaders = [];
    let currentDate = new Date(startDate);
  
    const options = { year: '2-digit', month: 'short', day: '2-digit' };
  
    while (currentDate <= endDate) {
      dateHeaders.push(currentDate.toLocaleDateString('default', options));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dateHeaders;
  }

  const dateHeader = selectedDate.toLocaleDateString('default', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

// Function to handle adding new status

const handleAddStatus = () => {
  // Validate new status input
  if (!newStatus.date || !newStatus.status) {
    alert('Please select a date and provide a status.');
    return;
  }

  // Prepare the data to be sent to the backend

  const data = {
    date: newStatus.date.toISOString().split('T')[0], // Format date as 'YYYY-MM-DD'
    status: newStatus.status,
  };

// Functions to handle the modal for adding personnel status



// Functions to handle the modal for adding equipment status

const openEquipmentModal = () => {
  setIsEquipmentModalOpen(true);
};

const closeEquipmentModal = () => {
  setIsEquipmentModalOpen(false);
};


// Function to handle changes in the "Add Equipment Status" modal inputs

const handleEquipmentStatusChange = (event) => {
  const { name, value } = event.target;
  setNewEquipmentStatus((prevStatus) => ({
    ...prevStatus,
    [name]: value,
  }));
};


const saveEquipmentStatus = () => {
};

  // Adding status

  fetch('http://localhost:8000/api/addStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        // Successfully added status, update the state and close the modal
        if (isEquipmentModalOpen) {
          const newEquipmentStatusData = { ...equipmentStatusData };
          newEquipmentStatusData[newStatus.eqptRegNumber] = newStatus.status;
          setEquipmentStatusData(newEquipmentStatusData);
        }
        setIsEquipmentModalOpen(false);
        setNewStatus({ date: null, status: '' });
      } else {
        // Handle error if the request fails
        alert('Failed to add status. Please try again.');
      }
    })
    .catch((error) => console.error('Error adding status:', error));
};

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="equipmentDatePicker" className="font-weight-bold">
          Select Equipment Date Range:
        </label>
        <br />
        <DateRangePicker
          ranges={[
            { startDate: equipmentDateRange[0], endDate: equipmentDateRange[1], key: 'selection' },
          ]}
          onChange={(ranges) => {
            setEquipmentDateRange([ranges.selection.startDate, ranges.selection.endDate]);
            setSelectedEquipmentDate([ranges.selection.startDate, ranges.selection.endDate]);
          }}
        />
      </div>

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
              {generateDateHeaders(selectedEquipmentDate[0], selectedEquipmentDate[1]).map((date, dateIndex) => (
                <th key={dateIndex} className="vertical-text">{date}</th>
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
              {generateDateHeaders(selectedEquipmentDate[0], selectedEquipmentDate[1]).map((date, dateIndex) => (
              <td key={dateIndex}>
                {equipmentStatusData[equipment.EqptRegNumber] && equipmentStatusData[equipment.EqptRegNumber][date] || 'N/A'}
              </td>
            ))}
            </tr>
          ))}
          </tbody>
        </table>
        <button className="btn btn-success">Add Equipment</button>
      </div>

      {/* Add Equipment Status Modal */}
    
{isEquipmentModalOpen && (
  <div className="modal">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add Equipment Status</h5>
          <button
            type="button"
            className="close"
            onClick={() => setIsEquipmentModalOpen(false)}
          >
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form>
            <div className="form-group">
              <label htmlFor="equipmentDate">Date:</label>
              <DateRangePicker
                id="equipmentDate"
                selected={newEquipmentStatus.date}
                onChange={(date) =>
                  setNewEquipmentStatus({ ...newEquipmentStatus, date })
                }
                dateFormat="MMMM d, yyyy"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="equipmentStatus">Status:</label>
              <input
                type="text"
                id="equipmentStatus"
                className="form-control"
                value={newEquipmentStatus.status}
                onChange={(e) =>
                  setNewEquipmentStatus({
                    ...newEquipmentStatus,
                    status: e.target.value,
                  })
                }
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsEquipmentModalOpen(false)}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              // Add logic here to save new equipment status to your database
              // After saving, update the equipmentStatusData state
              // Then close the modal
              setIsEquipmentModalOpen(false);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Equipment;
