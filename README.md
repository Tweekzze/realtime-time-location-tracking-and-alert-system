<div align="center">

# 🌍 Real-Time Location Tracking & Wildlife Alert System

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Node.js-v18+-blue" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
  <img src="https://img.shields.io/badge/WebSocket-Socket.IO-orange" alt="WebSocket">
</p>

<p align="center">
  🦎 A sophisticated real-time wildlife tracking and monitoring system for University of Engineering and Management National Park
</p>

---

</div>

## 🚀 Live Demo

<table align="center">
<tr>
<td align="center">
<strong>🌐 Live Application</strong><br/>
<a href="https://uem-kolkata-wildlife-tracker.onrender.com">uem-kolkata-wildlife-tracker.onrender.com</a>
</td>
<td align="center">
<strong>📍 Location</strong><br/>
University of Engineering and Management, Kolkata<br/>
<code>22.5603° N, 88.4903° E</code>
</td>
</tr>
</table>

## 📋 Overview

This cutting-edge project leverages **WebSocket technology** to provide real-time wildlife tracking and visitor monitoring for University of Engineering and Management National Park. The system features an interactive map interface with live animal simulation, proximity alerts, and comprehensive safety monitoring.

## ✨ Key Features

<div align="center">

| 🎯 **Real-Time Tracking** | 🦌 **Wildlife Simulation** | 🚨 **Safety Alerts** | 🗺️ **Interactive Maps** |
|:---:|:---:|:---:|:---:|
| Live GPS tracking with WebSocket | 10 realistic animal species | Proximity-based warnings | OpenStreetMap & Leaflet.js |
| Multi-visitor support | Territory-based movement | 3-tier alert system | Park boundaries & zones |

</div>

### 🔥 Advanced Features

- **🌐 Real-time visitor tracking** using GPS and WebSocket technology
- **🦎 Comprehensive wildlife simulation** with 10 different animal species
- **⚠️ Intelligent proximity alerts** with distance-based warning system
- **🗺️ Interactive map interface** with multiple view modes
- **🏞️ Multi-zone monitoring** including park boundaries and visitor centers
- **🔔 Real-time safety notifications** with customizable alert levels
- **📊 Live dashboard** with visitor statistics and wildlife monitoring
- **🎨 Modern responsive UI** with smooth animations and transitions

## 🛠️ Technology Stack

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JavaScript-blue?style=for-the-badge" alt="Frontend">
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express.js-green?style=for-the-badge" alt="Backend">
  <img src="https://img.shields.io/badge/WebSocket-Socket.IO-orange?style=for-the-badge" alt="WebSocket">
</p>

<div align="center">

| Technology | Purpose | Version |
|:---:|:---:|:---:|
| **Node.js** | Server Runtime | v18+ |
| **Express.js** | Web Framework | v4.18+ |
| **Socket.IO** | WebSocket Communication | v4.7+ |
| **Leaflet.js** | Interactive Maps | Latest |
| **OpenStreetMap** | Map Data Provider | - |
| **Geolocation API** | GPS Tracking | Browser Native |

</div>

## 🦌 Wildlife Simulation System

<details>
<summary><strong>🎯 Click to view all 10 animal species</strong></summary>

### 🔴 High Threat Animals
| Animal | Scientific Name | Habitat | Danger Zone | Warning Zone |
|:---:|:---:|:---:|:---:|:---:|
| 🐅 **Raja the Tiger** | *Panthera tigris* | Dense forests | 50m | 100m |
| 🐘 **Ganesha the Elephant** | *Elephas maximus* | Open grasslands | 30m | 75m |
| 🐆 **Shera the Leopard** | *Panthera pardus* | Rocky outcrops | 40m | 80m |
| 🐊 **Sobek the Crocodile** | *Crocodylus palustris* | Water bodies | 45m | 85m |

### 🟡 Medium Threat Animals
| Animal | Scientific Name | Habitat | Danger Zone | Warning Zone |
|:---:|:---:|:---:|:---:|:---:|
| 🐻 **Baloo the Sloth Bear** | *Melursus ursinus* | Forest undergrowth | 35m | 70m |
| 🐗 **Pumba the Wild Boar** | *Sus scrofa* | Dense undergrowth | 25m | 50m |

### 🟢 Low/No Threat Animals
| Animal | Scientific Name | Habitat | Warning Zone |
|:---:|:---:|:---:|:---:|
| 🦌 **Bambi the Spotted Deer** | *Axis axis* | Open meadows | 20m |
| 🦚 **Mayur the Peacock** | *Pavo cristatus* | Forest clearings | 15m |
| 🦜 **Zazu the Hornbill** | *Buceros rhinoceros* | Tall canopy | 10m |
| 🐒 **Hanuman the Monkey** | *Macaca mulatta* | Tree canopies | 25m |

</details>

### � Alert System

<div align="center">

| Alert Level | Icon | Description | Action Required |
|:---:|:---:|:---:|:---:|
| **🚨 DANGER** | Red | Animal within danger radius | **Immediate evacuation** |
| **⚠️ WARNING** | Yellow | Animal within warning radius | **Maintain safe distance** |
| **📍 INFO** | Blue | General park information | **Stay informed** |
| **✅ SAFE** | Green | No immediate threats | **Continue safely** |

</div>

## 🚀 Deployment Guide

<div align="center">

### 📦 Quick Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

</div>

### 📋 Prerequisites

- ✅ **Node.js** v18 or higher
- ✅ **Git** installed and configured
- ✅ **GitHub/GitLab account** for repository hosting
- ✅ **Render account** (free tier available)

### 🔧 Step-by-Step Deployment

<details>
<summary><strong>1️⃣ Repository Setup</strong></summary>

```bash
# Clone your repository
git clone https://github.com/alok-devforge/realtime-time-location-tracking-and-alert-system.git
cd realtime-time-location-tracking-and-alert-system

# Install dependencies
npm install

# Test locally
npm start
```

</details>

<details>
<summary><strong>2️⃣ Render Configuration</strong></summary>

1. 🌐 Go to [render.com](https://render.com) and sign up
2. 🔗 Connect your GitHub account
3. ➕ Click **"New +"** → **"Web Service"**
4. 📂 Select your repository
5. ⚙️ Configure settings:
   - **Name**: `uem-wildlife-tracker`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free` (or upgrade as needed)

</details>

<details>
<summary><strong>3️⃣ Environment Configuration</strong></summary>

| Setting | Value | Description |
|:---:|:---:|:---:|
| **Port** | `process.env.PORT` | Auto-configured by Render |
| **Node Version** | `18+` | Specified in package.json |
| **Auto-Deploy** | `Enabled` | Deploy on git push |

</details>

### 🌟 Deployment Features

- **🔄 Automatic deployments** on git push
- **🌐 WebSocket support** for real-time features  
- **📊 Built-in monitoring** and logging
- **⚡ Global CDN** for fast loading
- **🔒 Free SSL certificates** included
- **📈 Easy scaling** options available

## 💻 Local Development

### 🔧 Installation

```bash
# 1. Clone the repository
git clone https://github.com/alok-devforge/realtime-time-location-tracking-and-alert-system.git

# 2. Navigate to project directory
cd realtime-time-location-tracking-and-alert-system

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

### 🌐 Usage

1. **🚀 Start the server**: Run `npm start`
2. **🌍 Open browser**: Navigate to `http://localhost:3000`
3. **📍 Allow location**: Grant location permissions when prompted
4. **👤 Enter name**: Input your name to join the tracking system
5. **🦌 Monitor wildlife**: View real-time animal locations and receive alerts

### 📁 Project Structure

```
📦 realtime-time-location-tracking-and-alert-system/
├── 📄 server.js              # Main server file (Express + Socket.IO)
├── 📄 package.json           # Dependencies and scripts
├── 📄 Procfile              # Deployment configuration
├── 📄 index.html            # Main HTML file
├── 📂 public/               # Client-side assets
│   ├── 📂 images/           # Image assets
│   ├── 📂 scripts/          # JavaScript files
│   │   ├── 📄 script.js     # Main application logic
│   │   ├── 📄 methods.js    # Utility functions
│   │   ├── 📄 coords.js     # Park boundaries & coordinates
│   │   ├── 📄 control.js    # UI controls & interactions
│   │   └── 📄 userMarkers.js # User marker management
│   └── 📂 styles/           # CSS stylesheets
│       ├── 📄 style.css     # Main styles
│       ├── 📄 modern-panels.css # Panel styles
│       └── 📄 tooltip.css   # Tooltip styles
└── 📄 README.md             # Project documentation
```

## 🛡️ Safety Guidelines

<div align="center">

> ⚠️ **Important Disclaimer**: This is a demonstration system for educational purposes.

</div>

### 📋 Real Wildlife Park Guidelines

- 👥 **Always follow park ranger instructions**
- 📏 **Maintain recommended distances from all wildlife**
- 🚫 **Never attempt to feed or approach animals**
- 📞 **Report any wildlife sightings to park authorities**
- 🚶 **Stay on designated trails and paths**
- 📱 **Keep emergency contacts readily available**

## 🤝 Contributing

We welcome contributions! Here's how you can help:

<div align="center">

| 🐛 **Bug Reports** | 💡 **Feature Requests** | 🔧 **Code Contributions** |
|:---:|:---:|:---:|
| [Open an Issue](../../issues) | [Request Feature](../../issues) | [Create Pull Request](../../pulls) |

</div>

### 📝 Contribution Guidelines

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **💾 Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **📤 Push** to the branch (`git push origin feature/AmazingFeature`)
5. **🔄 Open** a Pull Request

## 📄 License

<div align="center">

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## 👨‍💻 Author & Contact

<div align="center">

**alok-devforge**

[![GitHub](https://img.shields.io/badge/GitHub-alok--devforge-black?style=for-the-badge&logo=github)](https://github.com/alok-devforge)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-alok--devforge-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/alok-devforge)

---

<p align="center">
  <strong>🌟 If you found this project helpful, please give it a star! ⭐</strong>
</p>

<p align="center">
  Made with ❤️ for wildlife conservation and education
</p>

</div>

