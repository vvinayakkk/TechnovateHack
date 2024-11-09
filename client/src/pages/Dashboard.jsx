import React from "react";
import { MdAddTask, MdAttachMoney, MdBarChart, MdFileCopy } from "react-icons/md";
import { BadgePercentIcon } from "lucide-react";
import { Pie, Line, Bar } from "react-chartjs-2";
import { useOutletContext } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  BarElement,
  Title
);

const DashboardCard = ({ title, value, icon }) => (
  <div className="dark:bg-black bg-white text-black dark:text-white p-2 px-4 pt-4 rounded-lg shadow-md flex items-center">
    <div className="mr-4 text-green-500 dark:text-green-400">{icon}</div>
    <div>
      <div className="text-gray-600 dark:text-gray-300 text-sm">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </div>
);

const projects = [
  { name: "Deep Patel", progress: 80 },
  { name: "Rajesh Mishra", progress: 60 },
  { name: "Shri Hari", progress: 40 },
  { name: "Ashley Frenandes", progress: 90 },
];

const PieChart = () => {
  const data = {
    labels: ["Emission Saved", "Electricity Usage", "Car Usage"],
    datasets: [
      {
        data: [12, 19, 7],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(153, 102, 255, 0.6)"],
      },
    ],
  };
  return <Pie data={data} />;
};

const LineChart = () => {
  const data = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    datasets: [
      {
        label: "My Water Saved (Liters)",
        data: [5, 9, 7, 8, 6],
        borderColor: "rgba(34, 193, 195, 1)",
        fill: true,
        backgroundColor: "rgba(34, 193, 195, 0.5)",
      },
      {
        label: "Friend's Water Saved (Liters)",
        data: [3, 6, 5, 7, 4],
        borderColor: "rgba(255, 99, 132, 1)",
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return <Line data={data} />;
};

const BarChart = () => {
  const data = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      { label: "Emission Generated", data: [5, 12, 19, 3, 5, 2, 8], backgroundColor: "rgba(75, 192, 192, 0.6)" },
      { label: "Emission Saved", data: [3, 7, 11, 5, 8, 3, 4], backgroundColor: "rgba(54, 162, 235, 0.6)" },
    ],
  };
  return <Bar data={data} />;
};

const Dashboard = () => {
  localStorage.setItem("theme", "dark");
  const { username } = useOutletContext();

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-[rgb(0_6_12)] dark:text-white">
      <h2 className="pt-4 text-3xl font-bold mb-6">Morning, {username}!</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard title="Carbon Emission Saved" value="2 KG" icon={<MdBarChart className="text-3xl" />} />
        <DashboardCard title="Beats" value="81% of our users" icon={<BadgePercentIcon className="text-3xl" />} />
        <DashboardCard title="Water Saved" value="50 Liters" icon={<MdFileCopy className="text-3xl" />} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="dark:bg-black bg-white text-black dark:text-white p-2 px-4 pt-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Daily World Emissions</h3>
          <div className="text-red-300 text-center">400 Metric Tons</div>
        </div>

        <div className="dark:bg-black bg-white text-black dark:text-white p-2 px-4 pt-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Friends</h3>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="flex items-center">
                <img
                  className="w-10 h-10 rounded-full mr-4"
                  src={`https://randomuser.me/api/portraits/thumb/men/${index + 10}.jpg`}
                  alt="User"
                />
                <div className="w-full">
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold">{project.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{`${project.progress}%`}</p>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dark:bg-black bg-white text-black dark:text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Emission Breakdown</h3>
          <PieChart />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="dark:bg-black bg-white text-black dark:text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Daily Water Saving</h3>
          <LineChart />
        </div>
        <div className="dark:bg-black bg-white text-black dark:text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Carbon Emission Overview</h3>
          <BarChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
