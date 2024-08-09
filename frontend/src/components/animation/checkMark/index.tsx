import { motion } from 'framer-motion'

const CheckmarkAnimation = () => {
  const ringVariants = {
    hidden: { strokeDasharray: 283, strokeDashoffset: 283 },
    visible: {
      strokeDashoffset: 0,
      transition: { duration: 0.7, ease: 'easeInOut' },
    },
  }

  const checkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeInOut', delay: 0.7 },
    },
  }

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient
          id="instagramGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="33%" stopColor="#FF5E6D" />
          <stop offset="66%" stopColor="#9D59B2" />
          <stop offset="100%" stopColor="#515BD4" />
        </linearGradient>
      </defs>

      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="url(#instagramGradient)"
        strokeWidth="4"
        variants={ringVariants}
        initial="hidden"
        animate="visible"
      />

      <motion.path
        d="M30 50 L45 65 L70 40"
        fill="transparent"
        strokeWidth="4"
        stroke="#F8026C"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={checkVariants}
        initial="hidden"
        animate="visible"
      />
    </motion.svg>
  )
}

export default CheckmarkAnimation
