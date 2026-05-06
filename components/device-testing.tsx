"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface DeviceInfo {
  width: number
  height: number
  devicePixelRatio: number
  userAgent: string
  orientation: string
  touchSupport: boolean
}

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  scrollPerformance: number
  memoryUsage?: number
}

export function DeviceTestingPanel() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Collect device information
    const collectDeviceInfo = () => {
      setDeviceInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        userAgent: navigator.userAgent,
        orientation: window.innerHeight > window.innerWidth ? "Portrait" : "Landscape",
        touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      })
    }

    // Measure performance metrics
    const measurePerformance = () => {
      const startTime = performance.now()

      // Simulate render time measurement
      requestAnimationFrame(() => {
        const renderTime = performance.now() - startTime

        // Measure scroll performance
        let scrollStart = 0
        let scrollFrames = 0

        const measureScroll = () => {
          if (scrollFrames === 0) scrollStart = performance.now()
          scrollFrames++

          if (scrollFrames < 60) {
            requestAnimationFrame(measureScroll)
          } else {
            const scrollPerformance = (performance.now() - scrollStart) / scrollFrames

            setPerformanceMetrics({
              loadTime: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : 0,
              renderTime,
              scrollPerformance,
              memoryUsage: (performance as any).memory?.usedJSHeapSize || undefined,
            })
          }
        }

        measureScroll()
      })
    }

    collectDeviceInfo()
    measurePerformance()

    // Update on resize/orientation change
    const handleResize = () => {
      collectDeviceInfo()
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
    }
  }, [])

  const getDeviceCategory = (width: number) => {
    if (width < 480) return { category: "Small Mobile", color: "text-red-400" }
    if (width < 768) return { category: "Mobile", color: "text-yellow-400" }
    if (width < 1024) return { category: "Tablet", color: "text-blue-400" }
    return { category: "Desktop", color: "text-green-400" }
  }

  const getPerformanceRating = (metric: number, type: "load" | "render" | "scroll") => {
    const thresholds = {
      load: { good: 2000, fair: 4000 },
      render: { good: 16, fair: 33 },
      scroll: { good: 16, fair: 33 },
    }

    const threshold = thresholds[type]
    if (metric <= threshold.good) return { rating: "Excellent", color: "text-green-400" }
    if (metric <= threshold.fair) return { rating: "Good", color: "text-yellow-400" }
    return { rating: "Needs Improvement", color: "text-red-400" }
  }

  if (!deviceInfo || !performanceMetrics) {
    return (
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg">
        <div className="animate-pulse">Collecting device metrics...</div>
      </div>
    )
  }

  const deviceCategory = getDeviceCategory(deviceInfo.width)

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-[#2c2c2c] text-white p-3 rounded-full shadow-lg hover:bg-[#3a3a3a] transition-colors"
        title="Device Performance Panel"
      >
        📊
      </button>

      {/* Performance Panel */}
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          x: isVisible ? 0 : 400,
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-4 right-4 z-40 bg-black/90 backdrop-blur-lg text-white p-6 rounded-xl shadow-2xl max-w-sm w-full border border-white/10"
        style={{ pointerEvents: isVisible ? "auto" : "none" }}
      >
        <h3 className="text-lg font-bold mb-4 text-[#D4C6A6]">Device Performance</h3>

        {/* Device Info */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-300">Device:</span>
            <span className={deviceCategory.color}>{deviceCategory.category}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Screen:</span>
            <span>
              {deviceInfo.width} × {deviceInfo.height}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Pixel Ratio:</span>
            <span>{deviceInfo.devicePixelRatio}x</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Orientation:</span>
            <span>{deviceInfo.orientation}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Touch:</span>
            <span className={deviceInfo.touchSupport ? "text-green-400" : "text-red-400"}>
              {deviceInfo.touchSupport ? "Supported" : "Not Supported"}
            </span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <h4 className="font-semibold text-[#D4C6A6]">Performance Metrics</h4>

          <div className="flex justify-between">
            <span className="text-gray-300">Load Time:</span>
            <span className={getPerformanceRating(performanceMetrics.loadTime, "load").color}>
              {(performanceMetrics.loadTime / 1000).toFixed(2)}s
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Render Time:</span>
            <span className={getPerformanceRating(performanceMetrics.renderTime, "render").color}>
              {performanceMetrics.renderTime.toFixed(2)}ms
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Scroll Perf:</span>
            <span className={getPerformanceRating(performanceMetrics.scrollPerformance, "scroll").color}>
              {performanceMetrics.scrollPerformance.toFixed(2)}ms/frame
            </span>
          </div>

          {performanceMetrics.memoryUsage && (
            <div className="flex justify-between">
              <span className="text-gray-300">Memory:</span>
              <span>{(performanceMetrics.memoryUsage / 1024 / 1024).toFixed(1)}MB</span>
            </div>
          )}
        </div>

        {/* Device-specific Recommendations */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <h5 className="text-sm font-semibold text-[#D4C6A6] mb-2">Recommendations</h5>
          <div className="text-xs text-gray-300 space-y-1">
            {deviceInfo.width < 480 && <div>• Small screen detected - animations disabled for better performance</div>}
            {deviceInfo.width < 800 && <div>• Mobile optimizations active - zoom disabled</div>}
            {performanceMetrics.scrollPerformance > 33 && <div>• Consider reducing animation complexity</div>}
            {performanceMetrics.loadTime > 4000 && <div>• Load time could be improved with image optimization</div>}
          </div>
        </div>
      </motion.div>
    </>
  )
}
