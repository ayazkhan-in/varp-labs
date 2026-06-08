import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectsGalleryProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export default function ProjectsGallery({ projects, onProjectClick }: ProjectsGalleryProps) {
  const firstProject = projects[0];
  const remainingProjects = projects.slice(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Main Featured Card - TaskStack */}
      {firstProject && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => onProjectClick(firstProject)}
          className="md:col-span-7 group relative overflow-hidden border border-white/5 aspect-video md:aspect-auto md:h-[500px] cursor-pointer bg-black/40 hover:bg-black/60 transition-all duration-500"
        >
          {/* Image - Fully Visible */}
          {firstProject.image && (
            <img 
              src={firstProject.image} 
              alt={firstProject.title}
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-[1.02] transition-all duration-700" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          {/* Content at Bottom */}
          <div className="absolute bottom-0 p-6 md:p-8 w-full space-y-4 relative z-10">
            <span className="inline-block font-mono text-[10px] text-secondary border border-white/10 px-2.5 py-1 bg-background/80 lowercase tracking-wider">
              / {firstProject.tag} /
            </span>
            
            <div>
              <h3 className="font-display text-2xl md:text-4xl font-semibold text-primary lowercase mb-2 flex items-center gap-2">
                {firstProject.title}
                <ArrowUpRight size={24} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="font-sans text-secondary text-sm md:text-base lowercase leading-relaxed max-w-2xl">
                {firstProject.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Secondary Cards Grid - Remaining Projects */}
      <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-2 gap-6 grid-rows-2">
        {remainingProjects.map((project, index) => (
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
            className={`group relative overflow-hidden border border-white/5 cursor-pointer bg-black/20 hover:bg-black/40 hover:border-white/10 transition-all duration-300 flex flex-col justify-end p-6 ${
              index === 0 ? 'md:col-span-2 min-h-[240px]' : 'md:col-span-1 min-h-[240px]'
            }`}
          >
            {/* Image Background */}
            {project.image && (
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 space-y-3">
              <span className="inline-block font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
                / {project.tag} /
              </span>
              
              <h4 className="font-display text-lg md:text-xl font-semibold text-primary lowercase flex items-center justify-between">
                {project.title}
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              
              <p className="font-sans text-secondary text-xs lowercase leading-relaxed line-clamp-2">
                {project.description}
              </p>

              {/* Stats for first remaining card */}
              {index === 0 && (
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
        ))}
      </div>
    </div>
  );
}

