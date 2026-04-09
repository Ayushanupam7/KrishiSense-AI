from datetime import datetime
from typing import List, Dict, Optional
import uuid

class CommunityPost:
    def __init__(self, user_name: str, content: str, crop_tag: str, image_url: Optional[str] = None):
        self.id = str(uuid.uuid4())
        self.user_name = user_name
        self.user_image = f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_name}"
        self.content = content
        self.crop_tag = crop_tag or "General"
        self.image_url = image_url
        self.likes = 0
        self.comments = []
        self.timestamp = datetime.now().isoformat()

class CommunityService:
    def __init__(self):
        # In-memory storage for MVP. Can be replaced with DB later.
        self.posts = [
            {
                "id": "1",
                "user_name": "Ramesh Kumar",
                "user_image": "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=200",
                "content": "My wheat crop is showing yellow spots on leaves. Is this rust or nutrient deficiency? Need advice from experts.",
                "crop_tag": "Wheat",
                "image_url": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
                "likes": 142,
                "comments": [
                    {"user": "Amit Singh", "text": "Looks like leaf rust to me. You should apply propiconazole 25 EC at 0.1%."},
                    {"user": "Dr. Sunila", "text": "Could also be early nitrogen deficiency. Check the lower leaves."}
                ],
                "timestamp": datetime.now().isoformat()
            },
            {
                "id": "2",
                "user_name": "Suresh Patel",
                "user_image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
                "content": "Best time to plant Rice in Gujarat region this season? Looking at the 7-day forecast, it seems rainy.",
                "crop_tag": "Rice",
                "image_url": "https://images.unsplash.com/photo-1586520786518-e3bd9bb27a81?auto=format&fit=crop&q=80&w=800",
                "likes": 88,
                "comments": [
                    {"user": "Ratan Lal", "text": "Wait for the heavy spell to pass, otherwise the seedlings will wash away."},
                    {"user": "Nisha", "text": "I planted yesterday and the KrishiSense app forecast was super accurate!"}
                ],
                "timestamp": datetime.now().isoformat()
            },
            {
                "id": "3",
                "user_name": "Lata Sharma",
                "user_image": "https://images.unsplash.com/photo-1531123897727-8f129e1eb4ce?auto=format&fit=crop&q=80&w=200",
                "content": "Does anybody have experience with drip irrigation for Maize? Trying to save water this summer.",
                "crop_tag": "Maize",
                "image_url": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800",
                "likes": 215,
                "comments": [
                    {"user": "Vikram", "text": "Yes, drip irrigation improved my maize yield by 20% compared to last year."},
                    {"user": "Kheti Expert", "text": "Make sure your lateral spacing is between 60-90cm for optimum water coverage."}
                ],
                "timestamp": datetime.now().isoformat()
            },
            {
                "id": "4",
                "user_name": "Dr. Sunita Rao",
                "user_image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
                "content": "Quick reminder for cotton farmers: Check for Pink Bollworm activity early morning. Here is what an infected boll looks like.",
                "crop_tag": "Cotton",
                "image_url": "https://images.unsplash.com/photo-1628103770451-872f9aa32ee0?auto=format&fit=crop&q=80&w=800",
                "likes": 349,
                "comments": [
                    {"user": "Kishore Farmer", "text": "Very useful info Doctor, thanks!"},
                    {"user": "Anil", "text": "I have seen 5 moths in my pheromone trap today. Will spray soon."},
                    {"user": "Agri Tech", "text": "Great visual, sharing this with my village WhatsApp group."}
                ],
                "timestamp": datetime.now().isoformat()
            },
            {
                "id": "5",
                "user_name": "Gopal Singh",
                "user_image": "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=200",
                "content": "Sugar prices are looking good this month! 📈 Look at my sugarcane harvest today. Who else is harvesting right now?",
                "crop_tag": "Sugarcane",
                "image_url": "https://images.unsplash.com/photo-1605256910609-bc36fae76295?auto=format&fit=crop&q=80&w=800",
                "likes": 402,
                "comments": [
                    {"user": "Devraj", "text": "Wow! That is an incredible yield."},
                    {"user": "Market Analyst", "text": "Prices are expected to hold steady for the next 45 days. Good time to sell."}
                ],
                "timestamp": datetime.now().isoformat()
            }
        ]

    def get_posts(self, crop_filter: Optional[str] = None) -> List[Dict]:
        if crop_filter and crop_filter != "All":
            return [p for p in self.posts if p['crop_tag'].lower() == crop_filter.lower()]
        return sorted(self.posts, key=lambda x: x['timestamp'], reverse=True)

    def create_post(self, post_data: Dict) -> Dict:
        new_post = {
            "id": str(uuid.uuid4()),
            "user_name": post_data.get("user_name", "Farmer"),
            "user_image": f"https://api.dicebear.com/7.x/avataaars/svg?seed={post_data.get('user_name', 'Farmer')}",
            "content": post_data.get("content"),
            "crop_tag": post_data.get("crop_tag", "General"),
            "image_url": post_data.get("image_url"),
            "likes": 0,
            "comments": [],
            "timestamp": datetime.now().isoformat()
        }
        self.posts.append(new_post)
        return new_post

    def like_post(self, post_id: str) -> bool:
        for post in self.posts:
            if post['id'] == post_id:
                post['likes'] += 1
                return True
        return False

community_service = CommunityService()
