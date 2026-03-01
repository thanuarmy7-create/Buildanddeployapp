// ─── Complaints ─────────────────────────────────────────────────────────────
export type ComplaintStatus = "Pending" | "In Progress" | "Resolved";
export type ComplaintCategory =
  | "Garbage"
  | "Pothole"
  | "Streetlight"
  | "Water Leakage"
  | "Noise"
  | "Other";

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  location: string;
  date: string;
  reportedBy: string;
  imageUrl?: string;
  upvotes: number;
}

export const complaints: Complaint[] = [
  {
    id: "C001",
    title: "Large pothole on Main Street",
    description: "A dangerous pothole near the traffic signal at Main St & 5th Ave causing vehicle damage.",
    category: "Pothole",
    status: "In Progress",
    location: "Main St & 5th Ave",
    date: "2026-02-25",
    reportedBy: "Alex Johnson",
    imageUrl: "https://images.unsplash.com/photo-1709934730506-fba12664d4e4?w=400&q=80",
    upvotes: 34,
  },
  {
    id: "C002",
    title: "Streetlight not working",
    description: "Three streetlights on Oak Avenue have been out for over a week creating safety hazard at night.",
    category: "Streetlight",
    status: "Pending",
    location: "Oak Avenue, Block 7",
    date: "2026-02-26",
    reportedBy: "Maria Santos",
    imageUrl: "https://images.unsplash.com/photo-1770447323553-5cd1b6711134?w=400&q=80",
    upvotes: 21,
  },
  {
    id: "C003",
    title: "Overflowing garbage bin",
    description: "Public bin near Central Park entrance has been overflowing since Monday.",
    category: "Garbage",
    status: "Resolved",
    location: "Central Park Entrance",
    date: "2026-02-20",
    reportedBy: "David Lee",
    imageUrl: "https://images.unsplash.com/photo-1758547343136-19d27f9cb57f?w=400&q=80",
    upvotes: 15,
  },
  {
    id: "C004",
    title: "Water pipe leakage",
    description: "Significant water leakage from underground pipe on Elm Street flooding the sidewalk.",
    category: "Water Leakage",
    status: "In Progress",
    location: "Elm Street, Near #42",
    date: "2026-02-27",
    reportedBy: "Priya Patel",
    upvotes: 47,
  },
  {
    id: "C005",
    title: "Garbage dump near school",
    description: "Illegal garbage dumping near Lincoln Elementary School posing health hazard to children.",
    category: "Garbage",
    status: "Pending",
    location: "Lincoln Elementary, West Side",
    date: "2026-02-28",
    reportedBy: "James Wilson",
    upvotes: 62,
  },
  {
    id: "C006",
    title: "Deep pothole causing accidents",
    description: "Multiple minor accidents reported due to a deep pothole on Highway 12.",
    category: "Pothole",
    status: "Resolved",
    location: "Highway 12, KM 34",
    date: "2026-02-15",
    reportedBy: "Christine Baker",
    upvotes: 88,
  },
];

// ─── Traffic Data ────────────────────────────────────────────────────────────
export interface TrafficZone {
  id: string;
  name: string;
  density: number; // 0–100
  avgSpeed: number; // km/h
  incidents: number;
  status: "Clear" | "Moderate" | "Heavy" | "Severe";
}

export const trafficZones: TrafficZone[] = [
  { id: "Z1", name: "Downtown Core", density: 85, avgSpeed: 18, incidents: 3, status: "Heavy" },
  { id: "Z2", name: "North Highway", density: 42, avgSpeed: 65, incidents: 0, status: "Moderate" },
  { id: "Z3", name: "East Bridge", density: 93, avgSpeed: 8, incidents: 2, status: "Severe" },
  { id: "Z4", name: "West Suburb", density: 20, avgSpeed: 80, incidents: 0, status: "Clear" },
  { id: "Z5", name: "Central Market", density: 70, avgSpeed: 25, incidents: 1, status: "Heavy" },
  { id: "Z6", name: "Airport Rd", density: 55, avgSpeed: 48, incidents: 1, status: "Moderate" },
];

export const trafficHourly = [
  { time: "00:00", downtown: 12, highway: 8, bridge: 5 },
  { time: "03:00", downtown: 5, highway: 4, bridge: 3 },
  { time: "06:00", downtown: 35, highway: 28, bridge: 42 },
  { time: "09:00", downtown: 88, highway: 65, bridge: 92 },
  { time: "12:00", downtown: 72, highway: 55, bridge: 68 },
  { time: "15:00", downtown: 78, highway: 62, bridge: 75 },
  { time: "18:00", downtown: 95, highway: 72, bridge: 98 },
  { time: "21:00", downtown: 45, highway: 38, bridge: 40 },
];

// ─── Waste Bins ──────────────────────────────────────────────────────────────
export interface WasteBin {
  id: string;
  location: string;
  fillLevel: number; // 0–100 percent
  lastEmptied: string;
  type: "General" | "Recyclable" | "Organic";
  coordinates: { lat: number; lng: number };
}

export const wasteBins: WasteBin[] = [
  { id: "BIN-001", location: "Main St & 1st Ave", fillLevel: 95, lastEmptied: "2026-02-25", type: "General", coordinates: { lat: 40.712, lng: -74.006 } },
  { id: "BIN-002", location: "Central Park North", fillLevel: 72, lastEmptied: "2026-02-26", type: "Recyclable", coordinates: { lat: 40.715, lng: -74.003 } },
  { id: "BIN-003", location: "City Hall Plaza", fillLevel: 30, lastEmptied: "2026-02-28", type: "General", coordinates: { lat: 40.713, lng: -74.009 } },
  { id: "BIN-004", location: "Riverside Drive", fillLevel: 88, lastEmptied: "2026-02-24", type: "Organic", coordinates: { lat: 40.718, lng: -74.001 } },
  { id: "BIN-005", location: "Market Square", fillLevel: 100, lastEmptied: "2026-02-23", type: "General", coordinates: { lat: 40.710, lng: -74.008 } },
  { id: "BIN-006", location: "East Bridge Approach", fillLevel: 15, lastEmptied: "2026-02-28", type: "Recyclable", coordinates: { lat: 40.720, lng: -73.998 } },
  { id: "BIN-007", location: "South Station", fillLevel: 60, lastEmptied: "2026-02-27", type: "Organic", coordinates: { lat: 40.709, lng: -74.012 } },
  { id: "BIN-008", location: "Sports Complex", fillLevel: 45, lastEmptied: "2026-02-27", type: "General", coordinates: { lat: 40.716, lng: -74.005 } },
];

export const wasteCollectionWeekly = [
  { day: "Mon", collected: 12.4, recycled: 4.2 },
  { day: "Tue", collected: 15.1, recycled: 5.8 },
  { day: "Wed", collected: 11.8, recycled: 3.9 },
  { day: "Thu", collected: 18.3, recycled: 7.1 },
  { day: "Fri", collected: 22.5, recycled: 9.4 },
  { day: "Sat", collected: 26.7, recycled: 11.2 },
  { day: "Sun", collected: 20.1, recycled: 8.6 },
];

// ─── Predictive Analytics ────────────────────────────────────────────────────
export const trafficPrediction = [
  { date: "Mar 1", actual: 72, predicted: 74 },
  { date: "Mar 2", actual: 68, predicted: 70 },
  { date: "Mar 3", actual: 85, predicted: 82 },
  { date: "Mar 4", actual: 91, predicted: 88 },
  { date: "Mar 5", actual: 78, predicted: 80 },
  { date: "Mar 6", actual: null, predicted: 76 },
  { date: "Mar 7", actual: null, predicted: 83 },
  { date: "Mar 8", actual: null, predicted: 90 },
  { date: "Mar 9", actual: null, predicted: 87 },
  { date: "Mar 10", actual: null, predicted: 79 },
];

export const wastePrediction = [
  { date: "Mar 1", actual: 68, predicted: 66 },
  { date: "Mar 2", actual: 72, predicted: 71 },
  { date: "Mar 3", actual: 75, predicted: 74 },
  { date: "Mar 4", actual: 80, predicted: 79 },
  { date: "Mar 5", actual: 78, predicted: 80 },
  { date: "Mar 6", actual: null, predicted: 85 },
  { date: "Mar 7", actual: null, predicted: 88 },
  { date: "Mar 8", actual: null, predicted: 82 },
  { date: "Mar 9", actual: null, predicted: 79 },
  { date: "Mar 10", actual: null, predicted: 76 },
];

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export const dashboardStats = {
  totalComplaints: 248,
  resolvedToday: 12,
  activeAlerts: 7,
  citizensSatisfied: "78%",
  trafficIncidents: 6,
  binsOverflow: 3,
  waterAlerts: 2,
  energySaved: "14%",
};

// ─── AI Chat Responses (mock OpenAI) ────────────────────────────────────────
export const aiChatResponses: Record<string, string> = {
  traffic: "🚦 Current traffic analysis: Downtown Core is experiencing **heavy congestion** (85% density). I recommend taking North Highway as an alternative. The East Bridge is severely congested — avoid if possible. Rush hour today is expected to ease by 8:00 PM.",
  waste: "🗑️ Waste collection update: **3 bins are currently full** (Market Square, Main St & 1st Ave, Riverside Drive). Collection crews have been dispatched. Next scheduled collection for your zone: **Tomorrow, 7:00 AM**.",
  water: "💧 Water supply status: There are **2 active alerts** — a pipe leakage on Elm Street (crew dispatched) and reduced pressure reported in the West Suburb zone. Normal supply expected to resume by tonight.",
  electricity: "⚡ Power grid status: **Grid stability is at 96%**. Minor outages reported on Oak Avenue (3 streetlights out — maintenance scheduled). No major outages in the city. Renewable energy currently supplying **43%** of city demand.",
  weather: "🌤️ City weather update: Today — **Partly Cloudy, 18°C**. Wind: 12 km/h NE. No rain expected. Tomorrow: Partly cloudy, high of 20°C. Weekend forecast: Rain on Saturday with 60% probability.",
  complaint: "📋 To file a complaint, please use the **Complaint System** section. You can report: potholes, streetlights, garbage, water leaks, and more. Your complaint will be AI-categorized and assigned to the relevant department. Average resolution time: **3.2 days**.",
  schedule: "📅 City services schedule for this week:\n- **Garbage Collection**: Mon/Thu (Zone A), Tue/Fri (Zone B)\n- **Street Cleaning**: Wednesday mornings\n- **Recycling Pickup**: Saturdays\n- **Water Maintenance**: Sunday 2–4 AM (low-pressure period)",
  default: "👋 Hello! I'm your **Smart City AI Assistant**. I can help you with:\n- 🚦 Traffic updates and routes\n- 🗑️ Waste collection schedules\n- 💧 Water supply information\n- ⚡ Electricity & power status\n- 🌤️ City weather updates\n- 📋 Filing and tracking complaints\n\nWhat would you like to know today?",
};
