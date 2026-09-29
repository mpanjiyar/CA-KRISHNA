import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Info, 
  Search,
  ExternalLink,
  Layers,
  Compass
} from 'lucide-react';
import { ALL_INDIAN_STATES_DATA } from '../data/allIndianStates';
import { MAP_OFFICES_AND_HUBS, MapLocationMarker, StateGeoInfo } from '../data/indiaMapData';
import { FIRM_DETAILS } from '../data/firmData';

interface InteractiveIndiaMapProps {
  onOpenConsultation?: (locationTitle?: string) => void;
}

export const InteractiveIndiaMap: React.FC<InteractiveIndiaMapProps> = ({ onOpenConsultation }) => {
  // State selection and hover states
  const [selectedState, setSelectedState] = useState<StateGeoInfo>(
    ALL_INDIAN_STATES_DATA.find(s => s.id === 'MH') || ALL_INDIAN_STATES_DATA[0]
  );
  const [hoveredState, setHoveredState] = useState<StateGeoInfo | null>(null);

  // Marker selection and hover states
  const [selectedMarker, setSelectedMarker] = useState<MapLocationMarker | null>(
    MAP_OFFICES_AND_HUBS.find(m => m.id === 'mumbai-ho') || null
  );
  const [hoveredMarker, setHoveredMarker] = useState<MapLocationMarker | null>(null);

  // Filter mode: 'all' | 'offices' | 'services'
  const [markerFilter, setMarkerFilter] = useState<'all' | 'offices' | 'services'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Find office in the selected state if exists
  const officesInSelectedState = MAP_OFFICES_AND_HUBS.filter(
    m => m.stateId === selectedState.id
  );

  // Filtered markers based on toggle
  const visibleMarkers = MAP_OFFICES_AND_HUBS.filter(marker => {
    if (markerFilter === 'offices') return marker.type === 'head-office' || marker.type === 'branch-office';
    if (markerFilter === 'services') return marker.type === 'service-hub';
    return true;
  });

  // Handle clicking on a state path
  const handleStateClick = (state: StateGeoInfo) => {
    setSelectedState(state);
    const relatedMarker = MAP_OFFICES_AND_HUBS.find(m => m.stateId === state.id);
    if (relatedMarker) {
      setSelectedMarker(relatedMarker);
    } else {
      setSelectedMarker(null);
    }
  };

  // Handle clicking on an office pin
  const handleMarkerClick = (marker: MapLocationMarker, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMarker(marker);
    const relatedState = ALL_INDIAN_STATES_DATA.find(s => s.id === marker.stateId);
    if (relatedState) setSelectedState(relatedState);
  };

  // Search filter list
  const filteredStatesList = ALL_INDIAN_STATES_DATA.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section 
      id="pan-india-section" 
      className="w-full bg-[#031C3D] text-white py-12 sm:py-16 lg:py-24 border-b border-[#062A5A] relative overflow-hidden scroll-mt-24 sm:scroll-mt-28 select-none"
    >
      {/* 1. Subtle Cartographic Network Background Lines */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#FFFFFF 1.5px, transparent 1.5px)`,
          backgroundSize: '36px 36px'
        }}
      />
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#0969C7]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-[#F28C18]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 2. Section Header: "Our Presence Across India" */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2.5 sm:mb-3">
            <span className="w-5 h-[2px] bg-[#F28C18]" />
            <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#F28C18]">
              Nationwide Chartered Accountancy Network
            </span>
            <span className="w-5 h-[2px] bg-[#F28C18]" />
          </div>

          <h2 className="font-manrope text-[24px] xs:text-[28px] sm:text-[36px] lg:text-[42px] font-bold text-white tracking-tight leading-tight mb-3">
            Our Presence Across India
          </h2>

          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed font-light">
            Explore our offices and dedicated service locations across all 28 Indian States and 8 Union Territories. Click or tap any state or marker to view regional services and direct partner support.
          </p>

          {/* Interactive Mode & Legend Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F28C18] animate-pulse" />
              <span className="font-semibold text-white">Physical Office</span>
              <span className="text-slate-400">&middot; Mumbai HQ</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#159447]" />
              <span className="font-semibold text-white">Liaison / Service Hub</span>
              <span className="text-slate-400">&middot; Delhi, Bengaluru, etc.</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0969C7]" />
              <span className="font-semibold text-white">Active Digital Coverage</span>
              <span className="text-slate-400">&middot; All 36 States &amp; UTs</span>
            </div>
          </div>
        </div>

        {/* 3. Main Interactive Grid: Interactive India SVG Map (Left/Center) + Smart Info Panel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: The Interactive India Vector Map Card (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            <div className="w-full bg-gradient-to-b from-[#062A5A] to-[#042045] rounded-3xl p-3 xs:p-4 sm:p-6 border border-[#0969C7]/30 shadow-2xl relative overflow-hidden">
              
              {/* Filter controls toolbar on top of map */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 sm:mb-4 pb-3 border-b border-white/10 text-xs">
                {/* Marker display filters */}
                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                  <button
                    onClick={() => setMarkerFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      markerFilter === 'all' ? 'bg-[#0969C7] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    All Pins
                  </button>
                  <button
                    onClick={() => setMarkerFilter('offices')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      markerFilter === 'offices' ? 'bg-[#F28C18] text-[#062A5A] font-bold shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Offices Only
                  </button>
                  <button
                    onClick={() => setMarkerFilter('services')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      markerFilter === 'services' ? 'bg-[#159447] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Service Hubs
                  </button>
                </div>

                {/* State hover breadcrumb */}
                <div className="flex items-center gap-1.5 text-slate-300 text-xs truncate">
                  <Compass size={13} className="text-[#F28C18] shrink-0" />
                  <span className="text-slate-400">Viewing:</span>
                  <span className="font-semibold text-white truncate">
                    {hoveredState ? hoveredState.name : selectedState.name}
                  </span>
                </div>
              </div>

              {/* The Master India SVG Canvas */}
              <div className="relative w-full aspect-[1/1.1] max-h-[640px] flex items-center justify-center">
                
                <svg
                  viewBox="0 0 1000 1100"
                  className="w-full h-full drop-shadow-2xl overflow-visible"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Interactive Map of India showing States, Union Territories and Offices"
                >
                  <defs>
                    {/* Glowing drop shadow for highlighted state */}
                    <filter id="stateGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#F28C18" floodOpacity="0.6" />
                    </filter>
                    <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#0B3C7B" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#031C3D" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Ocean / Subcontinent Background Aura */}
                  <ellipse cx="500" cy="580" rx="460" ry="460" fill="url(#oceanGlow)" />

                  {/* 1. All 28 Indian States & 8 UT Polygons */}
                  <g id="indian-states" className="transition-all duration-200">
                    {ALL_INDIAN_STATES_DATA.map((state) => {
                      const isSelected = selectedState.id === state.id;
                      const isHovered = hoveredState?.id === state.id;
                      const hasOffice = state.hasPhysicalOffice;

                      // Fill color logic
                      let fillColor = '#0D386D'; // Default slate navy
                      if (hasOffice) fillColor = '#104A91'; // Slightly brighter for states with offices
                      if (isHovered) fillColor = '#1D68C4'; // Active blue hover
                      if (isSelected) fillColor = '#F28C18'; // Highlighted selected state

                      // Stroke styling
                      let strokeColor = '#2563EB';
                      let strokeWidth = 1.2;
                      if (isHovered) {
                        strokeColor = '#FFFFFF';
                        strokeWidth = 2.5;
                      }
                      if (isSelected) {
                        strokeColor = '#FFFFFF';
                        strokeWidth = 3;
                      }

                      return (
                        <path
                          key={state.id}
                          id={`state-${state.id}`}
                          d={state.path}
                          fill={fillColor}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeLinejoin="round"
                          className="cursor-pointer transition-all duration-200 hover:brightness-110 focus:outline-none"
                          filter={isSelected ? 'url(#stateGlow)' : undefined}
                          onMouseEnter={() => setHoveredState(state)}
                          onMouseLeave={() => setHoveredState(null)}
                          onClick={() => handleStateClick(state)}
                          role="button"
                          tabIndex={0}
                          aria-label={`${state.name} (${state.type === 'state' ? 'State' : 'Union Territory'})`}
                        />
                      );
                    })}
                  </g>

                  {/* 2. State Identification Code Labels */}
                  <g id="state-labels" className="pointer-events-none select-none">
                    {ALL_INDIAN_STATES_DATA.map((state) => {
                      const isSelected = selectedState.id === state.id;
                      return (
                        <text
                          key={`label-${state.id}`}
                          x={state.center.x}
                          y={state.center.y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={isSelected ? 16 : 12.5}
                          fontWeight={isSelected ? 'bold' : '600'}
                          fill={isSelected ? '#062A5A' : '#E2E8F0'}
                          fontFamily="sans-serif"
                          className="transition-all duration-150 drop-shadow-sm"
                        >
                          {state.id}
                        </text>
                      );
                    })}
                  </g>

                  {/* 3. Inter-Hub Digital Network Connection Rays radiating from Mumbai HQ */}
                  <g id="network-lines" className="pointer-events-none opacity-40">
                    {MAP_OFFICES_AND_HUBS.filter(m => m.id !== 'mumbai-ho').map((hub) => (
                      <path
                        key={`line-${hub.id}`}
                        d={`M 285,640 Q ${(285 + hub.coordinates.x) / 2},${(640 + hub.coordinates.y) / 2 - 20} ${hub.coordinates.x},${hub.coordinates.y}`}
                        stroke="#F28C18"
                        strokeWidth="1.6"
                        strokeDasharray="4 5"
                        fill="none"
                      />
                    ))}
                  </g>

                  {/* 4. Animated Interactive Office Pins & Markers */}
                  <g id="office-markers">
                    {visibleMarkers.map((marker) => {
                      const isHQ = marker.type === 'head-office';
                      const isBranch = marker.type === 'branch-office';
                      const isMarkerSelected = selectedMarker?.id === marker.id;
                      const isMarkerHovered = hoveredMarker?.id === marker.id;

                      const markerColor = isHQ ? '#F28C18' : isBranch ? '#38BDF8' : '#159447';
                      const markerRadius = isHQ ? 13 : isBranch ? 10 : 8.5;

                      return (
                        <g
                          key={marker.id}
                          transform={`translate(${marker.coordinates.x}, ${marker.coordinates.y})`}
                          className="cursor-pointer transition-transform duration-200"
                          onMouseEnter={() => setHoveredMarker(marker)}
                          onMouseLeave={() => setHoveredMarker(null)}
                          onClick={(e) => handleMarkerClick(marker, e)}
                        >
                          {/* Pulsing Ripple Aura Ring */}
                          <circle
                            r={markerRadius * 2.2}
                            fill={markerColor}
                            opacity={isMarkerSelected ? 0.45 : 0.25}
                            className="animate-ping"
                            style={{ animationDuration: isHQ ? '2.4s' : '3.2s' }}
                          />

                          {/* Outer White Highlight Ring */}
                          <circle
                            r={markerRadius + 3}
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth={isMarkerSelected || isMarkerHovered ? 3 : 2}
                          />

                          {/* Central Solid Pin */}
                          <circle
                            r={markerRadius}
                            fill={markerColor}
                            className="drop-shadow-lg transition-transform hover:scale-125"
                          />

                          {/* Inner Icon / Star / Core Dot */}
                          {isHQ ? (
                            <text
                              x="0"
                              y="1"
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill="#062A5A"
                              fontSize="11"
                              fontWeight="900"
                            >
                              ★
                            </text>
                          ) : (
                            <circle r={3} fill="#FFFFFF" />
                          )}

                          {/* Floating Marker City Label Badge */}
                          <g transform="translate(0, -22)" className="pointer-events-none">
                            <rect
                              x={-marker.city.length * 4.2 - 8}
                              y="-10"
                              width={marker.city.length * 8.4 + 16}
                              height="20"
                              rx="6"
                              fill="#062A5A"
                              stroke={isMarkerSelected ? '#F28C18' : '#0969C7'}
                              strokeWidth="1.2"
                              opacity={0.95}
                            />
                            <text
                              x="0"
                              y="0"
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill="#FFFFFF"
                              fontSize="10.5"
                              fontWeight="bold"
                              fontFamily="sans-serif"
                            >
                              {marker.city}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </g>
                </svg>

                {/* On-Map Quick Hover Tooltip Box */}
                {(hoveredState || hoveredMarker) && (
                  <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-[#062A5A]/95 backdrop-blur-md p-3 rounded-xl border border-[#F28C18]/60 shadow-xl pointer-events-none animate-in fade-in zoom-in-95 duration-150 z-30">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold text-[#F28C18] tracking-wider">
                        {hoveredMarker ? 'Location Node' : hoveredState?.type === 'state' ? 'Indian State' : 'Union Territory'}
                      </span>
                      <span className="text-[10px] text-slate-300 font-mono">
                        {hoveredMarker ? hoveredMarker.state : hoveredState?.capital}
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm">
                      {hoveredMarker ? hoveredMarker.name : hoveredState?.name}
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">
                      {hoveredMarker ? hoveredMarker.highlight : `Coverage: ${hoveredState?.servicesAvailable.slice(0, 2).join(', ')}`}
                    </p>
                  </div>
                )}

              </div>

              {/* Bottom Instructions / Mobile Tap Note */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Info size={13} className="text-[#F28C18] shrink-0" />
                  <span>Tap any state or marker pin to inspect live CA coverage details</span>
                </span>
                <span className="hidden sm:inline-block text-[#159447] font-semibold">
                  28 States &middot; 8 Union Territories
                </span>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: State & Office Detailed Information Panel (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-4 text-left">
            
            {/* Quick State Search & Switcher */}
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex items-center gap-2">
              <Search size={15} className="text-slate-400 shrink-0 ml-1" />
              <input
                type="text"
                placeholder="Search state, capital, or zone (e.g. Maharashtra, Jaipur)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white text-xs w-full focus:outline-none placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5"
                >
                  Clear
                </button>
              )}
            </div>

            {/* If search query entered, show quick selection chips */}
            {searchQuery && (
              <div className="flex flex-wrap gap-1.5 p-2.5 bg-white/5 rounded-xl border border-white/10 max-h-32 overflow-y-auto">
                {filteredStatesList.slice(0, 8).map(st => (
                  <button
                    key={st.id}
                    onClick={() => {
                      handleStateClick(st);
                      setSearchQuery('');
                    }}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedState.id === st.id ? 'bg-[#F28C18] text-[#062A5A] font-bold' : 'bg-white/10 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    {st.name} ({st.id})
                  </button>
                ))}
              </div>
            )}

            {/* Primary Details Card for Selected Location */}
            <div className="bg-white/5 rounded-3xl p-5 sm:p-7 border border-white/15 shadow-xl relative overflow-hidden">
              
              {/* Corner Watermark */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0969C7]/10 rounded-bl-full pointer-events-none" />

              {/* Header: State / Location Title */}
              <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] xs:text-[11px] font-bold uppercase tracking-wider text-[#F28C18] bg-[#F28C18]/10 px-2 py-0.5 rounded">
                      {selectedState.zone} Zone &middot; {selectedState.type === 'state' ? 'State' : 'Union Territory'}
                    </span>
                    {selectedState.hasPhysicalOffice && (
                      <span className="text-[10px] xs:text-[11px] font-bold uppercase tracking-wider text-[#159447] bg-[#159447]/15 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 size={11} /> Office Verified
                      </span>
                    )}
                  </div>

                  <h3 className="font-manrope font-bold text-xl sm:text-2xl text-white">
                    {selectedState.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Capital: <strong className="text-white">{selectedState.capital}</strong> &middot; Client Reach: <span className="text-[#38BDF8] font-medium">{selectedState.activeClientsCount}</span>
                  </p>
                </div>

                <div className="w-11 h-11 rounded-2xl bg-[#062A5A] border border-[#0969C7] flex items-center justify-center font-brand font-bold text-base text-[#F28C18] shrink-0 shadow-sm">
                  {selectedState.id}
                </div>
              </div>

              {/* Physical Office / Hub Card (if exists in this state) */}
              {officesInSelectedState.length > 0 ? (
                <div className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#062A5A] to-[#0a356e] border border-[#F28C18]/50 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] xs:text-[11px] font-bold text-[#F28C18] uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 size={13} />
                      {officesInSelectedState[0].type === 'head-office' ? 'Primary Office (Headquarter)' : 'Regional Liaison Desk'}
                    </span>
                    <span className="text-[10px] bg-[#159447] text-white px-2 py-0.5 rounded font-semibold">
                      Direct Partner Desk
                    </span>
                  </div>

                  <h4 className="font-bold text-sm sm:text-base text-white mb-1">
                    {officesInSelectedState[0].name}
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed font-light mb-2.5">
                    {officesInSelectedState[0].address}
                  </p>

                  <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-[#F28C18] shrink-0" />
                      <a href={`tel:${officesInSelectedState[0].contact}`} className="hover:text-white font-medium">
                        {officesInSelectedState[0].contact}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-[#38BDF8] shrink-0" />
                      <a href={`mailto:${officesInSelectedState[0].email}`} className="hover:text-white truncate">
                        {officesInSelectedState[0].email}
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* No physical office message banner */
                <div className="mb-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                  <ShieldCheck size={18} className="text-[#159447] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-white block">
                      Active Digital Service Coverage in {selectedState.name}
                    </span>
                    <span className="text-slate-300 mt-0.5 block leading-relaxed font-light">
                      Physical filings and online scrutiny defense handled seamlessly via our centralized Mumbai partner desk. Contact us for priority assistance.
                    </span>
                  </div>
                </div>
              )}

              {/* Key Sector Focus in This State */}
              <div className="mb-4">
                <span className="text-[11px] xs:text-xs font-semibold text-slate-300 uppercase tracking-wide block mb-1.5">
                  Prominent Commercial Sectors Served:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedState.keyIndustries.map((ind, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-medium border border-white/5"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Available Statutory & Tax Services in this State */}
              <div className="mb-5">
                <span className="text-[11px] xs:text-xs font-semibold text-slate-300 uppercase tracking-wide block mb-2">
                  Specialized Solutions for {selectedState.name}:
                </span>
                <div className="space-y-1.5">
                  {selectedState.servicesAvailable.map((srv, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 bg-white/5 px-2.5 py-1.5 rounded-lg">
                      <CheckCircle2 size={13} className="text-[#159447] shrink-0" />
                      <span className="truncate">{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Consult for this State */}
              <div className="pt-3.5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <span className="text-[10px] xs:text-[11px] text-slate-400 font-light">
                  Direct CA Krishna Panjiyar Advisory
                </span>

                <button
                  onClick={() => onOpenConsultation?.(`${selectedState.name} Business Consultation`)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0969C7] hover:bg-[#0756a3] active:scale-[0.98] text-white text-xs font-bold transition-all shadow-md min-h-[42px]"
                >
                  <Sparkles size={14} className="text-[#F28C18]" />
                  <span>Consult for {selectedState.name}</span>
                  <ArrowRight size={13} />
                </button>
              </div>

            </div>

            {/* Quick Office Hub Carousel / Shortcut List */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Fast Location Jump:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {MAP_OFFICES_AND_HUBS.map(hub => (
                  <button
                    key={hub.id}
                    onClick={() => {
                      setSelectedMarker(hub);
                      const targetState = ALL_INDIAN_STATES_DATA.find(s => s.id === hub.stateId);
                      if (targetState) setSelectedState(targetState);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      selectedMarker?.id === hub.id 
                        ? 'bg-[#F28C18] text-[#062A5A] font-bold shadow-xs' 
                        : 'bg-white/10 text-slate-200 hover:bg-white/15'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${hub.type === 'head-office' ? 'bg-[#F28C18]' : 'bg-[#159447]'}`} />
                    <span>{hub.city}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
