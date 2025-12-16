import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

interface SuggestionChipsProps {
  suggestions: string[]
  onSuggestionClick: (suggestion: string) => void
}

export function SuggestionChips({ suggestions, onSuggestionClick }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSuggestionClick(suggestion)}
            className="text-sm"
          >
            {suggestion}
          </Button>
        </motion.div>
      ))}
    </div>
  )
}
