import { useState, useTransition, useEffect } from 'react';
import { motion } from 'motion/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { Terminal, Activity, ArrowUpRight, ArrowRight, ShieldCheck, Mail, GitBranch, Linkedin, Github, LayoutGrid, List } from 'lucide-react';
import { PROJECTS } from './data';
import { Project } from './types';
import logomark from '../assets/logomark.svg';
import CustomCursor from './components/CustomCursor';
import GlowBackground from './components/GlowBackground';
import GlassModal from './components/GlassModal';
import CaseStudyViewer from './components/CaseStudyViewer';
import ServicesPanel from './components/ServicesPanel';
import ScrambleText from './components/ScrambleText';
import { ShaderAnimation } from './components/ShaderAnimation';
import ScrollIndicator from './components/ScrollIndicator';
import ProjectsGallery from './components/ProjectsGallery';
import SweepLandingPage from './pages/SweepLandingPage';
import QRLogLandingPage from './pages/QRLogLandingPage';
import TeachbackLandingPage from './pages/TeachbackLandingPage';
import { FloatingPaths } from './components/BackgroundPaths';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'work' | 'services' | 'contact'>('work');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [, startTransition] = useTransition();
  const [showShader, setShowShader] = useState(true);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    let title = 'Varp Labs | Sophisticated Software';
    let description = 'Building sophisticated software solutions for the modern world. We transform complex requirements into elegant, high-performance digital products.';
    let ogImage = '/og.png';
    let url = 'https://varplabs.com/';

    if (currentPath === '/sweep') {
      title = 'Sweep | Auto Screenshot Deletion';
      description = 'Sweep intelligently monitors your Android device storage and automatically deletes screenshots based on age, size, and custom rules.';
      ogImage = '/og-sweep.png';
      url = 'https://varplabs.com/sweep';
    } else if (currentPath === '/qrlog' || currentPath === '/qr-log') {
      title = 'QRLog | QR Code Scanner & Generator';
      description = 'QRLog is a minimal, privacy-focused Android scanner built for security. It archives every scan locally and blocks malicious redirect links.';
      ogImage = '/og-qrlog.png';
      url = 'https://varplabs.com/qrlog';
    } else if (currentPath === '/teachback') {
      title = 'TeachBack | Explain to Learn';
      description = 'TeachBack is an AI-powered learning app built around the Feynman Technique. Explain concepts aloud, receive clarity feedback, and review with spaced repetition.';
      ogImage = '/og-teachback.png';
      url = 'https://varplabs.com/teachback';
    }

    document.title = title;

    const updateMetaTag = (selector: string, attributeName: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) {
        el.setAttribute(attributeName, value);
      }
    };

    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[property="og:title"]', 'content', title);
    updateMetaTag('meta[property="og:description"]', 'content', description);
    updateMetaTag('meta[property="og:image"]', 'content', ogImage);
    updateMetaTag('meta[property="og:url"]', 'content', url);
    updateMetaTag('meta[name="twitter:title"]', 'content', title);
    updateMetaTag('meta[name="twitter:description"]', 'content', description);
    updateMetaTag('meta[name="twitter:image"]', 'content', ogImage);
    updateMetaTag('meta[name="twitter:url"]', 'content', url);

    const canonicalEl = document.getElementById('canonical-link');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', url);
    }
  }, [currentPath]);

  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenProject = (project: Project) => {
    if (project.id === 'sweep') {
      navigate('/sweep');
    } else if (project.id === 'qrlog') {
      navigate('/qrlog');
    } else if (project.id === 'teachback') {
      navigate('/teachback');
    } else {
      setSelectedProject(project);
    }
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  const handleOpenContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative min-h-screen bg-background text-on-surface font-sans selection:bg-primary selection:text-on-primary ${currentPath !== '/sweep' && currentPath !== '/qrlog' && currentPath !== '/qr-log' && currentPath !== '/teachback' ? 'custom-cursor-active' : ''}`}>
      <SpeedInsights />
      <Analytics />

      {currentPath === '/sweep' ? (
        <SweepLandingPage onBackHome={() => navigate('/')} />
      ) : currentPath === '/qrlog' || currentPath === '/qr-log' ? (
        <QRLogLandingPage onBackHome={() => navigate('/')} />
      ) : currentPath === '/teachback' ? (
        <TeachbackLandingPage onBackHome={() => navigate('/')} />
      ) : (
        <>
          <CustomCursor />
          <ScrollIndicator />
          <GlowBackground />

          {/* Top Header Navigation */}
          <header className="fixed top-0 w-full z-40 bg-background/60 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex justify-between items-center select-none">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            {/* Varp Labs Logomark */}
            <img 
              src={logomark}
              alt="Varp Labs Logo"
              className="w-5 h-5"
              aria-hidden="true"
            />
            <div className="font-display text-lg md:text-xl font-bold text-primary tracking-tighter">
              varp labs
            </div>
          </motion.div>

          <nav className="hidden md:flex gap-10 items-center font-mono text-xs">
            <a 
              href="#work" 
              onClick={() => setActiveTab('work')}
              className={`transition-colors uppercase tracking-widest ${activeTab === 'work' ? 'text-primary' : 'text-secondary hover:text-primary'}`}
            >
              work
            </a>
            <a 
              href="#services" 
              onClick={() => setActiveTab('services')}
              className={`transition-colors uppercase tracking-widest ${activeTab === 'services' ? 'text-primary' : 'text-secondary hover:text-primary'}`}
            >
              services
            </a>
            <a 
              href="#contact" 
              onClick={() => setActiveTab('contact')}
              className={`transition-colors uppercase tracking-widest ${activeTab === 'contact' ? 'text-primary' : 'text-secondary hover:text-primary'}`}
            >
              contact
            </a>
          </nav>

          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleOpenContact}
            className="bg-primary text-background border border-white/10 px-4 py-1.5 font-mono text-xs font-semibold tracking-wider hover:opacity-90 active:scale-95 transition-all uppercase cursor-pointer"
          >
            get in touch
          </motion.button>
        </div>
      </header>

      {/* Main Container Core */}
      <main className="pt-24 select-text">
        
        {/* Section 1: Hero Section */}
        <section className="relative w-full overflow-hidden border-b border-white/5 bg-background">
          {/* WebGL neon line shader as interactive background layer */}
          {showShader && (
            <motion.div
              animate={{
                opacity: [0, 1, 1, 0, 0],
              }}
              transition={{
                duration: 5,
                ease: "easeInOut",
                times: [0, 0.2, 0.6, 0.8, 1],
              }}
              onAnimationComplete={() => {
                setShowShader(false);
              }}
              className="absolute inset-0 z-0 pointer-events-none select-none"
            >
              <ShaderAnimation />
              {/* Smooth transition vignettes to melt back gracefully into off-black background edges */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
            </motion.div>
          )}

          <div className="relative z-10 min-h-[75vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto py-16">
            <div className="space-y-6 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 font-mono text-xs text-secondary/80 tracking-widest uppercase"
              >
                <Terminal size={12} className="text-zinc-500" />
                <span><ScrambleText text="[ status: operational ]" delayMs={300} /></span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold text-primary leading-none tracking-tight lowercase"
              >
                varp labs
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-sans text-lg md:text-xl text-secondary max-w-2xl lowercase leading-relaxed"
              >
                building sophisticated software solutions for the modern world. we transform complex requirements into elegant, high-performance digital products.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-6 flex flex-wrap gap-4"
              >
                <button
                  onClick={handleOpenContact}
                  className="silver-gradient text-background px-8 py-3 font-mono text-xs font-bold tracking-wider hover:scale-105 active:scale-95 transition-all uppercase cursor-pointer flex items-center gap-1.5"
                >
                  get in touch <ArrowRight size={14} />
                </button>
                
                <a
                  href="#work"
                  className="border border-white/10 text-primary hover:border-primary px-8 py-3 font-mono text-xs hover:bg-white/5 transition-all uppercase"
                >
                  view our work
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 2: Milestones Grid */}
        <section className="border-y border-white/5 bg-black/30 backdrop-blur-sm select-text">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1 p-2 border-l border-white/5"
            >
              <h3 className="font-display text-3xl md:text-4xl font-semibold text-primary tracking-tight lowercase">100k+</h3>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">users reached</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1 p-2 border-l border-white/5"
            >
              <h3 className="font-display text-3xl md:text-4xl font-semibold text-primary tracking-tight lowercase">global</h3>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">reach & deployment</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1 p-2 border-l border-white/5"
            >
              <h3 className="font-display text-3xl md:text-4xl font-semibold text-primary tracking-tight lowercase">99.9%</h3>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">uptime guarantee</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1 p-2 border-l border-white/5"
            >
              <h3 className="font-display text-3xl md:text-4xl font-semibold text-primary tracking-tight lowercase">12+</h3>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">custom frameworks</p>
            </motion.div>
          </div>
        </section>

        {/* Section 3: Our Apps & Projects Gallery */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 space-y-12 select-text border-b border-white/5" id="work">
          <div className="flex justify-between items-end border-b border-white/5 pb-6 gap-4">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary lowercase tracking-tight">our apps</h2>
              <p className="text-secondary text-xs font-mono uppercase tracking-wider mt-2">innovative applications & tools</p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex bg-black/35 border border-white/10 p-0.5 rounded-lg items-center gap-0.5 shadow-inner shrink-0 select-none">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-background' 
                    : 'text-zinc-500 hover:text-primary'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === 'list' 
                    ? 'bg-primary text-background' 
                    : 'text-zinc-500 hover:text-primary'
                }`}
                title="List View"
              >
                <List size={14} />
              </button>
            </div>
          </div>

          <ProjectsGallery 
            projects={PROJECTS.slice(3)} 
            onProjectClick={handleOpenProject}
            viewMode={viewMode}
          />
        </section>
        {/* Section 4: What We Do */}
        <section className="bg-black/20 py-24 border-y border-white/5" id="services">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
              <div className="lg:w-1/3 space-y-4 lg:sticky lg:top-24 select-text">
                <span className="block font-mono text-xs text-zinc-500 uppercase tracking-widest">operational capabilities</span>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary lowercase tracking-tight">what we do</h2>
                <div className="h-[1px] w-12 bg-white/15 pt-2" />
                <p className="font-sans text-secondary text-sm lowercase leading-relaxed max-w-sm">
                  we leverage high-performance technologies to build resilient systems. from initial architectural design to global scaling.
                </p>
              </div>
              
              <div className="lg:w-2/3 w-full">
                <ServicesPanel />
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Start a Project / Inline Workspace Constructor */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 select-text" id="contact">
          <div className="border border-white/5 bg-black/10 p-8 md:p-12 relative overflow-hidden">
            
            {/* Soft decorative visual grid backgrounds */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            </div>

            {/* Floating Paths Background Animation */}
            <div className="absolute inset-0 pointer-events-none opacity-80">
              <FloatingPaths position={1} />
              <FloatingPaths position={-1} />
            </div>

            <div className="relative z-10 space-y-10">
              <div className="text-center space-y-3">
                <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary lowercase tracking-tight">
                  {"start a project".split(" ").map((word, wordIndex) => (
                    <span key={wordIndex} className="inline-block mr-3 last:mr-0">
                      {word.split("").map((letter, letterIndex) => (
                        <motion.span
                          key={`${wordIndex}-${letterIndex}`}
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: wordIndex * 0.1 + letterIndex * 0.03,
                            type: "spring",
                            stiffness: 150,
                            damping: 25,
                          }}
                          className="inline-block"
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </span>
                  ))}
                </h2>
                <p className="font-sans text-secondary text-sm max-w-xl mx-auto lowercase leading-relaxed">
                  ready to build the future? let's discuss your technical requirements and define the path forward.
                </p>
              </div>

              {/* Email Contact */}
              <div className="text-center space-y-4">
                <p className="font-sans text-secondary text-sm lowercase">reach us at</p>
                <motion.a 
                  href="mailto:hello@varplabs.com"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="inline-block font-mono text-sm md:text-base font-semibold text-primary border border-primary px-6 py-2.5 rounded-full hover:bg-primary/10 transition-all"
                >
                  hello@varplabs.com
                </motion.a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Block */}
      <footer className="w-full px-6 md:px-12 py-16 mt-16 border-t border-white/5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 select-none">
          <div className="flex items-center gap-3">
            <img 
              src={logomark}
              alt="Varp Labs Logo"
              className="w-5 h-5"
            />
            <span className="font-display text-xl font-bold text-primary lowercase">varp labs</span>
            <span className="text-[10px] font-mono text-zinc-600">v1.2.0 // SSL SECURED</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 font-mono text-xs uppercase tracking-widest text-zinc-500">
            <a href="#" className="hover:text-primary transition-colors">privacy</a>
            <a href="#" className="hover:text-primary transition-colors">terms</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
              <Github size={12} /> github
            </a>
            <a href="https://linkedin.com/company/varplabs" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
              <Linkedin size={12} /> linkedin
            </a>
          </div>

          <div className="font-mono text-[10px] text-zinc-600 lowercase text-center md:text-right">
            © {new Date().getFullYear()} varp labs. all rights reserved.
          </div>
        </div>
      </footer>

          {/* Global Detailed Portfolio GlassModal */}
          <GlassModal
            isOpen={selectedProject !== null}
            onClose={handleCloseProject}
            title={selectedProject ? `Specification brief // ${selectedProject.title}` : ''}
          >
            {selectedProject && <CaseStudyViewer project={selectedProject} />}
          </GlassModal>
        </>
      )}
    </div>
  );
}
