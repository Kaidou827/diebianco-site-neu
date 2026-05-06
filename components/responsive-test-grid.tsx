"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface TestDevice {
  name: string
  width: number
  height: number
  category: string
  userAgent: string
}

const testDevices: TestDevice[] = [
  // Small Mobile Devices
  { name: "iPhone SE", width: 375, height: 667, category: "Small Mobile", userAgent: "iPhone" },
  { name: "Galaxy S8", width: 360, height: 740, category: "Small Mobile", userAgent: "Android" },

  // Standard Mobile Devices
  { name: "iPhone 12", width: 390, height: 844, category: "Mobile", userAgent: "iPhone" },
  { name: "iPhone 14 Pro", width: 393, height: 852, category: "Mobile", userAgent: "iPhone" },
  { name: "Pixel 6", width: 412, height: 915, category: "Mobile", userAgent: "Android" },
  { name: "Galaxy S21", width: 384, height: 854, category: "Mobile", userAgent: "Android" },

  // Large Mobile Devices
  { name: "iPhone 14 Pro Max", width: 430, height: 932, category: "Large Mobile", userAgent: "iPhone" },
  { name: "Galaxy Note 20", width: 412, height: 915, category: "Large Mobile", userAgent: "Android" },

  // Tablets
  { name: "iPad Mini", width: 768, height: 1024, category: "Tablet", userAgent: "iPad" },
  { name: "iPad Pro", width: 1024, height: 1366, category: "Tablet", userAgent: "iPad" },
  { name: "Galaxy Tab", width: 800, height: 1280, category: "Tablet", userAgent: "Android" },

  // Desktop
  { name: "Desktop", width: 1920, height: 1080, category: "Desktop", userAgent: "Desktop" },
]

export function ResponsiveTestGrid() {
  const [selectedDevice, setSelectedDevice] = useState<TestDevice | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Small Mobile":
        return "bg-red-500/20 border-red-500/50 text-red-300"
      case "Mobile":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-300"
      case "Large Mobile":
        return "bg-orange-500/20 border-orange-500/50 text-orange-300"
      case "Tablet":
        return "bg-blue-500/20 border-blue-500/50 text-blue-300"
      case "Desktop":
        return "bg-green-500/20 border-green-500/50 text-green-300"
      default:
        return "bg-gray-500/20 border-gray-500/50 text-gray-300"
    }
  }

  const testResponsiveness = (device: TestDevice) => {
    // Simulate device viewport
    const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
    if (viewport) {
      viewport.content = `width=${device.width}, initial-scale=1, maximum-scale=1, user-scalable=no`
    }

    // Apply device dimensions for testing
    document.documentElement.style.setProperty("--test-width", `${device.width}px`)
    document.documentElement.style.setProperty("--test-height", `${device.height}px`)

    setSelectedDevice(device)

    // Log test results
    console.log(`Testing ${device.name}:`, {
      dimensions: `${device.width}x${device.height}`,
      category: device.category,
      mobileOptimized: device.width < 800,
      animationsDisabled: device.width < 800,
      zoomDisabled: device.width < 800,
    })
  }

  const resetTest = () => {
    const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
    if (viewport) {
      viewport.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    }

    document.documentElement.style.removeProperty("--test-width")
    document.documentElement.style.removeProperty("--test-height")
    setSelectedDevice(null)
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-20 right-4 z-50 bg-[#2c2c2c] text-white p-3 rounded-full shadow-lg hover:bg-[#3a3a3a] transition-colors"
        title="Responsive Testing Panel"
      >
        📱
      </button>

      {/* Testing Panel */}
      <motion.div
        initial={{ opacity: 0, y: 400 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 400,
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-4 right-4 z-40 bg-black/90 backdrop-blur-lg text-white p-6 rounded-xl shadow-2xl border border-white/10 max-h-96 overflow-y-auto"
        style={{ pointerEvents: isVisible ? "auto" : "none" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#D4C6A6]">Device Testing</h3>
          {selectedDevice && (
            <button
              onClick={resetTest}
              className="px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-300 rounded text-sm hover:bg-red-500/30 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {selectedDevice && (
          <div className="mb-4 p-3 bg-white/5 rounded-lg">
            <div className="text-sm">
              <span className="text-[#D4C6A6]">Testing:</span> {selectedDevice.name}
              <span className="ml-2 text-gray-400">
                ({selectedDevice.width}×{selectedDevice.height})
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {testDevices.map((device) => (
            <button
              key={device.name}
              onClick={() => testResponsiveness(device)}
              className={`p-3 rounded-lg border transition-all hover:scale-105 ${
                selectedDevice?.name === device.name
                  ? getCategoryColor(device.category) + " ring-2 ring-white/30"
                  : getCategoryColor(device.category) + " hover:bg-opacity-30"
              }`}
            >
              <div className="text-sm font-semibold">{device.name}</div>
              <div className="text-xs opacity-70">
                {device.width}×{device.height}
              </div>
              <div className="text-xs mt-1 opacity-60">{device.category}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 text-xs text-gray-400">
          <div className="mb-2">
            <span className="text-[#D4C6A6]">Legend:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-red-300">●</span> Small Mobile (&lt;480px)
            </div>
            <div>
              <span className="text-yellow-300">●</span> Mobile (480-767px)
            </div>
            <div>
              <span className="text-orange-300">●</span> Large Mobile (480-767px)
            </div>
            <div>
              <span className="text-blue-300">●</span> Tablet (768-1023px)
            </div>
            <div>
              <span className="text-green-300">●</span> Desktop (≥1024px)
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
