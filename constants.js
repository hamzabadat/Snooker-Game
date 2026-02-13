// ===========================================
// CONSTANTS.JS - All game constants and configuration
// ===========================================

// Physics Constants
const PHYSICS = {
    BALL_RESTITUTION: 0.8,      // Ball bounciness (0-1)
    BALL_FRICTION: 0.01,         // Ball surface friction
    BALL_AIR_FRICTION: 0.02,     // Air resistance/drag
    CUSHION_RESTITUTION: 0.9,    // Cushion bounciness
    INNER_CUSHION_RESTITUTION: 0.8,
    GRAVITY_X: 0,                // No horizontal gravity
    GRAVITY_Y: 0                 // No vertical gravity
};

// Table Dimensions (proportional scaling)
const TABLE = {
    WIDTH: 800,
    HEIGHT: 400,
    CUSHION_THICKNESS: 30,
    INNER_CUSHION_HEIGHT: 10,
    BALL_DIAMETER_RATIO: 36,     // Table width / ball diameter
    POCKET_SIZE_MULTIPLIER: 1.5  // Pocket size relative to ball
};

// Ball Positioning
const BALL_PLACEMENT = {
    MIN_DISTANCE_MULTIPLIER: 1.2, // Minimum distance between balls (ball diameters)
    TRIANGLE_START_X: 0.75,       // Triangle formation starts at 75% table width
    TRIANGLE_ROW_SPACING: 0.9,    // Spacing between rows in triangle
    TRIANGLE_BALL_SPACING: 1.1,   // Spacing between balls in same row
    D_ZONE_X: 0.2,                // D-zone center at 20% table width
    D_ZONE_RADIUS_DIVISOR: 6.25,  // Table height / this = D radius
    RANDOM_PLACEMENT_MIN_X: 0.3   // Random balls placed right of 30% table width
};

// Cue Stick Settings
const CUE = {
    MAX_POWER: 35,
    MIN_SHOT_POWER: 5,
    POWER_DIVISOR: 5,            // Distance to power conversion
    BASE_LENGTH: 100,
    STROKE_WEIGHT: 6,
    TIP_SIZE: 8,
    FORCE_MULTIPLIER: 0.001,
    AIM_ASSIST_LENGTH: 300,
    AIM_ASSIST_DOT_SPACING: 10
};

// UI Settings
const UI = {
    COLLISION_MESSAGE_DURATION: 120, // Frames (2 seconds at 60fps)
    POWER_BAR_X: 50,
    POWER_BAR_Y_OFFSET: 80,
    POWER_BAR_WIDTH: 200,
    POWER_BAR_HEIGHT: 20,
    SHADOW_OFFSET: 2,
    SHADOW_ALPHA: 50,
    HIGHLIGHT_SIZE_DIVISOR: 6,
    HIGHLIGHT_ALPHA: 100
};

// Colors for different balls (standard snooker colors)
const BALL_COLORS = {
    cue: '#FFFFFF',      // White
    red: '#CC0000',      // Red
    yellow: '#FFFF00',   // Yellow
    green: '#00AA00',    // Green
    brown: '#8B4513',    // Brown
    blue: '#0000FF',     // Blue
    pink: '#FF69B4',     // Pink
    black: '#000000'     // Black
};

// Ball values for scoring (standard snooker points)
const BALL_VALUES = {
    red: 1,      // Red balls worth 1 point each
    yellow: 2,   // Yellow ball worth 2 points
    green: 3,    // Green ball worth 3 points
    brown: 4,    // Brown ball worth 4 points
    blue: 5,     // Blue ball worth 5 points
    pink: 6,     // Pink ball worth 6 points
    black: 7     // Black ball worth 7 points
};

// Standard snooker ball starting positions (as ratios of table dimensions)
const STARTING_POSITIONS = {
    yellow: { x: 0.2, y: 0.75 },    // Left side, bottom quarter
    green: { x: 0.2, y: 0.25 },     // Left side, top quarter
    brown: { x: 0.2, y: 0.5 },      // Left side, center
    blue: { x: 0.5, y: 0.5 },       // Center of table
    pink: { x: 0.75, y: 0.5 },      // 75% across, center
    black: { x: 0.85, y: 0.5 }      // 85% across, center
};

// Game Modes
const GAME_MODES = {
    NONE: 0,
    STARTING_POSITIONS: 1,
    RANDOM_REDS: 2,
    ALL_RANDOM: 3
};

// Number of balls
const BALL_COUNT = {
    RED: 15,
    COLORED: 6
};
