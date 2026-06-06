import { useState, useTransition } from 'react';
import { Service, InquiryConfig } from '../types';
import { SERVICES } from '../data';
import { Layers, CheckCircle2, ChevronRight, FileText, Download, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectConfiguratorProps {
  initialServiceId?: string;
  onSubmitted?: () => void;
}

export default function ProjectConfigurator({ initialServiceId = 'software-dev', onSubmitted }: ProjectConfiguratorProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
  const [selectedStack, setSelectedStack] = useState<string[]>(SERVICES.find(s => s.id === initialServiceId)?.defaultStack || []);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [scaleLevel, setScaleLevel] = useState<'startup' | 'enterprise' | 'global'>('startup');
  const [hasDesignSpecs, setHasDesignSpecs] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [proposalBrief, setProposalBrief] = useState<any | null>(null);

  const [, startTransition] = useTransition();

  const currentService = SERVICES.find(s => s.id === selectedServiceId) as Service;

  const handleServiceChange = (id: string) => {
    setSelectedServiceId(id);
    const s = SERVICES.find(srv => srv.id === id);
    if (s) {
      setSelectedStack(s.defaultStack);
    }
  };

  const toggleStackItem = (item: string) => {
    if (selectedStack.includes(item)) {
      if (selectedStack.length > 1) {
        setSelectedStack(selectedStack.filter(i => i !== item));
      }
    } else {
      setSelectedStack([...selectedStack, item]);
    }
  };

  // Perform a realistic price calculation based on configured architecture criteria
  const calculateBudget = () => {
    let baseRate = 18000; // base rate per month
    
    if (selectedServiceId === 'cloud-solutions') baseRate = 22000;
    if (selectedServiceId === 'data-analytics') baseRate = 20000;
    if (selectedServiceId === 'ui-ux') baseRate = 15000;

    let scaleFactor = 1.0;
    if (scaleLevel === 'enterprise') scaleFactor = 1.6;
    if (scaleLevel === 'global') scaleFactor = 2.4;

    const stackFactor = 1.0 + (selectedStack.length * 0.05);
    const designDiscount = hasDesignSpecs ? 0.9 : 1.0;

    return Math.round(baseRate * durationMonths * scaleFactor * stackFactor * designDiscount);
  };

  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleGenerateProposal = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const estimatedBudget = calculateBudget();
      
      // Calculate realistic stage milestone deliveries across the estimated months
      const timeline = [
        { phase: 'Discovery & Specifications', duration: `${Math.round(durationMonths * 0.2)} weeks`, details: 'Initial discovery, API layout schema design, and local microVM docker environment allocation.' },
        { phase: 'Core Implementation', duration: `${Math.round(durationMonths * 0.5)} weeks`, details: `Deep full-stack coding of the core engine, standard integrations of ${selectedStack.join(', ')} stack modules.` },
        { phase: 'Staging & Load Isolation', duration: `${Math.round(durationMonths * 0.15)} weeks`, details: 'Vulnerability scans, end-to-end integration flows, and realistic latency simulations up to peak client request loads.' },
        { phase: 'Global Ingress Rollout', duration: `${Math.round(durationMonths * 0.15)} weeks`, details: `CDN allocation, Anycast routing, automated cloud deployments, and setup of DNS health registers.` }
      ];

      setProposalBrief({
        clientName: clientName || 'Undisclosed Partner',
        clientEmail: clientEmail || 'billing@domain.com',
        serviceTitle: currentService.title,
        stackChosen: selectedStack,
        durationMonths,
        scaleLevel,
        estimatedBudget,
        timeline,
        hash: Math.random().toString(36).substring(2, 10).toUpperCase()
      });
      setIsGenerating(false);
      setStep(4);
    }, 1500);
  };

  const handleDownloadBriefFile = () => {
    if (!proposalBrief) return;
    
    const fileContent = `VARP LABS // ARCHITECTURAL SERVICE PROPOSAL BRIEF
=============================================================
REFERENCE HASH: VP-${proposalBrief.hash}
GENERATED TIME: ${new Date().toLocaleString()}
CLIENT NAME: ${proposalBrief.clientName}
CLIENT EMAIL: ${proposalBrief.clientEmail}

SERVICE AREA: ${proposalBrief.serviceTitle}
CHOSEN TECHNOLOGIES: ${proposalBrief.stackChosen.join(', ')}
ESTIMATED TIME: ${proposalBrief.durationMonths} Months
INFRASTRUCTURE COEFFICIENT: ${proposalBrief.scaleLevel.toUpperCase()}

ESTIMATED BUDGET: USD $${proposalBrief.estimatedBudget.toLocaleString()}
=============================================================
STAGE MILESTONE ROADMAP
-------------------------------------------------------------
${proposalBrief.timeline.map((t: any, idx: number) => `
STAGE 0${idx + 1}: ${t.phase}
DURATION: ${t.duration}
DETAILS: ${t.details}
`).join('\n')}

=============================================================
VERIFIED BY THE VARP LABS INTEGRITY ENGINE
SOCI/II STANDARD PRE-COMPLIANT ARCHITECTURE Blueprints.
=============================================================`;

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `varp-labs-proposal-${proposalBrief.hash}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full relative">
      {/* Upper shadow layer */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {step < 4 ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-4">
          {/* Main Workspace Frame */}
          <div className="md:col-span-8 space-y-6">
            {/* Step Indicators bar */}
            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              <span className={step === 1 ? 'text-primary font-bold' : ''}>01. SERVICE</span>
              <ChevronRight size={10} className="text-zinc-700" />
              <span className={step === 2 ? 'text-primary font-bold' : ''}>02. COMPOSITION</span>
              <ChevronRight size={10} className="text-zinc-700" />
              <span className={step === 3 ? 'text-primary font-bold' : ''}>03. CONTACT & CALIBRATE</span>
            </div>

            {/* Step Content */}
            <div className="min-h-[280px]">
              <AnimatePresence mode="wait">
                {/* Step 1: Select Service Area */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    <div>
                      <h4 className="font-display text-lg text-primary lowercase font-medium">choose service sector</h4>
                      <p className="text-xs text-secondary lowercase">select the fundamental technological bucket for your build</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SERVICES.map((srv) => (
                        <button
                          key={srv.id}
                          onClick={() => handleServiceChange(srv.id)}
                          className={`p-4 text-left border cursor-pointer transition-all duration-300 ${
                            selectedServiceId === srv.id
                              ? 'border-primary bg-white/[0.03]'
                              : 'border-white/5 bg-black/10 hover:border-white/15'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-display font-medium text-sm text-primary lowercase">{srv.title}</span>
                            {selectedServiceId === srv.id && <CheckCircle2 size={14} className="text-primary" />}
                          </div>
                          <p className="text-xs text-secondary mt-2 lowercase leading-snug line-clamp-2">
                            {srv.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Stack Composition */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-5"
                  >
                    <div>
                      <h4 className="font-display text-lg text-primary lowercase font-medium">compose technology stack</h4>
                      <p className="text-xs text-secondary lowercase">select or deselect specialized tools for optimization</p>
                    </div>

                    {/* Tech BADGES checklist */}
                    <div className="space-y-3">
                      <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest">available modules</span>
                      <div className="flex flex-wrap gap-2">
                        {currentService.techOptions.map((tech) => {
                          const isSelected = selectedStack.includes(tech);
                          return (
                            <button
                              key={tech}
                              onClick={() => toggleStackItem(tech)}
                              className={`px-3 py-1.5 border font-mono text-xs cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-primary bg-primary text-background'
                                  : 'border-white/10 text-secondary hover:border-white/20 bg-white/[0.01]'
                              }`}
                            >
                              {tech} {isSelected ? '•' : ''}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sizing sliders & specs check */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/5">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono text-secondary">
                          <span>DURATION ESTIMATE</span>
                          <span className="text-primary font-bold">{durationMonths} MONTHS</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="12"
                          value={durationMonths}
                          onChange={(e) => startTransition(() => setDurationMonths(Number(e.target.value)))}
                          className="w-full accent-primary h-1 bg-zinc-800 rounded-none cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest">infrastructure scale</span>
                        <div className="grid grid-cols-3 border border-white/10 text-xs text-center font-mono select-none">
                          {(['startup', 'enterprise', 'global'] as const).map((lvl) => (
                            <button
                              key={lvl}
                              onClick={() => startTransition(() => setScaleLevel(lvl))}
                              className={`py-1.5 cursor-pointer transition-all ${
                                scaleLevel === lvl
                                  ? 'bg-primary text-background font-bold'
                                  : 'hover:bg-white/5 text-zinc-400'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="hasDesignSpecs"
                        checked={hasDesignSpecs}
                        onChange={(e) => startTransition(() => setHasDesignSpecs(e.target.checked))}
                        className="rounded-none border-white/10 bg-black text-primary focus:ring-0 cursor-pointer h-4 w-4"
                      />
                      <label htmlFor="hasDesignSpecs" className="text-xs text-secondary cursor-pointer lowercase select-none">
                        we already have functional designs, Figma layouts, or engineering blueprints (apply 10% design discount)
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Contact Details */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-5"
                  >
                    <div>
                      <h4 className="font-display text-lg text-primary lowercase font-medium">credentials & verify</h4>
                      <p className="text-xs text-secondary lowercase">provide communication keys to catalog your custom build logs</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest">full identity</label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. Satoshi Nakamoto"
                          className="w-full bg-black/30 border border-white/10 px-3 py-2 text-sm text-primary transition-colors focus:border-primary outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest">routing inbox</label>
                        <input
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="e.g. satoshi@bitcoin.org"
                          className="w-full bg-black/30 border border-white/10 px-3 py-2 text-sm text-primary transition-colors focus:border-primary outline-none"
                        />
                      </div>
                    </div>

                    <div className="bg-white/[0.01] border border-white/5 p-4 space-y-2">
                      <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest">pre-compiled architectural checklist</span>
                      <ul className="text-xs text-secondary space-y-1 list-disc pl-4 lowercase">
                        <li>engine scope: {currentService.title} with {selectedStack.length} active service layers</li>
                        <li>environment validation: {scaleLevel.toUpperCase()} parameters configured with SLA redundancy</li>
                        <li>automatic caching layer & continuous monitoring hooks pre-declared</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stepper controls */}
            <div className="flex justify-between items-center pt-6 border-t border-white/5">
              <button
                onClick={handlePrevStep}
                disabled={step === 1}
                className="px-4 py-2 border border-white/10 font-mono text-xs text-zinc-400 hover:text-primary hover:border-white/30 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none lowercase"
              >
                backward
              </button>

              {step < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-primary text-background font-mono text-xs font-bold hover:opacity-90 active:scale-95 transition-all text-center flex items-center gap-1 cursor-pointer lowercase"
                >
                  forward <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleGenerateProposal}
                  disabled={isGenerating || !clientName || !clientEmail}
                  className="px-6 py-2 silver-gradient border border-white/15 text-background font-mono text-xs font-bold hover:scale-105 active:scale-95 transition-all text-center flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:pointer-events-none lowercase"
                >
                  {isGenerating ? 'generating brief...' : 'generate architectural proposal'} <FileText size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right sidebar real-time estimation pricing cell */}
          <div className="md:col-span-4 border border-white/5 bg-white/[0.01] p-6 flex flex-col justify-between relative overflow-hidden select-text">
            {/* Header outline highlight */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="space-y-4">
              <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest">real-time parameters</span>
              
              <div className="space-y-1.5">
                <span className="block text-[11px] text-zinc-500 uppercase font-mono">SECTOR</span>
                <span className="block text-sm font-display text-primary font-medium lowercase">
                  {currentService.title}
                </span>
              </div>

              <div className="space-y-1.5 border-t border-white/5 pt-3">
                <span className="block text-[11px] text-zinc-500 uppercase font-mono">COMPOSITE STACK</span>
                <div className="flex flex-wrap gap-1">
                  {selectedStack.map((tech) => (
                    <span key={tech} className="text-[10px] font-mono border border-white/5 px-1.5 bg-black/30 text-secondary">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-3 text-[11px] font-mono text-zinc-400">
                <div>
                  <span className="block text-zinc-500 text-[10px] uppercase">INFRA COEFFICIENT</span>
                  <span className="block text-primary mt-0.5 uppercase tracking-wide">{scaleLevel}</span>
                </div>
                <div>
                  <span className="block text-zinc-500 text-[10px] uppercase">TIMEFRAME</span>
                  <span className="block text-primary mt-0.5">{durationMonths} MONTHS</span>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="border-t border-white/10 pt-6 mt-6">
              <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest">estimated cost pipeline</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display text-3xl font-bold text-primary tracking-tight">
                  ${calculateBudget().toLocaleString()}
                </span>
                <span className="font-mono text-[10px] text-zinc-500 uppercase">usd total</span>
              </div>
              <p className="text-[10px] text-zinc-500 lowercase mt-2 italic">
                *estimated dynamically based on resource constraints, developer allocation indexes, and infrastructure parameters.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Step 4: Complete generated contract proposal brief */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 py-4 select-all"
        >
          {/* Successful header badge */}
          <div className="border border-white/10 bg-white/[0.02] p-6 text-center space-y-3">
            <span className="inline-block bg-primary/10 border border-primary/20 text-primary px-3 py-1 text-xs font-mono rounded-none">
              PROPOSAL HASH: VP-{proposalBrief.hash}
            </span>
            <h4 className="font-display text-xl font-semibold text-primary lowercase">
              architectural brief compiled successfully!
            </h4>
            <p className="font-body-md text-secondary lowercase max-w-xl mx-auto text-sm leading-relaxed">
              we have calculated and structured a dedicated software engineering roadmap based on your chosen technologies. down below you can review the specifications or export them immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Core parameters list */}
            <div className="md:col-span-1 border border-white/5 p-5 bg-black/20 space-y-4">
              <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest">brief parameters</span>
              
              <div className="space-y-1">
                <span className="block text-[10px] text-zinc-500 font-mono uppercase">PARTNER ENTITY</span>
                <span className="block text-sm text-primary font-medium">{proposalBrief.clientName}</span>
                <span className="block text-xs text-zinc-500 font-mono">{proposalBrief.clientEmail}</span>
              </div>

              <div className="space-y-1 border-t border-white/5 pt-3">
                <span className="block text-[10px] text-zinc-500 font-mono uppercase">PROJECT STRENGTH</span>
                <span className="block text-sm text-primary font-medium lowercase">{proposalBrief.serviceTitle}</span>
              </div>

              <div className="space-y-1 border-t border-white/5 pt-3">
                <span className="block text-[10px] text-zinc-500 font-mono uppercase">VERIFIED PIPELINE</span>
                <p className="text-xs text-secondary leading-normal">{proposalBrief.stackChosen.join(', ')}</p>
              </div>

              <div className="border-t border-white/10 pt-4 text-left">
                <span className="block text-[10px] text-zinc-500 font-mono uppercase">TOTAL PROJECT INVESTMENT</span>
                <span className="block text-2xl font-display font-semibold text-primary tracking-tight mt-1">
                  ${proposalBrief.estimatedBudget.toLocaleString()} USD
                </span>
                <span className="block text-[10px] text-zinc-600 font-mono uppercase leading-none mt-1">SLA-backed tier estimate</span>
              </div>
            </div>

            {/* Stages / Milestones timelines */}
            <div className="md:col-span-2 border border-white/5 p-5 bg-black/20 space-y-5">
              <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest">compiled engineering milestone roadmap ({proposalBrief.durationMonths} months execution)</span>

              <div className="relative pl-4 space-y-6 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                {proposalBrief.timeline.map((item: any, idx: number) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[19px] top-[5px] w-1.5 h-1.5 rounded-full bg-primary border-2 border-background" />
                    <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                      <span>STAGE 0{idx + 1} // {item.phase}</span>
                      <span className="text-primary font-bold lowercase">{item.duration}</span>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed mt-1 lowercase">
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom control anchors */}
          <div className="flex flex-wrap gap-4 justify-between items-center pt-6 border-t border-white/5">
            <button
              onClick={() => setStep(1)}
              className="font-mono text-xs text-zinc-500 hover:text-primary transition-all cursor-pointer lowercase"
            >
              reset & run again
            </button>

            <div className="flex gap-4">
              <button
                onClick={handleDownloadBriefFile}
                className="px-5 py-2 border border-primary text-primary font-mono text-xs font-bold hover:bg-primary hover:text-background transition-all flex items-center gap-1.5 cursor-pointer lowercase"
              >
                export brief data <Download size={14} />
              </button>
              
              <a
                href={`mailto:hello@varplabs.com?subject=VP-${proposalBrief.hash}%20Architectural%20Proposal%20Inquiry&body=Hello%20Varp%20Labs%20Core%20Engine,%0A%0AI%20have%20compiled%20a%20project%20brief%20configuration.%0AReference%20hash:%20VP-${proposalBrief.hash}%0AEstimate:%20$${proposalBrief.estimatedBudget.toLocaleString()}%0A%0APlease%20reference%20my%20brief%20for%20our%20oncoming%20scoping%20discussion.%0A%0ARegards,%0A${proposalBrief.clientName}`}
                className="px-6 py-2 silver-gradient border border-white/10 text-background font-mono text-xs font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer lowercase"
              >
                schedule call <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
