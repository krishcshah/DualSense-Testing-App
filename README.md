# DualSense Tester 🎮

A modern, web-based diagnostic tool and visualizer for PlayStation DualSense controllers. Built with React and the HTML5 Gamepad API, this application provides real-time tracking of button states, analog triggers, and thumbstick axes within an "Immersive HUD" aesthetic.

![App Preview](https://via.placeholder.com/800x400?text=DualSense+Tester+Preview)

## Features

- **Real-Time Diagnostics:** Monitor exact input values across all buttons and directional axes.
- **Analog Feedback Visualization:** High-fidelity visual feedback mapping out exactly how much pressure is being applied to the L2/R2 triggers.
- **Accurate Thumbstick Axis Tracking:** Visual thumbstick components track your absolute inputs perfectly across an X and Y plane structure.
- **Haptic Engine Testing:** Test device vibration features (supported in most modern desktop browsers like Chrome/Edge).
- **Immersive Technical UI:** Beautiful glassmorphism, glowing gradients, and HUD-style typography tailored for diagnostics monitoring.
- **GitHub Pages Ready:** Deploys easily with a single build without routing or pathing issues.

## Technologies Used

- **React 19**
- **TypeScript**
- **Vite** (Optimized build tooling)
- **Tailwind CSS v4** (Styling and Design System)
- **Lucide React** (Vector Iconography)

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository** (if hosted):
   \`\`\`bash
   git clone <your-repository-url>
   cd dualsense-tester
   \`\`\`

2. **Install modules:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Navigate to the local URL (usually \`http://localhost:3000\`) in your web browser. 
   *(Note: Connect your DualSense controller via Bluetooth or USB and press any button to wake it up!)*

## Deployment to GitHub Pages

This project ships configured for seamless deployment to GitHub pages without resulting in blank pages or missing assets.

1. Build the production application:
   \`\`\`bash
   npm run build
   \`\`\`
2. This will generate a \`dist\` folder. You can push the contents of this folder to the \`gh-pages\` branch or use a GitHub Action configured to deploy standard static site builds (from the \`dist/\` directory) automatically.

### Why does it work?
In \`vite.config.ts\`, the \`base\` attribute is explicitly set to \`'./'\` (Relative Paths). This ensures all assets load properly regardless of whether they are hosted at the root domain (\`username.github.io\`) or a subpath (\`username.github.io/dualsense-tester\`).

## Browser Support
Controller data parsing is reliant on the [HTML5 Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API).
- **Google Chrome / Microsoft Edge:** Full feature support including Rumble haptics (\`VibrationActuator\`).
- **Mozilla Firefox / Safari:** Basic inputs, hardware detection, axis functionality. Advanced rumble may not be supported depending on platform limitations.

## Troubleshooting

- **Controller Not Detected?** Press any physical button (like \`X\` or the \`PS\` button) while the page is open. The Gamepad API usually blocks connections until an explicit user interaction occurs to prevent browser-fingerprinting. 
- Ensure your OS actually recognizes the gamepad via Bluetooth or USB before opening the browser. 

---
*Created as a lightweight web diagnostic utility.*
