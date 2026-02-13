// ===========================================
// GAME.JS - All game logic and display functions
// ===========================================

// Message system for displaying collision messages
let collisionMessage = {
    text: "",
    timer: 0,
    duration: UI.COLLISION_MESSAGE_DURATION
};

// ===========================================
// GAME DISPLAY FUNCTIONS
// ===========================================

function displayGameInfo() {
    // Display current game mode and instructions
    fill(255);
    textSize(16);
    textAlign(LEFT);
    
    let infoY = 30;
    let infoX = 20;
    
    // Game mode
    text("Mode: " + getModeText(), infoX, infoY);
    
    // Instructions
    if (!cueBallPlaced) {
        fill(255, 255, 0); // Yellow for important instruction
        text("→ Click in D-zone to place cue ball", infoX, infoY + 25);
        fill(255);
    } else {
        text("→ Drag to aim and shoot", infoX, infoY + 25);
    }
    
    // Aim assist status
    textAlign(RIGHT);
    if (aimAssist) {
        fill(0, 255, 0);
        text("✓ Aim Assist", width - infoX, infoY);
    } else {
        fill(150);
        text("Aim Assist (Press A)", width - infoX, infoY);
    }
    fill(255);
    
    // Ball count
    text("Reds: " + redBalls.length + "/15", width - infoX, infoY + 25);
    
    // Score display
    displayScore();
    
    // Display collision message if active
    displayCollisionMessage();
    
    // Display controls hint
    displayControlsHint();
}

function getModeText() {
    switch(gameMode) {
        case GAME_MODES.NONE: 
            return "Press 1, 2, or 3 to start";
        case GAME_MODES.STARTING_POSITIONS: 
            return "Standard Setup";
        case GAME_MODES.RANDOM_REDS: 
            return "Random Reds";
        case GAME_MODES.ALL_RANDOM: 
            return "All Random";
        default: 
            return "Unknown";
    }
}

function displayControlsHint() {
    // Display keyboard controls at bottom
    fill(200);
    textSize(12);
    textAlign(CENTER);
    let hintY = height - 10;
    text("Controls: [1] Standard  [2] Random Reds  [3] All Random  [A] Aim Assist  [R] Reset", width/2, hintY);
}

function displayCollisionMessage() {
    if (collisionMessage.timer > 0) {
        // Calculate fade effect
        let alpha = Math.min(255, collisionMessage.timer * 2);
        
        fill(255, 255, 0, alpha);
        textSize(20);
        textAlign(CENTER);
        text(collisionMessage.text, width/2, 60);
        
        collisionMessage.timer--;
        
        if (collisionMessage.timer <= 0) {
            collisionMessage.text = "";
        }
    }
}

function setCollisionMessage(type) {
    collisionMessage.text = "Hit: " + type;
    collisionMessage.timer = collisionMessage.duration;
}

function displayGameMessage(message) {
    // Display important game messages to user
    fill(255, 0, 0);
    textSize(24);
    textAlign(CENTER);
    text(message, width/2, height/2);
}

// ===========================================
// GAME LOGIC FUNCTIONS
// ===========================================

function checkConsecutiveColoredBalls(ball) {
    // Check if two consecutive colored balls have been potted (foul in snooker)
    if (ball.type !== 'red' && ball.type !== 'cue') {
        if (lastPottedBall && lastPottedBall.type !== 'red' && lastPottedBall.type !== 'cue') {
            consecutiveColoredBalls++;
            if (consecutiveColoredBalls >= 2) {
                console.log("FOUL: Two consecutive colored balls potted!");
                setCollisionMessage("FOUL: Two consecutive colors!");
                consecutiveColoredBalls = 0;
            }
        } else {
            consecutiveColoredBalls = 1;
        }
    } else {
        consecutiveColoredBalls = 0;
    }
    
    lastPottedBall = ball;
}

function resetGame() {
    // Reset everything to initial state
    clearAllBalls();
    gameMode = GAME_MODES.NONE;
    cueBallPlaced = false;
    cue.visible = false;
    isAiming = false;
    consecutiveColoredBalls = 0;
    lastPottedBall = null;
    score = 0;
    
    // Reset collision message
    collisionMessage.text = "";
    collisionMessage.timer = 0;
    
    console.log("Game reset!");
}

// ===========================================
// SCORING FUNCTIONS
// ===========================================

function calculateScore() {
    // Calculate current score based on balls potted
    let totalReds = BALL_COUNT.RED - redBalls.length;
    return totalReds * BALL_VALUES.red;
}

function displayScore() {
    fill(255);
    textSize(20);
    textAlign(RIGHT);
    text("Score: " + calculateScore(), width - 20, height - 40);
}

function updateScore(ball) {
    // Update score when a ball is potted
    if (ball.value) {
        score += ball.value;
        console.log(`+${ball.value} points! Total: ${score}`);
    }
}

// ===========================================
// GAME STATE FUNCTIONS
// ===========================================

function checkGameOver() {
    // Check if game is over (all red balls potted)
    if (redBalls.length === 0 && gameMode !== GAME_MODES.NONE) {
        displayGameMessage("All red balls cleared! Final Score: " + score);
        return true;
    }
    return false;
}

function areAllBallsStopped() {
    // Check if all balls have stopped moving (useful for turn-based play)
    let allBalls = [...redBalls, ...coloredBalls];
    if (cueBall && cueBall.body) {
        allBalls.push(cueBall);
    }
    
    for (let ball of allBalls) {
        if (ball.body) {
            let velocity = Math.sqrt(
                ball.body.velocity.x ** 2 + 
                ball.body.velocity.y ** 2
            );
            if (velocity > 0.1) { // Threshold for "stopped"
                return false;
            }
        }
    }
    return true;
}
