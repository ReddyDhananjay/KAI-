'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Zap, Filter } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProductCard } from '@/components/products/ProductCard'
import { dealsAPI } from '@/lib/api'

const categories = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty',
  'Sports',
]

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDeals()
  }, [selectedCategory])

  const loadDeals = async () => {
    setIsLoading(true)
    try {
      const category = selectedCategory === 'All' ? undefined : selectedCategory
      const response = await dealsAPI.getTopDeals(category, 20)
      setDeals(response.deals || [])
    } catch (error) {
      console.error('Failed to load deals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-4">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-semibold">Limited Time Offers</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Top Deals</span> of the Day
          </h1>
          <p className="text-xl text-gray-600">
            Discover amazing discounts across all platforms
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="font-semibold">Filter by Category</span>
              </div>
              <Badge variant="secondary">
                {deals.length} Deals
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Deals Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading amazing deals...</p>
            </div>
          </div>
        ) : deals.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {deals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard
                  product={{
                    id: deal.id,
                    name: deal.title,
                    platform: deal.platform || 'amazon',
                    price: deal.deal_price,
                    original_price: deal.original_price,
                    discount_percentage: deal.savings_percentage,
                    rating: 4.5,
                    reviews_count: Math.floor(Math.random() * 5000) + 100,
                    image_url: deal.image_url,
                    product_url: deal.product_url,
                    delivery_time: '2-3 days',
                    availability: deal.is_active,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="p-12 text-center">
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No deals available</h3>
            <p className="text-gray-600">
              Check back soon for amazing offers in this category!
            </p>
          </Card>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-br from-primary-600 to-purple-700 text-white p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Want personalized deal alerts?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Chat with KAI to set up custom alerts for your favorite products
            </p>
            <Button variant="secondary" size="lg">
              Set Up Alerts
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
