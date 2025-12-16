"""
Master Agent - KAI
Orchestrates all worker agents and manages conversation flow
"""

from typing import Dict, Any, List, Optional
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from langchain.schema import HumanMessage, AIMessage, SystemMessage
import json

from agents.worker_agents import (
    RecommendationAgent,
    ComparisonAgent,
    DealsAgent,
    InventoryAgent,
    PaymentAgent,
    FulfillmentAgent,
    SupportAgent
)


class MasterAgent:
    """
    Master Agent orchestrates all worker agents and manages the conversation.
    Acts as the main interface for the conversational commerce platform.
    """
    
    def __init__(self, openai_api_key: str):
        self.llm = ChatOpenAI(
            temperature=0.7,
            model="gpt-3.5-turbo",
            openai_api_key=openai_api_key
        )
        
        # Initialize worker agents
        self.recommendation_agent = RecommendationAgent(openai_api_key)
        self.comparison_agent = ComparisonAgent(openai_api_key)
        self.deals_agent = DealsAgent(openai_api_key)
        self.inventory_agent = InventoryAgent(openai_api_key)
        self.payment_agent = PaymentAgent(openai_api_key)
        self.fulfillment_agent = FulfillmentAgent(openai_api_key)
        self.support_agent = SupportAgent(openai_api_key)
        
        # Conversation memory
        self.conversations: Dict[str, ConversationBufferMemory] = {}
        
        # System prompt
        self.system_prompt = """You are KAI, a friendly and intelligent AI shopping assistant for a unified conversational commerce platform.

Your role:
- Help users find, compare, and purchase products across multiple e-commerce platforms (Amazon, Flipkart, Meesho, Myntra, Ajio)
- Provide personalized recommendations based on user preferences and budget
- Compare prices, ratings, and delivery times across platforms
- Highlight the best deals and offers
- Guide users through the purchase process
- Answer questions about products, orders, and shopping

Your personality:
- Friendly, helpful, and professional
- Human-like and conversational
- Proactive in asking clarifying questions
- Smart about understanding user intent
- Enthusiastic about finding the best deals

Always:
- Ask follow-up questions to better understand user needs
- Provide specific product recommendations with comparisons
- Highlight savings and best values
- Be transparent about pricing and platform differences
- Make shopping feel effortless and enjoyable

Available actions:
- SEARCH: Search for products
- COMPARE: Compare products across platforms
- RECOMMEND: Provide personalized recommendations
- DEALS: Show top deals of the day
- ORDER: Help with ordering and checkout
- TRACK: Track order status
- SUPPORT: Answer questions and provide help
"""
    
    def get_memory(self, session_id: str) -> ConversationBufferMemory:
        """Get or create conversation memory for a session"""
        if session_id not in self.conversations:
            self.conversations[session_id] = ConversationBufferMemory(
                return_messages=True,
                memory_key="chat_history"
            )
        return self.conversations[session_id]
    
    def determine_intent(self, message: str, chat_history: List) -> Dict[str, Any]:
        """Determine user intent and which agent(s) to invoke"""
        
        intent_prompt = f"""Based on the user's message and conversation history, determine their intent and which action to take.

User message: {message}

Available actions:
- SEARCH: User wants to find products
- COMPARE: User wants to compare products/prices across platforms
- RECOMMEND: User wants personalized recommendations
- DEALS: User wants to see top deals and offers
- ORDER: User wants to place an order or checkout
- TRACK: User wants to track an existing order
- SUPPORT: User has questions or needs help
- CHAT: General conversation or unclear intent

Respond with a JSON object containing:
- intent: The primary action (one of the above)
- confidence: Confidence level (0-1)
- entities: Extracted entities (product name, category, budget, etc.)
- follow_up_needed: Whether you need to ask clarifying questions

Example response:
{{"intent": "SEARCH", "confidence": 0.9, "entities": {{"product": "running shoes", "budget": 3000}}, "follow_up_needed": false}}
"""
        
        try:
            response = self.llm.predict(intent_prompt)
            intent_data = json.loads(response)
            return intent_data
        except:
            return {
                "intent": "CHAT",
                "confidence": 0.5,
                "entities": {},
                "follow_up_needed": True
            }
    
    async def process_message(
        self,
        message: str,
        session_id: str,
        user_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Process user message and orchestrate appropriate agents"""
        
        # Get conversation memory
        memory = self.get_memory(session_id)
        chat_history = memory.load_memory_variables({}).get("chat_history", [])
        
        # Determine intent
        intent_data = self.determine_intent(message, chat_history)
        intent = intent_data.get("intent", "CHAT")
        entities = intent_data.get("entities", {})
        
        # Initialize response
        response = {
            "message": "",
            "intent": intent,
            "products": [],
            "suggestions": [],
            "metadata": {}
        }
        
        # Route to appropriate agent(s)
        try:
            if intent == "SEARCH":
                result = await self.recommendation_agent.search_products(
                    query=entities.get("product", message),
                    category=entities.get("category"),
                    budget=entities.get("budget"),
                    user_context=user_context
                )
                response["products"] = result.get("products", [])
                response["message"] = self._generate_search_response(result)
                
            elif intent == "COMPARE":
                result = await self.comparison_agent.compare_products(
                    query=entities.get("product", message),
                    platforms=entities.get("platforms", ["amazon", "flipkart", "myntra"])
                )
                response["products"] = result.get("comparison", [])
                response["message"] = self._generate_comparison_response(result)
                
            elif intent == "RECOMMEND":
                result = await self.recommendation_agent.get_recommendations(
                    user_context=user_context,
                    category=entities.get("category"),
                    budget=entities.get("budget")
                )
                response["products"] = result.get("recommendations", [])
                response["message"] = self._generate_recommendation_response(result)
                
            elif intent == "DEALS":
                result = await self.deals_agent.get_top_deals(
                    category=entities.get("category")
                )
                response["products"] = result.get("deals", [])
                response["message"] = self._generate_deals_response(result)
                
            elif intent == "ORDER":
                response["message"] = await self._handle_order_intent(entities, user_context)
                
            elif intent == "TRACK":
                result = await self.fulfillment_agent.track_order(
                    order_id=entities.get("order_id"),
                    user_context=user_context
                )
                response["message"] = self._generate_tracking_response(result)
                
            elif intent == "SUPPORT":
                result = await self.support_agent.handle_query(
                    query=message,
                    user_context=user_context
                )
                response["message"] = result.get("response", "")
                
            else:  # CHAT or unclear intent
                response["message"] = await self._handle_general_chat(message, chat_history)
            
            # Add suggestions for next actions
            response["suggestions"] = self._generate_suggestions(intent, entities)
            
        except Exception as e:
            response["message"] = "I apologize, but I encountered an issue processing your request. Could you please rephrase or try again?"
            response["metadata"]["error"] = str(e)
        
        # Save to memory
        memory.save_context(
            {"input": message},
            {"output": response["message"]}
        )
        
        return response
    
    def _generate_search_response(self, result: Dict[str, Any]) -> str:
        """Generate friendly response for search results"""
        products = result.get("products", [])
        if not products:
            return "I couldn't find any products matching your search. Could you provide more details or try a different search term?"
        
        count = len(products)
        return f"I found {count} great options for you! I've compared prices across multiple platforms. The products are sorted by best value. Would you like me to compare specific ones or help you with anything else?"
    
    def _generate_comparison_response(self, result: Dict[str, Any]) -> str:
        """Generate friendly response for comparison results"""
        comparison = result.get("comparison", [])
        best_price = result.get("best_price")
        
        if not comparison:
            return "I couldn't find products to compare. Could you specify which products you'd like to compare?"
        
        message = f"I've compared prices across different platforms for you!\n\n"
        if best_price:
            message += f"🎯 Best Deal: {best_price['name']} at ₹{best_price['price']} on {best_price['platform'].title()}\n\n"
        message += "Would you like more details about any specific product or help with ordering?"
        
        return message
    
    def _generate_recommendation_response(self, result: Dict[str, Any]) -> str:
        """Generate friendly response for recommendations"""
        recommendations = result.get("recommendations", [])
        if not recommendations:
            return "Let me know your preferences and budget, and I'll find perfect recommendations for you!"
        
        return f"Based on your preferences, I've found {len(recommendations)} products that might interest you! These are curated based on great reviews, competitive pricing, and your shopping history. Anything catch your eye?"
    
    def _generate_deals_response(self, result: Dict[str, Any]) -> str:
        """Generate friendly response for deals"""
        deals = result.get("deals", [])
        if not deals:
            return "There are no special deals right now, but I'm always monitoring for the best offers!"
        
        total_savings = sum(d.get("savings_percentage", 0) for d in deals)
        avg_savings = total_savings / len(deals) if deals else 0
        
        return f"🔥 I found {len(deals)} amazing deals today with an average discount of {avg_savings:.0f}%! These won't last long. Want to grab any of these?"
    
    def _generate_tracking_response(self, result: Dict[str, Any]) -> str:
        """Generate friendly response for order tracking"""
        if not result.get("order"):
            return "I couldn't find that order. Could you double-check the order number?"
        
        order = result["order"]
        status = order.get("status", "unknown")
        
        return f"Your order #{order.get('order_number')} is currently {status}. {result.get('message', '')}"
    
    async def _handle_order_intent(self, entities: Dict[str, Any], user_context: Optional[Dict]) -> str:
        """Handle order-related intents"""
        return "I'd be happy to help you complete your order! Please confirm the items you'd like to purchase, your preferred platform, and delivery address. You can also proceed to checkout directly from any product card."
    
    async def _handle_general_chat(self, message: str, chat_history: List) -> str:
        """Handle general conversation"""
        
        prompt = f"""{self.system_prompt}

Conversation history: {chat_history[-5:] if len(chat_history) > 5 else chat_history}

User: {message}

Respond naturally and helpfully. If the user seems to want shopping help, guide them towards search, recommendations, or deals.
"""
        
        response = self.llm.predict(prompt)
        return response
    
    def _generate_suggestions(self, intent: str, entities: Dict[str, Any]) -> List[str]:
        """Generate contextual suggestions for next actions"""
        
        suggestions_map = {
            "SEARCH": [
                "Compare these products",
                "Show me similar items",
                "What are today's best deals?",
                "Filter by price range"
            ],
            "COMPARE": [
                "Show more details",
                "Check delivery times",
                "Proceed to checkout",
                "Show alternatives"
            ],
            "RECOMMEND": [
                "Compare with other options",
                "Show similar products",
                "What's the best rated?",
                "Show me deals in this category"
            ],
            "DEALS": [
                "Show more deals",
                "Compare these deals",
                "Help me order",
                "Alert me for future deals"
            ],
            "CHAT": [
                "Search for products",
                "Show me today's deals",
                "Recommend something for me",
                "Help me find..."
            ]
        }
        
        return suggestions_map.get(intent, [
            "How can I help you today?",
            "Search for products",
            "View top deals",
            "Get recommendations"
        ])
    
    def clear_session(self, session_id: str):
        """Clear conversation history for a session"""
        if session_id in self.conversations:
            del self.conversations[session_id]
