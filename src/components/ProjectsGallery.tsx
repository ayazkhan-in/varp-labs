import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectsGalleryProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  viewMode?: 'grid' | 'list';
}

export default function ProjectsGallery({ projects, onProjectClick, viewMode = 'grid' }: ProjectsGalleryProps) {
  // RENDER LIST VIEW
  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {projects.map((project, index) => {
          return (
            <motion.a
              key={project.id}
              href={project.id === 'sweep' ? '/sweep' : project.id === 'qrlog' ? '/qrlog' : project.id === 'teachback' ? '/teachback' : '#'}
              onClick={(e) => {
                e.preventDefault();
                onProjectClick(project);
              }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="border border-white/5 bg-black/10 p-3.5 hover:bg-black/20 hover:border-white/10 transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer group rounded-xl relative overflow-hidden"
            >
              {/* App Info Left */}
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {project.image && (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10 rounded-lg object-cover border border-white/10 opacity-70 group-hover:opacity-90 transition-opacity shrink-0"
                  />
                )}
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-display text-sm sm:text-base font-semibold text-primary lowercase truncate">
                      {project.title}
                    </h4>
                    <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-wider border border-white/5 px-2 py-0.5 bg-black/40 rounded shrink-0">
                      {project.tag}
                    </span>
                  </div>
                  {/* Product Short Description */}
                  <p className="font-sans text-zinc-400 text-xs lowercase truncate max-w-2xl">
                    {project.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Right */}
              <div className="shrink-0">
                <div className="border border-white/10 group-hover:border-primary p-2 rounded-lg transition-colors bg-white/5 flex items-center justify-center">
                  <ArrowUpRight size={14} className="text-secondary group-hover:text-primary transition-colors" />
                </div>
              </div>
            </motion.a>
          );
        })}

        {/* List placeholder for Cooking More Apps */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: projects.length * 0.05 }}
          className="border border-white/5 bg-black/5 p-3.5 flex items-center justify-between gap-4 rounded-xl select-none"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="font-display text-xs sm:text-sm font-semibold text-zinc-500 lowercase">
              cooking more apps...
            </span>
          </div>
          <span className="font-mono text-[8px] sm:text-[9px] text-zinc-600 uppercase tracking-widest shrink-0">
            labs in progress
          </span>
        </motion.div>
      </div>
    );
  }

  // RENDER GRID VIEW (BENTO BOX) WITH RESPONSIVE HEIGHTS
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {projects.map((project, index) => {
        // Layout and height settings based on card position
        // On mobile, all cards have an identical h-[220px] for symmetry
        let cardClasses = 'sm:col-span-1 md:col-span-1 h-[220px] sm:h-[220px] md:h-[260px]';
        let isWide = false;
        let showStats = false;

        if (index === 0) {
          // Taskstack (featured wide)
          cardClasses = 'sm:col-span-2 md:col-span-2 h-[220px] sm:h-[300px] md:h-[380px]';
          isWide = true;
          showStats = true;
        } else if (index === 1) {
          // Serin (tall standard)
          cardClasses = 'sm:col-span-1 md:col-span-1 h-[220px] sm:h-[300px] md:h-[380px]';
          showStats = true;
        } else if (index === 5) {
          // Teachback (wide)
          cardClasses = 'sm:col-span-2 md:col-span-2 h-[220px] sm:h-[280px] md:h-[320px]';
          isWide = true;
          showStats = true;
        } else {
          // QRLog (index 2), Sweep (index 3), Lessgo (index 4)
          cardClasses = 'sm:col-span-1 md:col-span-1 h-[220px] sm:h-[220px] md:h-[260px]';
        }

        return (
          <motion.a
            key={project.id}
            href={project.id === 'sweep' ? '/sweep' : project.id === 'qrlog' ? '/qrlog' : project.id === 'teachback' ? '/teachback' : '#'}
            onClick={(e) => {
              e.preventDefault();
              onProjectClick(project);
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.6,
              delay: 0.1 * (index + 1),
              ease: [0.16, 1, 0.3, 1]
            }}
            className={`group relative overflow-hidden border border-white/5 cursor-pointer bg-black/20 hover:bg-black/40 hover:border-white/10 transition-all duration-300 flex flex-col justify-end p-5 sm:p-6 ${cardClasses}`}
          >
            {/* Image Background */}
            {project.image && (
              <div className={`absolute inset-0 transition-opacity ${
                isWide 
                  ? 'opacity-30 group-hover:opacity-40 group-hover:scale-[1.01] transition-all duration-700' 
                  : 'opacity-5 group-hover:opacity-10'
              }`}>
                <img 
                  src={project.image} 
                  alt={project.title}
                  width={800}
                  height={600}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {isWide && (
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
            )}

            {/* Content */}
            <div className="relative z-10 space-y-3 w-full">
              <span className="inline-block font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
                / {project.tag} /
              </span>
              
              <h4 className="font-display text-base sm:text-lg md:text-xl font-semibold text-primary lowercase flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {project.title}
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity animate-in fade-in duration-300 sm:w-4 sm:h-4" />
                </span>
              </h4>
              
              <p className="font-sans text-secondary text-xs lowercase leading-relaxed line-clamp-2 max-w-2xl">
                {project.description}
              </p>

              {/* Stats for selected cards */}
              {showStats && project.stats && (
                <div className="pt-2 border-t border-white/5 mt-2">
                  <div className="grid grid-cols-2 gap-2 text-[9px]">
                    {project.stats.slice(0, 2).map((stat, i) => (
                      <div key={i}>
                        <p className="text-primary font-semibold">{stat.value}</p>
                        <p className="text-zinc-500 font-mono text-[8px] uppercase tracking-wider">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.a>
        );
      })}

      {/* Custom Bento item: Cooking More Apps */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration: 0.6,
          delay: 0.1 * 7,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="sm:col-span-2 md:col-span-1 h-[200px] sm:h-[240px] md:h-[320px] border border-white/5 bg-black/10 flex flex-col justify-between p-5 sm:p-6 select-none relative overflow-hidden group hover:border-white/10 transition-all duration-300"
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '20px 20px' }} />
        </div>
        
        <div className="space-y-2 relative z-10">
          <span className="inline-block font-mono text-[9px] text-zinc-600 uppercase tracking-wider">
            / status: active /
          </span>
          <h4 className="font-display text-base sm:text-lg md:text-xl font-semibold text-zinc-400 lowercase group-hover:text-primary transition-colors">
            cooking more apps
          </h4>
        </div>
        
        <div className="flex items-center gap-2 relative z-10">
          <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></span>
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            labs in progress...
          </span>
        </div>
      </motion.div>
    </div>
  );
}
