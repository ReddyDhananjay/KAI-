'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Settings, ShoppingBag, Heart, Bell, MapPin, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

const platforms = [
  { id: 'amazon', name: 'Amazon' },
  { id: 'flipkart', name: 'Flipkart' },
  { id: 'meesho', name: 'Meesho' },
  { id: 'myntra', name: 'Myntra' },
  { id: 'ajio', name: 'Ajio' },
]

const categories = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty',
  'Sports',
  'Books',
]

export default function ProfilePage() {
  const [preferences, setPreferences] = useState({
    selectedPlatforms: ['amazon', 'flipkart'],
    selectedCategories: ['Electronics', 'Fashion'],
    budgetMin: 0,
    budgetMax: 50000,
    priority: 'price',
    dealAlerts: true,
    priceDropAlerts: true,
  })

  const togglePlatform = (platformId: string) => {
    setPreferences((prev) => ({
      ...prev,
      selectedPlatforms: prev.selectedPlatforms.includes(platformId)
        ? prev.selectedPlatforms.filter((p) => p !== platformId)
        : [...prev.selectedPlatforms, platformId],
    }))
  }

  const toggleCategory = (category: string) => {
    setPreferences((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Profile</span> & Preferences
          </h1>
          <p className="text-gray-600">
            Customize your shopping experience with KAI
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardContent className="pt-6">
                {/* Profile Picture */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-xl font-bold">Guest User</h2>
                  <p className="text-sm text-gray-500">guest@kai-shop.com</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <ShoppingBag className="h-5 w-5 text-primary-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-xs text-gray-600">Orders</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-gray-600">Favorites</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    My Orders
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Addresses
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Shopping Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Shopping Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preferred Platforms */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Preferred Platforms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((platform) => (
                      <Button
                        key={platform.id}
                        variant={
                          preferences.selectedPlatforms.includes(platform.id)
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => togglePlatform(platform.id)}
                      >
                        {platform.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Favorite Categories */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Favorite Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={
                          preferences.selectedCategories.includes(category)
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => toggleCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Budget Range (₹)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600">Min</label>
                      <Input
                        type="number"
                        value={preferences.budgetMin}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            budgetMin: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Max</label>
                      <Input
                        type="number"
                        value={preferences.budgetMax}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            budgetMax: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Shopping Priority
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['price', 'speed', 'rating'].map((priority) => (
                      <Button
                        key={priority}
                        variant={
                          preferences.priority === priority ? 'default' : 'outline'
                        }
                        onClick={() =>
                          setPreferences((prev) => ({ ...prev, priority }))
                        }
                        className="capitalize"
                      >
                        {priority}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Deal Alerts</p>
                    <p className="text-sm text-gray-600">
                      Get notified about new deals in your favorite categories
                    </p>
                  </div>
                  <Button
                    variant={preferences.dealAlerts ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        dealAlerts: !prev.dealAlerts,
                      }))
                    }
                  >
                    {preferences.dealAlerts ? 'On' : 'Off'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Price Drop Alerts</p>
                    <p className="text-sm text-gray-600">
                      Get notified when prices drop on products you viewed
                    </p>
                  </div>
                  <Button
                    variant={preferences.priceDropAlerts ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        priceDropAlerts: !prev.priceDropAlerts,
                      }))
                    }
                  >
                    {preferences.priceDropAlerts ? 'On' : 'Off'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
