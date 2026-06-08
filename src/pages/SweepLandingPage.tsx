import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trash2, Smartphone, Shield, Sparkles, CheckCircle2, RefreshCw, Star, Info, Zap, Download } from 'lucide-react';
import sweepImg from '../../assets/sweep.png';
import logomark from '../../assets/logomark.svg';

interface SweepLandingPageProps {
  onBackHome: () => void;
}

interface ScreenshotItem {
  id: string;
  category: string;
  sizeMB: number;
  count: number;
  selected: boolean;
}

export default function SweepLandingPage({ onBackHome }: SweepLandingPageProps) {
  // Simulator State
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>([
    { id: '1', category: 'duplicate photos', sizeMB: 420, count: 145, selected: true },
    { id: '2', category: 'blurry landscapes', sizeMB: 280, count: 98, selected: true },
    { id: '3', category: 'old receipts & documents', sizeMB: 650, count: 210, selected: true },
    { id: '4', category: 'accidental pocket shots', sizeMB: 150, count: 62, selected: false },
    { id: '5', category: 'app cache & memes', sizeMB: 940, count: 320, selected: false },
  ]);

  const [storageUsed, setStorageUsed] = useState(58.4); // GB used out of 64GB
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepCompleted, setSweepCompleted] = useState(false);
  const [freedSpace, setFreedSpace] = useState(0);

  const toggleSelect = (id: string) => {
    if (isSweeping || sweepCompleted) return;
    setScreenshots(prev =>
      prev.map(item => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleSweep = () => {
    const toDelete = screenshots.filter(s => s.selected);
    if (toDelete.length === 0) return;

    setIsSweeping(true);
    const totalFreed = toDelete.reduce((acc, curr) => acc + curr.sizeMB, 0) / 1024; // convert to GB

    setTimeout(() => {
      setScreenshots(prev => prev.filter(s => !s.selected));
      setStorageUsed(prev => Math.max(10, prev - totalFreed));
      setFreedSpace(totalFreed);
      setIsSweeping(false);
      setSweepCompleted(true);
    }, 2000);
  };

  const handleReset = () => {
    setScreenshots([
      { id: '1', category: 'duplicate photos', sizeMB: 420, count: 145, selected: true },
      { id: '2', category: 'blurry landscapes', sizeMB: 280, count: 98, selected: true },
      { id: '3', category: 'old receipts & documents', sizeMB: 650, count: 210, selected: true },
      { id: '4', category: 'accidental pocket shots', sizeMB: 150, count: 62, selected: false },
      { id: '5', category: 'app cache & memes', sizeMB: 940, count: 320, selected: false },
    ]);
    setStorageUsed(58.4);
    setSweepCompleted(false);
    setFreedSpace(0);
  };

  const selectedSizeSum = screenshots
    .filter(s => s.selected)
    .reduce((acc, curr) => acc + curr.sizeMB, 0);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 140 }
    }
  };

  const statContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden pb-16">
      
      {/* Soft blue-ish decorative gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sky-300/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 w-full z-40 bg-white/70 backdrop-blur-md border-b border-slate-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center select-none">
          <button 
            onClick={onBackHome}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-mono text-xs uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>varp labs</span>
          </button>

          <div className="flex items-center gap-3">
            <img src={logomark} alt="Varp Labs Logo" className="w-4 h-4 opacity-70 filter invert" />
            <span className="font-display text-sm font-semibold tracking-tight text-slate-500 lowercase">sweep app</span>
          </div>

          <a 
            href="#download" 
            className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/10 cursor-pointer"
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
            className="lg:col-span-6 space-y-6 md:space-y-8"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full font-mono text-[10px] text-blue-600 uppercase tracking-widest"
            >
              <Smartphone size={10} />
              <span>platform: android utility</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1 
                variants={itemVariants}
                className="font-display text-5xl md:text-7xl font-bold tracking-tight text-slate-900 lowercase"
              >
                sweep
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="font-sans text-xl md:text-2xl text-blue-600 font-medium tracking-tight"
              >
                auto screenshot deletion app
              </motion.p>
              <motion.p 
                variants={itemVariants}
                className="font-sans text-base md:text-lg text-slate-600 leading-relaxed max-w-xl"
              >
                Sweep intelligently monitors your Android device storage and automatically deletes screenshots based on age, size, and custom rules you define. Keep your camera roll immaculate and reclaim gigabytes of space automatically.
              </motion.p>
            </div>

            {/* Play Store Links */}
            <motion.div variants={itemVariants} className="pt-2 space-y-3">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">available on playstore</p>
              <div className="flex flex-wrap gap-4" id="download">
                {/* Google Play Store */}
                <a 
                  href="https://play.google.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-slate-900 text-white hover:bg-black px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-[0.98] transition-all cursor-pointer border border-white/5"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M3 5.27v13.46c0 .82.68 1.43 1.47 1.34l11.64-6.42L4.65 4.03c-.76-.15-1.65.34-1.65 1.24zM17.47 12l3.41-1.88c.84-.46.84-1.78 0-2.24l-3.41-1.88L15.35 12l2.12 2.12zM4.65 4.03l11.47 7.97L4.65 19.97l11.47-7.97z" />
                    <path d="M5.25 3.03l11.64 6.42 2.12-2.12-12.29-6.8c-.85-.47-1.93.18-1.93 1.16l.46 1.34z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <p className="text-[10px] uppercase font-mono tracking-wider opacity-60">get it on</p>
                    <p className="text-sm font-semibold -mt-0.5">Google Play</p>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Technology tags */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5 pt-2">
              {['Kotlin', 'Android SDK', 'Jetpack Compose', 'TensorFlow Lite', 'Room DB'].map(tech => (
                <span 
                  key={tech} 
                  className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 font-mono text-xs rounded-full shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Logo in Rounded Rectangle */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end items-center relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: 'spring', damping: 20 }}
              className="relative group"
            >
              {/* Blur Shadow background */}
              <div className="absolute inset-0 bg-blue-500/20 rounded-[2.5rem] blur-2xl group-hover:bg-blue-500/35 transition-all duration-700" />
              
              {/* Logo frame */}
              <div className="relative bg-white border-4 border-white shadow-xl shadow-blue-500/10 rounded-[2.5rem] p-8 w-56 h-56 md:w-72 md:h-72 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]">
                <img 
                  src={sweepImg} 
                  alt="Sweep App Logo" 
                  className="w-full h-full object-contain rounded-[1.8rem]" 
                />
              </div>

              {/* Float visual indicators */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-white px-4 py-2 border border-slate-100 rounded-2xl shadow-lg shadow-slate-200/50 flex items-center gap-2 text-xs font-mono text-blue-600"
              >
                <Zap size={12} className="fill-blue-100" />
                <span>active cleanup</span>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-white px-4 py-2 border border-slate-100 rounded-2xl shadow-lg shadow-slate-200/50 flex items-center gap-2 text-xs font-mono text-emerald-600"
              >
                <CheckCircle2 size={12} className="fill-emerald-100" />
                <span>99.2% safe rate</span>
              </motion.div>
            </motion.div>
          </div>

        </div>

        {/* Stats Grid */}
        <motion.section 
          variants={statContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-24 py-12 border-y border-slate-200/60 grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            { value: '1.2M GB', label: 'storage reclaimed', desc: 'across all active devices' },
            { value: '50M+', label: 'screenshots swept', desc: 'safely categorised & deleted' },
            { value: '92%', label: 'user rating', desc: 'based on app store feedback' },
            { value: '8k', label: 'active daily users', desc: 'trusting automated cleanup' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants} 
              className="space-y-1.5 p-2"
            >
              <p className="font-display text-3xl md:text-4xl font-bold text-blue-600 tracking-tight">{stat.value}</p>
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-semibold">{stat.label}</p>
              <p className="text-slate-400 text-xs">{stat.desc}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Interactive Simulator Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-slate-200/60 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/40"
        >
          
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full font-mono text-[10px] text-amber-700 uppercase tracking-wider">
              <Sparkles size={10} />
              <span>interactive experience</span>
            </span>

            <h3 className="font-display text-3xl font-bold text-slate-900 leading-tight tracking-tight lowercase">
              try it yourself
            </h3>
            
            <p className="text-slate-600 text-sm md:text-base leading-relaxed lowercase">
              select the categories of screenshots you want to delete and press <span className="font-semibold text-blue-600">sweep storage</span>. watch how our algorithm frees up space on your simulated device.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex gap-3 text-xs text-slate-500">
                <Shield size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <span><strong className="text-slate-700">smart classification:</strong> our app separates memes and screenshots from photos using on-device ML classifiers.</span>
              </div>
              <div className="flex gap-3 text-xs text-slate-500">
                <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <span><strong className="text-slate-700">full control:</strong> you can review all items before final deletion, with customizable auto-clean timers.</span>
              </div>
            </div>
          </div>

          {/* Right interactive dashboard column */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200/50 rounded-2xl p-6 md:p-8 relative">
            <div className="space-y-6">
              
              {/* Storage Gauge */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/40 shadow-sm">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">device storage status</p>
                  <p className="text-lg font-bold text-slate-800">
                    {storageUsed.toFixed(2)} GB <span className="font-normal text-slate-400 text-sm">used of 64 GB</span>
                  </p>
                </div>
                
                {/* Progress bar */}
                <div className="w-full md:w-48 bg-slate-100 h-3 rounded-full overflow-hidden relative border border-slate-200/20">
                  <motion.div 
                    initial={{ width: '91.2%' }}
                    animate={{ width: `${(storageUsed / 64) * 100}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="bg-blue-600 h-full rounded-full"
                  />
                </div>
              </div>

              {/* Screenshot Categories */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-1">detected screenshot folders</p>
                
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {screenshots.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -30 }}
                        onClick={() => toggleSelect(item.id)}
                        className={`p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer select-none ${
                          item.selected 
                            ? 'bg-blue-50/50 border-blue-200 shadow-sm shadow-blue-500/5' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Checkbox */}
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            item.selected 
                              ? 'bg-blue-600 border-blue-600 text-white' 
                              : 'border-slate-300 bg-white'
                          }`}>
                            {item.selected && <CheckCircle2 size={12} className="stroke-[3]" />}
                          </div>
                          
                          <div className="text-left">
                            <p className={`text-sm font-semibold lowercase ${item.selected ? 'text-blue-900' : 'text-slate-700'}`}>
                              {item.category}
                            </p>
                            <p className="text-xs text-slate-400">{item.count} items detected</p>
                          </div>
                        </div>

                        <span className={`font-mono text-xs ${item.selected ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                          {item.sizeMB} MB
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {screenshots.length === 0 && sweepCompleted && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 text-center bg-white border border-slate-200 rounded-xl space-y-3"
                    >
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                        <Star size={24} className="fill-emerald-100" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-800">device storage optimized!</p>
                        <p className="text-xs text-slate-400">you successfully deleted unnecessary screenshots.</p>
                        <p className="text-sm font-mono text-emerald-600 font-bold">reclaimed {freedSpace.toFixed(2)} GB of storage!</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-between items-center gap-4">
                {sweepCompleted ? (
                  <button 
                    onClick={handleReset}
                    className="w-full py-3 border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 rounded-xl font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer bg-white"
                  >
                    <RefreshCw size={14} />
                    <span>reset simulator</span>
                  </button>
                ) : (
                  <button 
                    disabled={selectedSizeSum === 0 || isSweeping}
                    onClick={handleSweep}
                    className="w-full py-3.5 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/10 active:scale-95"
                  >
                    {isSweeping ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>sweeping camera roll...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} />
                        <span>sweep {selectedSizeSum > 0 ? `${(selectedSizeSum / 1024).toFixed(2)} GB` : 'storage'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          </div>
        </motion.section>

        {/* Technical Architecture details */}
        <section className="mt-24 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-2 max-w-2xl mx-auto"
          >
            <h3 className="font-display text-3xl font-bold text-slate-900 tracking-tight lowercase">
              engineered for safety
            </h3>
            <p className="text-slate-500 text-sm">
              how sweep handles data, deletion, and on-device file orchestration
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: '01 // background worker',
                subtitle: 'file system monitoring',
                desc: 'A background WorkManager task monitors device media library folders, queueing new screenshots for metadata parsing and size calculation.'
              },
              {
                title: '02 // classification',
                subtitle: 'tensorflow analytics',
                desc: 'Uses on-device TensorFlow Lite filters to analyze screenshot content, categorizing them into receipts, duplicates, and blurry frames without cloud interaction.'
              },
              {
                title: '03 // rule evaluator',
                subtitle: 'custom retention logic',
                desc: 'Applies your rules: delete screenshots older than 3 days, remove duplicate receipt scans, or ignore bookmarked screenshots.'
              },
              {
                title: '04 // safe purge',
                subtitle: 'recycle bin staging',
                desc: 'Items are moved to the application recycle bin first, guaranteeing you have a recovery window before final deletion.'
              }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, type: 'spring' }}
                className="bg-white border border-slate-200/50 rounded-2xl p-6 space-y-3 shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
              >
                <span className="font-mono text-xs text-blue-500 font-bold block">{step.title}</span>
                <h4 className="font-semibold text-slate-800 lowercase">{step.subtitle}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Block */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-28 bg-gradient-to-br from-blue-600 to-sky-700 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-blue-600/20 text-center select-text"
        >
          <div className="absolute inset-0 opacity-[0.05]">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          </div>

          <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight lowercase">
                immaculate camera roll starts now
              </h2>
              <p className="font-sans text-sm md:text-base opacity-90 max-w-lg mx-auto leading-relaxed lowercase">
                join thousands of users reclaiming storage. download sweep today on google play.
              </p>
            </div>

            {/* Badges in footer CTA */}
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <a 
                href="https://play.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="bg-white text-slate-900 hover:bg-slate-50 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl active:scale-[0.98] transition-all cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path d="M3 5.27v13.46c0 .82.68 1.43 1.47 1.34l11.64-6.42L4.65 4.03c-.76-.15-1.65.34-1.65 1.24zM17.47 12l3.41-1.88c.84-.46.84-1.78 0-2.24l-3.41-1.88L15.35 12l2.12 2.12zM4.65 4.03l11.47 7.97L4.65 19.97l11.47-7.97z" />
                  <path d="M5.25 3.03l11.64 6.42 2.12-2.12-12.29-6.8c-.85-.47-1.93.18-1.93 1.16l.46 1.34z" />
                </svg>
                <div className="text-left leading-tight">
                  <p className="text-[9px] uppercase font-mono tracking-wider opacity-60">download for</p>
                  <p className="text-xs font-semibold -mt-0.5">Android device</p>
                </div>
              </a>
            </div>
          </div>
        </motion.section>

      </main>

    </div>
  );
}
