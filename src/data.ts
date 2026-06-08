import { Project, Service } from './types';
import taskstackImg from '../assets/Taskstack.png';
import serinImg from '../assets/Serin.png';
import qrlogImg from '../assets/qrlog.png';
import sweepImg from '../assets/sweep.png';

export const PROJECTS: Project[] = [
  {
    id: 'fintech-shell',
    title: 'next-gen asset management',
    subtitle: 'fintech shell',
    tag: 'fintech shell',
    description: 'custom-built financial infrastructure for rapid transaction processing and real-time auditing.',
    extendedDescription: 'A comprehensive, sovereign trading and ledger platform engineered for lightning-fast order execution, multi-currency clearings, and automated reconciliation systems. It utilizes high-capacity streaming pipelines to support thousands of parallel trades with sub-millisecond execution times.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNI82HXZ-JoQ-y3Y6h2Xkcz-ceu2r0YdS69L_twGLxjbpaMeICBm1BoibmQiKvhoaYJ0WMZQELpaqItUTuWcgxPHbxny5mSp20syOu7stOeaZM0cCNrdhrwvjGCuQ7USHyDJwEbZBgtYQpCQhN7a2TqHyK-nGiA5NJ4q691TgWdLliN4QynQn_iRBgD0gFG5dXa67iMUly7zCKurGhKH3SuXcEQkgGdF8UTG7BN_6brcRMaN-hd4NdeDwYg6e9OaN3yRRolr2a48tp',
    stats: [
      { label: 'execution latency', value: '0.84ms' },
      { label: 'throughput', value: '250k/sec' },
      { label: 'compliance standard', value: 'SOCI/II' },
      { label: 'historical data size', value: '4.2 PB' }
    ],
    techStack: ['Rust', 'Apache Kafka', 'gRPC', 'PostgreSQL', 'WebAssembly'],
    architecture: [
      { step: 'ingestion layer', detail: 'Distributed Rust ingest API with load balancing' },
      { step: 'streaming pool', detail: 'Real-time state validation using Kafka topic clusters' },
      { step: 'consensus ledger', detail: 'Optimistic locking database engine with immutable double-entry tracks' },
      { step: 'auditing pipeline', detail: 'Isolated background process publishing cryptographically signed audit logs' }
    ],
    metrics: [
      { name: 'API Latency', value: 0.84, change: '-4.2%' },
      { name: 'Ingestion Queue Depletion', value: 99.98, change: '+0.01%' },
      { name: 'System Core Utilization', value: 41.2, change: '+1.5%' }
    ]
  },
  {
    id: 'nebulas-core',
    title: 'nebulas core',
    subtitle: 'decentralized serverless architecture',
    tag: 'cloud computing',
    description: 'decentralized serverless architecture providing edge-native computing for ultra-low latency applications.',
    extendedDescription: 'Nebulas Core redesigns standard function-as-a-service (FaaS) by scattering deployment instances right across global edge hubs. It eliminates cold-starts entirely by maintaining warm pre-allocated sandboxes on a custom microVM matrix.',
    stats: [
      { label: 'microVM boot time', value: '8ms' },
      { label: 'cold starts', value: '0.00%' },
      { label: 'active global points', value: '240+' },
      { label: 'total compute savings', value: '42%' }
    ],
    techStack: ['Go', 'Firecracker MicroVMs', 'WebAssembly', 'Cloudflare Workers', 'eBPF'],
    architecture: [
      { step: 'edge routing', detail: 'Anycast DNS network routing requests to nearest edge node' },
      { step: 'container layer', detail: 'On-demand microVM orchestration powered by AWS Firecracker' },
      { step: 'isolated sandbox', detail: 'Wasm-runtime sandbox for light-weight customer application sandboxing' },
      { step: 'telemetry track', detail: 'Low-overhead profiling and diagnostic collection backed by eBPF' }
    ],
    metrics: [
      { name: 'Cold Start Ratio', value: 0.0, change: '0.0%' },
      { name: 'Request Success Rate', value: 99.999, change: '+0.001%' },
      { name: 'Avg Execution Cost', value: 0.042, change: '-12.8%' }
    ]
  },
  {
    id: 'automata-ci',
    title: 'automata ci',
    subtitle: 'intelligent deployment pipelines',
    tag: 'devops',
    description: 'intelligent, predictive deployment pipelines utilizing reinforcement learning to optimize dependency building.',
    extendedDescription: 'Automata CI introduces intelligent, self-organizing dependency graph compilers that scan source configurations to cache and compile intermediate stages with extreme efficiency. It provides precise failure pinpointing and container-safe hot deployments.',
    stats: [
      { label: 'avg build speedup', value: '4.8x' },
      { label: 'cache hit ratio', value: '94.2%' },
      { label: 'auto-remediations', value: '38%' },
      { label: 'pipeline health rate', value: '99.8%' }
    ],
    techStack: ['Python', 'Docker', 'Kubernetes', 'Dvc', 'TypeScript'],
    architecture: [
      { step: 'graph compiler', detail: 'Generates dependency graphs based on changed AST nodes' },
      { step: 'caching layer', detail: 'Distributed segment cache using object storage with SHA hash keys' },
      { step: 'parallel runner', detail: 'Multi-node workflow runner scaling cleanly on Kubernetes clusters' },
      { step: 'fault analyzer', detail: 'Generates actionable insights and automatic pull request recommendations on failure' }
    ],
    metrics: [
      { name: 'Build Inbound Rate', value: 382, change: '+12%' },
      { name: 'Cache Savings Time', value: 16.8, change: '+2.4h' },
      { name: 'Orchestrator Idle Overhead', value: 1.8, change: '-0.3%' }
    ]
  },
  {
    id: 'taskstack',
    title: 'taskstack',
    subtitle: 'ai-powered task management',
    tag: 'webapp',
    description: 'AI-powered todo list that automatically generates daily task lists based on user goals, personalized for each user.',
    extendedDescription: 'TaskStack leverages advanced machine learning algorithms to understand user goals and automatically generate optimized daily todo lists. The system learns from user behavior patterns and adapts task suggestions in real-time, prioritizing high-impact tasks and distributing workload intelligently across the day.',
    image: taskstackImg,
    stats: [
      { label: 'users reached', value: '5k+' },
      { label: 'daily tasks generated', value: '50k+' },
      { label: 'completion rate', value: '87%' },
      { label: 'ai accuracy', value: '94%' }
    ],
    techStack: ['React', 'Node.js', 'MongoDB', 'Python', 'TensorFlow'],
    architecture: [
      { step: 'frontend', detail: 'Responsive React webapp with real-time task synchronization' },
      { step: 'ml engine', detail: 'Python-based ML pipeline for goal analysis and task generation' },
      { step: 'backend api', detail: 'Node.js REST API with MongoDB for persistent data storage' },
      { step: 'analytics', detail: 'User behavior tracking and completion pattern analysis' }
    ],
    metrics: [
      { name: 'Daily Active Users', value: 1250, change: '+18%' },
      { name: 'Avg Task Completion', value: 87, change: '+5.2%' },
      { name: 'System Response Time', value: 245, change: '-32ms' }
    ]
  },
  {
    id: 'serin',
    title: 'serin',
    subtitle: 'ai seo optimization tool',
    tag: 'webapp',
    description: 'AI-powered SEO tool that provides intelligent keyword analysis, content optimization, and ranking predictions.',
    extendedDescription: 'Serin uses advanced NLP and machine learning to analyze search intent, competitor strategies, and content performance. It delivers real-time optimization recommendations, auto-generates SEO-friendly content variations, and predicts ranking improvements with high accuracy.',
    image: serinImg,
    stats: [
      { label: 'websites optimized', value: '2.5k+' },
      { label: 'avg ranking lift', value: '+23%' },
      { label: 'content variants generated', value: '100k+' },
      { label: 'prediction accuracy', value: '91%' }
    ],
    techStack: ['Vue.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Elasticsearch'],
    architecture: [
      { step: 'content analyzer', detail: 'NLP engine for SERP analysis and keyword clustering' },
      { step: 'recommendation engine', detail: 'ML-based suggestions for on-page and technical SEO' },
      { step: 'content generator', detail: 'AI copywriting system for optimized meta descriptions and titles' },
      { step: 'ranking tracker', detail: 'Real-time position tracking across multiple search engines' }
    ],
    metrics: [
      { name: 'Avg Ranking Improvement', value: 23, change: '+6.8%' },
      { name: 'Content Optimization Index', value: 78.5, change: '+12.3%' },
      { name: 'API Response Time', value: 342, change: '-89ms' }
    ]
  },
  {
    id: 'qrlog',
    title: 'qrlog',
    subtitle: 'qr code scanner & generator',
    tag: 'android app',
    description: 'Android app that maintains comprehensive logs of all QR codes scanned and allows users to generate custom QR codes easily.',
    extendedDescription: 'QRLog is a feature-rich Android application that provides seamless QR code scanning with automatic logging, history management, and custom QR generation. The app stores all scans with timestamps, locations, and metadata for easy retrieval and analytics.',
    image: qrlogImg,
    stats: [
      { label: 'downloads', value: '50k+' },
      { label: 'scans logged', value: '2M+' },
      { label: 'avg rating', value: '4.7/5' },
      { label: 'active users', value: '15k' }
    ],
    techStack: ['Kotlin', 'Jetpack Compose', 'Room Database', 'Firebase', 'Google ML Kit'],
    architecture: [
      { step: 'scanner module', detail: 'Google ML Kit-powered QR detection with real-time preview' },
      { step: 'local database', detail: 'Room database for offline-first scan logging and history' },
      { step: 'qr generator', detail: 'Custom QR encoding with styling and customization options' },
      { step: 'sync service', detail: 'Firebase cloud sync for cross-device data availability' }
    ],
    metrics: [
      { name: 'Daily Scans', value: 8500, change: '+22%' },
      { name: 'App Retention Rate', value: 68, change: '+8.5%' },
      { name: 'Average Session Duration', value: 12.3, change: '+1.2m' }
    ]
  },
  {
    id: 'sweep',
    title: 'sweep',
    subtitle: 'auto screenshot deletion',
    tag: 'utility app',
    description: 'Automated screenshot deletion app that intelligently manages storage by removing old screenshots based on customizable rules.',
    extendedDescription: 'Sweep intelligently monitors your device storage and automatically deletes screenshots based on age, size, and custom rules you define. It includes smart categorization, manual review options, and detailed analytics to help you reclaim storage space without losing important captures.',
    image: sweepImg,
    stats: [
      { label: 'storage freed', value: '1.2M GB' },
      { label: 'screenshots deleted', value: '50M+' },
      { label: 'user satisfaction', value: '92%' },
      { label: 'daily active users', value: '8k' }
    ],
    techStack: ['Swift', 'iOS SDK', 'CloudKit', 'Core ML', 'AVFoundation'],
    architecture: [
      { step: 'file monitor', detail: 'Background service monitoring camera roll changes' },
      { step: 'ml classifier', detail: 'On-device ML model for screenshot quality and importance' },
      { step: 'auto deletion', detail: 'Rule-based deletion engine with safety reviews' },
      { step: 'analytics dashboard', detail: 'Storage insights and deletion history tracking' }
    ],
    metrics: [
      { name: 'Avg Storage Freed (MB)', value: 2850, change: '+340%' },
      { name: 'Safe Deletion Rate', value: 99.2, change: '+0.8%' },
      { name: 'User Retention', value: 76, change: '+12.3%' }
    ]
  }
];

export const SERVICES: Service[] = [
  {
    id: 'software-dev',
    title: 'software development',
    description: 'full-stack solutions using rust, go, and modern typescript. precision-engineered for speed and security.',
    iconName: 'terminal',
    techOptions: ['Rust', 'Go', 'TypeScript', 'C++', 'Python', 'WebAssembly'],
    defaultStack: ['Rust', 'Go', 'TypeScript'],
    capabilities: [
      'High-throughput API backend systems',
      'WebAssembly-driven web and client apps',
      'Extremely safe, typed, memory-efficient products',
      'Real-time message broker hubs (Kafka, Redis)'
    ]
  },
  {
    id: 'ui-ux',
    title: 'ui/ux design',
    description: 'minimalist, functional design systems that prioritize user efficiency, aesthetic precision, and technical clarity.',
    iconName: 'layout',
    techOptions: ['Figma', 'Preact', 'Tailwind', 'Framer Motion', 'Design Tokens'],
    defaultStack: ['Figma', 'Tailwind', 'Framer Motion'],
    capabilities: [
      'Precision wireframing and design blueprints',
      'Highly custom interaction logic and micro-animations',
      'Responsive multi-screen user architectures',
      'Thematic, dark-mode specialized color design'
    ]
  },
  {
    id: 'cloud-solutions',
    title: 'cloud solutions',
    description: 'highly available infrastructure on aws and gcp. auto-scaling and zero-downtime deployment strategies.',
    iconName: 'cloud',
    techOptions: ['AWS', 'GCP', 'Kubernetes', 'Terraform', 'Docker', 'Nginx'],
    defaultStack: ['AWS', 'Kubernetes', 'Terraform'],
    capabilities: [
      'Sovereign multi-region VPC architectures',
      'Infrastructure as Code (IaC) templates',
      'Automatic peak-demand horizontal scaling',
      'SLA-backed database backup and replications'
    ]
  },
  {
    id: 'data-analytics',
    title: 'data analytics',
    description: 'real-time processing of large-scale datasets with custom database clusters and sleek visual dashboards.',
    iconName: 'bar-chart-2',
    techOptions: ['ClickHouse', 'PostgreSQL', 'Apache Spark', 'Python (Pandas)', 'D3.js'],
    defaultStack: ['ClickHouse', 'PostgreSQL', 'D3.js'],
    capabilities: [
      'Sub-second query engines for billion-row datasets',
      'Real-time streaming analytical ingestion pipelines',
      'Responsive diagnostic dashboards',
      'Automated telemetry tracking and metrics reports'
    ]
  }
];
