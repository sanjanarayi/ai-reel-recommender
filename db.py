import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGODB_URI)

db = client["ai_reel_recommender"]
reels_collection = db["reels"]

print("MongoDB connection successful!")

# Get all reels
reels = list(reels_collection.find())

print(f"Total reels found: {len(reels)}")

for reel in reels:
    print(reel["reel_id"], "-", reel["title"])
print(reels[0])    