"use client"

import { Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onCreateStory: () => void
  onProfileClick: () => void
}

export default function Header({ activeTab, setActiveTab, onCreateStory, onProfileClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/memoryecho-logo.png" alt="MemoryEcho" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-800">MemoryEcho</span>
          </div>

          {/* Navigation tabs */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab("home")}
              className={`pb-1 border-b-2 transition-colors font-medium ${
                activeTab === "home"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => setActiveTab("mystories")}
              className={`pb-1 border-b-2 transition-colors font-medium ${
                activeTab === "mystories"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              My Stories
            </button>
          </div>

          {/* Search bar and actions */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search stories..."
                className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <Button
              onClick={onCreateStory}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Create Story
            </Button>

            <button onClick={onProfileClick} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <User className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
