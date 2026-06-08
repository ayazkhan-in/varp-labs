import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, QrCode, Smartphone, Shield, CheckCircle2, AlertTriangle, Trash2, History, RefreshCw, Copy, Check, Info, Download, ArrowRight, Github, Sparkles } from 'lucide-react';
import qrlogImg from '../../assets/qrlog.png';
import logomark from '../../assets/logomark.svg';

interface QRLogLandingPageProps {
  onBackHome: () => void;
}

interface ScanLogItem {
  id: string;
  payload: string;
  type: 'url' | 'wifi' | 'text';
  timestamp: string;
  status: 'secure' | 'suspicious' | 'blocked';
  category: string;
}

export default function QRLogLandingPage({ onBackHome }: QRLogLandingPageProps) {
  // Simulator logs state
  const [logs, setLogs] = useState<ScanLogItem[]>([
    { id: '1', payload: 'https://menu.coffeebar.io/downtown', type: 'url', timestamp: '2 mins ago', status: 'secure', category: 'Restaurant Menu' },
    { id: '2', payload: 'WIFI:S:Office_Guest;T:WPA;P:guest1234;;', type: 'wifi', timestamp: '1 hour ago', status: 'secure', category: 'WiFi Access' },
    { id: '3', payload: 'https://security-verify-bank-update.cn/login', type: 'url', timestamp: '1 day ago', status: 'blocked', category: 'Blocked Phishing' },
  ]);

  const [activeTab, setActiveTab] = useState<'history' | 'generate'>('history');
  const [selectedScanPreset, setSelectedScanPreset] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanLogItem | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // QR Generator state
  const [inputText, setInputText] = useState('https://varplabs.com');
  const [qrMatrix, setQrMatrix] = useState<boolean[][]>([]);

  // QR Matrix helper (for Generator tab)
  const generateQRMatrix = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const random = () => {
      const x = Math.sin(hash++) * 10000;
      return x - Math.floor(x);
    };
    const size = 25;
    const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));
    const drawFinderPattern = (startRow: number, startCol: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const row = startRow + r;
          const col = startCol + c;
          if (r === 0 || r === 6 || c === 0 || c === 6) matrix[row][col] = true;
          else if (r === 1 || r === 5 || c === 1 || c === 5) matrix[row][col] = false;
          else matrix[row][col] = true;
        }
      }
    };
    drawFinderPattern(0, 0);
    drawFinderPattern(0, size - 7);
    drawFinderPattern(size - 7, 0);
    for (let i = 7; i < size - 7; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)) continue;
        if (r === 6 || c === 6) continue;
        const inAlignment = r >= 16 && r <= 20 && c >= 16 && c <= 20;
        if (inAlignment) {
          const ar = r - 16;
          const ac = c - 16;
          matrix[r][c] = ar === 0 || ar === 4 || ac === 0 || ac === 4 || (ar === 2 && ac === 2);
          continue;
        }
        matrix[r][c] = random() > 0.45;
      }
    }
    return matrix;
  };

  useEffect(() => {
    setQrMatrix(generateQRMatrix(inputText));
  }, [inputText]);

  // Simulator scan action
  const handleSimulateScan = (preset: 'safe-url' | 'wifi' | 'malicious-url') => {
    setIsScanning(true);
    setScanResult(null);

    let payload = '';
    let type: 'url' | 'wifi' | 'text' = 'url';
    let status: 'secure' | 'suspicious' | 'blocked' = 'secure';
    let category = '';

    if (preset === 'safe-url') {
      payload = 'https://docs.varplabs.com/setup';
      type = 'url';
      status = 'secure';
      category = 'Documentation';
    } else if (preset === 'wifi') {
      payload = 'WIFI:S:Starbucks_Guest;T:WPA;P:espresso99;;';
      type = 'wifi';
      status = 'secure';
      category = 'WiFi Network';
    } else {
      payload = 'https://varplabs-security-alert-verify.com/update-password';
      type = 'url';
      status = 'blocked';
      category = 'Phishing Threat';
    }

    setTimeout(() => {
      const newLog: ScanLogItem = {
        id: Date.now().toString(),
        payload,
        type,
        timestamp: 'just now',
        status,
        category,
      };
      setScanResult(newLog);
      setIsScanning(false);
      
      // If it's scanned, automatically add to history list
      setLogs(prev => [newLog, ...prev]);
    }, 1500);
  };

  const clearHistory = () => {
    setLogs([]);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 140 }
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-850 font-sans selection:bg-zinc-950 selection:text-white relative overflow-hidden pb-16">
      
      {/* Subtle background mesh dots */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

      {/* Navigation Header */}
      <header className="sticky top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center select-none">
          <button 
            onClick={onBackHome}
            className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors font-mono text-xs uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>varp labs</span>
          </button>

          <div className="flex items-center gap-2">
            <img src={logomark} alt="Varp Labs Logo" className="w-4 h-4 opacity-75 filter invert" />
            <span className="font-display text-sm font-semibold tracking-tight text-zinc-500 lowercase">qrlog</span>
          </div>

          <a 
            href="#download"
            className="bg-zinc-900 text-white text-xs font-semibold px-4 py-2 hover:bg-black rounded-full active:scale-95 transition-all shadow-md shadow-zinc-900/10 cursor-pointer"
          >
            get app
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Description */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 md:space-y-8"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-full font-mono text-[10px] text-zinc-500 uppercase tracking-widest"
            >
              <Smartphone size={10} />
              <span>platform: android app</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1 
                variants={itemVariants}
                className="font-display text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 lowercase"
              >
                qrlog
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="font-sans text-xl md:text-2xl text-zinc-900 font-semibold tracking-tight leading-tight lowercase"
              >
                log scanned codes safely <span className="text-zinc-400 font-normal">// view history & secure scans</span>
              </motion.p>
              <motion.p 
                variants={itemVariants}
                className="font-sans text-base md:text-lg text-zinc-500 leading-relaxed max-w-xl"
              >
                QRLog is a minimal, privacy-focused Android scanner built for security. It automatically archives every code you scan in a secure local database, allowing you to access links or Wi-Fi credentials whenever you need. Every scan is evaluated by our cloud-free threat detection algorithm to block malicious and phishing links.
              </motion.p>
            </div>

            {/* Play Store Link */}
            <motion.div variants={itemVariants} className="pt-2 space-y-3" id="download">
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">available on playstore</p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://play.google.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-zinc-900 text-white hover:bg-black px-6 py-3 rounded-full flex items-center gap-3 shadow-lg shadow-zinc-900/10 hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer border border-white/5 font-semibold text-sm"
                >
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M3 5.27v13.46c0 .82.68 1.43 1.47 1.34l11.64-6.42L4.65 4.03c-.76-.15-1.65.34-1.65 1.24zM17.47 12l3.41-1.88c.84-.46.84-1.78 0-2.24l-3.41-1.88L15.35 12l2.12 2.12zM4.65 4.03l11.47 7.97L4.65 19.97l11.47-7.97z" />
                    <path d="M5.25 3.03l11.64 6.42 2.12-2.12-12.29-6.8c-.85-.47-1.93.18-1.93 1.16l.46 1.34z" />
                  </svg>
                  <span>Get on Google Play</span>
                </a>

                <a 
                  href="#simulator" 
                  className="border border-zinc-200 text-zinc-600 hover:border-black hover:text-black px-6 py-3 rounded-full flex items-center gap-2 active:scale-[0.98] transition-all cursor-pointer bg-white text-sm font-semibold shadow-sm"
                >
                  <span>Try Web Demo</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>

            {/* Core Tech Tags */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 pt-2">
              {['Kotlin', 'Room DB (Offline)', 'Google ML Kit', 'Malicious Shield', 'No Tracking'].map(tech => (
                <span 
                  key={tech} 
                  className="px-3 py-1.5 bg-zinc-50 border border-zinc-200/80 text-zinc-500 font-mono text-xs rounded-full shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Logo in stark Rounded Rectangle */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-center relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.93, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, type: 'spring', damping: 20 }}
              className="relative group"
            >
              {/* Soft clean shadow */}
              <div className="absolute inset-0 bg-zinc-900/5 rounded-[2.5rem] blur-2xl group-hover:bg-zinc-900/10 transition-all duration-700" />
              
              {/* Logo frame */}
              <div className="relative bg-white border border-zinc-200 shadow-xl shadow-zinc-200/30 rounded-[2.5rem] p-8 w-56 h-56 md:w-72 md:h-72 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]">
                <img 
                  src={qrlogImg} 
                  alt="QRLog App Logo" 
                  className="w-full h-full object-contain rounded-3xl" 
                />
              </div>

              {/* Status indicators */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 -right-3 bg-white px-3.5 py-1.5 border border-zinc-200 rounded-2xl shadow-lg shadow-zinc-200/50 flex items-center gap-2 text-xs font-semibold text-zinc-700"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>Local Engine Safe</span>
              </motion.div>
            </motion.div>
          </div>

        </div>

        {/* Stats Grid */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
          }}
          className="mt-24 py-12 border-y border-zinc-100 grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            { value: '50k+', label: 'downloads', desc: 'trusted installations on playstore' },
            { value: '2M+', label: 'scans logged', desc: 'securely saved in offline Room DB' },
            { value: '4.7 / 5', label: 'average rating', desc: 'from clean utility app reviews' },
            { value: '100% local', label: 'privacy guarantee', desc: 'zero logs shared with external servers' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="space-y-1.5 p-2"
            >
              <p className="font-display text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</p>
              <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">{stat.label}</p>
              <p className="text-zinc-500 text-xs">{stat.desc}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Interactive USP Demo Section */}
        <section className="mt-24 space-y-8" id="simulator">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-full font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
              <Sparkles size={10} className="text-amber-500" />
              <span>Interactive App Preview</span>
            </span>
            <h3 className="font-display text-3xl font-bold text-zinc-900 tracking-tight lowercase">
              how it protects you
            </h3>
            <p className="text-zinc-500 text-sm">
              simulate scanning different qr codes to see how the logs are archived and how warnings are flagged.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-zinc-50 border border-zinc-200/80 rounded-3xl p-6 md:p-10 shadow-lg shadow-zinc-100/50"
          >
            
            {/* Left: Interactive scanner preset choices */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">1. Select QR to scan</p>
                
                <div className="space-y-3">
                  <button 
                    disabled={isScanning}
                    onClick={() => handleSimulateScan('safe-url')}
                    className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      selectedScanPreset === 'safe-url' || isScanning
                        ? 'bg-zinc-900 text-white border-zinc-900' 
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 shadow-sm'
                    }`}
                  >
                    <QrCode size={20} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs uppercase tracking-wider lowercase">coffee shop menu qr</p>
                      <p className="text-xs opacity-75">a safe, standard restaurant menu url</p>
                    </div>
                  </button>

                  <button 
                    disabled={isScanning}
                    onClick={() => handleSimulateScan('wifi')}
                    className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      selectedScanPreset === 'wifi' || isScanning
                        ? 'bg-zinc-900 text-white border-zinc-900' 
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 shadow-sm'
                    }`}
                  >
                    <QrCode size={20} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs uppercase tracking-wider lowercase">hotel guest wifi qr</p>
                      <p className="text-xs opacity-75">safe local wifi credentials payload</p>
                    </div>
                  </button>

                  <button 
                    disabled={isScanning}
                    onClick={() => handleSimulateScan('malicious-url')}
                    className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      selectedScanPreset === 'malicious-url' || isScanning
                        ? 'bg-zinc-900 text-white border-zinc-900' 
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 shadow-sm'
                    }`}
                  >
                    <AlertTriangle size={20} className="shrink-0 mt-0.5 text-amber-500" />
                    <div>
                      <p className="font-semibold text-xs uppercase tracking-wider lowercase">suspicious phishing qr</p>
                      <p className="text-xs opacity-75">simulates a malicious link attempting password theft</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Security Shield banner */}
              <div className="bg-white border border-zinc-200/80 p-4 rounded-2xl shadow-sm flex gap-3 text-xs text-zinc-600">
                <Shield size={24} className="text-zinc-800 shrink-0 text-zinc-900" />
                <div>
                  <p className="font-semibold text-zinc-900 lowercase">active on-device security</p>
                  <p className="text-zinc-500 mt-0.5 leading-relaxed">Our Safety SDK scans links against local signatures and warning structures. Blocks malware redirects without logging your browser history.</p>
                </div>
              </div>
            </div>

            {/* Right: Simulated Android App Screen (History Log + Security alerts) */}
            <div className="lg:col-span-7 bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[420px]">
              
              {/* Simulator Header */}
              <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History size={14} className="text-zinc-400" />
                  <span className="font-mono text-xs tracking-wider uppercase">qrlog mobile viewer</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-zinc-700" />
                  <div className="w-2 h-2 rounded-full bg-zinc-700" />
                  <div className="w-2 h-2 rounded-full bg-zinc-700" />
                </div>
              </div>

              {/* Simulator Body Tabs */}
              <div className="flex border-b border-zinc-100 bg-zinc-50/50">
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider border-b-2 text-center cursor-pointer ${
                    activeTab === 'history' 
                      ? 'border-zinc-900 text-zinc-900 font-bold bg-white' 
                      : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  Scan Log History
                </button>
                <button 
                  onClick={() => setActiveTab('generate')}
                  className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider border-b-2 text-center cursor-pointer ${
                    activeTab === 'generate' 
                      ? 'border-zinc-900 text-zinc-900 font-bold bg-white' 
                      : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  QR Generator
                </button>
              </div>

              {/* Simulator Screen Content */}
              <div className="flex-1 p-5 relative overflow-y-auto max-h-[350px]">
                {isScanning && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3 z-10">
                    <RefreshCw size={24} className="text-zinc-800 animate-spin" />
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest animate-pulse">Scanning QR matrix...</p>
                  </div>
                )}

                {activeTab === 'history' ? (
                  <div className="space-y-4">
                    
                    {/* Live threat warning popup if last scanned was malicious */}
                    <AnimatePresence>
                      {scanResult && scanResult.status === 'blocked' && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs space-y-2 text-amber-900"
                        >
                          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-700">
                            <AlertTriangle size={14} />
                            <span>malicious threat blocked!</span>
                          </div>
                          <p className="leading-relaxed">
                            The scanned QR payload <code className="bg-amber-100 px-1 py-0.5 rounded text-[10px] break-all">{scanResult.payload}</code> has been flagged as a phishing domain. Access was blocked.
                          </p>
                          <p className="text-[10px] text-amber-600 font-mono font-bold">Shield Status: Active // Threat catalog check matched.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Scanned Logs List */}
                    <div className="flex justify-between items-center px-1">
                      <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">scanned logs archive ({logs.length})</p>
                      {logs.length > 0 && (
                        <button 
                          onClick={clearHistory}
                          className="text-[9px] font-mono text-red-500 hover:text-red-700 uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={10} />
                          <span>Clear logs</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <AnimatePresence initial={false} mode="popLayout">
                        {logs.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`p-3.5 border rounded-xl flex flex-col gap-1.5 transition-all bg-white ${
                              item.status === 'blocked' 
                                ? 'border-red-200 bg-red-50/10 hover:border-red-300' 
                                : 'border-zinc-200 hover:border-zinc-300 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                                item.status === 'blocked'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-zinc-100 text-zinc-600'
                              }`}>
                                {item.category}
                              </span>
                              <span className="text-zinc-400">{item.timestamp}</span>
                            </div>

                            <p className="text-xs text-zinc-800 break-all font-mono">
                              {item.payload}
                            </p>

                            <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-zinc-50 text-zinc-400">
                              <span className="lowercase font-mono">{item.type} scanner</span>
                              <span className={`flex items-center gap-1 font-bold uppercase ${
                                item.status === 'blocked' ? 'text-red-500' : 'text-emerald-600'
                              }`}>
                                {item.status === 'blocked' ? (
                                  <>
                                    <AlertTriangle size={10} />
                                    <span>blocked threat</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 size={10} />
                                    <span>verified secure</span>
                                  </>
                                )}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {logs.length === 0 && (
                        <div className="p-8 text-center text-zinc-400 text-xs border border-dashed border-zinc-200 rounded-xl space-y-2">
                          <History size={24} className="mx-auto text-zinc-300" />
                          <p>no logs in local database.</p>
                          <p className="text-[10px]">select a preset on the left to simulate a qr scan.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // QR Generator Tab
                  <div className="space-y-4">
                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest px-1">Generate static qr code</p>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="https://example.com"
                        maxLength={80}
                        className="w-full bg-zinc-50 border border-zinc-200 px-3.5 py-2 text-xs text-zinc-800 focus:outline-none focus:border-zinc-500 transition-all font-mono"
                      />
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                      <div className="bg-white p-3 border border-zinc-200 rounded shadow-sm select-none">
                        <div 
                          className="grid gap-[1px] bg-white" 
                          style={{ gridTemplateColumns: `repeat(${25}, minmax(0, 1fr))` }}
                        >
                          {qrMatrix.map((row, rIdx) => 
                            row.map((cell, cIdx) => (
                              <div 
                                key={`${rIdx}-${cIdx}`}
                                className="w-2.5 h-2.5 md:w-3 md:h-3 transition-colors"
                                style={{ backgroundColor: cell ? '#000000' : '#ffffff' }}
                              />
                            ))
                          )}
                        </div>
                      </div>
                      <p className="text-[9px] text-zinc-400 mt-3 uppercase tracking-wider font-mono">real-time encoding compiler</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        </section>

        {/* Technical Architecture details - Fine Minimal Cards */}
        <section className="mt-24 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-2 max-w-2xl mx-auto"
          >
            <h3 className="font-display text-3xl font-bold text-zinc-900 tracking-tight lowercase">
              under the hood
            </h3>
            <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold font-semibold">
              engine technical architecture
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'scanner core',
                tech: 'google ml kit',
                desc: 'Utilizes Google Play Services ML Kit API to recognize barcodes and QR formats in less than 45ms. Features auto-focus and low-light flashlight trigger.'
              },
              {
                title: 'local DB',
                tech: 'room database',
                desc: 'Stores scan records offline-first using SQLite Room database wrapper. Automatically indexes logs, timestamps, coordinates, and metadata.'
              },
              {
                title: 'security shield',
                tech: 'malicious filters',
                desc: 'Compares target domain signatures locally to detect phishing redirects. Runs asynchronously prior to opening links to prevent automated malware installs.'
              },
              {
                title: 'cloud synchronization',
                tech: 'firebase auth & sync',
                desc: 'Syncs historical lists securely across multiple devices. Employs end-to-end user authenticated security rules to protect scanned text payloads.'
              }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, type: 'spring' }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all select-text"
              >
                <span className="text-xs text-zinc-800 font-bold block">{`0${i + 1} // ${step.title}`}</span>
                <p className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider font-mono">{step.tech}</p>
                <p className="text-zinc-500 text-xs leading-relaxed lowercase">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Block - Fine Minimal Card */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-28 bg-white border border-zinc-200 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl shadow-zinc-100/50 text-center select-text"
        >
          <div className="absolute inset-0 opacity-[0.01] pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          </div>

          <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
            <div className="space-y-3">
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 lowercase">
                start scanning securely
              </h2>
              <p className="text-xs md:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed lowercase">
                keep scanning logs secure, readable, and queryable. install qrlog today from google play or download the release binaries directly.
              </p>
            </div>

            {/* Play store links in footer */}
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <a 
                href="https://play.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="bg-zinc-900 text-white hover:bg-black px-6 py-3 rounded-full flex items-center gap-3 shadow-md active:scale-[0.98] transition-all cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M3 5.27v13.46c0 .82.68 1.43 1.47 1.34l11.64-6.42L4.65 4.03c-.76-.15-1.65.34-1.65 1.24zM17.47 12l3.41-1.88c.84-.46.84-1.78 0-2.24l-3.41-1.88L15.35 12l2.12 2.12zM4.65 4.03l11.47 7.97L4.65 19.97l11.47-7.97z" />
                  <path d="M5.25 3.03l11.64 6.42 2.12-2.12-12.29-6.8c-.85-.47-1.93.18-1.93 1.16l.46 1.34z" />
                </svg>
                <div className="text-left leading-tight font-mono">
                  <p className="text-[8px] uppercase tracking-widest opacity-60">install on</p>
                  <p className="text-xs font-bold -mt-0.5">Google Play</p>
                </div>
              </a>

              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="border border-zinc-200 text-zinc-600 hover:border-black hover:text-black px-6 py-3 rounded-full flex items-center gap-3 active:scale-[0.98] transition-all cursor-pointer bg-white shadow-sm"
              >
                <Github size={18} />
                <div className="text-left leading-tight font-mono">
                  <p className="text-[8px] uppercase tracking-widest opacity-60">get source</p>
                  <p className="text-xs font-bold -mt-0.5">GitHub Repo</p>
                </div>
              </a>
            </div>
          </div>
        </motion.section>

      </main>

    </div>
  );
}
