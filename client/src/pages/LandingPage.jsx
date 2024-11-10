import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useAnimation } from 'framer-motion'
import { Moon, Sun, ChevronDown, Leaf, Wind, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import useTheme from '@/hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const ModernParticleBackground = ({ theme }) => {
  const particles = [...Array(40)].map((_, i) => ({
    id: i,
    size: Math.random() * 40 + 20, // Larger particles
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: Math.random() * 20 + 15 // Slower, more graceful movement
  }))

  const getParticleColor = (index) => {
    // Create a sophisticated color palette based on theme
    const lightThemeColors = [
      'rgba(72, 187, 120, 0.15)', // Green
      'rgba(104, 211, 145, 0.15)', // Light green
      'rgba(49, 151, 149, 0.15)',  // Teal
      'rgba(56, 178, 172, 0.15)',  // Cyan
      'rgba(49, 151, 149, 0.15)'   // Darker teal
    ]
    
    const darkThemeColors = [
      'rgba(34, 197, 94, 0.08)',  // Light green
      'rgba(16, 185, 129, 0.08)', // Emerald
      'rgba(20, 184, 166, 0.08)', // Teal
      'rgba(6, 182, 212, 0.08)',  // Cyan
      'rgba(45, 212, 191, 0.08)'  // Turquoise
    ]
    
    const colors = theme === 'dark' ? darkThemeColors : lightThemeColors
    return colors[index % colors.length]
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large Gradient Orbs */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              width: '40vw',
              height: '40vw',
              backgroundColor: theme === 'dark' 
                ? `rgba(16, 185, 129, 0.05)`
                : `rgba(16, 185, 129, 0.03)`,
              left: `${i * 30}%`,
              top: `${i * 20}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 5,
            }}
          />
        ))}
      </div>

      {/* Modern Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full mix-blend-screen backdrop-blur-sm"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: getParticleColor(particle.id),
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}
          animate={{
            x: [
              0,
              Math.random() * 200 - 100,
              Math.random() * -200 + 100,
              0
            ],
            y: [
              0,
              Math.random() * 200 - 100,
              Math.random() * -200 + 100,
              0
            ],
            scale: [1, Math.random() * 0.5 + 1, 1],
            rotate: [0, Math.random() * 360, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"
        style={{
          backdropFilter: 'blur(100px)',
        }}
      />

      {/* Mesh Grid Effect */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: theme === 'dark' 
            ? 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  )
}

const useScrollAnimation = () => {
  const controls = useAnimation()
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          controls.start('visible')
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [controls])

  return { ref, controls, isVisible }
}

const StatsCard = ({ number, label }) => (
  <div className="flex flex-col items-center p-4 bg-card/50 backdrop-blur-sm rounded-lg">
    <motion.span 
      className="text-3xl md:text-4xl font-bold text-green-500"
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {number}
    </motion.span>
    <span className="text-sm md:text-base text-center">{label}</span>
  </div>
)

export default function CarbonTrackerLanding() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { scrollYProgress } = useScroll()
  const { isSignedIn } = useUser()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const heroAnimation = useScrollAnimation()
  const featureAnimation1 = useScrollAnimation()
  const featureAnimation2 = useScrollAnimation()
  const featureAnimation3 = useScrollAnimation()

  const features = [
    {
      icon: <Leaf className="w-8 h-8 mb-4 text-green-500" />,
      title: "Personal Carbon Calculator",
      description: "Track and understand your daily carbon emissions through our AI-powered calculator"
    },
    {
      icon: <Zap className="w-8 h-8 mb-4 text-yellow-500" />,
      title: "Smart Reduction Goals",
      description: "Set personalized goals and receive actionable recommendations to reduce your footprint"
    },
    {
      icon: <Wind className="w-8 h-8 mb-4 text-blue-500" />,
      title: "Impact Dashboard",
      description: "Visualize your progress and see your contribution to global carbon reduction efforts"
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-green-500 z-50"
        style={{ scaleX }}
      />
      
      {/* Mobile-optimized Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <Leaf className="w-6 h-6 text-green-500" />
            <h1 className="text-xl md:text-2xl font-bold">CarbonTrace</h1>
          </motion.div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="hidden md:inline-flex"
              onClick={() => navigate('/how-it-works')}
            >
              How it Works
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section with Enhanced Background */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
        <ModernParticleBackground theme={theme} />
          
          <motion.div
            ref={heroAnimation.ref}
            initial="hidden"
            animate={heroAnimation.controls}
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: 50 }
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center z-10 max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Reduce Your Carbon Footprint
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto px-4">
              Track, understand, and reduce your carbon emissions with our AI-powered platform. 
              Make a real impact on climate change, one decision at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button 
                size="lg" 
                className="text-base md:text-lg bg-green-500 hover:bg-green-600 text-white px-6 md:px-8 py-4 md:py-6 w-full sm:w-auto"
                onClick={() => {
                  if (isSignedIn) {
                    navigate('/moredetails');
                  } else {
                    navigate('/signup');
                  }
                }}
              >
                Start Tracking
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full sm:w-auto"
                onClick={() => navigate('/how-it-works')}
              >
                Learn More
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto px-4">
              <StatsCard number="2M+" label="Trees Saved" />
              <StatsCard number="50K+" label="Active Users" />
              <StatsCard number="15K" label="Tons CO₂ Reduced" />
              <StatsCard number="98%" label="User Satisfaction" />
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <motion.div
              ref={featureAnimation1.ref}
              initial="hidden"
              animate={featureAnimation1.controls}
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 }
              }}
              transition={{ duration: 0.5 }}
              className="mb-20 text-center"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Smart Carbon Management</h3>
              <p className="text-base md:text-xl max-w-2xl mx-auto">
                Our platform helps you understand and reduce your carbon footprint through 
                personalized insights and actionable recommendations.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  ref={index === 0 ? featureAnimation1.ref : index === 1 ? featureAnimation2.ref : featureAnimation3.ref}
                  initial="hidden"
                  animate={index === 0 ? featureAnimation1.controls : index === 1 ? featureAnimation2.controls : featureAnimation3.controls}
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: 50 }
                  }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-card p-6 md:p-8 rounded-lg shadow-lg text-center hover:scale-105 transition-transform duration-300"
                >
                  {feature.icon}
                  <h4 className="text-lg md:text-xl font-semibold mb-4">{feature.title}</h4>
                  <p className="text-sm md:text-base">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Join the Climate Action Movement</h3>
              <p className="text-base md:text-xl mb-8">
                Every small action counts. Start your journey towards a more sustainable 
                future and join thousands of others making a difference.
              </p>
              <Button 
                size="lg" 
                className="text-base md:text-lg bg-green-500 hover:bg-green-600 text-white px-6 md:px-8 py-4 md:py-6 w-full sm:w-auto" 
                onClick={() => navigate('/signup')}
              >
                Create Free Account
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-10">
        <div className="container mx-auto px-4 text-center text-sm md:text-base">
          <p>&copy; 2024 CarbonTrace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}