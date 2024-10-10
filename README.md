# Whack-a-Mole Game

This is a simple Whack-a-Mole game implemented in TypeScript using React.

## Features

- 15-second gameplay
- Randomized mole appearances
- Score tracking
- Combo system for consecutive hits

## Bonus Feature: Combo System

I added a combo system to make the game more exciting. Here's how it works:

- Successfully whacking consecutive moles within 1 second of each other increases your combo.
- Each combo level multiplies your score for that hit (e.g., 2x for 2 combo, 3x for 3 combo, etc.).
- Missing a mole or taking more than 1 second between hits resets the combo to 1x.
- The current combo is displayed on the game screen, allowing players to track their streak.

## How to Run

1. Clone this repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open your browser and navigate to `http://localhost:5173`

## Running Tests

To run the unit tests, use the command: `npm test`

## Building for Production

To build the project for production, use: `npm run build`

The built files will be in the `dist` directory.

## Technologies Used

- TypeScript
- React
- Vite
- Jest (for testing)