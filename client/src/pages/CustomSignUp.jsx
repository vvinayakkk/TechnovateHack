'use client'

import { useEffect, useState } from 'react'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import { SignUp } from '@clerk/clerk-react'

export default function CustomSignUp() {
  const [mounted, setMounted] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const controls = useAnimation()

  useEffect(() => {
    setMounted(true)
    controls.start("visible")
  }, [controls])

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.5, duration: 1, ease: "easeOut" }
    })
  }

  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.3, duration: 0.5, ease: "easeOut" }
    })
  }

  const footprintVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i) => ({
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: { delay: i * 0.2, duration: 3, times: [0, 0.2, 1], repeat: Infinity }
    })
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 overflow-hidden">
      {/* Top left corner */}
      <motion.div
        className="absolute top-4 left-4 text-green-800 text-xl font-bold"
        variants={textVariants}
        custom={0}
        initial="hidden"
        animate={controls}
      >
        Reduce Your Carbon Footprint
      </motion.div>

      {/* Top right corner */}
      <motion.div
        className="absolute top-4 right-4 flex flex-col items-end"
        variants={iconVariants}
        custom={1}
        initial="hidden"
        animate={controls}
      >
        <svg className="w-12 h-12 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-green-800 mt-2">Save the Planet</span>
      </motion.div>
    <div className='flex justify-center items-center w-full h-screen'>
      <SignUp signInForceRedirectUrl='/moredetails' />

    </div>

      {/* Bottom left corner */}
      <motion.div
        className="absolute bottom-4 left-4 flex flex-col items-start"
        variants={iconVariants}
        custom={2}
        initial="hidden"
        animate={controls}
      >
        <svg className="w-12 h-12 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-green-800 mt-2">Go Green</span>
      </motion.div>

      {/* Bottom right corner */}
      <motion.div
        className="absolute bottom-4 right-4 text-green-800 text-xl font-bold"
        variants={textVariants}
        custom={3}
        initial="hidden"
        animate={controls}
      >
        Make Eco-Friendly Choices With Us
      </motion.div>

      {mounted && !shouldReduceMotion && (
        <>
          {/* Carbon Footprints */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              variants={footprintVariants}
              custom={i}
              initial="hidden"
              animate={controls}
            >
              <svg className="w-8 h-8 text-green-700 opacity-50" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.16 4.16l1.42 1.42A6.99 6.99 0 0010 18a7 7 0 005.84-10.84l1.42-1.42a9 9 0 11-13.1 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          ))}

          {/* Floating leaves */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-green-500"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                rotate: [0, 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              🍃
            </motion.div>
          ))}
        </>
      )}
    </div>
  )
}