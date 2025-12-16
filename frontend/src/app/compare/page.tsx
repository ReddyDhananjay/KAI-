'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Star, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { searchAPI } from '@/lib/api'
import { formatCurrency, formatDiscount } from '@/lib/utils'

export default function ComparePage() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [comparisonResults, setComparisonResults] = useState<any>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const response = await searchAPI.compareProducts(query)
      setComparisonResults(response)
    } catch (error) {
      console.error('Comparison failed:', error)
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
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Compare</span> Prices
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find the best deals across Amazon, Flipkart, Myntra, Meesho, and Ajio
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter product name (e.g., 'iPhone 15', 'Nike Running Shoes')"
                className="text-base"
              />
              <Button type="submit" size="lg" disabled={isLoading}>
                <Search className="h-5 w-5 mr-2" />
                Compare
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Comparing prices across platforms...</p>
            </div>
          </div>
        )}

        {/* Comparison Results */}
        {comparisonResults && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Best Options Summary */}
            {comparisonResults.best_options && (
              <div className="grid md:grid-cols-3 gap-6">
                {/* Best Price */}
                {comparisonResults.best_options.best_price && (
                  <Card className="border-2 border-green-500">
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-700">
                        <TrendingDown className="h-5 w-5 mr-2" />
                        Best Price
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-700 mb-2">
                        {formatCurrency(comparisonResults.best_options.best_price.price)}
                      </div>
                      <Badge className="capitalize mb-2">
                        {comparisonResults.best_options.best_price.platform}
                      </Badge>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {comparisonResults.best_options.best_price.name}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Best Rated */}
                {comparisonResults.best_options.best_rated && (
                  <Card className="border-2 border-yellow-500">
                    <CardHeader>
                      <CardTitle className="flex items-center text-yellow-700">
                        <Star className="h-5 w-5 mr-2 fill-yellow-500" />
                        Best Rated
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-2">
                        <span className="text-3xl font-bold text-yellow-700">
                          {comparisonResults.best_options.best_rated.rating}
                        </span>
                        <Star className="h-6 w-6 ml-1 fill-yellow-500 text-yellow-500" />
                      </div>
                      <Badge className="capitalize mb-2">
                        {comparisonResults.best_options.best_rated.platform}
                      </Badge>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {comparisonResults.best_options.best_rated.name}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Fastest Delivery */}
                {comparisonResults.best_options.fastest_delivery && (
                  <Card className="border-2 border-blue-500">
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-700">
                        <ArrowRight className="h-5 w-5 mr-2" />
                        Fastest Delivery
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-700 mb-2">
                        {comparisonResults.best_options.fastest_delivery.delivery_time}
                      </div>
                      <Badge className="capitalize mb-2">
                        {comparisonResults.best_options.fastest_delivery.platform}
                      </Badge>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {comparisonResults.best_options.fastest_delivery.name}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Detailed Comparison Table */}
            {comparisonResults.comparison && comparisonResults.comparison.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Platform</th>
                          <th className="text-left py-3 px-4">Product</th>
                          <th className="text-left py-3 px-4">Price</th>
                          <th className="text-left py-3 px-4">Discount</th>
                          <th className="text-left py-3 px-4">Rating</th>
                          <th className="text-left py-3 px-4">Delivery</th>
                          <th className="text-left py-3 px-4">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonResults.comparison.map((product: any, index: number) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <Badge className="capitalize">{product.platform}</Badge>
                            </td>
                            <td className="py-4 px-4">
                              <p className="font-medium text-sm line-clamp-2 max-w-xs">
                                {product.name}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-bold text-primary-600">
                                  {formatCurrency(product.price)}
                                </p>
                                {product.original_price && product.original_price > product.price && (
                                  <p className="text-xs text-gray-400 line-through">
                                    {formatCurrency(product.original_price)}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {product.discount_percentage > 0 && (
                                <Badge variant="destructive">
                                  {formatDiscount(product.discount_percentage)}
                                </Badge>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="font-medium">{product.rating}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm">{product.delivery_time}</span>
                            </td>
                            <td className="py-4 px-4">
                              <Button
                                size="sm"
                                onClick={() => window.open(product.product_url, '_blank')}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!comparisonResults && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-3">Start Comparing</h3>
            <p className="text-gray-600 mb-8">
              Enter a product name above to compare prices across multiple platforms
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {['iPhone 15', 'Nike Running Shoes', 'Sony Headphones'].map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  onClick={() => {
                    setQuery(example)
                    handleSearch({ preventDefault: () => {} } as any)
                  }}
                >
                  Try "{example}"
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
