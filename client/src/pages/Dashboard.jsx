import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, LineChart, Line,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
  Legend, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar
} from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Leaf, ShowerHead, Car, Plane, Utensils,
  Tv, ShoppingBag, Recycle, AwardIcon, TreesIcon
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const COLORS = ['#10B981', '#3B82F6', '#6366F1', '#8B5CF6'];

const AnimatedCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="w-full"
  >
    {children}
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value.toFixed(2)}${entry.unit || ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const mlData = JSON.parse(localStorage.getItem('MLData'));

  // Create lifestyle data from actual ML insights
  const lifestyleData = [
    { name: 'Vehicle', value: mlData?.comparisons?.vehicleDistance?.percentile || 0 },
    { name: 'Waste', value: mlData?.comparisons?.wasteBags?.percentile || 0 },
    { name: 'Screen Time', value: mlData?.comparisons?.screenTime?.percentile || 0 },
    { name: 'Shopping', value: mlData?.comparisons?.clothingPurchases?.percentile || 0 }
  ];

  // Create comparison data for bar chart
  const comparisonData = [
    {
      category: 'Vehicle',
      user: userData?.vehicleMonthlyDistanceKm || 0,
      average: mlData?.comparisons?.vehicleDistance?.population_mean || 0,
      unit: 'km'
    },
    {
      category: 'Waste',
      user: userData?.wasteBagWeeklyCount || 0,
      average: mlData?.comparisons?.wasteBags?.population_mean || 0,
      unit: 'bags'
    },
    {
      category: 'Screen',
      user: userData?.howLongTvpCDailyHour || 0,
      average: mlData?.comparisons?.screenTime?.population_mean || 0,
      unit: 'hrs'
    },
    {
      category: 'Clothes',
      user: userData?.howManyNewClothesMonthly || 0,
      average: mlData?.comparisons?.clothingPurchases?.population_mean || 0,
      unit: 'items'
    }
  ];

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
              <p className="text-gray-600 mt-2">Welcome {userData?.fullName || 'User'}</p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2"
            >
              <AwardIcon className="h-6 w-6 text-yellow-500" />
              <span className="text-lg font-semibold text-gray-700">
                Percentile: {mlData?.statistics?.percentileRank?.toFixed(1) || 0}
              </span>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Distribution Chart */}
          <AnimatedCard delay={0.1} className="lg:col-span-2">
            <Card className="bg-white/50 backdrop-blur-lg border-none shadow-xl">
              <CardHeader>
                <CardTitle>Category Comparison</CardTitle>
                <CardDescription>Your usage vs. Population Average</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="user" name="Your Usage" fill="#10B981" />
                    <Bar dataKey="average" name="Population Average" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Lifestyle Impact */}
          <AnimatedCard delay={0.2}>
            <Card className="bg-white/50 backdrop-blur-lg border-none shadow-xl">
              <CardHeader>
                <CardTitle>Lifestyle Impact</CardTitle>
                <CardDescription>Percentile ranking by category</CardDescription>
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
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {lifestyleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Performance Radar */}
          <AnimatedCard delay={0.3}>
            <Card className="bg-white/50 backdrop-blur-lg border-none shadow-xl">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Category-wise performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={lifestyleData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>

        {mlData?.recommendations?.immediate_actions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert className="bg-green-50 border-green-200">
              <TreesIcon className="h-4 w-4" />
              <AlertTitle>Recommendations</AlertTitle>
              <AlertDescription>
                {mlData.recommendations.immediate_actions[0]?.suggestion}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;