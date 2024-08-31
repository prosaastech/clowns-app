import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';

// Register required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [queue, setQueue] = React.useState({
    totalCalls: 0,
    priorityCalls: 0,
    estimatedWaitTime: 0,
  });

  const [summary, setSummary] = React.useState({
    callsHandled: 50,
    callsResolved: 48,
    missedCalls: 2,
  });

  const [volumeData, setVolumeData] = React.useState({
    peakHour: '2 PM - 3 PM',
    busiestDay: 'Monday',
    callsToday: 150,
  });

  const [satisfaction, setSatisfaction] = React.useState({
    avgRating: 4.2,
    positive: 120,
    negative: 15,
  });

  React.useEffect(() => {
    const fetchQueueData = () => {
      setQueue({
        totalCalls: Math.floor(Math.random() * 50),
        priorityCalls: Math.floor(Math.random() * 10),
        estimatedWaitTime: (Math.random() * 10).toFixed(2),
      });
    };

    fetchQueueData();
    const interval = setInterval(fetchQueueData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <h1>Agent Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-grid-item">
          <div className="component">
            <h3>Call Queue Overview</h3>
            <ul>
              <li>Total Calls: {queue.totalCalls}</li>
              <li>Priority Calls: {queue.priorityCalls}</li>
              <li>Estimated Wait Time: {queue.estimatedWaitTime} minutes</li>
            </ul>
          </div>
        </div>

        <div className="dashboard-grid-item">
          <div className="component">
            <h3>Performance Summary</h3>
            <ul>
              <li>Calls Handled: {summary.callsHandled}</li>
              <li>Calls Resolved: {summary.callsResolved}</li>
              <li>Missed Calls: {summary.missedCalls}</li>
            </ul>
          </div>
        </div>

        <div className="dashboard-grid-item">
          <div className="component">
            <h3>Call Volume</h3>
            <ul>
              <li>Peak Hour: {volumeData.peakHour}</li>
              <li>Busiest Day: {volumeData.busiestDay}</li>
              <li>Calls Today: {volumeData.callsToday}</li>
            </ul>
          </div>
        </div>

        <div className="dashboard-grid-item">
          <div className="component">
            <h3>Customer Satisfaction</h3>
            <ul>
              <li>Average Rating: {satisfaction.avgRating} / 5</li>
              <li>Positive Feedback: {satisfaction.positive}</li>
              <li>Negative Feedback: {satisfaction.negative}</li>
            </ul>
          </div>
        </div>

        <div className="dashboard-grid-item">
          <div className="component">
            <h3>Call Volume by Hour</h3>
            <Bar
              data={{
                labels: ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
                datasets: [
                  {
                    label: 'Calls by Hour',
                    data: [12, 19, 3, 5, 2, 3, 10, 15],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="dashboard-grid-item">
          <div className="component">
            <h3>Customer Satisfaction</h3>
            <Pie
              data={{
                labels: ['Satisfied', 'Neutral', 'Unsatisfied'],
                datasets: [
                  {
                    label: 'Customer Satisfaction',
                    data: [70, 20, 10],
                    backgroundColor: [
                      'rgba(75, 192, 192, 0.6)',
                      'rgba(255, 206, 86, 0.6)',
                      'rgba(255, 99, 132, 0.6)',
                    ],
                    borderColor: [
                      'rgba(75, 192, 192, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        </div>

        <div className="dashboard-grid-item">
          <div className="component">
            <h3>Weekly Call Volume</h3>
            <Line
              data={{
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [
                  {
                    label: 'Weekly Call Volume',
                    data: [50, 75, 100, 125],
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Add improved styles for the components */}
      <style>
        {`
          .dashboard {
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f0f2f5;
            min-height: 100vh;
          }

          h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
            font-size: 2rem;
            font-weight: bold;
          }

          .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
          }

          .dashboard-grid-item {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            max-width: 100%;
            height: 100%;
          }

          .component {
            margin: 0;
            padding: 0;
          }

          .component h3 {
            margin-bottom: 15px;
            color: #333;
            font-size: 1.2rem;
            border-bottom: 2px solid #75c3c9;
            padding-bottom: 5px;
          }

          .component ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .component li {
            margin-bottom: 10px;
            font-size: 1rem;
            color: #555;
          }

          .component li::before {
            content: '•';
            color: #75c3c9;
            font-weight: bold;
            display: inline-block;
            width: 1em;
            margin-left: -1em;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
