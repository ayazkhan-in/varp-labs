import { motion } from 'motion/react';
import { Service } from '../types';
import { SERVICES } from '../data';
import { Terminal, Layout, Cloud, BarChart2, Code2 } from 'lucide-react';

export default function ServicesPanel() {

  // Maps custom dynamic name strings to pre-compiled Lucide React icons
  const renderIcon = (iconName: string) => {
    const iconProps = { className: "text-primary group-hover:scale-110 transition-transform duration-300", size: 24 };
    switch (iconName) {
      case 'terminal':
        return <Terminal {...iconProps} />;
      case 'layout':
        return <Layout {...iconProps} />;
      case 'cloud':
        return <Cloud {...iconProps} />;
      case 'bar-chart-2':
        return <BarChart2 {...iconProps} />;
      default:
        return <Code2 {...iconProps} />;
    }
  };

  return (
    <div className="space-y-12">
      {/* Services Grid with staggered scroll animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-text">
        {SERVICES.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.16, 1, 0.3, 1] // Custom refined cubic-bezier easeOut
            }}
            className="group border border-white/5 bg-white/[0.01] p-8 space-y-6 hover:bg-white/[0.02] hover:border-white/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Service Icon indicator */}
              <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-black/40">
                {renderIcon(service.iconName)}
              </div>
              
              <h4 className="font-display text-xl text-primary lowercase font-medium">
                {service.title}
              </h4>
              
              <p className="font-body-md text-secondary lowercase text-sm leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* List capabilities with subtle dots */}
            <ul className="space-y-2 border-t border-white/5 pt-4">
              {service.capabilities.map((cap, i) => (
                <li key={i} className="flex items-start gap-2.5 font-sans text-xs text-secondary lowercase">
                  <span className="w-1.5 h-1.5 rounded-none bg-zinc-700 mt-1.5" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
