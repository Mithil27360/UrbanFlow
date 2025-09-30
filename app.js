// Traffic Management Dashboard JavaScript

// Global variables
let volumeChart, speedChart, incidentChart;
let updateInterval;
let currentSection = 'dashboard';

// Application data
const appData = {
  kpis: {
    flowRate: { value: 1245, unit: "veh/hr", trend: "up", status: "good" },
    density: { value: 67, unit: "veh/km", trend: "down", status: "caution" },
    avgSpeed: { value: 42, unit: "km/h", trend: "up", status: "good" },
    congestion: { value: 65, unit: "%", trend: "steady", status: "caution", level: "Medium" },
    emissions: { value: 125, unit: "kg CO2/hr", trend: "down", status: "good" },
    incidents: { value: 3, unit: "Active", trend: "up", status: "critical" }
  },
  cameras: [
    { id: "A1", name: "Intersection A1", status: "online", timestamp: "2025-09-30 06:45:12" },
    { id: "H7", name: "Highway Exit 7", status: "online", timestamp: "2025-09-30 06:45:08" },
    { id: "DC", name: "Downtown Core", status: "online", timestamp: "2025-09-30 06:45:15" },
    { id: "BE", name: "Bridge Entrance", status: "maintenance", timestamp: "2025-09-30 06:42:33" }
  ],
  trafficData: {
    volume: [820, 950, 1100, 1245, 1180, 1050, 980, 1120, 1300, 1245],
    speed: [45, 42, 38, 42, 44, 46, 43, 41, 39, 42],
    incidents: [1, 2, 1, 3, 2, 1, 2, 3, 2, 3]
  },
  user: {
    name: "Sarah Chen",
    role: "Traffic Operator",
    avatar: "SC",
    permissions: ["view", "override", "reports"]
  },
  alerts: [
    { type: "incident", message: "Traffic accident on Highway 7 - Lane blocked", time: "06:42", priority: "high" },
    { type: "system", message: "Camera BE offline for maintenance", time: "06:15", priority: "medium" },
    { type: "traffic", message: "Heavy congestion in Downtown area", time: "06:30", priority: "medium" }
  ]
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize datetime display
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Initialize charts
    initializeCharts();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Start real-time updates
    startRealTimeUpdates();
    
    // Initialize tooltips for map regions
    initializeMapTooltips();
    
    // Initialize sidebar navigation
    initializeSidebarNavigation();
}

function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('datetime').textContent = now.toLocaleDateString('en-US', options);
}

function initializeSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('nav-item--active'));
            
            // Add active class to clicked item
            this.classList.add('nav-item--active');
            
            // Get section from nav text
            const sectionText = this.querySelector('.nav-text').textContent.toLowerCase();
            let sectionId = sectionText.replace(/\s+/g, '-').replace('&', 'and');
            
            // Handle special cases
            if (sectionId === 'alerts-and-notifications') sectionId = 'alerts';
            if (sectionId === 'user-management') sectionId = 'users';
            if (sectionId === 'historical-data') sectionId = 'history';
            
            showSection(sectionId);
        });
    });
}

function showSection(sectionId) {
    currentSection = sectionId;
    const dashboardContainer = document.querySelector('.dashboard-container');
    
    // Clear current content
    dashboardContainer.innerHTML = '';
    
    switch(sectionId) {
        case 'dashboard':
            showDashboardContent();
            break;
        case 'reports':
            showReportsContent();
            break;
        case 'analytics':
            showAnalyticsContent();
            break;
        case 'history':
            showHistoryContent();
            break;
        case 'settings':
            showSettingsContent();
            break;
        case 'users':
            showUsersContent();
            break;
        case 'alerts':
            showAlertsContent();
            break;
        default:
            showDashboardContent();
    }
}

function showDashboardContent() {
    const dashboardContainer = document.querySelector('.dashboard-container');
    dashboardContainer.innerHTML = `
        <!-- KPI Cards -->
        <section class="kpi-section">
            <h2>Key Performance Indicators</h2>
            <div class="kpi-grid">
                <div class="kpi-card kpi-card--good">
                    <div class="kpi-icon">🚗</div>
                    <div class="kpi-content">
                        <div class="kpi-value">1,245</div>
                        <div class="kpi-unit">veh/hr</div>
                        <div class="kpi-label">Flow Rate (q)</div>
                    </div>
                    <div class="kpi-trend kpi-trend--up">↑</div>
                </div>
                <div class="kpi-card kpi-card--caution">
                    <div class="kpi-icon">📏</div>
                    <div class="kpi-content">
                        <div class="kpi-value">67</div>
                        <div class="kpi-unit">veh/km</div>
                        <div class="kpi-label">Density (k)</div>
                    </div>
                    <div class="kpi-trend kpi-trend--down">↓</div>
                </div>
                <div class="kpi-card kpi-card--good">
                    <div class="kpi-icon">⚡</div>
                    <div class="kpi-content">
                        <div class="kpi-value">42</div>
                        <div class="kpi-unit">km/h</div>
                        <div class="kpi-label">Average Speed (v)</div>
                    </div>
                    <div class="kpi-trend kpi-trend--up">↑</div>
                </div>
                <div class="kpi-card kpi-card--caution">
                    <div class="kpi-icon">🚦</div>
                    <div class="kpi-content">
                        <div class="kpi-value">65%</div>
                        <div class="kpi-unit">Medium</div>
                        <div class="kpi-label">Congestion Level</div>
                    </div>
                    <div class="kpi-trend kpi-trend--steady">→</div>
                </div>
                <div class="kpi-card kpi-card--good">
                    <div class="kpi-icon">🌱</div>
                    <div class="kpi-content">
                        <div class="kpi-value">125</div>
                        <div class="kpi-unit">kg CO2/hr</div>
                        <div class="kpi-label">Emissions</div>
                    </div>
                    <div class="kpi-trend kpi-trend--down">↓</div>
                </div>
                <div class="kpi-card kpi-card--critical">
                    <div class="kpi-icon">⚠️</div>
                    <div class="kpi-content">
                        <div class="kpi-value">3</div>
                        <div class="kpi-unit">Active</div>
                        <div class="kpi-label">Incident Alerts</div>
                    </div>
                    <div class="kpi-trend kpi-trend--up">↑</div>
                </div>
            </div>
        </section>

        <!-- Two Column Layout -->
        <div class="two-column-layout">
            <!-- Left Column -->
            <div class="left-column">
                <!-- Camera Feeds -->
                <section class="camera-section">
                    <div class="section-header">
                        <h2>Live Camera Feeds</h2>
                        <button class="btn btn--sm btn--outline" onclick="refreshCameras()">Refresh All</button>
                    </div>
                    <div class="camera-grid">
                        <div class="camera-card" data-camera="A1">
                            <div class="camera-header">
                                <span class="camera-name">Intersection A1</span>
                                <span class="camera-status camera-status--online">●</span>
                            </div>
                            <div class="camera-feed" onclick="expandCamera('A1')">
                                <div class="camera-placeholder">📹</div>
                                <div class="camera-overlay">
                                    <button class="btn btn--sm camera-expand-btn">⛶ Expand</button>
                                </div>
                            </div>
                            <div class="camera-timestamp">06:45:12</div>
                        </div>
                        <div class="camera-card" data-camera="H7">
                            <div class="camera-header">
                                <span class="camera-name">Highway Exit 7</span>
                                <span class="camera-status camera-status--online">●</span>
                            </div>
                            <div class="camera-feed" onclick="expandCamera('H7')">
                                <div class="camera-placeholder">📹</div>
                                <div class="camera-overlay">
                                    <button class="btn btn--sm camera-expand-btn">⛶ Expand</button>
                                </div>
                            </div>
                            <div class="camera-timestamp">06:45:08</div>
                        </div>
                        <div class="camera-card" data-camera="DC">
                            <div class="camera-header">
                                <span class="camera-name">Downtown Core</span>
                                <span class="camera-status camera-status--online">●</span>
                            </div>
                            <div class="camera-feed" onclick="expandCamera('DC')">
                                <div class="camera-placeholder">📹</div>
                                <div class="camera-overlay">
                                    <button class="btn btn--sm camera-expand-btn">⛶ Expand</button>
                                </div>
                            </div>
                            <div class="camera-timestamp">06:45:15</div>
                        </div>
                        <div class="camera-card" data-camera="BE">
                            <div class="camera-header">
                                <span class="camera-name">Bridge Entrance</span>
                                <span class="camera-status camera-status--maintenance">●</span>
                            </div>
                            <div class="camera-feed camera-feed--offline">
                                <div class="camera-placeholder">🔧</div>
                                <div class="camera-offline-text">Maintenance</div>
                            </div>
                            <div class="camera-timestamp">06:42:33</div>
                        </div>
                    </div>
                </section>

                <!-- Traffic Charts -->
                <section class="charts-section">
                    <h2>Traffic Analytics</h2>
                    <div class="charts-grid">
                        <div class="chart-container">
                            <h3>Real-time Traffic Volume</h3>
                            <div style="position: relative; height: 250px;">
                                <canvas id="volumeChart"></canvas>
                            </div>
                        </div>
                        <div class="chart-container">
                            <h3>Speed Distribution</h3>
                            <div style="position: relative; height: 250px;">
                                <canvas id="speedChart"></canvas>
                            </div>
                        </div>
                        <div class="chart-container chart-container--full">
                            <h3>Incident Timeline</h3>
                            <div style="position: relative; height: 200px;">
                                <canvas id="incidentChart"></canvas>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Right Column -->
            <div class="right-column">
                <!-- Heatmap -->
                <section class="heatmap-section">
                    <div class="section-header">
                        <h2>Traffic Density Heatmap</h2>
                        <select class="form-control" style="width: auto;">
                            <option>Real-time</option>
                            <option>1 Hour Ago</option>
                            <option>Peak Hours</option>
                        </select>
                    </div>
                    <div class="heatmap-container">
                        <div class="heatmap-legend">
                            <div class="legend-item">
                                <div class="legend-color legend-color--low"></div>
                                <span>Low</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color legend-color--medium"></div>
                                <span>Medium</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color legend-color--high"></div>
                                <span>High</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color legend-color--critical"></div>
                                <span>Critical</span>
                            </div>
                        </div>
                        <div class="city-map">
                            <div class="map-region map-region--high" data-region="Downtown" title="Downtown - High Traffic">
                                <span class="region-label">Downtown</span>
                            </div>
                            <div class="map-region map-region--medium" data-region="Suburbs North" title="Suburbs North - Medium Traffic">
                                <span class="region-label">Suburbs N</span>
                            </div>
                            <div class="map-region map-region--low" data-region="Suburbs South" title="Suburbs South - Low Traffic">
                                <span class="region-label">Suburbs S</span>
                            </div>
                            <div class="map-region map-region--medium" data-region="Industrial Area" title="Industrial Area - Medium Traffic">
                                <span class="region-label">Industrial</span>
                            </div>
                            <div class="map-region map-region--critical" data-region="Airport Route" title="Airport Route - Critical Traffic">
                                <span class="region-label">Airport Route</span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Manual Override Controls -->
                <section class="override-section">
                    <div class="section-header">
                        <h2>Manual Override Controls</h2>
                        <div class="emergency-indicator">Ready</div>
                    </div>
                    <div class="override-panel">
                        <button class="btn btn--lg emergency-btn" id="emergencyOverride">
                            <span class="btn-icon">🚨</span>
                            Emergency Override
                        </button>
                        <div class="override-controls">
                            <div class="form-group">
                                <label class="form-label">Signal Override</label>
                                <select class="form-control" id="signalSelect">
                                    <option value="">Select Intersection</option>
                                    <option value="A1">Intersection A1</option>
                                    <option value="B2">Intersection B2</option>
                                    <option value="C3">Intersection C3</option>
                                </select>
                                <button class="btn btn--sm btn--outline" onclick="overrideSignal()">Override</button>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Emergency Protocol</label>
                                <div class="protocol-buttons">
                                    <button class="btn btn--sm protocol-btn" data-protocol="fire">🚒 Fire</button>
                                    <button class="btn btn--sm protocol-btn" data-protocol="ambulance">🚑 Ambulance</button>
                                    <button class="btn btn--sm protocol-btn" data-protocol="police">🚓 Police</button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Route Clearing</label>
                                <select class="form-control" id="routeSelect">
                                    <option value="">Select Route</option>
                                    <option value="route1">Highway 7 → Hospital</option>
                                    <option value="route2">Downtown → Fire Station</option>
                                    <option value="route3">Airport → City Center</option>
                                </select>
                                <button class="btn btn--sm btn--outline" onclick="clearRoute()">Clear Route</button>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Export Panel -->
                <section class="export-section">
                    <h2>Reports & Export</h2>
                    <div class="export-buttons">
                        <button class="btn btn--outline" onclick="exportReport('pdf')">
                            <span class="btn-icon">📄</span>
                            Export PDF
                        </button>
                        <button class="btn btn--outline" onclick="exportReport('csv')">
                            <span class="btn-icon">📊</span>
                            Export CSV
                        </button>
                    </div>
                </section>
            </div>
        </div>
    `;
    
    // Re-initialize charts after content is added
    setTimeout(() => {
        initializeCharts();
        initializeMapTooltips();
    }, 100);
}

function showReportsContent() {
    const dashboardContainer = document.querySelector('.dashboard-container');
    dashboardContainer.innerHTML = `
        <section class="reports-section">
            <h2>Traffic Reports</h2>
            <div class="reports-grid">
                <div class="card">
                    <div class="card__body">
                        <h3>Daily Traffic Summary</h3>
                        <p>Comprehensive daily traffic report including volume, speed, and incident data.</p>
                        <button class="btn btn--primary" onclick="generateReport('daily')">Generate Report</button>
                    </div>
                </div>
                <div class="card">
                    <div class="card__body">
                        <h3>Weekly Analytics</h3>
                        <p>Weekly traffic patterns and trend analysis.</p>
                        <button class="btn btn--primary" onclick="generateReport('weekly')">Generate Report</button>
                    </div>
                </div>
                <div class="card">
                    <div class="card__body">
                        <h3>Incident Report</h3>
                        <p>Detailed incident analysis and response times.</p>
                        <button class="btn btn--primary" onclick="generateReport('incidents')">Generate Report</button>
                    </div>
                </div>
                <div class="card">
                    <div class="card__body">
                        <h3>Performance Metrics</h3>
                        <p>System performance and efficiency metrics.</p>
                        <button class="btn btn--primary" onclick="generateReport('performance')">Generate Report</button>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function showAnalyticsContent() {
    const dashboardContainer = document.querySelector('.dashboard-container');
    dashboardContainer.innerHTML = `
        <section class="analytics-section">
            <h2>Advanced Analytics</h2>
            <div class="analytics-content">
                <div class="card">
                    <div class="card__body">
                        <h3>Traffic Flow Analysis</h3>
                        <p>Advanced analytics for traffic flow optimization and pattern recognition.</p>
                        <div class="analytics-chart">
                            <canvas id="analyticsChart" style="height: 300px;"></canvas>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card__body">
                        <h3>Predictive Modeling</h3>
                        <p>Machine learning models for traffic prediction and optimization.</p>
                        <div class="status status--success">Model Accuracy: 94.2%</div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function showHistoryContent() {
    const dashboardContainer = document.querySelector('.dashboard-container');
    dashboardContainer.innerHTML = `
        <section class="history-section">
            <h2>Historical Data</h2>
            <div class="history-filters">
                <div class="form-group">
                    <label class="form-label">Date Range</label>
                    <input type="date" class="form-control" value="2025-09-23">
                    <span style="margin: 0 10px;">to</span>
                    <input type="date" class="form-control" value="2025-09-30">
                </div>
                <button class="btn btn--primary">Load Data</button>
            </div>
            <div class="history-table">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 12px; border: 1px solid var(--color-border); background: var(--color-secondary);">Date</th>
                            <th style="padding: 12px; border: 1px solid var(--color-border); background: var(--color-secondary);">Avg Volume</th>
                            <th style="padding: 12px; border: 1px solid var(--color-border); background: var(--color-secondary);">Avg Speed</th>
                            <th style="padding: 12px; border: 1px solid var(--color-border); background: var(--color-secondary);">Incidents</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 12px; border: 1px solid var(--color-border);">2025-09-29</td>
                            <td style="padding: 12px; border: 1px solid var(--color-border);">1,187 veh/hr</td>
                            <td style="padding: 12px; border: 1px solid var(--color-border);">44 km/h</td>
                            <td style="padding: 12px; border: 1px solid var(--color-border);">2</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; border: 1px solid var(--color-border);">2025-09-28</td>
                            <td style="padding: 12px; border: 1px solid var(--color-border);">1,203 veh/hr</td>
                            <td style="padding: 12px; border: 1px solid var(--color-border);">41 km/h</td>
                            <td style="padding: 12px; border: 1px solid var(--color-border);">4</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    `;
}

function showSettingsContent() {
    const dashboardContainer = document.querySelector('.dashboard-container');
    dashboardContainer.innerHTML = `
        <section class="settings-section">
            <h2>System Settings</h2>
            <div class="settings-grid">
                <div class="card">
                    <div class="card__body">
                        <h3>Alert Thresholds</h3>
                        <div class="form-group">
                            <label class="form-label">Congestion Alert (%)</label>
                            <input type="number" class="form-control" value="75">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Speed Alert (km/h)</label>
                            <input type="number" class="form-control" value="30">
                        </div>
                        <button class="btn btn--primary">Save Settings</button>
                    </div>
                </div>
                <div class="card">
                    <div class="card__body">
                        <h3>Display Preferences</h3>
                        <div class="form-group">
                            <label class="form-label">Update Interval (seconds)</label>
                            <select class="form-control">
                                <option value="5">5 seconds</option>
                                <option value="10">10 seconds</option>
                                <option value="30">30 seconds</option>
                            </select>
                        </div>
                        <button class="btn btn--primary">Apply Changes</button>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function showUsersContent() {
    const dashboardContainer = document.querySelector('.dashboard-container');
    dashboardContainer.innerHTML = `
        <section class="users-section">
            <h2>User Management</h2>
            <div class="users-table">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 12px; border: 1px solid var(--color-border); background: var(--color-secondary);">Name</th>
                            <th style="padding: 12px; border: 1px solid var(--color-border); background: var(--color-secondary);">Role</th>
                            <th style="padding: 12px; border: 1px solid var(--color-border); background: var(--color-secondary);">Status</th>
                            <th style="padding: 12px; border: 1px solid var(--color-border); background: var(--color-secondary);">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 12px; border: 1px solid var(--color-border);">Sarah Chen</td>
                            <td style="padding: 12px; border: 1px solid var(--color-border);">Traffic Operator</td>
                            <td style="padding: 12px; border: 1px solid var(--color-border);"><span class="status status--success">Active</span></td>
                            <td style="padding: 12px; border: 1px solid var(--color-border);">
                                <button class="btn btn--sm btn--outline">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; border: 1px solid var(--color-border);">Mike Johnson</td>
                            <td style="padding: 12px; border: 1px solid var(--color-border);">System Admin</td>
                            <td style="padding: 12px; border: 1px solid var(--color-border);"><span class="status status--success">Active</span></td>
                            <td style="padding: 12px; border: 1px solid var(--color-border);">
                                <button class="btn btn--sm btn--outline">Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button class="btn btn--primary mt-8">Add New User</button>
        </section>
    `;
}

function showAlertsContent() {
    const dashboardContainer = document.querySelector('.dashboard-container');
    dashboardContainer.innerHTML = `
        <section class="alerts-section">
            <h2>Alerts & Notifications</h2>
            <div class="alerts-list">
                <div class="alert alert--high">
                    <span class="alert-icon">🚨</span>
                    <div class="alert-content">
                        <div class="alert-message">Traffic accident on Highway 7 - Lane blocked</div>
                        <div class="alert-time">06:42 AM</div>
                    </div>
                    <button class="alert-close">×</button>
                </div>
                <div class="alert alert--medium">
                    <span class="alert-icon">🔧</span>
                    <div class="alert-content">
                        <div class="alert-message">Camera BE offline for maintenance</div>
                        <div class="alert-time">06:15 AM</div>
                    </div>
                    <button class="alert-close">×</button>
                </div>
                <div class="alert alert--medium">
                    <span class="alert-icon">🚦</span>
                    <div class="alert-content">
                        <div class="alert-message">Heavy congestion in Downtown area</div>
                        <div class="alert-time">06:30 AM</div>
                    </div>
                    <button class="alert-close">×</button>
                </div>
            </div>
        </section>
    `;
}

function initializeCharts() {
    // Traffic Volume Chart
    const volumeCanvas = document.getElementById('volumeChart');
    if (volumeCanvas) {
        const volumeCtx = volumeCanvas.getContext('2d');
        volumeChart = new Chart(volumeCtx, {
            type: 'line',
            data: {
                labels: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
                datasets: [{
                    label: 'Traffic Volume (veh/hr)',
                    data: appData.trafficData.volume,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    // Speed Distribution Chart
    const speedCanvas = document.getElementById('speedChart');
    if (speedCanvas) {
        const speedCtx = speedCanvas.getContext('2d');
        speedChart = new Chart(speedCtx, {
            type: 'bar',
            data: {
                labels: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
                datasets: [{
                    label: 'Average Speed (km/h)',
                    data: appData.trafficData.speed,
                    backgroundColor: '#FFC185',
                    borderColor: '#FFC185',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 60,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    // Incident Timeline Chart
    const incidentCanvas = document.getElementById('incidentChart');
    if (incidentCanvas) {
        const incidentCtx = incidentCanvas.getContext('2d');
        incidentChart = new Chart(incidentCtx, {
            type: 'line',
            data: {
                labels: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
                datasets: [{
                    label: 'Active Incidents',
                    data: appData.trafficData.incidents,
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            stepSize: 1
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }
}

function initializeEventListeners() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }

    // Emergency override button (will be re-added when dashboard content loads)
    document.addEventListener('click', function(e) {
        if (e.target.id === 'emergencyOverride') {
            showConfirmation(
                'Emergency Override',
                'Are you sure you want to activate emergency override? This will affect all traffic signals in the system.',
                () => activateEmergencyOverride()
            );
        }
        
        // Handle protocol buttons
        if (e.target.classList.contains('protocol-btn')) {
            document.querySelectorAll('.protocol-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            const protocol = e.target.dataset.protocol;
            showToast(`${protocol.charAt(0).toUpperCase() + protocol.slice(1)} protocol selected`, 'info');
        }
    });

    // Map region hover effects will be re-initialized when dashboard content loads
}

function initializeMapTooltips() {
    const regions = document.querySelectorAll('.map-region');
    regions.forEach(region => {
        region.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'region-tooltip';
            tooltip.textContent = this.title;
            tooltip.style.cssText = `
                position: absolute;
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-sm);
                padding: var(--space-8);
                font-size: var(--font-size-sm);
                z-index: 1000;
                pointer-events: none;
                box-shadow: var(--shadow-md);
                opacity: 0;
                transition: opacity var(--duration-fast) var(--ease-standard);
            `;
            
            document.body.appendChild(tooltip);
            
            const updateTooltipPosition = (e) => {
                tooltip.style.left = e.pageX + 10 + 'px';
                tooltip.style.top = e.pageY - 30 + 'px';
            };
            
            updateTooltipPosition(e);
            this.addEventListener('mousemove', updateTooltipPosition);
            tooltip.style.opacity = '1';
            
            this.addEventListener('mouseleave', function() {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, { once: true });
        });
    });
}

function startRealTimeUpdates() {
    updateInterval = setInterval(() => {
        updateKPIValues();
        updateCameraTimestamps();
        updateChartData();
    }, 5000); // Update every 5 seconds
}

function updateKPIValues() {
    // Simulate real-time KPI updates with small random variations
    const kpiCards = document.querySelectorAll('.kpi-card');
    
    kpiCards.forEach((card, index) => {
        const valueElement = card.querySelector('.kpi-value');
        if (!valueElement) return;
        
        const currentValue = parseInt(valueElement.textContent.replace(/[^\d]/g, ''));
        
        let newValue;
        switch(index) {
            case 0: // Flow Rate
                newValue = currentValue + Math.floor(Math.random() * 21) - 10; // ±10
                break;
            case 1: // Density
                newValue = Math.max(0, currentValue + Math.floor(Math.random() * 11) - 5); // ±5
                break;
            case 2: // Speed
                newValue = Math.max(0, currentValue + Math.floor(Math.random() * 7) - 3); // ±3
                break;
            case 3: // Congestion
                newValue = Math.min(100, Math.max(0, currentValue + Math.floor(Math.random() * 11) - 5)); // ±5
                valueElement.textContent = newValue + '%';
                return;
            case 4: // Emissions
                newValue = Math.max(0, currentValue + Math.floor(Math.random() * 11) - 5); // ±5
                break;
            case 5: // Incidents
                newValue = Math.max(0, currentValue + Math.floor(Math.random() * 3) - 1); // ±1
                break;
        }
        
        if (index !== 3) {
            valueElement.textContent = newValue.toLocaleString();
        }
    });
}

function updateCameraTimestamps() {
    const now = new Date();
    document.querySelectorAll('.camera-timestamp').forEach(timestamp => {
        const time = new Date(now.getTime() - Math.floor(Math.random() * 30000)); // Random time within last 30 seconds
        timestamp.textContent = time.toTimeString().slice(0, 8);
    });
}

function updateChartData() {
    // Update charts only if they exist
    if (volumeChart) {
        const newVolumeData = appData.trafficData.volume.map(val => 
            val + Math.floor(Math.random() * 101) - 50 // ±50
        );
        volumeChart.data.datasets[0].data = newVolumeData;
        volumeChart.update('none');
    }
    
    if (speedChart) {
        const newSpeedData = appData.trafficData.speed.map(val => 
            Math.max(0, val + Math.floor(Math.random() * 11) - 5) // ±5
        );
        speedChart.data.datasets[0].data = newSpeedData;
        speedChart.update('none');
    }
    
    if (incidentChart) {
        const newIncidentData = appData.trafficData.incidents.map(val => 
            Math.max(0, val + Math.floor(Math.random() * 3) - 1) // ±1
        );
        incidentChart.data.datasets[0].data = newIncidentData;
        incidentChart.update('none');
    }
}

// Camera functions
function refreshCameras() {
    showToast('Refreshing all camera feeds...', 'info');
    
    // Simulate refresh delay
    setTimeout(() => {
        updateCameraTimestamps();
        showToast('Camera feeds refreshed successfully', 'success');
    }, 1500);
}

function expandCamera(cameraId) {
    const camera = appData.cameras.find(cam => cam.id === cameraId);
    if (camera) {
        document.getElementById('modalCameraTitle').textContent = `${camera.name} - Live Feed`;
        showModal('cameraModal');
    }
}

// Override functions
function overrideSignal() {
    const selectedSignal = document.getElementById('signalSelect').value;
    if (!selectedSignal) {
        showToast('Please select an intersection', 'warning');
        return;
    }
    
    showConfirmation(
        'Signal Override',
        `Are you sure you want to override signals at ${selectedSignal}?`,
        () => {
            showToast(`Signal override activated for ${selectedSignal}`, 'success');
            document.getElementById('signalSelect').value = '';
        }
    );
}

function clearRoute() {
    const selectedRoute = document.getElementById('routeSelect').value;
    if (!selectedRoute) {
        showToast('Please select a route', 'warning');
        return;
    }
    
    const routeText = document.querySelector(`#routeSelect option[value="${selectedRoute}"]`).textContent;
    showConfirmation(
        'Clear Route',
        `Are you sure you want to clear the route: ${routeText}?`,
        () => {
            showToast(`Route cleared: ${routeText}`, 'success');
            document.getElementById('routeSelect').value = '';
        }
    );
}

function activateEmergencyOverride() {
    showToast('Emergency Override activated - All signals under manual control', 'warning');
    
    // Update emergency indicator
    const indicator = document.querySelector('.emergency-indicator');
    if (indicator) {
        indicator.textContent = 'OVERRIDE ACTIVE';
        indicator.style.backgroundColor = 'var(--color-error)';
    }
    
    // Auto-deactivate after 5 minutes (simulation)
    setTimeout(() => {
        if (indicator) {
            indicator.textContent = 'Ready';
            indicator.style.backgroundColor = 'var(--color-success)';
        }
        showToast('Emergency Override deactivated - Normal operation resumed', 'info');
    }, 300000); // 5 minutes
}

// Report generation functions
function generateReport(type) {
    showToast(`Generating ${type} report...`, 'info');
    setTimeout(() => {
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} report generated successfully`, 'success');
    }, 2000);
}

// Export functions
function exportReport(format) {
    showToast(`Generating ${format.toUpperCase()} report...`, 'info');
    
    // Simulate export delay
    setTimeout(() => {
        const fileName = `traffic_report_${new Date().toISOString().split('T')[0]}.${format}`;
        showToast(`Report exported: ${fileName}`, 'success');
        
        // Create a dummy download (simulation)
        const link = document.createElement('a');
        link.href = `data:text/plain;charset=utf-8,Traffic Management Report - ${new Date().toLocaleDateString()}`;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 2000);
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

function showConfirmation(title, message, confirmCallback) {
    document.getElementById('confirmationTitle').textContent = title;
    document.getElementById('confirmationMessage').textContent = message;
    
    const confirmBtn = document.getElementById('confirmationButton');
    confirmBtn.onclick = function() {
        confirmCallback();
        closeModal('confirmationModal');
    };
    
    showModal('confirmationModal');
}

// Alert functions
function closeAlert(alertElement) {
    alertElement.style.opacity = '0';
    alertElement.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.parentNode.removeChild(alertElement);
        }
    }, 300);
}

function showToast(message, type = 'info') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="closeToast(this)">×</button>
    `;
    
    // Add toast styles if not already present
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 2000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }
    
    // Style the toast
    toast.style.cssText = `
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-base);
        padding: var(--space-12) var(--space-16);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: var(--space-12);
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all var(--duration-normal) var(--ease-standard);
    `;
    
    // Type-specific styling
    switch(type) {
        case 'success':
            toast.style.borderColor = 'var(--color-success)';
            toast.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.1)';
            break;
        case 'warning':
            toast.style.borderColor = 'var(--color-warning)';
            toast.style.backgroundColor = 'rgba(var(--color-warning-rgb), 0.1)';
            break;
        case 'error':
            toast.style.borderColor = 'var(--color-error)';
            toast.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.1)';
            break;
    }
    
    const container = document.querySelector('.toast-container');
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        closeToast(toast.querySelector('.toast-close'));
    }, 5000);
}

function closeToast(closeButton) {
    const toast = closeButton.parentNode;
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Cleanup function
window.addEventListener('beforeunload', function() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});

// Handle window resize for responsive charts
window.addEventListener('resize', function() {
    setTimeout(() => {
        if (volumeChart) volumeChart.resize();
        if (speedChart) speedChart.resize();
        if (incidentChart) incidentChart.resize();
    }, 100);
});