import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AnimatedNumber from "@/components/AnimatedNumber"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Wallet, Leaf, PersonStanding, School, Scale } from 'lucide-react'
import { motion } from 'framer-motion'
import MetamaskForm from '@/components/MetamaskForm'
import {
  Bar,
  Line,
  Pie,
  Area,
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  CartesianGrid
} from 'recharts'
import { Heart, Globe, TrendingUp } from 'lucide-react'

// Enhanced sample data
const yearlyData = [
  { year: 2015, amount: 100, donors: 1000, avgDonation: 100 },
  { year: 2016, amount: 120, donors: 1200, avgDonation: 100 },
  { year: 2017, amount: 150, donors: 1500, avgDonation: 100 },
  { year: 2018, amount: 180, donors: 1800, avgDonation: 100 },
  { year: 2019, amount: 200, donors: 2000, avgDonation: 100 },
  { year: 2020, amount: 250, donors: 2500, avgDonation: 100 },
  { year: 2021, amount: 280, donors: 2800, avgDonation: 100 },
  { year: 2022, amount: 300, donors: 3000, avgDonation: 100 },
]

const monthlyData = [
  { month: 'Jan', amount: 50, donors: 500, avgDonation: 100 },
  { month: 'Feb', amount: 60, donors: 600, avgDonation: 100 },
  { month: 'Mar', amount: 75, donors: 750, avgDonation: 100 },
  { month: 'Apr', amount: 65, donors: 650, avgDonation: 100 },
  { month: 'May', amount: 90, donors: 900, avgDonation: 100 },
  { month: 'Jun', amount: 85, donors: 850, avgDonation: 100 },
]

const regionalDistributionData = [
  { name: 'North America', value: 35, growth: 5 },
  { name: 'Europe', value: 30, growth: 3 },
  { name: 'Asia', value: 20, growth: 8 },
  { name: 'Africa', value: 10, growth: 12 },
  { name: 'South America', value: 5, growth: 4 },
]

const donationsByCauseData = [
  { cause: 'Environment', amount: 100, donors: 500 },
  { cause: 'Healthcare', amount: 80, donors: 400 },
  { cause: 'Education', amount: 60, donors: 300 },
  { cause: 'Poverty', amount: 40, donors: 200 },
  { cause: 'Relief', amount: 20, donors: 100 },
]

const greenColors = [
  '#2ecc71', '#27ae60', '#1abc9c', '#16a085', '#3498db',
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-bold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const DonationsPage = () => {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isMetaMaskModalOpen, setIsMetaMaskModalOpen] = useState(false)
  const [timeframe, setTimeframe] = useState('yearly')

  // Select data based on timeframe
  const trendData = timeframe === 'yearly' ? yearlyData : monthlyData
  const xAxisKey = timeframe === 'yearly' ? 'year' : 'month'

  const handleDonate = () => {
    if (amount && parseFloat(amount) > 0) {
      setIsPaymentModalOpen(true)
    }
  }

  const handleMetaMaskDonate = () => {
    if (amount && parseFloat(amount) > 0) {
      setIsMetaMaskModalOpen(true)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between bg-cover bg-center p-8 rounded-lg shadow-lg backdrop-blur-md mb-8 relative overflow-hidden"
        style={{ backgroundImage: "url('/donate.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold uppercase mr-6 text-white mb-6 md:mb-0 relative z-10"
        >
          REDUCE YOUR<br />CARBON FOOTPRINT
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col space-y-4 w-full max-w-md relative z-10"
        >
          <label className="text-xl font-semibold text-white">Enter donation amount</label>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              placeholder="Enter amount to donate..."
              className="flex-1"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-24 bg-green-500 text-white">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleDonate} className="flex-1 bg-green-500 hover:bg-green-600 text-white transition-colors duration-300">
              <CreditCard className="mr-2 h-4 w-4" /> Donate
            </Button>
            <Button onClick={handleMetaMaskDonate} className="flex-1 bg-green-500 hover:bg-green-600 text-white transition-colors duration-300">
              <Wallet className="mr-2 h-4 w-4" /> MetaMask
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard number={11} title=" Million+" description="Volunteers" action="Become a Volunteer" icon={<PersonStanding className="h-6 w-6 text-green-500" />} />
        <StatCard number={39} title=" Million+" description="Saplings" action="Become a Supporter" icon={<Leaf className="h-6 w-6 text-green-500" />} />
        <StatCard number={66} title=" Million+" description="Children" action="Study Areas" icon={<School className="h-6 w-6 text-green-500" />} />
        <StatCard number={310} title=" +" description="Lawsuits/Campaigns" action="More on Legal Cases" icon={<Scale className="h-6 w-6 text-green-500" />} />
      </div>

      <PaymentModal isOpen={isPaymentModalOpen} setIsOpen={setIsPaymentModalOpen} amount={amount} currency={currency} />
      <MetaMaskModal isOpen={isMetaMaskModalOpen} setIsOpen={setIsMetaMaskModalOpen} amount={amount} currency={currency} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Trend Overview Card */}
        <Card className="col-span-full">
          <CardHeader className="space-y-1">
            <div className='flex justify-between'>
              <div className='flex flex-col'>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <TrendingUp className="w-5 h-5" />
                  Donation Trends
                </CardTitle>
                <CardDescription>Historical view of donations and donors</CardDescription>
              </div>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] md:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2ecc71" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={xAxisKey}
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    name="Donations"
                    stroke="#2ecc71"
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                  <Line
                    type="monotone"
                    dataKey="donors"
                    name="Donors"
                    stroke="#3498db"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Regional Distribution Card */}
        <Card className="col-span-full md:col-span-1">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Globe className="w-5 h-5" />
              Regional Distribution
            </CardTitle>
            <CardDescription>Donation distribution by region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={regionalDistributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {regionalDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={greenColors[index % greenColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Causes Breakdown Card */}
        <Card className="col-span-full md:col-span-1">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Heart className="w-5 h-5" />
              Donations by Cause
            </CardTitle>
            <CardDescription>Distribution across causes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={donationsByCauseData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="cause"
                    type="category"
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="amount"
                    name="Amount"
                    fill="#2ecc71"
                  />
                  <Bar
                    dataKey="donors"
                    name="Donors"
                    fill="#3498db"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const StatCard = ({ number, title, description, action, icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        <CardHeader className="relative z-10 transition-colors duration-500 group-hover:text-white">
          <div className="flex items-center space-x-2">
            {icon}
            <CardTitle className="text-3xl font-bold">
              <AnimatedNumber end={number} />
              {title}</CardTitle>
          </div>
          <CardDescription className="text-lg group-hover:text-green-100">{description}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 transition-colors duration-500 group-hover:text-white">
          {action && (
            <Button variant="link" className="mt-2 p-0 text-green-700 group-hover:text-white">
              {action}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

const PaymentModal = ({ isOpen, setIsOpen, amount, currency }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-green-50">
        <DialogHeader>
          <DialogTitle className="text-green-700">Complete Your Donation</DialogTitle>
          <DialogDescription>
            You are about to donate {amount} {currency}. Please enter your payment details to complete the transaction.
          </DialogDescription>
        </DialogHeader>
        {/* Add payment form here */}
        <Button onClick={() => setIsOpen(false)} className="bg-green-500 hover:bg-green-600 text-white">Close</Button>
      </DialogContent>
    </Dialog>
  )
}

const MetaMaskModal = ({ isOpen, setIsOpen, amount, currency }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-green-50">
        <DialogHeader>
          <DialogTitle className="text-green-700">Donate with MetaMask</DialogTitle>
          <DialogDescription>
            You are about to donate {amount} {currency} using MetaMask. Please confirm the transaction in your MetaMask wallet.
          </DialogDescription>
        </DialogHeader>
        <MetamaskForm amount={amount} currency={currency} />
        {/* Add MetaMask integration here */}
        <Button onClick={() => setIsOpen(false)} className="bg-green-500 hover:bg-green-600 text-white">Close</Button>
      </DialogContent>
    </Dialog>
  )
}

export default DonationsPage;