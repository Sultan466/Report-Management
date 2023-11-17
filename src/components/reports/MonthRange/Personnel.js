import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Import Chart.js
import "../../../css/styles.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Personnel() {
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedStartMonth, setSelectedStartMonth] = useState("Jan");
  const [selectedEndMonth, setSelectedEndMonth] = useState("Dec");
  const [chartData, setChartData] = useState(null);
  const [generatedData, setGeneratedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const personnelColumns = ["TRP", "BSE", "RTA", "SCK", "CL", "ANL", "OTH"];

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

  const generateRandomData = () => {
    const data = getMonthsInRange().map((month) => {
      const rowData = {};
      personnelColumns.forEach((column) => {
        rowData[column] = getRandomNumber(1, 50);
      });
      return rowData;
    });
    setGeneratedData(data);
    setIsLoading(false); // Data is loaded, no longer in loading state
  };

  const calculateRowTotal = (row) => {
    let total = 0;
    personnelColumns.forEach((column) => {
      total += row[column];
    });
    return total;
  };

  const createChart = () => {
    const monthsInRange = getMonthsInRange();
    const totalValues = generatedData.map((row) => calculateRowTotal(row));
    // console.log(totalValues, "total");

    setChartData({
      labels: monthsInRange.map((month) => `${month}-${selectedYear.slice(2)}`),
      datasets: [
        {
          label: "TOTAL",
          data: totalValues,
          borderColor: "blue",
          fill: false,
        },
      ],
    });
  };

  useEffect(() => {
    generateRandomData();
  }, [selectedYear, selectedStartMonth, selectedEndMonth]);

  useEffect(() => {
    if (!isLoading) {
      createChart();
    }
  }, [isLoading, selectedStartMonth, selectedEndMonth, generatedData]);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Store a reference to the Chart instance

  useEffect(() => {
    if (chartData) {
      if (chartInstanceRef.current) {
        // console.log(chartInstanceRef.current);
        chartInstanceRef.current.destroy(); // Destroy the previous chart instance
      }

      const ctx = chartRef.current.getContext("2d");
      const newChartInstance = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true,
              stepSize: 50,
            },
          },
        },
      });

      chartInstanceRef.current = newChartInstance; // Store the new Chart instance in the ref

      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy(); // Ensure the chart is destroyed when the component unmounts
        }
      };
    }
  }, [chartData]);

  useEffect(() => {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      if (chartInstanceRef.current) {
        // Redraw the chart with updated dimensions
        chartInstanceRef.current.resize();
        chartInstanceRef.current.options.scales.y.max = calculateMaxY(); // You may need to adjust this based on your data
        chartInstanceRef.current.update();
      }
    };

    const calculateMaxY = () => {
      // Add logic to calculate the maximum value on the y-axis based on your data
      // This ensures that the chart scales properly after resizing
      // Example: Find the maximum value in your data
      const maximum = Math.max(
        ...generatedData.map((row) => calculateRowTotal(row))
      );
      // console.log(maximum);
      return maximum;
    };

    // Initial resize
    resizeCanvas();

    // Event listener for screen resize
    window.addEventListener("resize", resizeCanvas);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [generatedData]); // Include generatedData in the dependencies to recalculate on data change

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="yearDropdown" className="font-weight-bold">
          Select Year:
        </label>
        <br />
        <select
          id="yearDropdown"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="startMonthDropdown" className="font-weight-bold">
          Select Start Month:
        </label>
        <select
          id="startMonthDropdown"
          value={selectedStartMonth}
          onChange={handleStartMonthChange}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <label htmlFor="endMonthDropdown" className="font-weight-bold ml-4">
          Select End Month:
        </label>
        <select
          id="endMonthDropdown"
          value={selectedEndMonth}
          onChange={handleEndMonthChange}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 table-container">
        <h3>Personnel</h3>
        <div className="container">
          <div className="row mb-3" style={{ height: "fit-content" }}>
            <div className="col-lg-12 col-md-12 col-sm-12">
              <canvas id="myCanvas" ref={chartRef}></canvas>
            </div>
          </div>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Month</th>
                {personnelColumns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {getMonthsInRange().map((month, index) => {
                const rowData = generatedData[index];

                return (
                  <tr key={month}>
                    <td>{`${month}-${selectedYear.slice(2)}`}</td>
                    {personnelColumns.map((column) => (
                      <td key={column}>{rowData ? rowData[column] : 0}</td> // Check if rowData is defined
                    ))}
                    <td>{rowData ? calculateRowTotal(rowData) : 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Personnel;
