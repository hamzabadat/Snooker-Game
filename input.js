// ===========================================
// INPUT.JS - All input handling functions
// ===========================================

// ===========================================
// INPUT HANDLING (KEYBOARD AND MOUSE)
// ===========================================

function keyPressed() {
    // Handle keyboard input
    if (key === '1') {
        // Place balls in starting positions
        placeBallsStartingPosition();
    } else if (key === '2') {
        // Place red balls randomly, colored balls in starting positions
        placeBallsRandomReds();
    } else if (key === '3') {
        // Place all balls randomly
        placeBallsAllRandom();
    } else if (key === 'a' || key === 'A') {
        // Toggle aim assist on/off
        aimAssist = !aimAssist;
        console.log("Aim assist:", aimAssist ? "ON" : "OFF");
    } else if (key === 'r' || key === 'R') {
        // Reset game
        resetGame();
    }
}

function mousePressed() {
    // Handle mouse clicks
    if (!cueBallPlaced) {
        // Try to place cue ball in D-zone
        placeCueBall(mouseX, mouseY);
    } else {
        // Start aiming the cue
        isAiming = true;
        updateCue();
    }
}

function mouseMoved() {
    // Update cue position while moving mouse (for aiming)
    if (cueBallPlaced && !isAiming) {
        updateCue();
    }
}

function mouseDragged() {
    // Update cue while dragging mouse (for power adjustment)
    if (cueBallPlaced) {
        updateCue();
        isAiming = true;
    }
}

function mouseReleased() {
    // Shoot the cue ball when mouse is released
    if (isAiming) {
        shootCueBall();
    }
}