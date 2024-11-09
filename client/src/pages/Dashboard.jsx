import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, Tooltip, XAxis, YAxis, Legend
} from "recharts";
import {
  LeafIcon, TreesIcon, LightbulbIcon, GlobeIcon,
  TrendingUpIcon, AwardIcon, UsersIcon, BatteryChargingIcon,
  CarIcon, HomeIcon, UtensilsIcon
} from "lucide-react";

// const { user } = useUser();
// const userID = user?.id;

// Enhanced dashboard card with hover effects and click interaction
const DashboardCard = ({ title, value, subtitle, icon: Icon, trend }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <motion.div className="flex items-center justify-between">
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className="p-3 rounded-full bg-green-100"
            >
              <Icon className="h-8 w-8 text-green-500" />
            </motion.div>
            {trend && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                <TrendingUpIcon className={`h-4 w-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
                <span>{Math.abs(trend)}%</span>
              </motion.div>
            )}
          </motion.div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">{title}</p>
            <motion.p
              className="text-3xl font-bold text-gray-800 mt-1"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {value}
            </motion.p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Enhanced emission data with more detail
const emissionData = [
  { name: "Your Usage", value: 30, color: "#10B981" },
  { name: "World Average", value: 70, color: "#6EE7B7" }
];

// Weekly data with multiple metrics
const weeklyData = [
  { name: "Mon", electricity: 20, water: 15, transport: 25 },
  { name: "Tue", electricity: 25, water: 18, transport: 22 },
  { name: "Wed", electricity: 30, water: 20, transport: 28 },
  { name: "Thu", electricity: 28, water: 22, transport: 24 },
  { name: "Fri", electricity: 35, water: 25, transport: 30 },
  { name: "Sat", electricity: 40, water: 30, transport: 35 },
  { name: "Sun", electricity: 32, water: 24, transport: 27 }
];

// Enhanced friends data with achievements
const friends = [
  { name: "Deep Patel", progress: 80, achievement: "Carbon Champion", avatar: "1" },
  { name: "Rajesh Mishra", progress: 60, achievement: "Energy Saver", avatar: "2" },
  { name: "Shri Hari", progress: 40, achievement: "Green Commuter", avatar: "3" },
  { name: "Ashley Fernandes", progress: 90, achievement: "Eco Warrior", avatar: "4" }
];

// Carbon source breakdown
const carbonSources = [
  { name: "Transport", value: 40, icon: CarIcon },
  { name: "Home", value: 35, icon: HomeIcon },
  { name: "Food", value: 25, icon: UtensilsIcon }
];

export default function Dashboard() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('electricity');

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold text-gray-800"
            >
              Morning, eco warrior! 🌱
            </motion.h1>
            <p className="text-gray-600 mt-2">Your environmental impact dashboard</p>
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
          <DashboardCard
            title="Carbon Saved"
            value="2.8 KG"
            subtitle="vs. last week"
            icon={LeafIcon}
            trend={12}
          />
          <DashboardCard
            title="Energy Saved"
            value="42 kWh"
            subtitle="daily average"
            icon={LightbulbIcon}
            trend={8}
          />
          <DashboardCard
            title="Water Saved"
            value="120 L"
            subtitle="this week"
            icon={BatteryChargingIcon}
            trend={-5}
          />
          <DashboardCard
            title="Community Rank"
            value="#42"
            subtitle="out of 1,234"
            icon={UsersIcon}
            trend={15}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Carbon Sources Breakdown</CardTitle>
                <CardDescription>Your main sources of carbon emissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {carbonSources.map((source, index) => {
                    const Icon = source.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center mb-2">
                          <Icon className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">{source.name}</span>
                          <span className="ml-auto text-sm text-gray-600">{source.value}%</span>
                        </div>
                        <Progress value={source.value} className="h-2" />
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Your Impact vs World Average</CardTitle>
                <CardDescription>How you compare to global emissions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie
                      data={emissionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {emissionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-gray-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-800">Weekly Usage Trends</CardTitle>
                  <CardDescription>Track your resource consumption</CardDescription>
                </div>
                <div className="flex space-x-2">
                  {['electricity', 'water', 'transport'].map((metric) => (
                    <motion.button
                      key={metric}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1 rounded-full text-sm ${selectedMetric === metric
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                        }`}
                      onClick={() => setSelectedMetric(metric)}
                    >
                      {metric.charAt(0).toUpperCase() + metric.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey={selectedMetric}
                        stroke="#10B981"
                        fillOpacity={1}
                        fill="url(#colorUsage)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {friends.map((friend, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center"
                    >
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={`https://randomuser.me/api/portraits/thumb/men/${friend.avatar}.jpg`} />
                        <AvatarFallback>{friend.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="text-sm font-medium text-gray-700">{friend.name}</span>
                            <div className="text-xs text-gray-500">{friend.achievement}</div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{friend.progress}%</span>
                        </div>
                        <Progress value={friend.progress} className="h-2" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}