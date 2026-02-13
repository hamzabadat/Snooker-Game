// ===========================================
// BALLS.JS - All ball-related functions
// ===========================================

// ===========================================
// BALL CREATION FUNCTIONS  
// ===========================================

function createBalls() {
    // Create 15 red balls
    for (let i = 0; i < BALL_COUNT.RED; i++) {
        let ball = {
            body: null,  // Will be created when placed on table
            color: BALL_COLORS.red,
            value: BALL_VALUES.red,
            type: 'red',
            id: i
        };
        redBalls.push(ball);
    }
    
    // Create 6 colored balls with their properties
    let coloredBallTypes = [
        { type: 'yellow', color: BALL_COLORS.yellow, value: BALL_VALUES.yellow },
        { type: 'green', color: BALL_COLORS.green, value: BALL_VALUES.green },
        { type: 'brown', color: BALL_COLORS.brown, value: BALL_VALUES.brown },
        { type: 'blue', color: BALL_COLORS.blue, value: BALL_VALUES.blue },
        { type: 'pink', color: BALL_COLORS.pink, value: BALL_VALUES.pink },
        { type: 'black', color: BALL_COLORS.black, value: BALL_VALUES.black }
    ];
    
    for (let i = 0; i < coloredBallTypes.length; i++) {
        let ballInfo = coloredBallTypes[i];
        let ball = {
            body: null,
            color: ballInfo.color,
            value: ballInfo.value,
            type: ballInfo.type,
            id: i
        };
        coloredBalls.push(ball);
    }
    
    console.log(`Created ${redBalls.length} red balls and ${coloredBalls.length} colored balls`);
}

// ===========================================
// BALL PLACEMENT FUNCTIONS
// ===========================================

function placeBallsStartingPosition() {
    console.log("Placing balls in starting positions...");
    
    clearAllBalls();
    placeRedBallsTriangle();
    placeColoredBallsStartingPositions();
    
    gameMode = GAME_MODES.STARTING_POSITIONS;
    console.log("Starting positions set!");
}

function placeBallsRandomReds() {
    console.log("Placing red balls randomly...");
    
    clearAllBalls();
    placeRedBallsRandom();
    
    gameMode = GAME_MODES.RANDOM_REDS;
    console.log("Random red positions set!");
}

function placeBallsAllRandom() {
    console.log("Placing all balls randomly");
    
    clearAllBalls();
    placeRedBallsRandom();
    placeColoredBallsStartingPositions();

    gameMode = GAME_MODES.ALL_RANDOM;
    console.log("All random positions set!");
}

function placeRedBallsTriangle() {
    // Standard triangle formation for red balls (5 rows: 1,2,3,4,5 balls)
    let startX = tableX + tableWidth * BALL_PLACEMENT.TRIANGLE_START_X;
    let startY = tableY + tableHeight / 2;
    
    let ballIndex = 0;
    
    // Create triangle pattern
    for (let row = 0; row < 5; row++) {
        let ballsInRow = row + 1;
        
        for (let col = 0; col < ballsInRow; col++) {
            if (ballIndex < redBalls.length) {
                let x = startX + (row * ballDiameter * BALL_PLACEMENT.TRIANGLE_ROW_SPACING);
                let y = startY + (col - (ballsInRow - 1) / 2) * ballDiameter * BALL_PLACEMENT.TRIANGLE_BALL_SPACING;
                
                // Create physics body for this red ball
                redBalls[ballIndex].body = Matter.Bodies.circle(x, y, ballDiameter/2, {
                    restitution: PHYSICS.BALL_RESTITUTION,
                    friction: PHYSICS.BALL_FRICTION,
                    frictionAir: PHYSICS.BALL_AIR_FRICTION,
                    label: 'red_ball_' + ballIndex
                });
                
                Matter.World.add(world, redBalls[ballIndex].body);
                ballIndex++;
            }
        }
    }
}

function placeRedBallsRandom() {
    // Place red balls in random positions on the table
    for (let i = 0; i < redBalls.length; i++) {
        let attempts = 0;
        let placed = false;
        
        while (!placed && attempts < 100) {
            // Random position on table (avoiding edges and D-zone)
            let x = tableX + ballDiameter + Math.random() * (tableWidth - 2 * ballDiameter);
            let y = tableY + ballDiameter + Math.random() * (tableHeight - 2 * ballDiameter);
            
            // Make sure not in D-zone (left portion of table)
            if (x > tableX + tableWidth * BALL_PLACEMENT.RANDOM_PLACEMENT_MIN_X) {
                if (isPositionClear(x, y)) {
                    redBalls[i].body = Matter.Bodies.circle(x, y, ballDiameter/2, {
                        restitution: PHYSICS.BALL_RESTITUTION,
                        friction: PHYSICS.BALL_FRICTION,
                        frictionAir: PHYSICS.BALL_AIR_FRICTION,
                        label: 'red_ball_' + i
                    });
                    
                    Matter.World.add(world, redBalls[i].body);
                    placed = true;
                }
            }
            attempts++;
        }
    }
}

function placeColoredBallsStartingPositions() {
    // Get triangle position for positioning pink and black relative to reds
    let triangleStartX = tableX + tableWidth * BALL_PLACEMENT.TRIANGLE_START_X;
    let triangleStartY = tableY + tableHeight / 2;
    
    // Place each colored ball in its designated starting spot
    for (let i = 0; i < coloredBalls.length; i++) {
        let ball = coloredBalls[i];
        let x, y;
        
        // Calculate positions based on ball type
        switch(ball.type) {
            case 'yellow':
                x = tableX + tableWidth * 0.2;
                y = tableY + tableHeight * 0.75;
                break;
                
            case 'green':
                x = tableX + tableWidth * 0.2;
                y = tableY + tableHeight * 0.25;
                break;
                
            case 'brown':
                x = tableX + tableWidth * 0.2;
                y = tableY + tableHeight * 0.5;
                break;
                
            case 'blue':
                x = tableX + tableWidth * 0.5;
                y = tableY + tableHeight * 0.5;
                break;
                
            case 'pink':
                // Pink: in front of red triangle
                x = triangleStartX - ballDiameter * 1.2;
                y = triangleStartY;
                break;
                
            case 'black':
                // Black: behind red triangle
                x = triangleStartX + ballDiameter * 5.5;
                y = triangleStartY;
                break;
                
            default:
                // Fallback to position table if type not found
                let pos = STARTING_POSITIONS[ball.type];
                if (pos) {
                    x = tableX + pos.x * tableWidth;
                    y = tableY + pos.y * tableHeight;
                } else {
                    continue;
                }
        }
        
        // Make sure position is clear before placing
        if (isPositionClear(x, y)) {
            ball.body = Matter.Bodies.circle(x, y, ballDiameter/2, {
                restitution: PHYSICS.BALL_RESTITUTION,
                friction: PHYSICS.BALL_FRICTION,
                frictionAir: PHYSICS.BALL_AIR_FRICTION,
                label: ball.type + '_ball'
            });
            
            Matter.World.add(world, ball.body);
        } else {
            // If position is blocked, find a nearby clear spot
            let nearbyPosition = findNearbyPosition(x, y);
            if (nearbyPosition) {
                ball.body = Matter.Bodies.circle(nearbyPosition.x, nearbyPosition.y, ballDiameter/2, {
                    restitution: PHYSICS.BALL_RESTITUTION,
                    friction: PHYSICS.BALL_FRICTION,
                    frictionAir: PHYSICS.BALL_AIR_FRICTION,
                    label: ball.type + '_ball'
                });
                Matter.World.add(world, ball.body);
            }
        }
    }
}

function findNearbyPosition(x, y) {
    // Find a clear position near the target coordinates
    for (let radius = ballDiameter; radius < ballDiameter * 3; radius += ballDiameter/2) {
        for (let angle = 0; angle < 2 * PI; angle += PI/8) {
            let testX = x + Math.cos(angle) * radius;
            let testY = y + Math.sin(angle) * radius;
            
            if (isPositionClear(testX, testY)) {
                return { x: testX, y: testY };
            }
        }
    }
    return null;
}

function isPositionClear(x, y) {
    // Check if a position is clear of other balls
    let minDistance = ballDiameter * BALL_PLACEMENT.MIN_DISTANCE_MULTIPLIER;
    
    // Check against all existing balls
    let allExistingBalls = [...redBalls, ...coloredBalls];
    if (cueBall && cueBall.body) {
        allExistingBalls.push(cueBall);
    }
    
    for (let ball of allExistingBalls) {
        if (ball.body) {
            let distance = Math.sqrt(
                Math.pow(x - ball.body.position.x, 2) + 
                Math.pow(y - ball.body.position.y, 2)
            );
            
            if (distance < minDistance) {
                return false;
            }
        }
    }
    
    return true;
}

function clearAllBalls() {
    // Remove all balls from physics world
    for (let ball of redBalls) {
        if (ball.body) {
            Matter.World.remove(world, ball.body);
            ball.body = null;
        }
    }
    
    for (let ball of coloredBalls) {
        if (ball.body) {
            Matter.World.remove(world, ball.body);
            ball.body = null;
        }
    }
    
    if (cueBall && cueBall.body) {
        Matter.World.remove(world, cueBall.body);
        cueBall = null;
    }
    
    cueBallPlaced = false;
}

// ===========================================
// CUE BALL FUNCTIONS
// ===========================================

function placeCueBall(x, y) {
    // Check if position is in the D-zone
    if (!isInDZone(x, y)) {
        console.log("Cue ball must be placed in the D-zone!");
        return false;
    }
    
    // Check if position is clear
    if (!isPositionClear(x, y)) {
        console.log("Position is not clear!");
        return false;
    }
    
    // Remove existing cue ball if it exists
    if (cueBall && cueBall.body) {
        Matter.World.remove(world, cueBall.body);
    }
    
    // Create new cue ball
    cueBall = {
        body: Matter.Bodies.circle(x, y, ballDiameter/2, {
            restitution: PHYSICS.BALL_RESTITUTION,
            friction: PHYSICS.BALL_FRICTION,
            frictionAir: PHYSICS.BALL_AIR_FRICTION,
            label: 'cue_ball'
        }),
        color: BALL_COLORS.cue,
        type: 'cue'
    };
    
    Matter.World.add(world, cueBall.body);
    cueBallPlaced = true;
    
    console.log("Cue ball placed at", x, y);
    return true;
}

function isInDZone(x, y) {
    // Check if point is within the D-zone semicircle
    let dCenterX = tableX + tableWidth * BALL_PLACEMENT.D_ZONE_X;
    let dCenterY = tableY + tableHeight / 2;
    let dRadius = tableHeight / BALL_PLACEMENT.D_ZONE_RADIUS_DIVISOR;
    
    let distance = Math.sqrt(Math.pow(x - dCenterX, 2) + Math.pow(y - dCenterY, 2));
    return distance <= dRadius && x >= tableX && x <= dCenterX;
}

// ===========================================
// BALL DRAWING FUNCTIONS
// ===========================================

function drawBalls() {
    // Draw all red balls
    for (let ball of redBalls) {
        if (ball.body) {
            drawSingleBall(ball);
        }
    }
    
    // Draw all colored balls
    for (let ball of coloredBalls) {
        if (ball.body) {
            drawSingleBall(ball);
        }
    }
    
    // Draw cue ball
    if (cueBall && cueBall.body) {
        drawSingleBall(cueBall);
    }
}

function drawSingleBall(ball) {
    let pos = ball.body.position;
    
    // Draw ball shadow
    fill(0, 0, 0, UI.SHADOW_ALPHA);
    noStroke();
    circle(pos.x + UI.SHADOW_OFFSET, pos.y + UI.SHADOW_OFFSET, ballDiameter);
    
    // Draw ball
    fill(ball.color);
    stroke(0);
    strokeWeight(1);
    circle(pos.x, pos.y, ballDiameter);
    
    // Add highlight to make ball look 3D
    fill(255, 255, 255, UI.HIGHLIGHT_ALPHA);
    noStroke();
    circle(
        pos.x - ballDiameter / UI.HIGHLIGHT_SIZE_DIVISOR, 
        pos.y - ballDiameter / UI.HIGHLIGHT_SIZE_DIVISOR, 
        ballDiameter / 3
    );
}
