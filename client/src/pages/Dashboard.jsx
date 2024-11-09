import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere } from "@react-three/drei"
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { LeafIcon, DropletIcon, TreesIcon } from "lucide-react"

// Sample data
const waterData = [
  { name: "Mon", you: 40, world: 20 },
  { name: "Tue", you: 60, world: 30 },
  { name: "Wed", you: 45, world: 25 },
  { name: "Thu", you: 55, world: 35 },
  { name: "Fri", you: 50, world: 30 },
  { name: "Sat", you: 65, world: 40 },
  { name: "Sun", you: 40, world: 25 },
]

const emissionData = [
  { name: "Transport", value: 45 },
  { name: "Energy", value: 35 },
  { name: "Food", value: 20 },
]

const COLORS = ["#34d399", "#60a5fa", "#a78bfa"]

function Globe() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial color="#34d399" wireframe />
      </Sphere>
      <OrbitControls autoRotate enableZoom={false} />
    </Canvas>
  )
}

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 opacity-20">
        <svg className="h-full w-full">
          <pattern id="pattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M0 32V.5H32" fill="none" stroke="rgba(52, 211, 153, 0.2)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-green-800 mb-8"
      >
        Morning, eco warrior!
      </motion.h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Carbon Saved", value: "2 KG", icon: LeafIcon },
          { title: "Global Rank", value: "Top 19%", icon: TreesIcon },
          { title: "Impact Score", value: "81/100", icon: DropletIcon },
        ].map((metric, i) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/50 backdrop-blur-sm border-green-200">
              <CardContent className="flex items-center p-6">
                <metric.icon className="h-8 w-8 text-green-500 mr-4" />
                <div>
                  <p className="text-sm text-green-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-green-800">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Daily World Emissions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/50 backdrop-blur-sm border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Daily World Emissions</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Globe />
              <p className="text-center text-green-600 mt-4">400 Metric Tons</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Your Emissions vs World */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/50 backdrop-blur-sm border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Your Emissions vs World</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Daily Water Saving */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-white/50 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Daily Water Saving</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={waterData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorYou" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWorld" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="you"
                  stroke="#34d399"
                  fillOpacity={1}
                  fill="url(#colorYou)"
                />
                <Area
                  type="monotone"
                  dataKey="world"
                  stroke="#60a5fa"
                  fillOpacity={1}
                  fill="url(#colorWorld)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}