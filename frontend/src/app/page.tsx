'use client'

import { motion } from 'framer-motion'
import { MessageSquare, TrendingUp, ShoppingBag, Zap, Star, Shield } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Shop Smarter</span>
              <br />
              with AI Assistant
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Compare prices, find best deals, and shop across Amazon, Flipkart, Myntra, and more - all through one intelligent chatbot
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button size="lg" className="text-lg px-8 py-6">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Start Shopping with KAI
                </Button>
              </Link>
              <Link href="/deals">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  View Top Deals
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-20 h-20 bg-blue-400 rounded-full blur-3xl opacity-30"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400 rounded-full blur-3xl opacity-30"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">KAI</span>?
            </h2>
            <p className="text-xl text-gray-600">
              Experience the future of online shopping with AI-powered assistance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-shadow border-2 hover:border-primary-400">
                  <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="h-7 w-7 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Shop Across Multiple Platforms
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Compare prices and find the best deals from your favorite stores
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {platforms.map((platform) => (
                <motion.div
                  key={platform}
                  whileHover={{ scale: 1.1 }}
                  className="bg-white px-8 py-4 rounded-xl shadow-md font-semibold text-gray-700 text-lg"
                >
                  {platform}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Shopping made simple in three easy steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary-600 to-purple-700 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Shopping?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of smart shoppers who save time and money with KAI
          </p>
          <Link href="/chat">
            <Button size="lg" variant="secondary" className="text-lg px-10 py-6">
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Chatting Now
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: MessageSquare,
    title: 'Conversational AI',
    description: 'Chat naturally with our AI assistant. Just tell KAI what you need, and get personalized product recommendations instantly.',
  },
  {
    icon: TrendingUp,
    title: 'Price Comparison',
    description: 'Automatically compare prices across Amazon, Flipkart, Myntra, Meesho, and Ajio to find the best deals.',
  },
  {
    icon: ShoppingBag,
    title: 'Smart Recommendations',
    description: 'Get AI-powered product suggestions based on your preferences, budget, and shopping history.',
  },
  {
    icon: Zap,
    title: 'Instant Deals',
    description: 'Never miss a great deal. KAI finds the best discounts and offers across all platforms in real-time.',
  },
  {
    icon: Star,
    title: 'Quality Ratings',
    description: 'Make informed decisions with aggregated ratings and reviews from multiple platforms.',
  },
  {
    icon: Shield,
    title: 'Secure Shopping',
    description: 'Your data is safe with us. Shop confidently with secure payment processing and privacy protection.',
  },
]

const platforms = ['Amazon', 'Flipkart', 'Myntra', 'Meesho', 'Ajio']

const steps = [
  {
    title: 'Tell KAI What You Want',
    description: 'Simply type or speak your product requirements, budget, and preferences in natural language.',
  },
  {
    title: 'Compare & Choose',
    description: 'KAI instantly searches across platforms and presents the best options with price comparisons.',
  },
  {
    title: 'Complete Your Purchase',
    description: 'Select your preferred platform and complete the purchase securely through our integrated checkout.',
  },
]
