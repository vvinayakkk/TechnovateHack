import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, Tooltip, XAxis, YAxis, Legend, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import {
  Leaf, ShowerHead, Car, Plane,
  Utensils, Tv, ShoppingBag, Recycle,
  AwardIcon,
  TreesIcon
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser } from "@clerk/clerk-react";
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const DJANGO_URL = import.meta.env.VITE_DJANGO_URL;

const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    className="w-full"
  >
    <Card className="bg-white/50 backdrop-blur-lg border-none shadow-xl">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="p-3 rounded-xl bg-green-100">
            <Icon className="h-6 w-6 text-green-600" />
          </div>
          {trend && (
            <span className={`text-sm font-medium ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <h3 className="text-base font-medium text-gray-600 mt-4">{title}</h3>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const lifestyleData = [
  { category: "Transport", value: 35 },
  { category: "Diet", value: 25 },
  { category: "Energy", value: 20 },
  { category: "Shopping", value: 15 },
  { category: "Waste", value: 5 }
];

const monthlyActivities = [
  { month: "Jan", transport: 240, energy: 180, waste: 120 },
  { month: "Feb", transport: 220, energy: 160, waste: 110 },
  { month: "Mar", transport: 260, energy: 190, waste: 130 },
  { month: "Apr", transport: 200, energy: 170, waste: 100 },
  { month: "May", transport: 230, energy: 175, waste: 115 },
  { month: "Jun", transport: 210, energy: 165, waste: 105 }
];

const radarData = [
  { subject: 'Transport', A: 65, fullMark: 100 },
  { subject: 'Diet', A: 80, fullMark: 100 },
  { subject: 'Energy', A: 45, fullMark: 100 },
  { subject: 'Waste', A: 70, fullMark: 100 },
  { subject: 'Shopping', A: 55, fullMark: 100 },
];

export default function Dashboard() {
  const { user } = useUser();
  const userID = user?.id;

  const [userData, setUserData] = useState({});
  const [mlData, setMLData] = useState({});
  const [animationComplete, setAnimationComplete] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('transport');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(`${SERVER_URL}/user/get`, {
          userID: userID
        });
        console.log("Respose 1" + response.data);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUserData(response.data.user);
        const response2 = await axios.post(`${DJANGO_URL}/api/analyze-carbon-footprint/`, {
          ...response.data.user
        })
        console.log("Response 2" + response2.data);
        localStorage.setItem('MLData', JSON.stringify(response2.data));
        setMLData(response2.data);
        const response3 = await axios.post(`${SERVER_URL}/user/get`, {
          userID: userID
        });
        localStorage.setItem('user', JSON.stringify(response3.data.user));
        setUserData(response3.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);


  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold text-gray-800">Environmental Impact Dashboard</h1>
              <p className="text-gray-600 mt-2">Your personal carbon footprint analysis</p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2"
            >
              <AwardIcon className="h-6 w-6 text-yellow-500" />
              <span className="text-lg font-semibold text-gray-700">Rank: #42 Global</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {animationComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Alert className="bg-green-50 border-green-200">
              <TreesIcon className="h-4 w-4" />
              <AlertTitle>Great progress!</AlertTitle>
              <AlertDescription>
                You've reduced your carbon footprint by 15% this month. Keep it up!
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Carbon Footprint"
          value={`${mlData.carbonFootprint || 2238} kg`}
          subtitle="Monthly CO2"
          icon={Leaf}
          trend={-12}
        />
        <StatCard
          title="Transport Impact"
          value={`${mlData.transportDistance || 210} km`}
          subtitle="Monthly distance"
          icon={Car}
          trend={15}
        />
        <StatCard
          title="Energy Usage"
          value={`${mlData.energyUsage || 7} hrs`}
          subtitle="Daily average"
          icon={Tv}
          trend={-8}
        />
        <StatCard
          title="Waste Generation"
          value={`${mlData.wasteGeneration || 4} bags`}
          subtitle="Weekly average"
          icon={Recycle}
          trend={-5}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full"
        >
          <Card className="shadow-xl border-none bg-white/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle>Lifestyle Impact Distribution</CardTitle>
              <CardDescription>Breakdown of your carbon footprint sources</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={lifestyleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#10B981"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {lifestyleData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={[
                          '#10B981',
                          '#3B82F6',
                          '#6366F1',
                          '#8B5CF6',
                          '#EC4899',
                        ][index % 5]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full"
        >
          <Card className="shadow-xl border-none bg-white/50 backdrop-blur-lg">
            <CardHeader>
              <CardTitle>Monthly Activity Trends</CardTitle>
              <CardDescription>Track your environmental impact over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyActivities}>
                  <defs>
                    <linearGradient id="colorTransport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="transport" stroke="#3B82F6" fillOpacity={1} fill="url(#colorTransport)" />
                  <Area type="monotone" dataKey="energy" stroke="#6366F1" fillOpacity={1} fill="url(#colorEnergy)" />
                  <Area type="monotone" dataKey="waste" stroke="#10B981" fillOpacity={1} fill="url(#colorWaste)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
