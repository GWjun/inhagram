import { motion } from 'framer-motion'

const XMarkAnimation = () => {
  const ringVariants = {
    hidden: { strokeDasharray: 283, strokeDashoffset: 283 },
    visible: {
      strokeDashoffset: 0,
      transition: { duration: 0.7, ease: 'easeInOut' },
    },
  }

  const xVariants = {
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
          id="failureGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="50%" stopColor="#FF4757" />
          <stop offset="100%" stopColor="#FF3E4D" />
        </linearGradient>
      </defs>

      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="url(#failureGradient)"
        strokeWidth="4"
        variants={ringVariants}
        initial="hidden"
        animate="visible"
      />

      <motion.path
        d="M35 35 L65 65 M65 35 L35 65"
        fill="transparent"
        strokeWidth="4"
        stroke="#FF3E4D"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={xVariants}
        initial="hidden"
        animate="visible"
      />
    </motion.svg>
  )
}

export default XMarkAnimation
