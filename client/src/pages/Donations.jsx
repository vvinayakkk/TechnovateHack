import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AnimatedNumber from "@/components/AnimatedNumber"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Wallet, Leaf, PersonStanding, School, Scale } from 'lucide-react'
import { motion } from 'framer-motion'


const DonationsPage = () => {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isMetaMaskModalOpen, setIsMetaMaskModalOpen] = useState(false)

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
      <div className="flex flex-col md:flex-row items-center justify-between bg-cover bg-center p-8 rounded-lg shadow-lg backdrop-blur-md mb-12 relative overflow-hidden"
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
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="INR">INR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleDonate} className="flex-1 bg-green-500 hover:bg-green-600 transition-colors duration-300">
              <CreditCard className="mr-2 h-4 w-4" /> Donate
            </Button>
            <Button onClick={handleMetaMaskDonate} className="flex-1 bg-green-500 hover:bg-green-600 text-white transition-colors duration-300">
              <Wallet className="mr-2 h-4 w-4" /> MetaMask
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard number={11} title=" Million+" description="Volunteers" action="Become a Volunteer" icon={<PersonStanding className="h-6 w-6 text-green-500" />} />
        <StatCard number={39} title=" Million+" description="Saplings" action="Become a Supporter" icon={<Leaf className="h-6 w-6 text-green-500" />} />
        <StatCard number={66} title=" Million+" description="Children" action="Study Areas" icon={<School className="h-6 w-6 text-green-500" />} />
        <StatCard number={310} title=" +" description="Lawsuits/Campaigns" action="More on Legal Cases" icon={<Scale className="h-6 w-6 text-green-500" />} />
      </div>

      <PaymentModal isOpen={isPaymentModalOpen} setIsOpen={setIsPaymentModalOpen} amount={amount} currency={currency} />
      <MetaMaskModal isOpen={isMetaMaskModalOpen} setIsOpen={setIsMetaMaskModalOpen} amount={amount} currency={currency} />
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
        {/* Add MetaMask integration here */}
        <Button onClick={() => setIsOpen(false)} className="bg-green-500 hover:bg-green-600 text-white">Close</Button>
      </DialogContent>
    </Dialog>
  )
}

export default DonationsPage;