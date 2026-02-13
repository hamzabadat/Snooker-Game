// ===========================================
// VARIABLES.JS - All global variables
// ===========================================

// Matter.js physics engine components
let engine;  
let world;   

// Table dimensions and calculated properties
let tableWidth = TABLE.WIDTH;  
let tableHeight = TABLE.HEIGHT; 
let tableX, tableY;    // Calculated in setup to center table
let ballDiameter;      // Calculated based on table width
let pocketSize;        // Calculated based on ball diameter

// Ball arrays to store different types of balls
let redBalls = [];        
let coloredBalls = [];    
let cueBall = null;       

// Cue stick properties - object holds all cue information
let cue = {
    visible: false,       
    startX: 0,           
    startY: 0,           
    endX: 0,             
    endY: 0,             
    power: 0,            
    angle: 0             
};

// Game state variables
let gameMode = GAME_MODES.NONE;       // Current ball layout mode
let cueBallPlaced = false;             // Whether cue ball has been placed
let aimAssist = false;                 // Whether aim assist line is on/off
let isAiming = false;                  // Whether player is currently aiming

// Pocket and cushion arrays
let pockets = [];
let cushions = [];

// Scoring and game logic tracking
let consecutiveColoredBalls = 0;  // Count of colored balls potted in a row (for foul detection)
let lastPottedBall = null;        // Remember the last ball that was potted
let score = 0;                    // Player's current score
