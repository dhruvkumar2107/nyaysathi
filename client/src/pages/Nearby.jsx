import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import toast from "react-hot-toast";

// FIX LEAFLET ICONS MISSING
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const policeIcon = L.divIcon({
  html: '<div class="text-2xl">🚓</div>',
  className: 'bg-transparent',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const courtIcon = L.divIcon({
  html: '<div class="text-2xl">⚖️</div>',
  className: 'bg-transparent',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const lawyerIcon = L.divIcon({
  html: '<div class="text-2xl">👨‍⚖️</div>',
  className: 'bg-transparent',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Helper to randomize location around a center
const getRandomLocation = (lat, lon, radiusKm = 5) => {
  const y0 = lat;
  const x0 = lon;
  const rd = radiusKm / 111.3; // 1 degree lat ~ 111.3km

  const u = Math.random();
  const v = Math.random();

  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  const newLat = y + y0;
  const newLon = x / Math.cos(y0) + x0;

  return { lat: newLat, lon: newLon };
};

// Component to fly map to new center
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13);
    }
  }, [center, map]);
  return null;
}

export default function Nearby() {
  const [userLocation, setUserLocation] = useState(null); // [lat, lon]
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ police: [], courts: [], lawyers: [] });
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get User Location on Mount
  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        generateMockData(latitude, longitude);
        setLoading(false);
        toast.success("Location found!");
      },
      (error) => {
        console.error(error);
        toast.error("Unable to retrieve your location. Using default.");
        // Default to Mumbai
        const defLat = 19.0760;
        const defLon = 72.8777;
        setUserLocation([defLat, defLon]);
        generateMockData(defLat, defLon);
        setLoading(false);
      }
    );
  }, []);

  const generateMockData = (lat, lon) => {
    const police = Array(4).fill(0).map((_, i) => ({
      id: `p-${i}`,
      name: `Police Station ${i + 1}`,
      address: `${(i + 1.2).toFixed(1)} km away`,
      ...getRandomLocation(lat, lon, 3),
      rating: (3.5 + Math.random() * 1.5).toFixed(1)
    }));

    const courts = Array(2).fill(0).map((_, i) => ({
      id: `c-${i}`,
      name: `District Court ${i + 1}`,
      address: `${(i + 2.5).toFixed(1)} km away`,
      ...getRandomLocation(lat, lon, 5),
      rating: (4.0 + Math.random() * 1.0).toFixed(1)
    }));

    const lawyers = Array(6).fill(0).map((_, i) => ({
      id: `l-${i}`,
      name: `Adv. Name ${i + 1}`,
      specialization: i % 2 === 0 ? "Criminal Law" : "Civil Law",
      plan: i === 0 ? "diamond" : i < 3 ? "gold" : "silver",
      address: `${(i + 0.5).toFixed(1)} km away`,
      ...getRandomLocation(lat, lon, 2),
      rating: (4.2 + Math.random() * 0.8).toFixed(1),
      image: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${30 + i}.jpg`
    }));

    setData({ police, courts, lawyers });
  };

  const categories = [
    { id: "all", label: "All Services", icon: "🗺️" },
    { id: "police", label: "Police", icon: "🚓" },
    { id: "courts", label: "Courts", icon: "⚖️" },
    { id: "lawyers", label: "Lawyers", icon: "👨‍⚖️" },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Acquiring Satellite Lock...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-72px)] bg-slate-50 overflow-hidden relative">

      {/* LEFT SIDEBAR - LISTINGS */}
      <aside className="w-full md:w-[400px] lg:w-[450px] bg-white border-r border-slate-200 flex flex-col z-20 shadow-xl h-full absolute md:relative transform transition-transform duration-300 md:translate-x-0">

        {/* HEADER & SEARCH */}
        <div className="p-6 border-b border-slate-100 bg-white z-10 sticky top-0">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Nearby Support</h1>
          <p className="text-sm text-slate-500 mb-4">Finding help near your location</p>

          <div className="relative">
            <input
              type="text"
              placeholder="Search location..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
            />
            <span className="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedCategory === cat.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth">
          {(selectedCategory === 'all' || selectedCategory === 'police') && (
            <Section title="Police Stations">
              {data.police.map((p) => <PlaceCard key={p.id} data={p} type="police" />)}
            </Section>
          )}

          {(selectedCategory === 'all' || selectedCategory === 'courts') && (
            <Section title="Courts">
              {data.courts.map((c) => <PlaceCard key={c.id} data={c} type="court" />)}
            </Section>
          )}

          {(selectedCategory === 'all' || selectedCategory === 'lawyers') && (
            <Section title="Verified Lawyers">
              {data.lawyers.map((l) => <LawyerCard key={l.id} data={l} />)}
            </Section>
          )}
        </div>
      </aside>

      {/* RIGHT MAIN - REAL MAP */}
      <main className="flex-1 relative z-10 w-full h-full">
        {userLocation && (
          <MapContainer center={userLocation} zoom={13} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={userLocation} />

            {/* USER LOCATION MARKER */}
            <Marker position={userLocation}>
              <Popup>You are here 📍</Popup>
            </Marker>

            {/* DATA MARKERS */}
            {(selectedCategory === 'all' || selectedCategory === 'police') && data.police.map(p => (
              <Marker key={p.id} position={[p.lat, p.lon]} icon={policeIcon}>
                <Popup><b>{p.name}</b><br />{p.address}</Popup>
              </Marker>
            ))}

            {(selectedCategory === 'all' || selectedCategory === 'courts') && data.courts.map(c => (
              <Marker key={c.id} position={[c.lat, c.lon]} icon={courtIcon}>
                <Popup><b>{c.name}</b><br />{c.address}</Popup>
              </Marker>
            ))}

            {(selectedCategory === 'all' || selectedCategory === 'lawyers') && data.lawyers.map(l => (
              <Marker key={l.id} position={[l.lat, l.lon]} icon={lawyerIcon}>
                <Popup>
                  <div className="text-center">
                    <img src={l.image} className="w-10 h-10 rounded-full mx-auto mb-1" />
                    <b>{l.name}</b><br />
                    {l.specialization}
                  </div>
                </Popup>
              </Marker>
            ))}

          </MapContainer>
        )}

        {/* FLOATING RECENTER BUTTON */}
        <div className="absolute bottom-8 right-8 z-[1000]">
          <button
            onClick={() => {
              navigator.geolocation.getCurrentPosition(pos => {
                setUserLocation([pos.coords.latitude, pos.coords.longitude]);
                toast.success("Recentered!");
              })
            }}
            className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl hover:bg-slate-800 transition transform hover:-translate-y-1 flex items-center gap-2"
          >
            <span>🎯</span> My Location
          </button>
        </div>
        {/* FLOATING ZOOM BUTTONS (Custom) */}
        <div className="absolute bottom-24 right-8 z-[1000] flex flex-col gap-2">
          {/* Leaflet has default zoom controls, so we rely on them or could add custom ones here */}
        </div>
      </main>
    </div >
  );
}

/* -----------------------------------------
   COMPONENTS
----------------------------------------- */
function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function PlaceCard({ data, type }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer group">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${type === 'police' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
            {type === 'police' ? '🚓' : '⚖️'}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition">{data.name}</h4>
            <p className="text-xs text-slate-500 mt-1">{data.address}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-bold">Open Now</span>
              <span className="text-[10px] text-slate-400">• {data.rating} ⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LawyerCard({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-400 transition cursor-pointer group relative overflow-hidden">
      {data.plan === 'diamond' && <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-indigo-500 w-16 h-16 transform rotate-45 translate-x-8 -translate-y-8 z-0"></div>}

      <div className="flex gap-4 relative z-10">
        <img src={data.image} alt={data.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-sm" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition">{data.name}</h4>
            {data.plan !== 'silver' && (
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${data.plan === 'diamond' ? 'bg-purple-100 text-purple-700' : 'bg-amber-50 text-amber-700'
                }`}>
                {data.plan}
              </span>
            )}
          </div>
          <p className="text-sm text-blue-600 font-medium">{data.specialization}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs text-slate-500 flex items-center gap-1">📍 {data.address}</span>
            <span className="text-xs font-bold text-amber-500 flex items-center gap-1">⭐ {data.rating}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
        <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition">View Profile</button>
        <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition">Message</button>
      </div>
    </div>
  );
}
