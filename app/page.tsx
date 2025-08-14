"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Plus,
  Camera,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Lock,
  Globe,
  Users,
  ChevronRight,
  X,
  Calendar,
  Tag,
  User,
  Mic,
  Square,
  Shield,
  Bell,
  AlertTriangle,
  Settings,
  Trash2,
  Eye,
} from "lucide-react"
// Fixed import path for Header component
import Header from "@/components/Header"
import ChatWindow, { type Msg } from "@/components/Chatwindows"
import { extractStoryText, storyToImagePrompt } from "@/lib/story";
import { useRouter } from "next/navigation";


type StepDef = {
  key: string;
  label: string;
  required?: boolean;
  placeholder?: string;
};

type ChatMsg = { role: "user" | "assistant"; content: string };


//

// Define all screen components inline instead of importing from separate files
const ExploreScreen = ({ onStoryClick }: { onStoryClick: (story: any) => void }) => {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const stories = [
    {
      id: 1,
      title: "Under the Plum Tree",
      author: "Maria Chen",
      image: "/plum-blossoms-painting.png",
      tag: "nostalgia",
      likes: 24,
      comments: 8,
      category: "Family",
    },
    {
      id: 2,
      title: "Arriving in Aotearoa",
      author: "James Wilson",
      image: "/new-zealand-arrival-artistic.png",
      tag: "first time",
      likes: 31,
      comments: 12,
      category: "Migration",
    },
    {
      id: 3,
      title: "Making Noodles Together",
      author: "Li Wei",
      image: "/grandmother-child-noodles.png",
      tag: "love",
      likes: 45,
      comments: 15,
      category: "Food",
    },
    {
      id: 4,
      title: "Walking to School in the Rain",
      author: "Sarah Johnson",
      image: "/watercolor-rainy-school-walk.png",
      tag: "adventure",
      likes: 18,
      comments: 6,
      category: "Daily Life",
    },
  ]

  const categories = ["All", "Family", "Migration", "Food", "Daily Life", "Adventure", "Romance", "Mystery"]

  const filteredStories =
    selectedCategory === "All" ? stories : stories.filter((story) => story.category === selectedCategory)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Stories</h1>
        <p className="text-xl text-gray-600">Discover amazing stories brought to life with AI-generated images</p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            onClick={() => onStoryClick(story)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="relative h-80">
              <img
                src={story.image || "/placeholder.svg"}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {story.tag}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-2xl font-bold mb-2">{story.title}</h3>
                <p className="text-white/90 text-sm mb-3">{story.author}</p>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{story.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{story.comments}</span>
                  </div>
                  <Bookmark className="w-4 h-4 ml-auto" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const MyStoriesScreen = ({ onStoryClick }: { onStoryClick: (story: any) => void }) => {
  const [privacyFilter, setPrivacyFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [sortBy, setSortBy] = useState("Most Recent")

  const myStories = [
    {
      id: 1,
      title: "My Secret Garden",
      author: "You",
      image: "/secret-garden.png",
      tag: "secret",
      likes: 0,
      comments: 0,
      privacy: "Private",
      category: "Family",
      date: "2024/1/12",
    },
    {
      id: 2,
      title: "The Letter I Never Sent",
      author: "You",
      image: "/autumn-forest-path.png",
      tag: "emotion",
      likes: 0,
      comments: 0,
      privacy: "Public",
      category: "Family",
      date: "2024/1/10",
    },
    {
      id: 3,
      title: "Family Reunion Memories",
      author: "You",
      image: "/chinese-new-year-family.png",
      tag: "celebration",
      likes: 5,
      comments: 2,
      privacy: "Collaborative",
      category: "Family",
      date: "2024/1/8",
    },
    {
      id: 4,
      title: "Weekend Adventures",
      author: "You",
      image: "/sunset-beach-generations.png",
      tag: "adventure",
      likes: 3,
      comments: 1,
      privacy: "Collaborative",
      category: "Adventure",
      date: "2024/1/5",
    },
  ]

  const privacyOptions = ["All", "Public", "Private", "Collaborative"]
  const regularCategories = [
    "All Categories",
    "Family",
    "Migration",
    "Food",
    "Daily Life",
    "Adventure",
    "Romance",
    "Mystery",
  ]
  const collaborativeCategories = ["All Categories", "Family", "Friends"]

  const currentCategories = privacyFilter === "Collaborative" ? collaborativeCategories : regularCategories

  const filteredStories = myStories.filter((story) => {
    const matchesPrivacy = privacyFilter === "All" || story.privacy === privacyFilter
    const matchesCategory = categoryFilter === "All Categories" || story.category === categoryFilter
    return matchesPrivacy && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Privacy Filter Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {privacyOptions.map((option) => (
          <button
            key={option}
            onClick={() => {
              setPrivacyFilter(option)
              setCategoryFilter("All Categories")
            }}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              privacyFilter === option
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Filter Dropdowns */}
      <div className="flex gap-4 mb-8">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {currentCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="Most Recent">Most Recent</option>
          <option value="Most Popular">Most Popular</option>
          <option value="Alphabetical">Alphabetical</option>
        </select>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            onClick={() => onStoryClick(story)}
            className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200"
          >
            <div className="relative h-64">
              <img
                src={story.image || "/placeholder.svg"}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Privacy Badge */}
              <div className="absolute top-3 right-3">
                {story.privacy === "Private" && (
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Private
                  </div>
                )}
                {story.privacy === "Public" && (
                  <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Public
                  </div>
                )}
                {story.privacy === "Collaborative" && (
                  <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Collaborative
                  </div>
                )}
              </div>

              {/* Story Tag */}
              <div className="absolute top-3 left-3">
                <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                  {story.tag}
                </span>
              </div>

              {/* Story Info */}
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white text-lg font-bold mb-1">{story.title}</h3>
                <p className="text-white/90 text-sm mb-2">{story.author}</p>
                <div className="flex items-center justify-between text-white/80">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{story.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{story.comments}</span>
                    </div>
                  </div>
                  <Bookmark className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No stories found matching your filters.</p>
        </div>
      )}
    </div>
  )
}

const ActivityScreen = ({ onBack }: { onBack: () => void }) => {
  const activities = [
    {
      id: 1,
      user: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      action: "shared 5 new photos from their trip to Japan",
      time: "2h ago",
      likes: 24,
      comments: 8,
      type: "photos",
    },
    {
      id: 2,
      user: "Marcus Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      action: "created a new story 'Wedding Season 2024'",
      time: "4h ago",
      likes: 18,
      comments: 3,
      type: "story",
    },
    {
      id: 3,
      user: "Emma Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      action: "added photos to 'Family Traditions' collection",
      time: "6h ago",
      likes: 12,
      comments: 2,
      type: "collection",
      images: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
    },
  ]

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Activity</h1>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="divide-y divide-gray-100">
          {activities.map((activity) => (
            <div key={activity.id} className="p-6">
              <div className="flex gap-4">
                <img
                  src={activity.avatar || "/placeholder.svg"}
                  alt={activity.user}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="mb-3">
                    <span className="font-medium text-gray-900">{activity.user}</span>
                    <span className="text-gray-600 ml-1">{activity.action}</span>
                  </div>

                  {activity.type === "collection" && activity.images && (
                    <div className="flex gap-2 mb-4">
                      {activity.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img || "/placeholder.svg"}
                          alt="Collection preview"
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{activity.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{activity.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <span className="ml-auto">{activity.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const SettingsScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Profile Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value="john"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value="john@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value="Memory collector and storyteller"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  readOnly
                />
              </div>

              <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <User className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Privacy & Security */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-900">Privacy & Security</h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-3">
                Your profile is currently public. Other users can view your photos and follow you.
              </p>
              <button className="text-sm text-gray-500 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Privacy Settings (Coming Soon)
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-3">Manage your notification preferences.</p>
              <button className="text-sm text-gray-500 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notification Settings (Coming Soon)
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-medium text-red-600">Danger Zone</h2>
            </div>

            <div className="border border-red-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="pt-4 border-t border-gray-200">
            <button className="text-gray-600 hover:text-gray-800 font-medium transition-colors">Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfileScreen = ({
  onCollectionsClick,
  onActivityClick,
  onSettingsClick,
}: {
  onCollectionsClick: () => void
  onActivityClick: () => void
  onSettingsClick: () => void
}) => {
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [followersModalType, setFollowersModalType] = useState<"followers" | "following">("followers")

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Header */}
        <div className="p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">John</h2>
          <p className="text-gray-600 mb-4">Memory collector and story teller</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* Stats */}
        <div className="px-8 pb-6">
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Memories</div>
            </div>
            <div
              className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={() => {
                setFollowersModalType("followers")
                setShowFollowersModal(true)
              }}
            >
              <div className="text-2xl font-bold text-gray-900">76</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div
              className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={() => {
                setFollowersModalType("following")
                setShowFollowersModal(true)
              }}
            >
              <div className="text-2xl font-bold text-gray-900">112</div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="border-t border-gray-100">
          <button
            onClick={onCollectionsClick}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Collections</div>
                <div className="text-sm text-gray-600">Organize photos into collections</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={onActivityClick}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Activity Feed</div>
                <div className="text-sm text-gray-600">See what people you follow are sharing</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={onSettingsClick}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Settings</div>
                <div className="text-sm text-gray-600">Account and privacy settings</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Sign Out */}
        <div className="border-t border-gray-100 p-6">
          <button className="text-red-600 hover:text-red-700 font-medium transition-colors">Sign Out</button>
        </div>
      </div>

      {/* Followers/Following Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {followersModalType === "followers" ? "Followers" : "Following"}
              </h2>
              <button
                onClick={() => setShowFollowersModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[60vh]">
              {followersModalType === "followers" ? (
                // Followers List
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">SC</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Sarah Chen</div>
                        <div className="text-sm text-gray-500">sarah@memoryecho.com</div>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                      Unfollow
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">MJ</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Marcus Johnson</div>
                        <div className="text-sm text-gray-500">marcus@example.com</div>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                      Follow
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">DK</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">David Kim</div>
                        <div className="text-sm text-gray-500">david@example.com</div>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                      Unfollow
                    </button>
                  </div>
                </div>
              ) : (
                // Following List
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">ER</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Emma Rodriguez</div>
                        <div className="text-sm text-gray-500">emma@memoryecho.com</div>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                      Unfollow
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">AL</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Alex Liu</div>
                        <div className="text-sm text-gray-500">alex@example.com</div>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                      Unfollow
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">JW</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Jessica Wang</div>
                        <div className="text-sm text-gray-500">jessica@memoryecho.com</div>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                      Unfollow
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const StoryCreationScreen = ({ onBack }: { onBack: () => void }) => {
  const router = useRouter();

  const [mode, setMode] = useState<"choose" | "record" | "type" | "settings">("choose");

  // 原有状态
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [storyText, setStoryText] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  // ✅ Chat + steps
  const [steps, setSteps] = useState<StepDef[] | null>(null);
  const [chatMessages, setChatMessages] = useState<Msg[]>([]);

  // 结果
  const [busy, setBusy] = useState(false);
  const [finalStory, setFinalStory] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");

  // 进入 type 时加载 steps
  useEffect(() => {
    if (mode !== "type") return;
    (async () => {
      try {
        const res = await fetch("/story-steps.json", { cache: "no-store" });
        const data: StepDef[] = await res.json();
        setSteps(data);
      } catch {
        setSteps([]);
      }
    })();
  }, [mode]);

  // 生成故事（现在只在本页生成故事，出图交给新页面）
  const handleGenerate = async () => {
    if (!steps) return;
    setBusy(true);
    setFinalStory("");
    setImagePrompt("");
    setImageDataUrl("");

    try {
      // 1) 从聊天记录抽取字段
      const r1 = await fetch("/api/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steps, messages: chatMessages }),
      });
      const c = await r1.json();

      if (!c.ok) {
        const missingList = (c.missing || []).map((m: any) => m.label || m.key).join(", ");
        alert(`We still need: ${missingList}. Could you provide these details?`);
        return;
      }

      const storyData = c.storyData || {};

      // 2) 生成故事
      const r2 = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyData }),
      });
      const sdata = await r2.json();
      setFinalStory(sdata.story || "");
    } catch (error) {
      console.error("Error generating story:", error);
      alert("An error occurred while generating your story. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  // ✅ 新增：跳到独立出图页
  const openImagePage = () => {
  
    router.push("/page2");
  };

  // =================== 渲染 ===================
  if (mode === "type") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setMode("choose")}
            className="text-white/80 hover:text-white flex items-center gap-2 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {/* 聊天 */}
          <ChatWindow onMessagesChange={setChatMessages} />

          {/* 生成故事按钮 */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={busy || !steps}
              className="rounded border px-4 py-2 bg-white disabled:opacity-50"
              title="Generate Story"
            >
              {busy ? "Generating..." : "Generate Story"}
            </button>

            {/* ✅ 新按钮：跳去新页面出图 */}
            <button
              onClick={openImagePage}
              
              className="rounded border px-4 py-2 bg-black text-white disabled:opacity-50"
              title="Generate Image on a new page"
            >
              Go To Generate Image 
            </button>
          </div>

          {/* 故事结果 */}
          {finalStory && (
            <div className="mt-6 bg-white rounded-2xl p-6 shadow">
              <h2 className="text-xl font-semibold mb-2">Your Story</h2>
              <div className="prose max-w-none whitespace-pre-wrap">{finalStory}</div>
              <p className="text-sm text-gray-500 mt-3">
                Tip: Click “Generate Image on a new page” to create artwork from this story.
              </p>
            </div>
          )}

          {/* 旧的图片结果区块可保留/移除，这里先隐藏： */}
          {false && (imageDataUrl || imagePrompt) && (
            <div className="mt-4 bg-white rounded-2xl p-6 shadow">
              {imageDataUrl && (
                <>
                  <h3 className="font-medium mb-2">Generated Image</h3>
                  <img src={imageDataUrl} alt="Generated" className="rounded-lg border" />
                </>
              )}
              {imagePrompt && (
                <>
                  <h3 className="font-medium mt-4 mb-1">Image Prompt</h3>
                  <div className="rounded border p-3 text-sm text-gray-700 bg-gray-50">{imagePrompt}</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === "choose") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <button
            onClick={onBack}
            className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <h1 className="text-4xl font-bold text-white mb-8">Create Your Story</h1>
          <p className="text-white/90 text-lg mb-12">How would you like to share your memory?</p>

          <div className="space-y-4">
            <button
              onClick={() => setMode("record")}
              className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <Mic className="w-6 h-6" />
              Record Your Story
            </button>

            <button
              onClick={() => setMode("type")}
              className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <MessageCircle className="w-6 h-6" />
              Write Your Story
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const StoryDetailModal = ({ story, onClose }: { story: any; onClose: () => void }) => {
  const [scrollY, setScrollY] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const el = e.currentTarget as HTMLElement;  
      setScrollY(el?.scrollTop ?? 0);

   
    }

    const modalContent = document.getElementById("modal-content")
    if (modalContent) {
      modalContent.addEventListener("scroll", handleScroll)
      return () => modalContent.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const imageHeight = Math.max(200, 400 - scrollY * 0.8)
  const imageScale = Math.max(0.8, 1 - scrollY * 0.0005)
  const isMinimized = scrollY > 100

  const storyContent = {
    "My Secret Garden":
      "Behind our old house, there was a forgotten corner where wild roses climbed over a broken fence. I was seven when I first discovered it, pushing through the overgrown grass that tickled my bare legs. The air smelled of honeysuckle and earth after rain.\n\nI made it my secret place. Every afternoon, I would slip away with a book and a handful of crackers, settling into the soft moss beneath the apple tree. The garden seemed to breathe around me – butterflies dancing between the lavender, bees humming their ancient songs.\n\nYears later, when we moved away, I pressed a rose from that garden between the pages of my favorite book. Sometimes I still open it and remember the magic of having a place that was entirely mine.",

    "The Letter I Never Sent":
      "Dear Mom,\n\nIt's been three years since you left us, and I still find myself reaching for the phone to call you when something wonderful happens. Today I got the promotion you always said I deserved, and for a moment, I forgot you wouldn't be there to answer.\n\nI've written this letter a hundred times in my mind, walking through the forest path where we used to collect autumn leaves. The trees are bare now, just like that day when I realized I'd never hear your laugh again.\n\nI want you to know that I'm okay. Dad is learning to cook your recipes, though his attempts at your famous apple pie still make us smile through our tears. Sarah graduated with honors – you would have been so proud. And I finally learned to play that piano piece you loved.\n\nI carry your voice with me everywhere, Mom. In every decision I make, every kindness I show, every moment I choose love over fear. You're not gone – you're just written in a different language now, one that my heart is slowly learning to read.\n\nWith all my love,\nYour daughter",

    "Family Reunion Memories":
      "The kitchen was chaos in the most beautiful way. Aunties bustled around with steaming dishes, their voices rising and falling in Mandarin and English, sometimes both in the same sentence. The smell of dumplings and red-cooked pork filled every corner of Grandma's house.\n\nI was twelve, perched on a stool, watching my cousins fold wontons with the precision of tiny surgeons. Grandma's weathered hands guided mine, showing me how to crimp the edges just so. 'Like this, xiǎo bǎo,' she whispered, her voice warm as jasmine tea.\n\nUncle Chen told the same stories he told every year, his hands painting pictures in the air. The children rolled their eyes, but we all leaned in anyway, hungry for the familiar rhythm of family folklore. Outside, firecrackers popped like distant applause.\n\nThat night, as we sat around the table sharing oranges and laughter, I understood something profound about belonging. We were threads in a tapestry that stretched back generations, each of us carrying forward the colors and patterns of those who came before.",

    "Walking to School in the Rain":
      "The rain turned our neighborhood into a different world. Sarah and I splashed through puddles that reflected the gray sky like scattered mirrors, our yellow raincoats bright against the morning gloom.\n\nWe took the long way to school, as we always did when it rained. Past Mrs. Chen's garden where the roses hung heavy with water droplets, down the alley where cats sheltered under parked cars, their eyes glowing like amber lanterns.\n\nSarah collected things – smooth pebbles, interesting leaves, once a perfect snail shell. I collected moments. The way the rain drummed different songs on different surfaces. The smell of wet earth and blooming jasmine. The comfortable silence between best friends who didn't need words to communicate.\n\nWe were always late on rainy days, but our teacher, Mrs. Rodriguez, never scolded us. She understood that some lessons couldn't be learned from books – that sometimes the most important education happened in the spaces between destinations, in the willingness to get a little wet while discovering the world.",
  }

  const comments = [
    {
      id: 1,
      author: "Emma Chen",
      text: "This brought tears to my eyes. Thank you for sharing such a beautiful memory.",
      time: "2 hours ago",
    },
    {
      id: 2,
      author: "David Kim",
      text: "I had a secret place like this too when I was young. There's something magical about having your own little world.",
      time: "5 hours ago",
    },
    {
      id: 3,
      author: "Maria Santos",
      text: "Your writing is so vivid, I could almost smell the honeysuckle!",
      time: "1 day ago",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div
          className={`sticky top-0 bg-white border-b border-gray-200 transition-all duration-300 ${
            isMinimized ? "py-3" : "py-4"
          }`}
        >
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              {isMinimized && (
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img
                    src={story.image || "/placeholder.svg"}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                {isMinimized && <h2 className="font-bold text-gray-900">{story.title}</h2>}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>2024/1/12</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <span>Migration</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{story.author}</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div id="modal-content" className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Story Image */}
          <div className="relative overflow-hidden transition-all duration-300" style={{ height: `${imageHeight}px` }}>
            <img
              src={story.image || "/placeholder.svg"}
              alt={story.title}
              className="w-full h-full object-cover transition-transform duration-300"
              style={{ transform: `scale(${imageScale})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {!isMinimized && (
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-white text-3xl font-bold mb-2">{story.title}</h1>
                <div className="flex items-center gap-4 text-white/90">
                  <span>{story.author}</span>
                  <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-sm">{story.tag}</span>
                </div>
              </div>
            )}
          </div>

          {/* Story Content */}
          <div className="p-6">
            <div className="prose prose-lg max-w-none mb-8">
              {storyContent[story.title as keyof typeof storyContent]?.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Engagement Buttons */}
            <div className="flex items-center gap-6 py-4 border-y border-gray-200 mb-6">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  isLiked ? "bg-red-50 text-red-600" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                <span>{story.likes + (isLiked ? 1 : 0)}</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>{comments.length}</span>
              </button>

              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  isSaved ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                <span>Save</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Comments</h3>

              {/* Add Comment */}
              <div className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Post Comment
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="font-medium text-gray-900 mb-1">{comment.author}</div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{comment.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CollectionsScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Profile</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Collection</span>
          </button>
        </div>

        {/* Create New Collection Section */}
        <div className="mb-8">
          <button className="w-full max-w-md bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
            <div className="flex items-center justify-center gap-3">
              <Plus className="w-5 h-5" />
              <span>Create New Collection</span>
            </div>
          </button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Family Portraits Collection */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <div className="p-6">
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 mb-4">
                <img
                  src="/chinese-new-year-family.png"
                  alt="Family Portraits"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Family Portraits</h3>
              <p className="text-gray-600 mb-4">Professional and candid family photos</p>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <Camera className="w-4 h-4" />
                <span>18 photos</span>
              </div>
            </div>
          </div>

          {/* Travel Adventures Collection */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <div className="p-6">
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 mb-4">
                <img
                  src="/tropical-beach-palms.png"
                  alt="Travel Adventures"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Travel Adventures</h3>
              <p className="text-gray-600 mb-4">Photos from our trips around the world</p>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <Camera className="w-4 h-4" />
                <span>42 photos</span>
              </div>
            </div>
          </div>

          {/* Special Occasions Collection */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <div className="p-6">
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 mb-4">
                <img
                  src="/sunset-beach-generations.png"
                  alt="Special Occasions"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Special Occasions</h3>
              <p className="text-gray-600 mb-4">Birthdays, holidays, and celebrations</p>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <Camera className="w-4 h-4" />
                <span>25 photos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("home")
  const [activeTab, setActiveTab] = useState("home")
  const [selectedStory, setSelectedStory] = useState<any>(null)
  const [showStoryModal, setShowStoryModal] = useState(false)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === "home") {
      setCurrentScreen("home")
    } else if (tab === "mystories") {
      setCurrentScreen("mystories")
    }
  }

  const handleCreateStory = () => {
    setCurrentScreen("create")
  }

  const handleProfileClick = () => {
    setCurrentScreen("profile")
  }

  const handleCollectionsClick = () => {
    setCurrentScreen("collections")
  }

  const handleActivityClick = () => {
    setCurrentScreen("activity")
  }

  const handleSettingsClick = () => {
    setCurrentScreen("settings")
  }

  const handleBackToProfile = () => {
    setCurrentScreen("profile")
  }

  const openStoryModal = (story: any) => {
    setSelectedStory(story)
    setShowStoryModal(true)
  }

  const closeStoryModal = () => {
    setShowStoryModal(false)
    setSelectedStory(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onCreateStory={handleCreateStory}
        onProfileClick={handleProfileClick}
      />

      {currentScreen === "home" && <ExploreScreen onStoryClick={openStoryModal} />}

      {currentScreen === "mystories" && <MyStoriesScreen onStoryClick={openStoryModal} />}

      {currentScreen === "profile" && (
        <ProfileScreen
          onCollectionsClick={handleCollectionsClick}
          onActivityClick={handleActivityClick}
          onSettingsClick={handleSettingsClick}
        />
      )}

      {currentScreen === "collections" && <CollectionsScreen onBack={handleBackToProfile} />}

      {currentScreen === "activity" && <ActivityScreen onBack={handleBackToProfile} />}

      {currentScreen === "settings" && <SettingsScreen onBack={handleBackToProfile} />}

      {currentScreen === "create" && <StoryCreationScreen onBack={() => setCurrentScreen("home")} />}

      {showStoryModal && selectedStory && <StoryDetailModal story={selectedStory} onClose={closeStoryModal} />}
    </div>
  )
}
