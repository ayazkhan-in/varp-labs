import { useState, useEffect } from 'react';
import { Project } from '../types';
import { Terminal as TerminalIcon, BarChart3, Radio, Layers3, Cpu, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface CaseStudyViewerProps {
  project: Project;
}

export default function CaseStudyViewer({ project }: CaseStudyViewerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'diagnostics'>('overview');
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [sysHealth, setSysHealth] = useState({
    cpu: 45,
    latency: 0.84,
    traffic: 12000,
    status: 'ACTIVE'
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load custom starting logs depending on the project
  useEffect(() => {
    const initLogs = [
      `[sys] establishing secure session over vpn subnet`,
      `[sys] microservice telemetry layer initializing...`,
      `[net] resolved gateway routing to variable instance cluster`,
      `[srv] instances allocated on virtual secure nodes successfully.`,
      `[db] transaction sync engine verified.`
    ];
    setLogMessages(initLogs);

    // Dynamic state simulations to mimic cloud computing monitoring
    setSysHealth({
      cpu: Math.round(35 + Math.random() * 20),
      latency: project.id === 'fintech-shell' ? 0.84 : project.id === 'nebulas-core' ? 8.1 : 4.2,
      traffic: Math.round(8000 + Math.random() * 8000),
      status: 'ACTIVE'
    });
  }, [project]);

  // Generate simulated real-time telemetry streaming log strings
  // Only runs when the diagnostics tab is active to avoid unnecessary background state updates.
  useEffect(() => {
    if (activeTab !== 'diagnostics') return;

    const interval = setInterval(() => {
      const messages = [
        `[telemetry] query throughput: ${(Math.random() * 1000 + 4000).toFixed(0)} req/s`,
        `[sys] cpu instruction cycle clean: ${(Math.random() * 10 + 25).toFixed(1)}% loaded`,
        `[net] websocket ping response resolved in ${(Math.random() * 3 + 1).toFixed(1)}ms`,
        `[db] microVM sandbox cache committed successfully`,
        `[audit] cryptographic signature published to distributed ledger`
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setLogMessages(prev => [...prev.slice(-12), randomMsg]);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const handleManualDiagnose = () => {
    setIsRefreshing(true);
    const diagnosticLogs = [
      `[diagnostics] initialized comprehensive stack checklist`,
      `[diagnostics] profiling engine CPU & thread count`,
      `[diagnostics] checking cold start overhead & microVM partitions`,
      `[diagnostics] system load within nominal parameters. 0 warnings.`,
    ];
    
    // Staggered diagnostics run simulation
    diagnosticLogs.forEach((log, index) => {
      setTimeout(() => {
        setLogMessages(prev => [...prev, log]);
      }, (index + 1) * 300);
    });

    setTimeout(() => {
      setSysHealth({
        cpu: Math.round(20 + Math.random() * 30),
        latency: Number((project.id === 'fintech-shell' ? 0.7 + Math.random() * 0.2 : 6 + Math.random() * 3).toFixed(2)),
        traffic: Math.round(9000 + Math.random() * 6000),
        status: 'ACTIVE'
      });
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 select-text">
      {/* Title & Headline */}
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary lowercase mb-4">
          {project.title}
        </h2>
        <p className="font-body-md text-secondary lowercase leading-relaxed max-w-2xl">
          {project.description}
        </p>
      </div>

      {/* Stats Bento Grid Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {project.stats.map((stat, i) => (
          <div key={i} className="border border-white/5 bg-white/[0.01] p-4 text-left select-all">
            <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              {stat.label}
            </span>
            <span className="block font-display text-xl md:text-2xl font-bold text-primary lowercase mt-2">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Modern Tabs Navigation panel */}
      <div className="flex border-b border-white/5 gap-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-medium transition-colors relative lowercase ${
            activeTab === 'overview' ? 'text-primary' : 'text-secondary hover:text-primary'
          }`}
        >
          overview
          {activeTab === 'overview' && (
            <motion.div layoutId="modalTabLine" className="absolute bottom-0 inset-x-0 h-[2px] bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`pb-3 text-sm font-medium transition-colors relative lowercase ${
            activeTab === 'architecture' ? 'text-primary' : 'text-secondary hover:text-primary'
          }`}
        >
          architecture pipeline
          {activeTab === 'architecture' && (
            <motion.div layoutId="modalTabLine" className="absolute bottom-0 inset-x-0 h-[2px] bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`pb-3 text-sm font-medium transition-colors relative lowercase ${
            activeTab === 'diagnostics' ? 'text-primary' : 'text-secondary hover:text-primary'
          }`}
        >
          live telemetry room
          {activeTab === 'diagnostics' && (
            <motion.div layoutId="modalTabLine" className="absolute bottom-0 inset-x-0 h-[2px] bg-primary" />
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[220px]">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <p className="font-body-md text-secondary leading-relaxed lowercase">
              {project.extendedDescription}
            </p>

            <div className="space-y-3">
              <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                core technologies
              </span>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="border border-white/10 px-3 py-1 font-mono text-xs text-primary bg-white/[0.02]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Architecture Stepper */}
        {activeTab === 'architecture' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/15">
              {project.architecture.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Point bullet */}
                  <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-primary border-4 border-background transition-colors group-hover:bg-secondary" />
                  
                  <span className="block font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                    stage 0{idx + 1} // {item.step}
                  </span>
                  <p className="font-body-md text-primary mt-1 lowercase text-sm">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab 3: Diagnostics Simulator */}
        {activeTab === 'diagnostics' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Live Metrics Header */}
            <div className="grid grid-cols-3 gap-4 border border-white/5 bg-white/[0.01] p-4 font-mono text-xs select-all">
              <div>
                <span className="block text-zinc-500 text-[10px] uppercase">cpu load</span>
                <span className="block text-primary mt-1 text-sm font-semibold">{sysHealth.cpu}%</span>
              </div>
              <div>
                <span className="block text-zinc-500 text-[10px] uppercase">response</span>
                <span className="block text-primary mt-1 text-sm font-semibold">{sysHealth.latency} ms</span>
              </div>
              <div>
                <span className="block text-zinc-500 text-[10px] uppercase">active requests</span>
                <span className="block text-primary mt-1 text-sm font-semibold">{sysHealth.traffic.toLocaleString()}/m</span>
              </div>
            </div>

            {/* Simulated Live Terminal */}
            <div className="bg-black/40 border border-white/5 p-4 rounded-none font-mono text-xs space-y-1.5 h-48 overflow-y-auto scrollbar-none scroll-smooth">
              <div className="sticky top-0 bg-background/95 pb-1 flex justify-between items-center border-b border-white/5 text-[10px] text-zinc-500">
                <span>TERMINAL LOG STREAM</span>
                <button
                  onClick={handleManualDiagnose}
                  disabled={isRefreshing}
                  className="px-2 py-0.5 rounded border border-white/15 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-primary flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Cpu size={10} className={isRefreshing ? 'animate-spin' : ''} />
                  {isRefreshing ? 'syncing...' : 'run diagnostics'}
                </button>
              </div>
              
              <div className="pt-2 space-y-1 text-zinc-400">
                {logMessages.map((msg, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-zinc-600 font-medium">[{new Date().toLocaleTimeString()}]</span>
                    <span>{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
