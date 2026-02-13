// ===========================================
// CUE.JS - All cue stick related functions
// ===========================================

// ===========================================
// CUE STICK FUNCTIONS
// ===========================================

function updateCue() {
    if (cueBallPlaced && cueBall && cueBall.body) {
        let cueBallX = cueBall.body.position.x;
        let cueBallY = cueBall.body.position.y;
        
        // Calculate angle from cue ball to mouse
        let angle = Math.atan2(mouseY - cueBallY, mouseX - cueBallX);
        
        // Set cue start position (at cue ball)
        cue.startX = cueBallX;
        cue.startY = cueBallY;
        
        // Calculate power based on distance from mouse to cue ball
        let distance = Math.sqrt(
            Math.pow(mouseX - cueBallX, 2) + 
            Math.pow(mouseY - cueBallY, 2)
        );
        cue.power = Math.min(distance / CUE.POWER_DIVISOR, CUE.MAX_POWER);
        
        // Set cue end position
        let cueLength = CUE.BASE_LENGTH + cue.power;
        cue.endX = cueBallX - Math.cos(angle) * cueLength;
        cue.endY = cueBallY - Math.sin(angle) * cueLength;
        
        cue.angle = angle;
        cue.visible = true;
    }
}

function shootCueBall() {
    if (cueBallPlaced && cueBall && cueBall.body && cue.power > CUE.MIN_SHOT_POWER) {
        // Calculate force direction (towards mouse)
        let forceX = Math.cos(cue.angle) * cue.power * CUE.FORCE_MULTIPLIER;
        let forceY = Math.sin(cue.angle) * cue.power * CUE.FORCE_MULTIPLIER;
        
        // Apply force to cue ball
        Matter.Body.applyForce(cueBall.body, cueBall.body.position, {x: forceX, y: forceY});
        
        // Hide cue after shooting
        cue.visible = false;
        isAiming = false;
        
        console.log("Shot fired with power:", cue.power.toFixed(1));
    }
}

// ===========================================
// CUE DRAWING FUNCTIONS
// ===========================================

function drawCue() {
    if (cue.visible) {
        // Draw cue stick
        stroke(139, 69, 19);  // Brown color
        strokeWeight(CUE.STROKE_WEIGHT);
        line(cue.startX, cue.startY, cue.endX, cue.endY);
        
        // Draw cue tip
        fill(255);
        noStroke();
        circle(cue.endX, cue.endY, CUE.TIP_SIZE);
        
        // Draw power indicator
        drawPowerBar();
    }
}

function drawPowerBar() {
    let powerBarX = UI.POWER_BAR_X;
    let powerBarY = height - UI.POWER_BAR_Y_OFFSET;
    let powerBarWidth = UI.POWER_BAR_WIDTH;
    let powerBarHeight = UI.POWER_BAR_HEIGHT;
    
    // Power bar background
    fill(100);
    noStroke();
    rect(powerBarX, powerBarY + 35, powerBarWidth, powerBarHeight);
    
    // Power bar fill (color changes with power)
    let powerRatio = cue.power / CUE.MAX_POWER;
    fill(255 * powerRatio, 255 * (1 - powerRatio), 0); // Red to yellow gradient
    let powerWidth = powerRatio * powerBarWidth;
    rect(powerBarX, powerBarY + 35, powerWidth, powerBarHeight);
    
    // Power bar label
    fill(255);
    textSize(14);
    textAlign(LEFT);
    text("Power: " + Math.round(cue.power), powerBarX, powerBarY + 25);
}

function drawAimAssist() {
    if (cueBall && cueBall.body && cue.visible) {
        // Draw dotted line showing aim direction
        let cueBallX = cueBall.body.position.x;
        let cueBallY = cueBall.body.position.y;
        
        // Calculate direction
        let dirX = Math.cos(cue.angle);
        let dirY = Math.sin(cue.angle);
        
        // Draw dotted line
        stroke(255, 255, 255, 200);
        strokeWeight(2);
        
        for (let i = ballDiameter; i < CUE.AIM_ASSIST_LENGTH; i += CUE.AIM_ASSIST_DOT_SPACING) {
            let x = cueBallX + dirX * i;
            let y = cueBallY + dirY * i;
            
            // Only draw if point is on table
            if (x > tableX && x < tableX + tableWidth && 
                y > tableY && y < tableY + tableHeight) {
                point(x, y);
            }
        }
        noStroke();
        strokeWeight(1);
    }
}
