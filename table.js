// ===========================================
// TABLE.JS - Functions for creating and drawing the snooker table
// ===========================================

// Main function to create the entire table structure
function createTable() {
    // Create the 6 pockets (4 corners + 2 middle sides)
    pockets = [
        // Corner pockets
        { x: tableX, y: tableY },                           // Top left corner
        { x: tableX + tableWidth, y: tableY },              // Top right corner
        { x: tableX, y: tableY + tableHeight },             // Bottom left corner
        { x: tableX + tableWidth, y: tableY + tableHeight }, // Bottom right corner
        // Side pockets (middle of long sides)
        { x: tableX + tableWidth/2, y: tableY },            // Top middle
        { x: tableX + tableWidth/2, y: tableY + tableHeight } // Bottom middle
    ];
    
    // Create cushions (walls) around the table for physics
    createCushions();
    
    // Create dark grey inner cushions to simulate snooker table edges
    createInnerCushions();
}

// Create the cushions that balls bounce off
function createCushions() { 
    let cushionThickness = TABLE.CUSHION_THICKNESS;
    
    // Top cushions (split by the top middle pocket)
    // Left side of top cushion
    cushions.push(Matter.Bodies.rectangle(
        tableX + tableWidth/4,
        tableY - cushionThickness/2,
        tableWidth/2 - pocketSize,
        cushionThickness,
        { isStatic: true, restitution: PHYSICS.CUSHION_RESTITUTION, label: 'cushion' }
    ));
    
    // Right side of top cushion
    cushions.push(Matter.Bodies.rectangle(
        tableX + 3*tableWidth/4,
        tableY - cushionThickness/2,
        tableWidth/2 - pocketSize,
        cushionThickness,
        { isStatic: true, restitution: PHYSICS.CUSHION_RESTITUTION, label: 'cushion' }
    ));
    
    // Bottom cushions (split by the bottom middle pocket)
    // Left side of bottom cushion
    cushions.push(Matter.Bodies.rectangle(
        tableX + tableWidth/4,
        tableY + tableHeight + cushionThickness/2,
        tableWidth/2 - pocketSize,
        cushionThickness,
        { isStatic: true, restitution: PHYSICS.CUSHION_RESTITUTION, label: 'cushion' }
    ));
    
    // Right side of bottom cushion
    cushions.push(Matter.Bodies.rectangle(
        tableX + 3*tableWidth/4,
        tableY + tableHeight + cushionThickness/2,
        tableWidth/2 - pocketSize,
        cushionThickness,
        { isStatic: true, restitution: PHYSICS.CUSHION_RESTITUTION, label: 'cushion' }
    ));
    
    // Left cushion (full height between corner pockets)
    cushions.push(Matter.Bodies.rectangle(
        tableX - cushionThickness/2,
        tableY + tableHeight/2,
        cushionThickness,
        tableHeight - pocketSize,
        { isStatic: true, restitution: PHYSICS.CUSHION_RESTITUTION, label: 'cushion' }
    ));
    
    // Right cushion (full height between corner pockets)
    cushions.push(Matter.Bodies.rectangle(
        tableX + tableWidth + cushionThickness/2,
        tableY + tableHeight/2,
        cushionThickness,
        tableHeight - pocketSize,
        { isStatic: true, restitution: PHYSICS.CUSHION_RESTITUTION, label: 'cushion' }
    ));
    
    // Add all cushions to the physics world so balls can bounce off them
    for (let cushion of cushions) {
        Matter.World.add(world, cushion);
    }
}

function createInnerCushions() {
    let innerCushions = [];
    let cushionHeight = TABLE.INNER_CUSHION_HEIGHT;
    let pocketRadius = pocketSize / 2;
    
    // Calculate offsets for angled cushions (proportional to table size)
    let angleOffset = tableWidth * 0.015; // 1.5% of table width
    
    // TOP CUSHIONS (split by top middle pocket)
    // Left section of top cushion
    let topLeftVertices = [
        { x: tableX + pocketRadius * 1.5, y: tableY + 5 },
        { x: tableX + tableWidth/2 - pocketRadius * 1.5, y: tableY + 5},
        { x: tableX + tableWidth/2 - pocketRadius, y: tableY + cushionHeight },
        { x: tableX + pocketRadius * 2, y: tableY + cushionHeight }
    ];
    
    let topLeftCushion = Matter.Bodies.fromVertices(
        tableX + tableWidth/4, tableY + cushionHeight/2,
        [topLeftVertices],
        { isStatic: true, restitution: PHYSICS.INNER_CUSHION_RESTITUTION, label: 'inner_cushion' }
    );
    
    // Right section of top cushion
    let topRightVertices = [
        { x: tableX + tableWidth/2 + pocketRadius, y: tableY + 5 },
        { x: tableX + tableWidth - pocketRadius * 1.5, y: tableY + 5},
        { x: tableX + tableWidth - pocketRadius * 2, y: tableY + cushionHeight },
        { x: tableX + tableWidth/2 + pocketRadius * 1.5, y: tableY + cushionHeight }
    ];
    
    let topRightCushion = Matter.Bodies.fromVertices(
        tableX + 3*tableWidth/4, tableY + cushionHeight/2,
        [topRightVertices],
        { isStatic: true, restitution: PHYSICS.INNER_CUSHION_RESTITUTION, label: 'inner_cushion' }
    );
    
    // BOTTOM CUSHIONS (split by bottom middle pocket)
    // Left section of bottom cushion
    let bottomLeftVertices = [
        { x: tableX + pocketRadius * 2, y: tableY + tableHeight - cushionHeight },
        { x: tableX + tableWidth/2 - pocketRadius, y: tableY + tableHeight - cushionHeight },
        { x: tableX + tableWidth/2 - pocketRadius * 1.5, y: tableY + tableHeight - 5},
        { x: tableX + pocketRadius * 1.5, y: tableY + tableHeight - 5}
    ];
    
    let bottomLeftCushion = Matter.Bodies.fromVertices(
        tableX + tableWidth/4, tableY + tableHeight - cushionHeight/2,
        [bottomLeftVertices],
        { isStatic: true, restitution: PHYSICS.INNER_CUSHION_RESTITUTION, label: 'inner_cushion' }
    );
    
    // Right section of bottom cushion
    let bottomRightVertices = [
        { x: tableX + tableWidth/2 + pocketRadius * 1.5, y: tableY + tableHeight - cushionHeight },
        { x: tableX + tableWidth - pocketRadius * 2, y: tableY + tableHeight - cushionHeight },
        { x: tableX + tableWidth - pocketRadius * 1.5, y: tableY + tableHeight - 5 },
        { x: tableX + tableWidth/2 + pocketRadius, y: tableY + tableHeight - 5}
    ];
    
    let bottomRightCushion = Matter.Bodies.fromVertices(
        tableX + 3*tableWidth/4, tableY + tableHeight - cushionHeight/2,
        [bottomRightVertices],
        { isStatic: true, restitution: PHYSICS.INNER_CUSHION_RESTITUTION, label: 'inner_cushion' }
    );
    
    // LEFT CUSHION (between top and bottom corner pockets)
    let leftVertices = [
        { x: tableX + 5, y: tableY + pocketRadius * 1.5},
        { x: tableX + cushionHeight, y: tableY + pocketRadius * 2},
        { x: tableX + cushionHeight, y: tableY + tableHeight - pocketRadius * 2},
        { x: tableX + 5, y: tableY + tableHeight - pocketRadius * 1.5}
    ];
    
    let leftCushion = Matter.Bodies.fromVertices(
        tableX + cushionHeight/2, tableY + tableHeight/2,
        [leftVertices],
        { isStatic: true, restitution: PHYSICS.INNER_CUSHION_RESTITUTION, label: 'inner_cushion' }
    );
    
    // RIGHT CUSHION (between top and bottom corner pockets)
    let rightVertices = [
        { x: tableX + tableWidth - cushionHeight, y: tableY + pocketRadius * 2},
        { x: tableX + tableWidth - 5, y: tableY + pocketRadius * 1.5},
        { x: tableX + tableWidth - 5, y: tableY + tableHeight - pocketRadius * 1.5},
        { x: tableX + tableWidth - cushionHeight, y: tableY + tableHeight - pocketRadius * 2}
    ];
    
    let rightCushion = Matter.Bodies.fromVertices(
        tableX + tableWidth - cushionHeight/2, tableY + tableHeight/2,
        [rightVertices],
        { isStatic: true, restitution: PHYSICS.INNER_CUSHION_RESTITUTION, label: 'inner_cushion' }
    );
    
    // Store all inner cushions
    innerCushions = [
        topLeftCushion, topRightCushion,
        bottomLeftCushion, bottomRightCushion,
        leftCushion, rightCushion
    ];
    
    // Add all inner cushions to physics world
    for (let cushion of innerCushions) {
        if (cushion) { // Safety check
            Matter.World.add(world, cushion);
        }
    }
    
    // Store reference to inner cushions for drawing
    window.innerCushions = innerCushions;
}

// Draw the entire snooker table
function drawTable() {
    // Draw table felt (green background)
    fill(34, 139, 34);  // Forest green color
    stroke(101, 67, 33); // Brown border color
    strokeWeight(8);
    rect(tableX, tableY, tableWidth, tableHeight);
    
    // Draw the D-zone
    drawDZone();
    
    // Draw Baulk line
    stroke(255);
    strokeWeight(2);
    line(tableX + tableWidth/5, tableY + 5, tableX + tableWidth/5, tableY + tableHeight - 5);
    
    // Draw spot markers for colored balls
    drawSpotMarkers();
    
    // Draw all 6 pockets
    drawPockets();
    
    // Draw cushions (table edges)
    drawCushions();
    
    // Draw inner dark grey cushions
    drawInnerCushions();
}

// Draw the D-zone where cue ball must be placed
function drawDZone() {
    let dCenterX = tableX + tableWidth * BALL_PLACEMENT.D_ZONE_X;
    let dCenterY = tableY + tableHeight / 2;
    let dRadius = tableHeight / BALL_PLACEMENT.D_ZONE_RADIUS_DIVISOR;

    stroke(255);
    strokeWeight(2);
    noFill();
    
    // Draw semicircle (only left half)
    arc(dCenterX, dCenterY, dRadius * 2, dRadius * 2, PI/2, -PI/2);
}

// Draw small markers showing where colored balls should be placed
function drawSpotMarkers() {
    fill(255, 255, 255, 100);
    noStroke();
    
    let markerSize = 4;
    
    // Draw a small marker for each colored ball spot
    for (let spotType in STARTING_POSITIONS) {
        let pos = STARTING_POSITIONS[spotType];
        let x = tableX + pos.x * tableWidth;
        let y = tableY + pos.y * tableHeight;
        circle(x, y, markerSize);
    }
}

// Draw all 6 pockets as black circles
function drawPockets() {
    fill(0);
    noStroke();
    
    for (let pocket of pockets) {
        circle(pocket.x, pocket.y, pocketSize);
    }
}

// Draw the cushions
function drawCushions() {
    fill(101, 67, 33);  // Brown color (like wood)
    noStroke();
    
    for (let cushion of cushions) {
        push();
        
        translate(cushion.position.x, cushion.position.y);
        rotate(cushion.angle);
        rectMode(CENTER);
        
        let bounds = cushion.bounds;
        let w = bounds.max.x - bounds.min.x;
        let h = bounds.max.y - bounds.min.y;
        
        rect(0, 0, w, h);
        pop();
    }
}

// Draw the inner dark grey cushions
function drawInnerCushions() {
    if (window.innerCushions) {
        fill(64, 64, 64);
        noStroke();
        
        for (let cushion of window.innerCushions) {
            if (cushion && cushion.vertices) { // Safety check
                push();
                translate(cushion.position.x, cushion.position.y);
                rotate(cushion.angle);
                
                beginShape();
                for (let v of cushion.vertices) {
                    vertex(v.x - cushion.position.x, v.y - cushion.position.y);
                }
                endShape(CLOSE);
                
                pop();
            }
        }
    }
}
