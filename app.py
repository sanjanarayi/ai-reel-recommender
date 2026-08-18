from flask import Flask, jsonify, request
from flask_cors import CORS

from db import reels_collection


app = Flask(__name__)

CORS(app)


@app.route("/api/reels", methods=["GET"])
def get_reels():

    reels = list(reels_collection.find())

    result = []

    for reel in reels:

        result.append({
            "reel_id": reel.get("reel_id"),
            "title": reel.get("title"),
            "description": reel.get("description"),
            "category": reel.get("category"),
            "content_type": reel.get("content_type"),
            "topics": reel.get("topics", []),
            "liked": reel.get("liked", False),
            "watch_percentage": reel.get("watch_percentage", 0),
            "replayed": reel.get("replayed", False)
        })

    return jsonify(result)


@app.route("/api/reels/<reel_id>/like", methods=["POST"])
def update_like(reel_id):

    data = request.get_json()

    liked = data.get("liked", False)

    result = reels_collection.update_one(
        {"reel_id": reel_id},
        {"$set": {"liked": liked}}
    )

    if result.matched_count == 0:

        return jsonify({
            "success": False,
            "message": "Reel not found"
        }), 404

    return jsonify({
        "success": True,
        "reel_id": reel_id,
        "liked": liked
    })
@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "ReelMind AI backend is running!"
    })


if __name__ == "__main__":
    app.run(debug=True)