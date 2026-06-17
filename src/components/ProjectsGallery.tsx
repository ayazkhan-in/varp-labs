import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectsGalleryProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export default function ProjectsGallery({ projects, onProjectClick }: ProjectsGalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {projects.map((project, index) => {
        // Layout and height settings based on card position
        let cardClasses = 'md:col-span-1 h-[280px]';
        let isWide = false;
        let showStats = false;

        if (index === 0) {
          // Taskstack (featured wide)
          cardClasses = 'md:col-span-2 h-[380px]';
          isWide = true;
          showStats = true;
        } else if (index === 1) {
          // Serin (tall standard)
          cardClasses = 'md:col-span-1 h-[380px]';
          showStats = true;
        } else if (index === 5) {
          // Teachback (wide)
          cardClasses = 'md:col-span-2 h-[320px]';
          isWide = true;
          showStats = true;
        } else {
          // QRLog (index 2), Sweep (index 3), Lessgo (index 4)
          cardClasses = 'md:col-span-1 h-[260px]';
        }

        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.6,
              delay: 0.1 * (index + 1),
              ease: [0.16, 1, 0.3, 1]
            }}
            onClick={() => onProjectClick(project)}
            className={`group relative overflow-hidden border border-white/5 cursor-pointer bg-black/20 hover:bg-black/40 hover:border-white/10 transition-all duration-300 flex flex-col justify-end p-6 ${cardClasses}`}
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
              
              <h4 className="font-display text-lg md:text-xl font-semibold text-primary lowercase flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {project.title}
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity animate-in fade-in duration-300" />
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
          </motion.div>
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
        className="md:col-span-1 h-[320px] border border-white/5 bg-black/10 flex flex-col justify-between p-6 select-none relative overflow-hidden group hover:border-white/10 transition-all duration-300"
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '20px 20px' }} />
        </div>
        
        <div className="space-y-2 relative z-10">
          <span className="inline-block font-mono text-[9px] text-zinc-600 uppercase tracking-wider">
            / status: active /
          </span>
          <h4 className="font-display text-lg md:text-xl font-semibold text-zinc-400 lowercase group-hover:text-primary transition-colors">
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
