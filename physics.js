// ===========================================
// PHYSICS.JS - All physics and collision functions
// ===========================================

// ===========================================
// COLLISION DETECTION SYSTEM
// ===========================================

function setupCollisionDetection() {
    // Listen for collision events
    Matter.Events.on(engine, 'collisionStart', function(event) {
        let pairs = event.pairs;
        
        for (let pair of pairs) {
            let bodyA = pair.bodyA;
            let bodyB = pair.bodyB;
            
            // Check if cue ball is involved in collision
            if (cueBall && cueBall.body) {
                if (bodyA === cueBall.body || bodyB === cueBall.body) {
                    handleCueBallCollision(bodyA, bodyB);
                }
            }
        }
    });
}

function handleCueBallCollision(bodyA, bodyB) {
    let otherBody = (bodyA === cueBall.body) ? bodyB : bodyA;
    let collisionType = getCollisionType(otherBody);
    
    console.log("Cue ball collision:", collisionType);
    
    // Set collision message to display for 2 seconds
    setCollisionMessage(collisionType);
}

function getCollisionType(body) {
    let label = body.label;
    
    if (label.includes('red_ball')) {
        return "cue-red";
    } else if (label.includes('_ball')) {
        return "cue-colour";
    } else if (label === 'cushion') {
        return "cue-cushion";
    } else {
        return "cue-cushion";
    }
}

// ===========================================
// POCKET DETECTION AND BALL REMOVAL
// ===========================================

function checkPockets() {
    // Check all balls against all pockets
    checkBallsInPockets();
}

function checkBallsInPockets() {
    // Check red balls
    for (let i = redBalls.length - 1; i >= 0; i--) {
        let ball = redBalls[i];
        if (ball.body && isBallInPocket(ball.body)) {
            console.log("Red ball potted!");
            Matter.World.remove(world, ball.body);
            redBalls.splice(i, 1);  // Remove from array
        }
    }
    
    // Check colored balls
    for (let ball of coloredBalls) {
        if (ball.body && isBallInPocket(ball.body)) {
            console.log(ball.type + " ball potted!");
            // Check for consecutive colored balls
            checkConsecutiveColoredBalls(ball);
            // Remove from physics world temporarily
            Matter.World.remove(world, ball.body);
            // Re-spot the colored ball using proper snooker rules
            respotColoredBall(ball);
        }
    }
    
    // Check cue ball
    if (cueBall && cueBall.body && isBallInPocket(cueBall.body)) {
        console.log("Cue ball potted! Place it back in D-zone.");
        Matter.World.remove(world, cueBall.body);
        cueBall = null;
        cueBallPlaced = false;
        cue.visible = false;
    }
}

function isBallInPocket(ballBody) {
    let ballX = ballBody.position.x;
    let ballY = ballBody.position.y;
    
    // Check distance to each pocket
    for (let pocket of pockets) {
        let distance = Math.sqrt(
            Math.pow(ballX - pocket.x, 2) + 
            Math.pow(ballY - pocket.y, 2)
        );
        
        if (distance < pocketSize/2) {
            return true;
        }
    }
    return false;
}

// ===========================================
// RE-SPOTTING SYSTEM
// ===========================================

function respotColoredBall(ball) {
    // Get the respotting position using proper snooker rules
    let respotPosition = findRespotPosition(ball.type);
    
    if (respotPosition) {
        // Create new physics body at the respot position
        ball.body = Matter.Bodies.circle(respotPosition.x, respotPosition.y, ballDiameter/2, {
            restitution: 0.8,
            friction: 0.01,
            frictionAir: 0.02,
            label: ball.type + '_ball'
        });
        Matter.World.add(world, ball.body);
        console.log(ball.type + " ball respotted at position:", respotPosition);
    } else {
        console.log("Could not find valid respot position for " + ball.type + " ball!");
    }
}

function findRespotPosition(ballType) {
    // Order of spots from highest to lowest value
    const spotOrder = ['black', 'pink', 'blue', 'brown', 'green', 'yellow'];
    
    // Get the starting index based on the ball type
    let startIndex = spotOrder.indexOf(ballType);
    if (startIndex === -1) {
        console.log("Unknown ball type:", ballType);
        return null;
    }
    
    // Try the ball's own spot first, then higher value spots
    for (let i = startIndex; i >= 0; i--) {
        let spotType = spotOrder[i];
        let position = getSpotPosition(spotType);
        
        if (position && isPositionClear(position.x, position.y)) {
            console.log(ballType + " ball placed on " + spotType + " spot");
            return position;
        }
    }
    
    // If no spots are available, place as close as possible to own spot
    let ownSpotPosition = getSpotPosition(ballType);
    if (ownSpotPosition) {
        let nearestPosition = findNearestClearPosition(ownSpotPosition);
        if (nearestPosition) {
            console.log(ballType + " ball placed near its own spot");
            return nearestPosition;
        }
    }
    
    return null;
}

function getSpotPosition(spotType) {
    // Get the exact position of each colored ball spot
    let pos = STARTING_POSITIONS[spotType];
    if (!pos) return null;
    
    return {
        x: tableX + pos.x * tableWidth,
        y: tableY + pos.y * tableHeight
    };
}

function findNearestClearPosition(originalPosition) {
    // Find the nearest clear position to the original spot
    // Search in a straight line towards the top cushion as per snooker rules
    
    let x = originalPosition.x;
    let y = originalPosition.y;
    
    // Direction towards top cushion (negative Y direction)
    let stepSize = ballDiameter / 4;
    let maxSteps = Math.floor((y - tableY - ballDiameter) / stepSize);
    
    // Search from the original position towards the top cushion
    for (let step = 1; step <= maxSteps; step++) {
        let testY = y - (step * stepSize);
        
        // Make sure we don't go outside the table
        if (testY < tableY + ballDiameter) break;
        
        if (isPositionClear(x, testY)) {
            return { x: x, y: testY };
        }
    }
    
    // If no position found towards top cushion, search in expanding circles around original spot
    return findNearestClearPositionRadial(originalPosition);
}

function findNearestClearPositionRadial(originalPosition) {
    // Search in expanding circles around the original position
    let x = originalPosition.x;
    let y = originalPosition.y;
    let maxRadius = Math.min(tableWidth, tableHeight) / 4;
    
    for (let radius = ballDiameter; radius < maxRadius; radius += ballDiameter/2) {
        for (let angle = 0; angle < 2*Math.PI; angle += Math.PI/8) {
            let testX = x + Math.cos(angle) * radius;
            let testY = y + Math.sin(angle) * radius;
            
            // Make sure position is within table bounds
            if (testX > tableX + ballDiameter && testX < tableX + tableWidth - ballDiameter &&
                testY > tableY + ballDiameter && testY < tableY + tableHeight - ballDiameter) {
                
                if (isPositionClear(testX, testY)) {
                    return { x: testX, y: testY };
                }
            }
        }
    }
    
    return null; // No position found
}