import React, { useState, useEffect } from 'react';
import '../../../css/styles.css';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Import date picker styles
import 'react-date-range/dist/theme/default.css'; // Import date picker theme
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function Personnel ()
{

    const [personnelDateRange, setPersonnelDateRange] = useState([new Date(), new Date()]); // Personnel date range
    const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with the current date
    const [personnelData, setPersonnelData] = useState([]);
    const [statusData, setStatusData] = useState({});
    const [personnelStatusData, setPersonnelStatusData] = useState({});
    const [isPersonnelModalOpen, setIsPersonnelModalOpen] = useState(false); // State for personnel modal
    const [newStatus, setNewStatus] = useState({ date: null, status: '' }); // State for new status input
    const [selectedPersonnelDate, setSelectedPersonnelDate] = useState([new Date(), new Date()]);

    useEffect(() => {
        fetch('http://localhost:8000/api/personnel/personnelInfo')
        .then((response) => response.json())
        .then((data) => setPersonnelData(data))
        .catch((error) => console.error('Error fetching data:', error));
    }, []);

    
    useEffect(() => {
        const startDate = personnelDateRange[0].toISOString().split('T')[0];
        const endDate = personnelDateRange[1].toISOString().split('T')[0];

        // Create an array of dates within the selected personnel date range
        const dateArray = [];
        let currentDate = new Date(startDate);
        while (currentDate <= personnelDateRange[1]) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
        }

        const promises = dateArray.map((date) => {
        return personnelData.map((personnel) => {
            const egNumber = personnel.EGNumber;
            console.log(date.toISOString().split('T')[0],'date before personnel daily status request')
            return fetch(
            `http://localhost:8000/api/personnel/personnelDailyStatus?egNumber=${egNumber}&date=${date.toISOString().split('T')[0]}`
            )
            .then(async (response) => {
                if (response.status === 404) {
                return { egNumber, date, status: 'N/A' };
                } else if (response.ok) {
                const data = await response.json();
                console.log(data,'data in personnel daily status response')
                if (data.length > 0) {
                    return { egNumber, date, status: data[0].StatusCode };
                } else {
                    return { egNumber, date, status: 'N/A' };
                }
                } else {
                throw new Error('Failed to fetch personnel status data');
                }
            })
            .catch((error) => console.error('Error fetching personnel status data:', error));
        });
        });

        // Wait for all promises to resolve and update personnelStatusData
        Promise.all(promises.flat())
        .then((results) => {
            const newStatusData = { ...personnelStatusData };
            results.forEach((result) => {
            if (!newStatusData[result.egNumber]) {
                newStatusData[result.egNumber] = {};
            }
            newStatusData[result.egNumber][result.date] = result.status;
            });
            setPersonnelStatusData(newStatusData);
        })
        .catch((error) => console.error('Error fetching personnel status data:', error));
    }, [personnelDateRange, personnelData]);

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
    
    const openPersonnelModal = () => {
      setIsPersonnelModalOpen(true);
    };
    
    const closePersonnelModal = () => {
      setIsPersonnelModalOpen(false);
    };
        
    
    
    // Function to handle changes in the "Add Personnel Status" modal inputs
    
    const handlePersonnelStatusChange = (event) => {
      const { name, value } = event.target;
      setNewStatus((prevStatus) => ({
        ...prevStatus,
        [name]: value,
      }));
    };
    
    
    
    const savePersonnelStatus = () => {
      
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
            if (isPersonnelModalOpen) {
              const newStatusData = { ...statusData };
              newStatusData[newStatus.egNumber] = newStatus.status;
              setStatusData(newStatusData);
            } 
            setIsPersonnelModalOpen(false);
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
          <h2>View Within Date Range</h2>
          <div className="mb-1"></div>
          <br />
          <div className="mb-4">
            <label htmlFor="personnelDatePicker" className="font-weight-bold">
              Select Personnel Date Range:
            </label>
            <br />
            <DateRangePicker
              ranges={[
                { startDate: personnelDateRange[0], endDate: personnelDateRange[1], key: 'selection' },
              ]}
              onChange={(ranges) => {
                setPersonnelDateRange([ranges.selection.startDate, ranges.selection.endDate]);
                setSelectedPersonnelDate([ranges.selection.startDate, ranges.selection.endDate]);
              }}
              dateFormat="yyyy-MM-dd"
            />
    
          </div>
    
          {/* Table for Personnel */}
          <div className="mb-4 table-container col-lg-12 col-md-6 col-sm-12">
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
                  {generateDateHeaders(selectedPersonnelDate[0], selectedPersonnelDate[1]).map((date, dateIndex) => (
                    <th key={dateIndex} className="vertical-text">{date}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {personnelData.map((personnel, index) => (
                  <tr key={personnel.id}>
                    <td>{index + 1}</td>
                    <td>{personnel.Name}</td>
                    <td>{personnel.EGNumber}</td>
                    <td>{personnel.DOB}</td>
                    <td>{personnel.Location}</td>
                    <td>{personnel.JobType}</td>
                    {generateDateHeaders(selectedPersonnelDate[0], selectedPersonnelDate[1]).map((date, dateIndex) => (
                    <td key={dateIndex}>
                      {personnelStatusData[personnel.EGNumber] && personnelStatusData[personnel.EGNumber][date] || 'N/A'}
                    </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn btn-success">Add Personnel</button>
          </div>
    
          {/* Add Personnel Status Modal */}
          {isPersonnelModalOpen && (
      <div className="modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Personnel Status</h5>
              <button
                type="button"
                className="close"
                onClick={() => {
                  setIsPersonnelModalOpen(false);
                  setNewStatus({ date: null, status: '', egNumber: '' });
                }}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="statusDate">Date</label>
                  <DateRangePicker
                    id="statusDate"
                    selected={newStatus.date}
                    // onChange={(ranges) => {
                    //   setEquipmentDateRange([ranges.selection.startDate, ranges.selection.endDate]);
                    //   setSelectedEquipmentDate([ranges.selection.startDate, ranges.selection.endDate]);
                    // }}
                    dateFormat="MMMM d, yyyy"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <input
                    type="text"
                    id="status"
                    className="form-control"
                    value={newStatus.status}
                    onChange={(e) => setNewStatus({ ...newStatus, status: e.target.value })}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  // Handle the logic to add personnel status here
                  // Call your API to add the status to the database
                  // After successful addition, close the modal and update the statusData state
                  setIsPersonnelModalOpen(false);
                  setNewStatus({ date: null, status: '', egNumber: '' });
                }}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsPersonnelModalOpen(false);
                  setNewStatus({ date: null, status: '', egNumber: '' });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    
        </div>
      );
    }
    
export default Personnel;
