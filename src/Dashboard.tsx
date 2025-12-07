import React, { useState, useEffect } from 'react';
import { Shield, Lock, CheckCircle2, AlertCircle, Activity, ExternalLink, Loader2, X, Smartphone, Monitor, RotateCcw, Info, DollarSign, TrendingUp, HelpCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const narrativeSequence = [
    { message: "Connecting to Media.net Exchange...", type: 'info' as const, reveal: null },
    { message: "Verifying Illinois State License DB... [Match]", type: 'success' as const, reveal: null },
    { message: "Analyzing joesplumbing.com intent...", type: 'info' as const, reveal: null },
    { message: "Blocking KW: 'DIY'...", type: 'warning' as const, reveal: null },
    { message: "Blocking KW: 'Salary'...", type: 'warning' as const, reveal: null },
    { message: "Blocking KW: 'Internship'...", type: 'warning' as const, reveal: 'filter' },
    { message: "Geolocating Zip Code 60614...", type: 'success' as const, reveal: 'adPreview' },
    { message: "Cross-referencing Publisher Whitelist...", type: 'info' as const, reveal: 'publishers' },
    { message: "READY FOR ACTIVATION.", type: 'success' as const, reveal: 'metrics' },
  ];

  const [logs, setLogs] = useState<Array<{ id: number; message: string; type: 'success' | 'warning' | 'info' }>>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleCards, setVisibleCards] = useState<{
    filter: boolean;
    publishers: boolean;
    adPreview: boolean;
    metrics: boolean;
  }>({
    filter: false,
    publishers: false,
    adPreview: false,
    metrics: false,
  });

  // Interactive state
  const allKeywords = ['DIY', 'Free', 'Intern', 'Trainee', 'Salary'];
  const [activeKeywords, setActiveKeywords] = useState<string[]>(allKeywords);
  const [publishers, setPublishers] = useState([
    { name: 'CNN Weather (Local)', verified: true, enabled: true, reach: 2500000 },
    { name: 'BobVila.com / Home', verified: true, enabled: true, reach: 1800000 },
    { name: 'Yahoo! Real Estate', verified: true, enabled: true, reach: 3200000 },
    { name: 'Architectural Digest', verified: true, enabled: true, reach: 2100000 },
    { name: 'SF Gate (Home Section)', verified: true, enabled: true, reach: 2900000 },
  ]);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isActivating, setIsActivating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [dailyBudget, setDailyBudget] = useState(500);
  const [tempBudget, setTempBudget] = useState(500);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (currentStep < narrativeSequence.length) {
      const timer = setTimeout(() => {
        const currentNarrative = narrativeSequence[currentStep];
        setLogs(prev => [...prev, { ...currentNarrative, id: currentStep }]);
        
        if (currentNarrative.reveal) {
          setVisibleCards(prev => ({
            ...prev,
            [currentNarrative.reveal as string]: true,
          }));
        }
        
        setCurrentStep(currentStep + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const toggleKeyword = (keyword: string) => {
    setActiveKeywords(prev => {
      if (prev.includes(keyword)) {
        return prev.filter(kw => kw !== keyword);
      } else {
        return [...prev, keyword];
      }
    });
    setHasUnsavedChanges(true);
  };

  const togglePublisher = (publisherName: string) => {
    setPublishers(prev => prev.map(pub => 
      pub.name === publisherName ? { ...pub, enabled: !pub.enabled } : pub
    ));
    setHasUnsavedChanges(true);
  };

  const getTotalReach = () => {
    return publishers
      .filter(pub => pub.enabled)
      .reduce((sum, pub) => sum + pub.reach, 0);
  };

  const getWasteInventory = () => {
    return (2419 - (allKeywords.length - activeKeywords.length) * 380).toLocaleString();
  };

  const getEstimatedClicks = () => {
    const baseClicks = 85;
    const publisherFactor = publishers.filter(p => p.enabled).length / publishers.length;
    const budgetFactor = dailyBudget / 500;
    return Math.round(baseClicks * publisherFactor * budgetFactor);
  };

  const getEstimatedCost = () => {
    const enabledPublishers = publishers.filter(p => p.enabled).length;
    const baseMultiplier = enabledPublishers / publishers.length;
    return Math.round(dailyBudget * baseMultiplier);
  };

  const getRecommendedBudget = () => {
    const enabledPublishers = publishers.filter(p => p.enabled).length;
    return Math.max(200, enabledPublishers * 100);
  };

  const handleBudgetUpdate = () => {
    setDailyBudget(tempBudget);
    setShowBudgetModal(false);
    setHasUnsavedChanges(true);
  };

  const handleActivateCampaign = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      setShowSuccessModal(true);
      setHasUnsavedChanges(false);
    }, 2000);
  };

  const isInitializing = currentStep < narrativeSequence.length;
  const recommendedBudget = getRecommendedBudget();

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-lg w-full mx-4 animate-scaleIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Daily Budget Configuration</h3>
              <button onClick={() => setShowBudgetModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-gray-600">
                  Based on {publishers.filter(p => p.enabled).length} active publishers, we recommend <span className="font-bold text-blue-600">${recommendedBudget}/day</span>
                </p>
              </div>
            </div>

            {/* Interactive Semi-circle gauge */}
            <div className="relative h-56 mb-2">
              <svg 
                viewBox="0 0 240 140" 
                className="w-full h-full cursor-pointer touch-none select-none"
                onPointerDown={(e) => {
                  const svg = e.currentTarget;
                  const rect = svg.getBoundingClientRect();
                  
                  const handleMove = (moveEvent: PointerEvent) => {
                    const x = moveEvent.clientX - rect.left;
                    const y = moveEvent.clientY - rect.top;
                    
                    // Convert to SVG coordinates
                    const svgX = (x / rect.width) * 240;
                    const svgY = (y / rect.height) * 140;
                    
                    // Calculate angle from center (120, 110)
                    const centerX = 120;
                    const centerY = 110;
                    const dx = svgX - centerX;
                    const dy = centerY - svgY;
                    let angle = Math.atan2(dy, dx);
                    
                    // Normalize angle to 0-π range (right to left semicircle)
                    if (angle < 0) angle = 0;
                    if (angle > Math.PI) angle = Math.PI;
                    
                    // Convert angle to budget (0 to π maps to $100 to $1000)
                    const percentage = 1 - (angle / Math.PI);
                    // Linear mapping from 100 to 1000
                    const newBudget = Math.round(100 + percentage * 900);
                    setTempBudget(Math.min(1000, Math.max(100, newBudget)));
                  };

                  handleMove(e as any); // Trigger once immediately
                  
                  svg.setPointerCapture(e.pointerId);
                  svg.addEventListener('pointermove', handleMove);
                  svg.addEventListener('pointerup', () => {
                    svg.removeEventListener('pointermove', handleMove);
                    svg.releasePointerCapture(e.pointerId);
                  }, { once: true });
                }}
              >
                {/* Defs for gradients/shadows */}
                <defs>
                  <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                  <filter id="knobShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                  </filter>
                </defs>

                {/* Track Background - Thinner and lighter */}
                <path
                  d="M 30 110 A 90 90 0 0 1 210 110"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="12"
                  strokeLinecap="round"
                />

                {/* Recommended Range Marker - Subtle segment on track */}
                {(() => {
                   const recBudget = recommendedBudget;
                   const startB = Math.max(100, recBudget - 50);
                   const endB = Math.min(1000, recBudget + 50);
                   const startPct = (startB - 100) / 900;
                   const endPct = (endB - 100) / 900;
                   
                   const startAngle = (1 - startPct) * Math.PI;
                   const endAngle = (1 - endPct) * Math.PI;
                   
                   const x1 = 120 + Math.cos(startAngle) * 90;
                   const y1 = 110 - Math.sin(startAngle) * 90;
                   const x2 = 120 + Math.cos(endAngle) * 90;
                   const y2 = 110 - Math.sin(endAngle) * 90;
                   
                   return (
                     <path
                       d={`M ${x1} ${y1} A 90 90 0 0 0 ${x2} ${y2}`}
                       fill="none"
                       stroke="#d1fae5"
                       strokeWidth="12"
                       strokeLinecap="butt"
                     />
                   );
                })()}
                
                {/* Active Progress Path */}
                <path
                  d="M 30 110 A 90 90 0 0 1 210 110"
                  fill="none"
                  stroke="url(#trackGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(Math.min(Math.max(tempBudget - 100, 0) / 900, 1)) * 282.7} 282.7`}
                  className="transition-all duration-75 ease-out"
                />

                {/* Refined Tick Marks - Small Dots */}
                {[0, 0.25, 0.5, 0.75, 1].map(pct => {
                   const angle = (1 - pct) * Math.PI;
                   // Position dots slightly inside the track
                   const x = 120 + Math.cos(angle) * 78;
                   const y = 110 - Math.sin(angle) * 78;
                   return (
                     <circle key={pct} cx={x} cy={y} r="1.5" fill="#cbd5e1" />
                   );
                })}

                {/* Recommended Triangle Indicator (Outside Track) */}
                {(() => {
                  const recPercentage = Math.min(Math.max(recommendedBudget - 100, 0) / 900, 1);
                  const recAngle = (1 - recPercentage) * Math.PI;
                  // Position just outside track
                  const tipX = 120 + Math.cos(recAngle) * 108;
                  const tipY = 110 - Math.sin(recAngle) * 108;
                  
                  return (
                    <g className="transition-all duration-300 ease-out">
                      <path 
                        d={`M ${tipX} ${tipY} l -3.5 -5 l 7 0 z`} 
                        fill="#10b981" 
                        transform={`rotate(${(1 - recPercentage) * 180 + 90} ${tipX} ${tipY})`}
                      />
                    </g>
                  );
                })()}
                
                {/* Draggable Knob - Sleeker */}
                {(() => {
                  const percentage = Math.min(Math.max(tempBudget - 100, 0) / 900, 1);
                  const angle = (1 - percentage) * Math.PI;
                  const handleX = 120 + Math.cos(angle) * 90;
                  const handleY = 110 - Math.sin(angle) * 90;
                  return (
                    <g style={{ filter: 'url(#knobShadow)' }}>
                      <circle
                        cx={handleX}
                        cy={handleY}
                        r="10"
                        fill="white"
                        className="cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
                      />
                      <circle
                        cx={handleX}
                        cy={handleY}
                        r="3"
                        fill="#3b82f6"
                      />
                    </g>
                  );
                })()}
                
                {/* Labels - Clean & Minimal */}
                <text x="20" y="115" fontSize="10" fill="#94a3b8" textAnchor="end" fontWeight="500">$100</text>
                <text x="220" y="115" fontSize="10" fill="#94a3b8" textAnchor="start" fontWeight="500">$1,000</text>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: '30px' }}>
                <div className="text-4xl font-mono font-bold text-slate-900 tracking-tighter">${tempBudget}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Daily Cap</div>
              </div>
              
              <div className="text-center mt-[-10px]">
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-full border border-emerald-100/50 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Rec: ${recommendedBudget}</span>
                </div>
              </div>
            </div>

            {/* Manual input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Or enter precise amount:</label>
              <div className="relative group">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={tempBudget === 0 ? '' : tempBudget}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setTempBudget(0);
                    } else {
                      const num = parseInt(val.replace(/[^0-9]/g, ''));
                      if (!isNaN(num)) {
                        setTempBudget(num);
                      }
                    }
                  }}
                  onBlur={() => {
                    const clamped = Math.min(10000, Math.max(100, tempBudget));
                    setTempBudget(clamped);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-xl transition-all shadow-sm"
                  placeholder="Enter amount..."
                />
              </div>
              <div className="flex justify-between items-center mt-2 px-1">
                 <p className="text-xs text-gray-400">Min: $100</p>
                 <p className="text-xs text-gray-400">Max: $10,000</p>
              </div>
            </div>

            {/* Performance estimate */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">Estimated Performance</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-600">Daily Clicks</div>
                  <div className="font-mono font-bold text-blue-600">{Math.round((tempBudget / 500) * 85)}</div>
                </div>
                <div>
                  <div className="text-gray-600">Est. Leads</div>
                  <div className="font-mono font-bold text-blue-600">{Math.round((tempBudget / 500) * 12)}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBudgetModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBudgetUpdate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Apply Budget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-scaleIn">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <Shield className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Defense Grid Active</h3>
              <p className="text-gray-600 text-center mb-2">Campaign has been validated and queued for deployment.</p>
              <div className="bg-gray-50 rounded-lg p-3 w-full mb-4">
                <div className="text-xs text-gray-500 mb-1">Campaign Summary:</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Budget:</span>
                    <span className="font-mono font-bold">${dailyBudget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Filters:</span>
                    <span className="font-mono font-bold">{activeKeywords.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Publishers:</span>
                    <span className="font-mono font-bold">{publishers.filter(p => p.enabled).length}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to payment...</span>
              </div>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <div className="w-80 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">TradeTrust</h1>
              <p className="text-xs text-slate-400">Campaign Manager</p>
            </div>
          </div>
          {hasUnsavedChanges && (
            <div className="mt-3 flex items-center gap-2 text-xs text-yellow-400 bg-yellow-400 bg-opacity-10 px-2 py-1 rounded">
              <AlertCircle className="w-3 h-3" />
              <span>Unsaved changes</span>
            </div>
          )}
        </div>

        {/* System Activity */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">System Activity</h3>
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  log.type === 'success' ? 'bg-green-400' : 
                  log.type === 'warning' ? 'bg-yellow-400' : 
                  'bg-blue-400'
                }`} />
                <p className="text-slate-300 leading-snug text-xs">{log.message}</p>
              </div>
            ))}
            {isInitializing && (
              <div className="flex items-center gap-2 text-blue-400 text-xs">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Processing...</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400">
            <p>Last updated: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-0.5">Forensic Strategy Audit</h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <Activity className="w-3.5 h-3.5" />
                  <span className="text-sm">joesplumbing-chicago.com</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs text-green-700 font-medium">LICENSE VERIFIED</div>
                  <div className="text-xs font-mono font-bold text-green-900">#IL-50552</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="max-w-7xl mx-auto space-y-3">
              {/* Loading State */}
              {!visibleCards.filter && !visibleCards.publishers && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Initializing Forensics Module...</h3>
                  <p className="text-sm text-gray-500">Scanning campaign parameters and validating strategy</p>
                </div>
              )}

              {/* Top Row - Two Cards */}
              {(visibleCards.filter || visibleCards.publishers) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {/* Negative Keywords Card */}
                  {visibleCards.filter && (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 animate-fadeIn">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <Lock className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">Content Filter</h3>
                            <p className="text-xs text-gray-500">Click to toggle filters</p>
                          </div>
                        </div>
                        <div className="group relative">
                          <Info className="w-4 h-4 text-gray-400 cursor-help" />
                          <div className="absolute right-0 top-6 w-48 bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Block low-quality traffic by filtering out these search terms
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2 min-h-[60px]">
                        {allKeywords.map((kw) => {
                          const isActive = activeKeywords.includes(kw);
                          return (
                            <button
                              key={kw}
                              onClick={() => toggleKeyword(kw)}
                              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-all group ${
                                isActive
                                  ? 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'
                                  : 'bg-gray-100 border border-gray-200 text-gray-400 hover:bg-gray-200'
                              }`}
                            >
                              <span className={`text-xs font-medium ${isActive ? 'line-through' : ''}`}>{kw}</span>
                              {isActive ? (
                                <X className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                              ) : (
                                <RotateCcw className="w-3 h-3" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Waste Inventory Detected</span>
                          <span className="font-mono font-bold text-red-600">{getWasteInventory()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Publisher Safe List Card */}
                  {visibleCards.publishers && (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 animate-fadeIn">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">Verified Publishers</h3>
                            <p className="text-xs text-gray-500">Premium financial sites</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Est. Reach</div>
                          <div className="text-sm font-mono font-bold text-blue-600">
                            {(getTotalReach() / 1000000).toFixed(1)}M
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {publishers.map((pub) => (
                          <button
                            key={pub.name}
                            onClick={() => togglePublisher(pub.name)}
                            className={`w-full flex items-center justify-between py-1 px-1.5 rounded hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-all ${
                              pub.enabled ? 'opacity-100' : 'opacity-40'
                            }`}
                          >
                            <span className="text-[10px] font-medium text-gray-700 truncate max-w-[120px] text-left">{pub.name}</span>
                            <div className="flex items-center gap-1">
                              <span className={`text-[10px] font-medium ${pub.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                                {pub.enabled ? 'Active' : 'Paused'}
                              </span>
                              {pub.enabled ? (
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                              ) : (
                                <div className="w-3 h-3 border border-gray-300 rounded-full" />
                              )}
                            </div>
                          </button>
                        ))}
                        <button className="w-full mt-1 py-1 border border-dashed border-gray-300 rounded text-[10px] text-gray-400 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-1">
                          <span className="text-xs font-light leading-none">+</span> Add Competitor / URL
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Ad Preview Card */}
              {visibleCards.adPreview && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 animate-fadeIn">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Ad Preview</h3>
                      <p className="text-xs text-gray-500">How your ad appears</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setPreviewMode('desktop')}
                          className={`px-2 py-1 rounded flex items-center gap-1 text-xs font-medium transition-colors ${
                            previewMode === 'desktop' 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Monitor className="w-3 h-3" />
                          Desktop
                        </button>
                        <button
                          onClick={() => setPreviewMode('mobile')}
                          className={`px-2 py-1 rounded flex items-center gap-1 text-xs font-medium transition-colors ${
                            previewMode === 'mobile' 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Smartphone className="w-3 h-3" />
                          Mobile
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        LIVE
                      </div>
                    </div>
                  </div>

                  <div className={`mx-auto transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-sm' : 'max-w-3xl'}`}>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex gap-3">
                        <div className={`relative overflow-hidden rounded-md flex-shrink-0 transition-all ${
                          previewMode === 'mobile' ? 'w-16 h-16' : 'w-20 h-20'
                        }`}>
                          <img 
                            src="https://images.unsplash.com/photo-1581094794329-cd119277f838?auto=format&fit=crop&q=80&w=200" 
                            alt="Contractor" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-gray-900 mb-1 leading-tight ${
                            previewMode === 'mobile' ? 'text-sm' : 'text-base'
                          }`}>
                            Emergency Plumbing - 24/7 Licensed Pros
                          </h4>
                          <p className={`text-gray-700 mb-2 leading-snug ${
                            previewMode === 'mobile' ? 'text-xs' : 'text-xs'
                          }`}>
                            Verified Bonded & Insured. Don't risk DIY failures. Serving Zip 60614.
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Sponsored</span>
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Campaign Metrics Card */}
              {visibleCards.metrics && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 animate-fadeIn">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Projected Value Forecast</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => {
                        setTempBudget(dailyBudget);
                        setShowBudgetModal(true);
                      }}
                      className="relative text-center p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors group flex flex-col justify-center"
                    >
                      <div className="absolute top-1 right-1 text-[10px] font-medium text-blue-600 flex items-center gap-0.5 bg-white/50 px-1 rounded hover:bg-white transition-colors">
                        Adjust ⚙️
                      </div>
                      <div className="text-xl font-mono font-bold text-blue-600 mt-1">${dailyBudget}</div>
                      <div className="text-xs text-gray-600 mt-0.5 flex items-center justify-center gap-1">
                        Daily Budget
                      </div>
                    </button>
                    <div className="text-center p-2 bg-green-50 border border-green-100 rounded-lg shadow-sm flex flex-col justify-center">
                      <div className="text-2xl font-bold text-green-700 leading-none">
                        {Math.floor(dailyBudget / 60)}-{Math.ceil(dailyBudget / 40)} Claims
                      </div>
                      <div className="text-xs font-bold text-green-800 mt-1 flex items-center justify-center gap-1 group relative cursor-help">
                        Est. Verified Jobs
                        <HelpCircle className="w-3 h-3 text-green-600" />
                        <div className="absolute bottom-full mb-2 w-40 bg-slate-900 text-white text-[10px] p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 font-normal">
                          Filtering clicks lacking GPS verification.
                        </div>
                      </div>
                      <div className="text-[10px] text-green-600 flex items-center justify-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        via Phone/GPS
                      </div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg flex flex-col justify-center">
                      <div className="text-xl font-mono font-bold text-red-600">{getWasteInventory()}</div>
                      <div className="text-xs text-gray-600 mt-0.5">Junk Traffic Blocked</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg flex flex-col justify-center">
                      <div className="text-lg font-bold text-gray-900 leading-tight">{publishers.filter(p => p.enabled).length} Premium Sites</div>
                      <div className="text-xs text-gray-600 mt-0.5">Trust Network</div>
                    </div>
                  </div>
                  
                  {/* Performance indicators */}
                  <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xs text-gray-500">Est. High-Intent Visitors</div>
                      <div className="text-sm font-mono font-bold text-blue-600">{getEstimatedClicks()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Avg. Cost Per Job</div>
                      <div className="text-sm font-mono font-bold text-green-600">
                        ~${Math.round(dailyBudget / ((Math.floor(dailyBudget / 50) + Math.ceil(dailyBudget / 40)) / 2))}.00
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Est. Spend</div>
                      <div className="text-sm font-mono font-bold text-gray-900">${getEstimatedCost()}/day</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        {visibleCards.metrics && (
          <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0 shadow-lg animate-fadeIn">
            <div className="max-w-7xl mx-auto">
              <button 
                onClick={handleActivateCampaign}
                disabled={isActivating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-base py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3"
              >
                {isActivating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Campaign...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Activate Campaign
                    <span className="font-mono bg-blue-700 px-2 py-0.5 rounded text-sm">${dailyBudget}/DAY</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
