let reels = [];
let currentReel = 0;

const reelFeed = document.getElementById("reelFeed");
const reelCounter = document.getElementById("reelCounter");

const prevReel = document.getElementById("prevReel");
const nextReel = document.getElementById("nextReel");


async function loadReels() {

    try {

        reelFeed.innerHTML = `
            <div class="card-placeholder">
                <div class="brain-icon">⏳</div>
                <h3>Loading Reels...</h3>
                <p>Connecting to ReelMind AI...</p>
            </div>
        `;


        const response = await fetch(
            "http://127.0.0.1:5000/api/reels"
        );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        reels = await response.json();


        if (reels.length === 0) {

            throw new Error("No Reels found.");

        }


        currentReel = 0;

        displayReel(currentReel);

    }

    catch (error) {

        console.error("Error loading Reels:", error);

        reelFeed.innerHTML = `
            <div class="card-placeholder">

                <div class="brain-icon">⚠️</div>

                <h3>Unable to load Reels</h3>

                <p>
                    Make sure the Flask backend is running
                    on port 5000.
                </p>

            </div>
        `;

    }

}


function displayReel(index) {

    const reel = reels[index];


    const topicsHTML = reel.topics
        .map(topic => `<span class="topic">#${topic}</span>`)
        .join("");


    reelFeed.innerHTML = `

        <div class="reel-card">

            <div>

                <div class="reel-number">
                    ${reel.reel_id.toUpperCase()}
                </div>


                <div class="reel-visual">

                    <div class="reel-emoji">
                        🎬
                    </div>

                </div>


                <span class="reel-category">
                    ${reel.category}
                </span>


                <h3 class="reel-title">
                    ${reel.title}
                </h3>


                <p class="reel-description">
                    ${reel.description}
                </p>


                <div class="reel-topics">
                    ${topicsHTML}
                </div>

            </div>


           <div class="reel-stats">

    <button
        class="like-button ${reel.liked ? "liked" : ""}"
        id="likeButton"
    >
        ${reel.liked ? "❤️ Liked" : "♡ Like"}
    </button>

    <div class="reel-stat">
        👁️ ${reel.watch_percentage}% watched
    </div>

    <div class="reel-stat">
        ${reel.replayed ? "🔄 Replayed" : "▶️ Once"}
    </div>

</div>

        </div>

    `;


   reelCounter.innerText =
    `Reel ${index + 1} / ${reels.length}`;


const likeButton =
    document.getElementById("likeButton");


likeButton.addEventListener("click", async () => {

    const newLikeStatus = !reel.liked;

    reel.liked = newLikeStatus;

    displayReel(index);


    try {

        const response = await fetch(
            `http://127.0.0.1:5000/api/reels/${reel.reel_id}/like`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    liked: newLikeStatus
                })
            }
        );


        const result = await response.json();

        console.log("Like saved:", result);

    }

    catch (error) {

        console.error(
            "Could not save Like:",
            error
        );

    }

});


prevReel.disabled = index === 0;

nextReel.disabled =
    index === reels.length - 1;


}


nextReel.addEventListener("click", () => {

    if (currentReel < reels.length - 1) {

        currentReel++;

        displayReel(currentReel);

    }

});


prevReel.addEventListener("click", () => {

    if (currentReel > 0) {

        currentReel--;

        displayReel(currentReel);

    }

});


loadReels();