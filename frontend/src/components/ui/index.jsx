import { motion } from "framer-motion"



export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-richblack-700 rounded-lg ${className}`}
    />
  )
}


export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-richblack-700 p-4 space-y-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}


export function PageSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-6 w-96" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}


export function HoverCard({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-lg bg-richblack-800 border border-richblack-700 ${className}`}
    >
      {children}
    </motion.div>
  )
}

