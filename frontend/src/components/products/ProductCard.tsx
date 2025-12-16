import { motion } from 'framer-motion'
import { Star, TrendingDown, ExternalLink, ShoppingCart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDiscount } from '@/lib/utils'
import Image from 'next/image'

interface ProductCardProps {
  product: {
    id?: string | number
    name: string
    platform: string
    price: number
    original_price?: number
    discount_percentage?: number
    rating?: number
    reviews_count?: number
    image_url?: string
    product_url?: string
    delivery_time?: string
    availability?: boolean
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.discount_percentage || 0
  const hasDiscount = discount > 0

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="h-16 w-16 text-gray-300" />
            </div>
          )}
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="bg-red-500 text-white">
                <TrendingDown className="h-3 w-3 mr-1" />
                {formatDiscount(discount)}
              </Badge>
            </div>
          )}

          {/* Platform Badge */}
          <div className="absolute top-2 left-2">
            <Badge className="capitalize bg-white/90 backdrop-blur text-gray-700">
              {product.platform}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Product Name */}
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 h-10">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-1 mb-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              {product.reviews_count && (
                <span className="text-xs text-gray-500">
                  ({product.reviews_count.toLocaleString()})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="mb-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-primary-600">
                {formatCurrency(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(product.original_price)}
                </span>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          {product.delivery_time && (
            <p className="text-xs text-gray-500 mb-3">
              🚚 Delivery in {product.delivery_time}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {product.product_url && (
              <Button
                size="sm"
                className="flex-1"
                onClick={() => window.open(product.product_url, '_blank')}
              >
                View Product
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            )}
            <Button size="sm" variant="outline">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
