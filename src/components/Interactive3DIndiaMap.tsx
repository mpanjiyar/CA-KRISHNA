import React, { useState, useRef, useEffect } from 'react';
import { 
  INDIA_STATES_DATA, 
  OUR_OFFICES, 
  StateGeoData, 
  OfficeLocation 
} from '../data/indiaMapData';
import { 
  Building2, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink, 
  X, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  CheckCircle2, 
  Navigation,
  Compass
} from 'lucide-react';
import { WhatsAppOfficialIcon } from './FloatingContactPanel';

interface Interactive3DIndiaMapProps {
  onOpenConsultation?: (regionName?: string) => void;
  selectedZone?: string;
  onSelectZone?: (zone: 'West' | 'North' | 'South' | 'East' | 'Central' | 'Northeast') => void;
}

export const Interactive3DIndiaMap: React.FC<Interactive3DIndiaMapProps> = ({
  onOpenConsultation,
  selectedZone = 'West',
  onSelectZone
}) => {
  // 3D Isometric / Perspective State
  const [pitch, setPitch] = useState(24); // deg (X axis rotation)
  const [yaw, setYaw] = useState(-14);   // deg (Z/Y axis rotation)
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startPitch: number; startYaw: number }>({
    x: 0,
    y: 0,
    startPitch: 24,
    startYaw: -14
  });

  // State selection & Hover
  const [hoveredState, setHoveredState] = useState<StateGeoData | null>(null);
  const [selectedState, setSelectedState] = useState<StateGeoData | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Office Marker Selection
  const [selectedOffice, setSelectedOffice] = useState<OfficeLocation | null>(OUR_OFFICES[0]); // Default to Mumbai HO

  // Touch and pointer interactions for 3D rotation
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag when primary click and not clicking directly on controls
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPitch: pitch,
      startYaw: yaw
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }

    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    // Smoothly update camera angles with safe clamping
    const newYaw = Math.max(-35, Math.min(15, dragStartRef.current.startYaw + deltaX * 0.15));
    const newPitch = Math.max(8, Math.min(45, dragStartRef.current.startPitch - deltaY * 0.15));

    setYaw(newYaw);
    setPitch(newPitch);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const resetCamera = () => {
    setPitch(24);
    setYaw(-14);
    setScale(1);
  };

  // Zoom handlers
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.18, 1.6));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.18, 0.75));

  // Determine state zone styling
  const getStateColor = (state: StateGeoData) => {
    const isSelected = selectedState?.id === state.id;
    const isHovered = hoveredState?.id === state.id;
    const isZoneActive = state.zone === selectedZone;

    if (isSelected || isHovered) {
      return {
        fill: '#F28C18',
        stroke: '#FFFFFF',
        strokeWidth: 2.2,
        extrusionColor: '#B86507'
      };
    }

    if (state.hasOffice) {
      return {
        fill: '#0E5FA6',
        stroke: '#F28C18',
        strokeWidth: 1.8,
        extrusionColor: '#073A6B'
      };
    }

    if (isZoneActive) {
      return {
        fill: '#0969C7',
        stroke: '#84B8EB',
        strokeWidth: 1.2,
        extrusionColor: '#053E77'
      };
    }

    return {
      fill: '#082F63',
      stroke: '#1A4D8C',
      strokeWidth: 0.8,
      extrusionColor: '#041B3D'
    };
  };

  return (
    <div 
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative w-full rounded-2xl bg-gradient-to-b from-[#02142E] via-[#041E44] to-[#010D20] border border-[#0969C7]/30 shadow-2xl overflow-hidden select-none touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{ minHeight: '620px', height: '100%' }}
    >
      {/* 3D Atmospheric Grid Plane */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(9, 105, 199, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(9, 105, 199, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: `perspective(900px) rotateX(${pitch}deg) rotateZ(${yaw}deg) scale(1.4)`,
          transformOrigin: '50% 60%'
        }}
      />

      {/* Floating 3D Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0969C7]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Map Action HUD Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        {/* Left Badge: 3D Mode & Active Zone */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#062A5A]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-[#159447] animate-ping" />
          <span className="text-[11px] font-bold text-white tracking-wide uppercase font-manrope">
            Interactive 3D Map
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">&middot;</span>
          <span className="text-[11px] text-[#F28C18] font-semibold hidden sm:inline">
            Drag to Rotate &bull; Click to Explore
          </span>
        </div>

        {/* Right Camera Controls (Reset, ZoomIn, ZoomOut) */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#062A5A]/90 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-lg">
          <button
            type="button"
            onClick={resetCamera}
            title="Reset 3D Camera"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-xs flex items-center gap-1 font-medium"
          >
            <RotateCcw size={14} className="text-[#F28C18]" />
            <span className="hidden md:inline text-[11px]">Reset View</span>
          </button>
          <div className="w-px h-4 bg-white/20" />
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <ZoomIn size={14} />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <ZoomOut size={14} />
          </button>
        </div>
      </div>

      {/* 3D MAP CANVAS STAGE */}
      <div 
        className="w-full h-full flex items-center justify-center p-2 sm:p-6"
        style={{
          perspective: '1100px',
          perspectiveOrigin: '50% 45%'
        }}
      >
        <div
          className="transition-transform duration-100 ease-out will-change-transform flex items-center justify-center"
          style={{
            transform: `rotateX(${pitch}deg) rotateZ(${yaw}deg) scale(${scale})`,
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 50%'
          }}
        >
          {/* Main 3D Extruded Map SVG */}
          <svg
            viewBox="0 0 820 920"
            className="w-[340px] xs:w-[390px] sm:w-[520px] md:w-[620px] lg:w-[680px] h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.65)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Depth shadow drop gradient */}
              <filter id="map3DShadow" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#010A1A" floodOpacity="0.8" />
              </filter>

              {/* Glowing office pulse animation filter */}
              <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* LAYER 1: Realistic 3D Extrusion Slabs (Lower extruded base layer) */}
            <g id="extrusion-depth-layer" opacity="0.95">
              {INDIA_STATES_DATA.map((state) => {
                const colors = getStateColor(state);
                return (
                  <path
                    key={`extrusion-${state.id}`}
                    d={state.path}
                    fill={colors.extrusionColor}
                    stroke="#020E21"
                    strokeWidth="1.5"
                    transform="translate(0, 14)"
                  />
                );
              })}
            </g>

            {/* LAYER 2: Middle Extrusion Intermediate Stepping */}
            <g id="extrusion-mid-layer" opacity="0.75">
              {INDIA_STATES_DATA.map((state) => {
                const colors = getStateColor(state);
                return (
                  <path
                    key={`mid-${state.id}`}
                    d={state.path}
                    fill={colors.extrusionColor}
                    transform="translate(0, 7)"
                  />
                );
              })}
            </g>

            {/* LAYER 3: Top Plate (Interactive States & Boundaries) */}
            <g id="states-top-plate">
              {INDIA_STATES_DATA.map((state) => {
                const colors = getStateColor(state);
                const isSelected = selectedState?.id === state.id;
                const isHovered = hoveredState?.id === state.id;

                return (
                  <g
                    key={state.id}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredState(state)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedState(state);
                      if (onSelectZone) onSelectZone(state.zone);
                    }}
                  >
                    {/* Top Surface Polygon */}
                    <path
                      d={state.path}
                      fill={colors.fill}
                      stroke={colors.stroke}
                      strokeWidth={colors.strokeWidth}
                      strokeLinejoin="round"
                      className="transition-colors duration-150"
                    />

                    {/* Subtle Top Inner Highlight */}
                    {(isSelected || isHovered) && (
                      <path
                        d={state.path}
                        fill="#FFFFFF"
                        fillOpacity="0.15"
                        stroke="#FFE7B8"
                        strokeWidth="2.5"
                      />
                    )}
                  </g>
                );
              })}
            </g>

            {/* LAYER 4: State Labels (Dynamically legible, non-overlapping) */}
            <g id="state-labels" className="pointer-events-none select-none">
              {INDIA_STATES_DATA.map((state) => {
                // Show prominent states directly, others on hover or zoom
                const isKeyLabel = [
                  'MH', 'DL', 'KA', 'TN', 'WB', 'GJ', 'AS', 'RJ', 'UP', 'TS', 'KL', 'BR'
                ].includes(state.id);

                if (!isKeyLabel && scale < 1.1 && hoveredState?.id !== state.id) return null;

                const isHovered = hoveredState?.id === state.id;
                const isSelected = selectedState?.id === state.id;

                return (
                  <text
                    key={`label-${state.id}`}
                    x={state.center[0]}
                    y={state.center[1]}
                    textAnchor="middle"
                    fill={isHovered || isSelected ? '#FFFFFF' : '#C2D8F2'}
                    fontSize={isHovered ? '13' : '10'}
                    fontWeight={isHovered || isSelected ? '700' : '600'}
                    fontFamily="system-ui, -apple-system, sans-serif"
                    className="drop-shadow-md"
                  >
                    {state.name}
                  </text>
                );
              })}
            </g>

            {/* LAYER 5: Inter-Office Digital Rays Radiating from Mumbai HO */}
            <g id="network-rays" className="pointer-events-none">
              {/* Mumbai -> Guwahati Desk */}
              <path
                d="M 240,520 Q 450,420 670,390"
                stroke="#F28C18"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.75"
              />
              {/* Mumbai -> Delhi Liaison Desk */}
              <path
                d="M 240,520 Q 270,390 320,310"
                stroke="#0969C7"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.75"
              />
            </g>

            {/* LAYER 6: 3D "OUR OFFICE" Location Markers with Pulsing Waves */}
            <g id="office-markers">
              {OUR_OFFICES.map((office) => {
                const [ox, oy] = office.coords;
                const isOfficeSelected = selectedOffice?.id === office.id;
                const isHO = office.type === 'Headquarter';

                return (
                  <g
                    key={office.id}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOffice(office);
                    }}
                  >
                    {/* Pulsing Ground Halo Wave 1 */}
                    <circle
                      cx={ox}
                      cy={oy}
                      r={isOfficeSelected ? '22' : '16'}
                      fill="none"
                      stroke={isHO ? '#F28C18' : '#159447'}
                      strokeWidth="1.8"
                      className="animate-ping opacity-60 origin-center"
                      style={{ transformOrigin: `${ox}px ${oy}px`, animationDuration: '2.5s' }}
                    />

                    {/* Secondary Expanding Ground Ring */}
                    <circle
                      cx={ox}
                      cy={oy}
                      r={isOfficeSelected ? '14' : '10'}
                      fill={isHO ? '#F28C18' : '#159447'}
                      fillOpacity="0.25"
                      stroke={isHO ? '#F28C18' : '#159447'}
                      strokeWidth="1.2"
                    />

                    {/* 3D Vertical Marker Pillar Line */}
                    <line
                      x1={ox}
                      y1={oy}
                      x2={ox}
                      y2={oy - 26}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    {/* Floating 3D Pin Beacon */}
                    <g transform={`translate(${ox}, ${oy - 28})`} filter="url(#pinGlow)">
                      {/* Hexagonal / Circular Head */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isHO ? '10' : '8.5'}
                        fill={isHO ? '#F28C18' : '#159447'}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="transition-transform group-hover:scale-125"
                      />

                      {/* Small Center Core */}
                      <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                    </g>

                    {/* Floating Office Badge Label */}
                    <g transform={`translate(${ox}, ${oy - 46})`}>
                      <rect
                        x="-48"
                        y="-12"
                        width="96"
                        height="20"
                        rx="10"
                        fill="#062A5A"
                        stroke={isHO ? '#F28C18' : '#159447'}
                        strokeWidth="1.5"
                        className="shadow-xl"
                      />
                      <text
                        x="0"
                        y="1"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="8.5"
                        fontWeight="700"
                        fontFamily="sans-serif"
                      >
                        {office.city} ({isHO ? 'HQ' : 'Desk'})
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Floating State Info Tooltip on Hover */}
      {hoveredState && !selectedOffice && (
        <div
          className="pointer-events-none absolute z-40 bg-[#062A5A]/95 text-white p-3 rounded-xl shadow-2xl border border-[#0969C7]/50 backdrop-blur-md max-w-[240px] animate-in fade-in zoom-in-95 duration-100"
          style={{
            left: `${Math.min(Math.max(mousePos.x + 12, 16), 560)}px`,
            top: `${Math.min(Math.max(mousePos.y - 60, 20), 480)}px`
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-1.5">
            <span className="font-bold text-xs text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F28C18]" />
              {hoveredState.name}
            </span>
            <span className="text-[9.5px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
              {hoveredState.type}
            </span>
          </div>
          <p className="text-[10px] text-slate-300 mb-1.5 font-light">
            Capital: <span className="text-white font-medium">{hoveredState.capital}</span> &bull; {hoveredState.zone} India
          </p>
          <div className="space-y-0.5 text-[9.5px] text-[#A8D3FF]">
            {hoveredState.highlightServices.slice(0, 2).map((srv, i) => (
              <div key={i} className="truncate flex items-center gap-1">
                <span className="text-[#F28C18]">&rsaquo;</span> {srv}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Office Details Card Modal / Drawer */}
      {selectedOffice && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:left-4 sm:max-w-md z-40 bg-[#062A5A]/95 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl shadow-2xl text-left text-white animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/15">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#F28C18] flex items-center gap-1">
                <Building2 size={12} />
                {selectedOffice.type}
              </span>
              <h4 className="font-manrope font-bold text-sm sm:text-base text-white mt-0.5">
                {selectedOffice.name}
              </h4>
              <p className="text-[11px] text-slate-300">
                {selectedOffice.city}, {selectedOffice.state}
              </p>
            </div>
            <button
              onClick={() => setSelectedOffice(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close office card"
            >
              <X size={16} />
            </button>
          </div>

          {/* Address */}
          <p className="text-xs text-slate-200 leading-relaxed mb-3 font-light">
            {selectedOffice.address}
          </p>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3.5">
            <a
              href={`tel:${selectedOffice.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium"
            >
              <Phone size={13} className="text-[#F28C18] shrink-0" />
              <span className="truncate">{selectedOffice.phone}</span>
            </a>
            <a
              href={`mailto:${selectedOffice.email}`}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium"
            >
              <Mail size={13} className="text-[#0969C7] shrink-0" />
              <span className="truncate">{selectedOffice.email}</span>
            </a>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-300 mb-3.5">
            <Clock size={12} className="text-[#159447] shrink-0" />
            <span>{selectedOffice.timing}</span>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <a
              href={`https://wa.me/${selectedOffice.whatsapp}?text=${encodeURIComponent(
                `Hello, I would like to consult with your ${selectedOffice.city} office.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold shadow-xs"
            >
              <WhatsAppOfficialIcon className="w-3.5 h-3.5 text-white" />
              <span>WhatsApp</span>
            </a>

            <a
              href={selectedOffice.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold"
            >
              <Navigation size={13} className="text-[#F28C18]" />
              <span>Get Directions</span>
            </a>

            {onOpenConsultation && (
              <button
                onClick={() => {
                  onOpenConsultation(`${selectedOffice.city} Office Direct Consultation`);
                  setSelectedOffice(null);
                }}
                className="inline-flex items-center justify-center py-2 px-3 rounded-xl bg-[#0969C7] hover:bg-[#0756a3] text-white text-xs font-semibold"
              >
                <Sparkles size={13} className="text-[#F28C18]" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Hint Indicator */}
      <div className="absolute bottom-2.5 right-3 pointer-events-none hidden sm:flex items-center gap-1.5 text-[10.5px] text-slate-400 bg-[#062A5A]/80 px-2.5 py-1 rounded-lg border border-white/10">
        <Compass size={12} className="text-[#F28C18]" />
        <span>3D Orbit View: {Math.round(pitch)}&deg; Pitch / {Math.round(yaw)}&deg; Yaw</span>
      </div>
    </div>
  );
};
