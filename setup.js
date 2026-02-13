// ===========================================
// SETUP.JS - P5.js setup and main draw loop
// ===========================================

function setup() {
    createCanvas(1000, 600);
    
    // Calculate table position to center it on canvas
    tableX = (width - tableWidth) / 2;
    tableY = (height - tableHeight) / 2;
    
    // Calculate ball size based on table width (standard snooker proportions)
    ballDiameter = tableWidth / TABLE.BALL_DIAMETER_RATIO;
    
    // Calculate pocket size based on ball diameter
    pocketSize = ballDiameter * TABLE.POCKET_SIZE_MULTIPLIER;
    
    // Initialize Matter.js physics engine
    engine = Matter.Engine.create();
    world = engine.world;
    
    // Set gravity to zero (top-down view, no gravity)
    engine.world.gravity.y = PHYSICS.GRAVITY_Y;
    engine.world.gravity.x = PHYSICS.GRAVITY_X;
    
    // Create the snooker table structure
    createTable();
    
    // Create all the balls (but don't place them on table yet)
    createBalls();
    
    // Setup collision detection system
    setupCollisionDetection();
    
    console.log("Snooker game initialized! Press 1, 2, or 3 to place balls.");
}

function draw() {
    // Clear screen with dark blue-grey background
    background(40, 60, 80);
    
    // Update the physics engine
    Matter.Engine.update(engine);
    
    // Draw decorative pocket rings (before table so they appear behind)
    drawPocketRings();
    
    // Draw the snooker table
    drawTable();
    
    // Draw all the balls
    drawBalls();
    
    // Draw the cue stick if player is aiming
    if (cue.visible && cueBallPlaced) {
        drawCue();
    }
    
    // Draw aim assist line if it's turned on
    if (aimAssist && cueBallPlaced && cue.visible) {
        drawAimAssist();
    }
    
    // Check if any balls fell into pockets and handle them
    checkPockets();
    
    // Display game information and instructions
    displayGameInfo();
}

// Draw decorative golden rings around pockets
function drawPocketRings() {
    fill(255, 215, 0, 150); // Gold with transparency
    noStroke();
    
    let ringSize = pocketSize * 1.5;
    
    // Draw ring around each pocket
    for (let pocket of pockets) {
        circle(pocket.x, pocket.y, ringSize);
    }
}
