# University of Engineering and Management National Park - Wildlife Tracker

## Overview

This project is a real-time wildlife tracking and monitoring system for University of Engineering and Management National Park. It utilizes WebSocket technology to provide real-time updates, displaying the location of visitors and simulated wildlife on an interactive map. The system provides safety alerts when visitors get too close to dangerous animals.

## 🦎 **Live Demo**
- **URL:** [UEM Kolkata Wildlife Tracker - Live Site](https://uem-kolkata-wildlife-tracker.onrender.com) 
- **GitHub:** [Source Code](https://github.com/faisal-shohag/realtime_location_tracking)
- **Location:** University of Engineering and Management, Kolkata (22.5603° N, 88.4903° E)
- **Address:** University Area, Plot No. III – B/5, New Town, Action Area – III, Kolkata, West Bengal 700156, India

## Features

- **Real-time visitor tracking** using WebSocket technology and GPS
- **Comprehensive wildlife simulation** with 10 different animal species moving within their territories
- **Proximity alerts** that warn visitors when dangerous animals are nearby
- **Interactive map** using OpenStreetMap and Leaflet.js with park boundaries
- **Multi-zone monitoring** including park boundaries, wildlife sanctuary zones, and visitor centers
- **Real-time safety notifications** with different alert levels based on animal proximity and threat levels
- **Professional animal markers** with scientific names and habitat information
- **Supports multiple connected visitors** viewing locations simultaneously

## Technologies Used

- **JavaScript**
- **Node.js**
- **Express.js**
- **Socket.IO**
- **OpenStreetMap**
- **Leaflet.js**
- **Geolocation API**

## Wildlife Features

### Animal Simulation - 10 Species
- **🐅 Raja the Tiger** (Panthera tigris): Dense forest areas (Danger: 50m, Warning: 100m) - HIGH THREAT
- **🐘 Ganesha the Elephant** (Elephas maximus): Open grasslands (Danger: 30m, Warning: 75m) - HIGH THREAT  
- **🐆 Shera the Leopard** (Panthera pardus): Rocky outcrops (Danger: 40m, Warning: 80m) - HIGH THREAT
- **🐻 Baloo the Sloth Bear** (Melursus ursinus): Forest undergrowth (Danger: 35m, Warning: 70m) - MEDIUM THREAT
- **🦌 Bambi the Spotted Deer** (Axis axis): Open meadows (Warning: 20m) - NO THREAT
- **🦚 Mayur the Peacock** (Pavo cristatus): Forest clearings (Warning: 15m) - NO THREAT
- **🦜 Zazu the Rhino Hornbill** (Buceros rhinoceros): Tall forest canopy (Warning: 10m) - NO THREAT
- **🐒 Hanuman the Rhesus Monkey** (Macaca mulatta): Tree canopies (Danger: 5m, Warning: 25m) - LOW THREAT
- **🐊 Sobek the Mugger Crocodile** (Crocodylus palustris): Water bodies (Danger: 45m, Warning: 85m) - HIGH THREAT
- **🐗 Pumba the Wild Boar** (Sus scrofa): Dense undergrowth (Danger: 25m, Warning: 50m) - MEDIUM THREAT

### Safety Alert System
- 🚨 **DANGER**: Animal within danger radius - immediate action required
- ⚠️ **WARNING**: Animal within warning radius - maintain safe distance
- 📍 **INFO**: General park and location information
- 🔴 **HIGH THREAT**: Large predators and dangerous animals
- 🟡 **MEDIUM THREAT**: Potentially aggressive animals
- 🟢 **LOW/NO THREAT**: Harmless wildlife for observation

## 🚀 **Deployment on Render**

### Prerequisites
- A GitHub account with your code repository
- A Render account (free tier available)

### Step-by-step Deployment

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** `uem-wildlife-tracker` (or your preferred name)
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `node server.js`
     - **Plan:** `Free`

3. **Environment Variables (if needed):**
   - No additional environment variables required for basic deployment

4. **Custom Domain (Optional):**
   - Add your custom domain in Render dashboard
   - Update DNS settings as instructed

### Important Deployment Notes
- **WebSockets Support:** Render fully supports WebSockets needed for Socket.io
- **Auto Sleep:** Free tier will sleep after inactivity; first request after sleep may be slow
- **Continuous Deployment:** Automatically redeploys when you push changes to your repository
- **Logs:** Monitor application logs from the Render dashboard for troubleshooting
- **Scaling:** Easily upgrade to paid plans if you need more resources

## Local Development

### Installation

1. Clone the repository:
    ```bash
   
    ```
2. Navigate to the project directory:
    ```bash
    cd realtime_location_tracking
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

### Usage

1. Start the server:
    ```bash
    npm start
    ```
2. Open your web browser and go to `http://localhost:3000` to access the wildlife tracker.
3. Allow location permissions when prompted
4. Enter your name to join the park tracking system
5. Monitor wildlife locations and receive proximity alerts

## Project Structure

- `server.js` - Main server file that sets up the Express server and WebSocket connections
- `package.json` - Project dependencies and scripts
- `public/` - Directory containing the client-side code
  - `index.html` - Main HTML file with park branding
  - `styles/style.css` - CSS file for styling including wildlife alert styles
  - `scripts/`
    - `script.js` - Main application logic with animal simulation
    - `methods.js` - Utility functions for distance calculation and alerts
    - `coords.js` - Park boundaries and animal territory definitions
    - `control.js` - UI controls and user interaction handlers

## Safety Guidelines

⚠️ **Important**: This is a simulation system for demonstration purposes. In a real wildlife park:
- Always follow park ranger instructions
- Maintain recommended distances from all wildlife
- Never attempt to feed or approach animals
- Report any wildlife sightings to park authorities

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue to discuss improvements or bugs.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

- **Author:** 
- **Email:** 
- **LinkedIn:** [alok-devforge](http://linkedin.com/in/alok-devforge)
- **GitHub:** [alok-devforge](http://github.com/alok-devforge)

