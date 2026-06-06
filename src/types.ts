export interface Project {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  extendedDescription: string;
  image?: string;
  stats: { label: string; value: string }[];
  techStack: string[];
  architecture: { step: string; detail: string }[];
  metrics: { name: string; value: number; change: string }[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  techOptions: string[];
  defaultStack: string[];
  capabilities: string[];
}

export interface InquiryConfig {
  serviceId: string;
  techStack: string[];
  durationMonths: number;
  hasDesignSpecs: boolean;
  scaleLevel: 'startup' | 'enterprise' | 'global';
  estimatedBudget: number;
}
