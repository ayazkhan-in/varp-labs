import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Mic, Play, RotateCcw, Check, 
  AlertCircle, Calendar, Sparkles, BookOpen, 
  TrendingUp, Clock, Sliders, ChevronRight,
  Flame, Award, BookOpenCheck, Volume2, ArrowRight
} from 'lucide-react';
import teachbackLogo from '../../assets/Teachback.png';
import { arrayUnion, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

interface TeachbackLandingPageProps {
  onBackHome: () => void;
}

interface TopicPreset {
  id: string;
  emoji: string;
  name: string;
  category: string;
  concepts: string[];
  goodExp: {
    text: string;
    clarity: number;
    accuracy: number;
    confidence: number;
    feedback: string;
    gaps: string[];
  };
  badExp: {
    text: string;
    clarity: number;
    accuracy: number;
    confidence: number;
    feedback: string;
    gaps: string[];
  };
}

const TOPIC_PRESETS: TopicPreset[] = [
  {
    id: 'quantum',
    emoji: '⚛️',
    name: 'Quantum Computing',
    category: 'Computer Science',
    concepts: ['Superposition', 'Entanglement', 'Qubits', 'Quantum Decoherence'],
    goodExp: {
      text: "Quantum computing is a type of computing that uses quantum mechanics to process information. Unlike regular computers that use bits of 0 and 1, quantum computers use qubits. Qubits can exist in a superposition of both 0 and 1 at the same time. They also use quantum entanglement, which links qubits together so their states depend on each other. However, these systems are very sensitive, and noise can cause quantum decoherence, where the system loses its quantum properties.",
      clarity: 94,
      accuracy: 96,
      confidence: 90,
      feedback: "Exceptional job! You explained qubits, superposition, and entanglement clearly, and correctly identified quantum decoherence as a key physical challenge.",
      gaps: []
    },
    badExp: {
      text: "Quantum computers are super fast computers that use qubits. They use superposition to do many things at once. I think they are cool but they are hard to build because they have to be kept very cold.",
      clarity: 45,
      accuracy: 50,
      confidence: 65,
      feedback: "You explained the basic speed improvement but missed the core physics. You did not explain qubits in detail, nor did you cover entanglement or decoherence.",
      gaps: ['Quantum Entanglement', 'Quantum Decoherence', 'Superposition details']
    }
  },
  {
    id: 'photosynthesis',
    emoji: '🌿',
    name: 'Photosynthesis',
    category: 'Biology',
    concepts: ['Chloroplasts', 'Light-dependent reactions', 'Calvin Cycle', 'Chlorophyll'],
    goodExp: {
      text: "Photosynthesis is the process where plants convert light energy into chemical energy. It happens in chloroplasts using chlorophyll, which absorbs sunlight. In the light-dependent reactions, water is split using sunlight to produce oxygen and energy carriers ATP and NADPH. Then, in the Calvin Cycle (light-independent reactions), the plant uses carbon dioxide along with that ATP and NADPH to synthesize glucose.",
      clarity: 96,
      accuracy: 98,
      confidence: 94,
      feedback: "Great structure. You mapped out both the light-dependent and Calvin cycle reactions, and correctly identified chlorophyll and chloroplasts as the site of action.",
      gaps: []
    },
    badExp: {
      text: "Plants eat sunlight and water to make oxygen and food. It uses chlorophyll which makes them green and absorbs the sun.",
      clarity: 52,
      accuracy: 58,
      confidence: 50,
      feedback: "A very basic overview. To teach this effectively, explain the two main reaction stages (light-dependent and the Calvin Cycle) and the role of chloroplasts.",
      gaps: ['Calvin Cycle (Light-Independent)', 'Light-dependent reactions', 'Chloroplasts']
    }
  },
  {
    id: 'spacedrep',
    emoji: '🧠',
    name: 'Spaced Repetition',
    category: 'Learning Science',
    concepts: ['Forgetting Curve', 'Active Recall', 'Optimal Intervals', 'Ebbinghaus'],
    goodExp: {
      text: "Spaced repetition is a learning technique based on the Ebbinghaus forgetting curve, which states memory decays exponentially. By using active recall to test ourselves right before we would forget, we strengthen neural connections. Spaced repetition automatically schedules future reviews at increasing intervals (like 1 day, 3 days, 8 days) to move information into long-term memory efficiently.",
      clarity: 95,
      accuracy: 94,
      confidence: 92,
      feedback: "Well explained. Mentioning Hermann Ebbinghaus and the forgetting curve provides strong scientific context. Excellent explanation of active recall.",
      gaps: []
    },
    badExp: {
      text: "Spaced repetition is when you study things at different times. If you study it today, you study it again in a few days so you don't forget it. It's better than cramming.",
      clarity: 48,
      accuracy: 62,
      confidence: 55,
      feedback: "Correct in premise, but lacking the scientific reasoning. Make sure to reference active recall, the forgetting curve, and how intervals expand over time.",
      gaps: ['Forgetting Curve / Ebbinghaus', 'Active Recall', 'Expanding Intervals']
    }
  },
  {
    id: 'loadbalancer',
    emoji: '🗃️',
    name: 'Load Balancers',
    category: 'System Design',
    concepts: ['Traffic Distribution', 'Routing Algorithms', 'Health Checks', 'High Availability'],
    goodExp: {
      text: "A load balancer is a device or software that acts as a reverse proxy, distributing network or application traffic across multiple backend servers. It prevents any single server from becoming a bottleneck, increasing capacity and reliability. It uses routing algorithms like Round Robin or Least Connections to direct traffic, and performs health checks to route around failed servers, achieving high availability.",
      clarity: 97,
      accuracy: 95,
      confidence: 91,
      feedback: "Flawless explanation. You correctly identified its reverse-proxy nature, mentioned load balancing algorithms, and explained health checks and high availability.",
      gaps: []
    },
    badExp: {
      text: "Load balancers split traffic between servers. If you have a lot of users, it sends some to server A and some to server B so they don't crash.",
      clarity: 55,
      accuracy: 60,
      confidence: 70,
      feedback: "You have the basic idea, but missed crucial technical details. Explain the algorithms used to route traffic and how health checks guarantee high availability.",
      gaps: ['Routing Algorithms', 'Health Checks', 'High Availability']
    }
  }
];

export default function TeachbackLandingPage({ onBackHome }: TeachbackLandingPageProps) {
  // Navigation & UI States
  const [simulatorStep, setSimulatorStep] = useState<'topic' | 'explain' | 'loading' | 'results'>('topic');
  const [selectedPreset, setSelectedPreset] = useState<TopicPreset>(TOPIC_PRESETS[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [activeTab, setActiveTab] = useState<'speak' | 'write'>('speak');
  
  // Simulation Input States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [typedExplanation, setTypedExplanation] = useState('');
  const [simulatedTranscript, setSimulatedTranscript] = useState('');
  const [simulationQuality, setSimulationQuality] = useState<'good' | 'bad'>('good');
  
  // Results State
  const [resultsData, setResultsData] = useState({
    title: '',
    clarity: 0,
    accuracy: 0,
    confidence: 0,
    feedback: '',
    gaps: [] as string[],
    mastered: [] as string[]
  });
  
  // Day-One vs Current comparison active topic
  const [compareTopic, setCompareTopic] = useState<'dns' | 'react'>('dns');
  
  // Streak Calendar interactive grid
  const [streakDays, setStreakDays] = useState(
    Array.from({ length: 28 }, (_, i) => ({
      day: i + 1,
      active: i < 14 || [16, 17, 20, 21, 24, 25, 27].includes(i)
    }))
  );

  // Waitlist States
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistSaving, setWaitlistSaving] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');

  const recordingIntervalRef = useRef<number | null>(null);
  const transcriptionTimeoutRef = useRef<number | null>(null);

  // Handle Preset select
  const handlePresetSelect = (preset: TopicPreset) => {
    setSelectedPreset(preset);
    setCustomTopic('');
  };

  // Start the explanation step
  const handleStartTeaching = () => {
    setSimulatorStep('explain');
    setTypedExplanation('');
    setSimulatedTranscript('');
    setIsRecording(false);
    setRecordingProgress(0);
  };

  // Simulate Speak Button
  const handleToggleRecord = () => {
    if (isRecording) {
      stopRecordingAndAnalyze();
    } else {
      setIsRecording(true);
      setRecordingProgress(0);
      setSimulatedTranscript('');
      
      const targetText = simulationQuality === 'good' ? selectedPreset.goodExp.text : selectedPreset.badExp.text;
      const words = targetText.split(' ');
      let wordIndex = 0;

      // Increment progress bar
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingProgress(prev => {
          if (prev >= 100) {
            stopRecordingAndAnalyze();
            return 100;
          }
          return prev + 2;
        });
      }, 300);

      // Type words sequentially to simulate speech-to-text
      const typeWords = () => {
        if (wordIndex < words.length) {
          const nextChunk = words.slice(0, wordIndex + 3).join(' ');
          setSimulatedTranscript(nextChunk);
          wordIndex += 3;
          transcriptionTimeoutRef.current = window.setTimeout(typeWords, 350);
        }
      };
      typeWords();
    }
  };

  const stopRecordingAndAnalyze = () => {
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    if (transcriptionTimeoutRef.current) clearTimeout(transcriptionTimeoutRef.current);
    setIsRecording(false);
    
    // Auto submit transcription
    handleSubmitExplanation(simulationQuality === 'good' ? selectedPreset.goodExp.text : selectedPreset.badExp.text);
  };

  // Handle submit
  const handleSubmitExplanation = (textToSubmit: string) => {
    setSimulatorStep('loading');
    
    // Simulate loading process steps
    setTimeout(() => {
      const isGood = simulationQuality === 'good';
      const expSource = isGood ? selectedPreset.goodExp : selectedPreset.badExp;
      
      setResultsData({
        title: customTopic || selectedPreset.name,
        clarity: expSource.clarity,
        accuracy: expSource.accuracy,
        confidence: expSource.confidence,
        feedback: expSource.feedback,
        gaps: expSource.gaps,
        mastered: selectedPreset.concepts.filter(c => !expSource.gaps.includes(c))
      });
      setSimulatorStep('results');
    }, 2500);
  };

  const handleResetSimulator = () => {
    setSimulatorStep('topic');
    setCustomTopic('');
    setTypedExplanation('');
    setSimulatedTranscript('');
  };

  const toggleStreakDay = (index: number) => {
    setStreakDays(prev => 
      prev.map((day, i) => i === index ? { ...day, active: !day.active } : day)
    );
  };

  // Load curriculum topic into simulator
  const handleLoadCurriculumTopic = (topicName: string) => {
    const matched = TOPIC_PRESETS.find(p => p.name.toLowerCase() === topicName.toLowerCase());
    if (matched) {
      setSelectedPreset(matched);
      setCustomTopic('');
    } else {
      setCustomTopic(topicName);
    }
    setSimulatorStep('explain');
    setTypedExplanation('');
    setSimulatedTranscript('');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      if (transcriptionTimeoutRef.current) clearTimeout(transcriptionTimeoutRef.current);
    };
  }, []);

  const handleWaitlistSubmit = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return;
    }

    setWaitlistSaving(true);
    setWaitlistError('');

    try {
      await setDoc(
        doc(db, 'teachback-waitlist', 'teachback waitlist'),
        {
          emails: arrayUnion(normalizedEmail),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setWaitlistEmail(normalizedEmail);
      setWaitlistSubmitted(true);
    } catch (error) {
      console.error('Failed to save teachback waitlist email', error);
      setWaitlistError('We could not save your email right now. Please try again in a moment.');
    } finally {
      setWaitlistSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] font-sans selection:bg-[#000000] selection:text-[#FFCE18] antialiased">
      
      {/* Stark Navbar */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b-4 border-[#000000]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src={teachbackLogo} 
              alt="TeachBack Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-[#000000] rounded-lg shadow-[2px_2px_0px_0px_#000000]"
            />
            <span className="font-bold text-lg sm:text-2xl tracking-tight uppercase">TeachBack</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => {
                const el = document.getElementById('simulator');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden sm:block border-2 border-[#000000] bg-[#FFFFFF] hover:bg-zinc-100 px-4 py-1.5 rounded-lg font-bold text-sm shadow-[3px_3px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000000] transition-all cursor-pointer"
            >
              Try Simulator
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('waitlist-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-2 border-[#000000] bg-[#FFCE18] px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-lg font-bold text-xs sm:text-sm shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000000] transition-all cursor-pointer"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </header>

      {/* Hero Poster Section */}
      <section className="bg-[#FFCE18] border-b-4 border-[#000000] py-16 md:py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block border-2 border-[#000000] bg-[#FFFFFF] text-[#000000] font-bold text-xs uppercase px-3 py-1 rounded-md tracking-wider">
              🧠 Active Recall + Spaced Repetition
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none uppercase tracking-tighter">
              Stop studying.<br />
              <span className="bg-[#000000] text-[#FFFFFF] px-2 py-0.5 inline-block my-1 border-4 border-[#000000]">Start teaching.</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-relaxed max-w-2xl">
              TeachBack is an AI-powered tutor designed around the Feynman Technique. Explain topics aloud; our AI evaluates your core understanding, highlights missing details, and schedules spaced review loops to secure long-term retention.
            </p>

            {waitlistSubmitted ? (
              <div className="border-4 border-[#000000] bg-[#FFFFFF] p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000000] max-w-lg">
                <p className="text-xl font-bold uppercase mb-1">🎉 You're on the list!</p>
                <p className="font-bold text-sm">We've saved your spot. We'll contact you at <span className="underline">{waitlistEmail}</span> when early access slots open.</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-xl">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleWaitlistSubmit(waitlistEmail);
                  }}
                  className="flex flex-col sm:flex-row gap-3 pt-2"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email for early access"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    disabled={waitlistSaving}
                    className="flex-1 bg-[#FFFFFF] border-4 border-[#000000] px-4 py-3.5 rounded-xl font-bold text-base shadow-[4px_4px_0px_0px_#000000] focus:outline-none focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[6px_6px_0px_0px_#000000] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={waitlistSaving}
                    className="bg-[#000000] text-[#FFFFFF] border-4 border-[#000000] font-bold px-6 py-3.5 rounded-xl hover:bg-[#FFFFFF] hover:text-[#000000] shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer uppercase text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#000000] disabled:hover:text-[#FFFFFF] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                  >
                    {waitlistSaving ? 'Saving...' : 'Join Waitlist'}
                  </button>
                </form>
                {waitlistError && (
                  <p className="font-bold text-sm text-red-700 border-2 border-red-700 bg-white px-3 py-2 rounded-lg shadow-[3px_3px_0px_0px_#000000]">
                    {waitlistError}
                  </p>
                )}
                <div className="flex gap-4 font-bold text-xs uppercase pt-1">
                  <button 
                    onClick={() => {
                      const el = document.getElementById('simulator');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:underline cursor-pointer flex items-center gap-1 text-[#000000]"
                  >
                    Try Interactive Simulator <ArrowRight size={12} />
                  </button>
                  <span className="text-[#000000]/40">•</span>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('features');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:underline cursor-pointer text-[#000000]"
                  >
                    How it works
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hero Poster Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative border-4 border-[#000000] bg-[#FFFFFF] p-6 rounded-3xl w-full max-w-[400px] shadow-[12px_12px_0px_0px_#000000] rotate-2 hover:rotate-0 transition-transform duration-300">
              
              <div className="border-b-4 border-[#000000] pb-4 mb-4 flex justify-between items-center">
                <span className="font-bold uppercase tracking-wider text-sm">active explanation</span>
                <span className="w-3.5 h-3.5 bg-[#FFCE18] rounded-full border-2 border-[#000000] animate-pulse"></span>
              </div>
              
              <div className="space-y-4">
                {/* Simulated Audio Bars */}
                <div className="bg-[#FFCE18] border-4 border-[#000000] p-4 rounded-xl flex items-center justify-around h-24">
                  {[20, 45, 80, 60, 30, 90, 75, 40, 60, 20, 85, 50].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-2 bg-[#000000] rounded-full" 
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                {/* Simulated Transcription Card */}
                <div className="border-2 border-[#000000] p-3.5 rounded-xl space-y-2 text-sm">
                  <div className="flex gap-2 items-center">
                    <span className="font-bold uppercase text-xs border border-[#000000] px-1.5 py-0.5 rounded bg-[#FFCE18]">AI Input</span>
                    <span className="font-bold text-xs">Topic: Quantum Qubits</span>
                  </div>
                  <p className="font-bold italic">
                    "So a qubit is in superposition, meaning it acts as both zero and one at the same time, unlike a regular bit..."
                  </p>
                </div>

                {/* Mini Result Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border-2 border-[#000000] p-3 rounded-xl bg-[#FFCE18] text-center">
                    <p className="text-xs uppercase font-bold">Clarity Score</p>
                    <p className="text-2xl font-bold">92%</p>
                  </div>
                  <div className="border-2 border-[#000000] p-3 rounded-xl bg-[#FFFFFF] text-center">
                    <p className="text-xs uppercase font-bold">Next Review</p>
                    <p className="text-sm font-bold mt-1">24 Hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Feynman Simulator Interactive Widget */}
      <section id="simulator" className="py-10 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 border-b-4 border-[#000000]">
        
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight">
            Feynman Technique Simulator
          </h2>
          <p className="text-sm sm:text-lg md:text-xl font-bold max-w-2xl mx-auto">
            Test your explaining skills right now. Select a topic, choose whether you want to simulate a strong or weak explanation, and see how our critique engine works.
          </p>
        </div>

        {/* Large Simulator Card */}
        <div className="border-4 border-[#000000] bg-[#FFFFFF] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_#000000]">
          
          {/* Card Titlebar */}
          <div className="bg-[#000000] text-[#FFFFFF] p-4 flex justify-between items-center font-bold text-sm uppercase">
            <span>Feynman Simulator // v1.0.4</span>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FFCE18]"></span>
              <span className="w-3 h-3 rounded-full bg-[#FFFFFF]"></span>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <AnimatePresence mode="wait">

              {/* STEP 1: SELECT TOPIC */}
              {simulatorStep === 'topic' && (
                <motion.div 
                  key="step-topic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold uppercase mb-2">Step 1: Choose a Topic</h3>
                    <p className="font-bold text-sm sm:text-base">Select one of our preset subjects or enter a custom topic to start.</p>
                  </div>

                  {/* Preset Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {TOPIC_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset)}
                        className={`text-left p-4 sm:p-5 border-4 border-[#000000] rounded-2xl transition-all cursor-pointer ${
                          selectedPreset.id === preset.id && !customTopic
                            ? 'bg-[#FFCE18] shadow-[4px_4px_0px_0px_#000000]' 
                            : 'bg-[#FFFFFF] hover:bg-zinc-100 hover:translate-y-[-2px]'
                        }`}
                      >
                        <div className="text-4xl mb-3">{preset.emoji}</div>
                        <div className="font-bold text-lg leading-tight mb-1">{preset.name}</div>
                        <div className="text-xs uppercase font-bold border border-[#000000] px-2 py-0.5 rounded inline-block bg-[#FFFFFF]">
                          {preset.category}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Topic Input */}
                  <div className="space-y-2 border-t-4 border-[#000000] pt-6">
                    <label className="block text-base sm:text-lg font-bold uppercase">Or Type a Custom Topic</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text"
                        value={customTopic}
                        onChange={(e) => {
                          setCustomTopic(e.target.value);
                          // Default custom topic preset mapping
                          setSelectedPreset(TOPIC_PRESETS[0]);
                        }}
                        placeholder="e.g. How the Internet Works, Newton's Laws..."
                        className="flex-1 bg-[#FFFFFF] border-4 border-[#000000] p-3 sm:p-4 rounded-xl font-bold text-sm sm:text-lg focus:outline-none focus:bg-[#FFCE18]/10 transition-colors"
                      />
                      <button
                        onClick={handleStartTeaching}
                        className="bg-[#FFCE18] border-4 border-[#000000] py-3 px-6 sm:py-3.5 sm:px-8 rounded-xl font-bold uppercase hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#000000] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer w-full sm:w-auto text-sm sm:text-base"
                      >
                        Teach it!
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleStartTeaching}
                      className="bg-[#000000] text-[#FFFFFF] border-4 border-[#000000] px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-bold uppercase hover:bg-[#FFFFFF] hover:text-[#000000] transition-colors cursor-pointer w-full sm:w-auto text-center text-sm sm:text-base"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: EXPLAIN SUBJECT */}
              {simulatorStep === 'explain' && (
                <motion.div 
                  key="step-explain"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold uppercase mb-1">Step 2: Explain it</h3>
                      <p className="font-bold text-sm sm:text-base">Topic: <span className="border-b-4 border-[#FFCE18] px-1">{customTopic || selectedPreset.name}</span></p>
                    </div>
                    
                    {/* Demo quality selector */}
                    <div className="border-4 border-[#000000] p-1 sm:p-1.5 rounded-xl flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setSimulationQuality('good')}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[10px] xs:text-xs uppercase cursor-pointer w-full sm:w-auto text-center ${
                          simulationQuality === 'good' ? 'bg-[#FFCE18]' : 'hover:bg-zinc-100'
                        }`}
                      >
                        Simulate Strong Explanation
                      </button>
                      <button
                        onClick={() => setSimulationQuality('bad')}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[10px] xs:text-xs uppercase cursor-pointer w-full sm:w-auto text-center ${
                          simulationQuality === 'bad' ? 'bg-[#FFCE18]' : 'hover:bg-zinc-100'
                        }`}
                      >
                        Simulate Explanation Gaps
                      </button>
                    </div>
                  </div>

                  {/* Audio vs Text Tabs */}
                  <div className="flex border-b-4 border-[#000000] w-full">
                    <button
                      onClick={() => setActiveTab('speak')}
                      className={`flex-1 sm:flex-initial text-center px-3 sm:px-6 py-2 sm:py-2.5 font-bold uppercase border-t-4 border-x-4 border-[#000000] rounded-t-xl translate-y-[4px] cursor-pointer text-[10px] xs:text-xs sm:text-base ${
                        activeTab === 'speak' ? 'bg-[#FFFFFF] z-10' : 'bg-[#FFCE18]/30 hover:bg-[#FFCE18]/50'
                      }`}
                    >
                      🎤 Explain Aloud
                    </button>
                    <button
                      onClick={() => setActiveTab('write')}
                      className={`flex-1 sm:flex-initial text-center px-3 sm:px-6 py-2 sm:py-2.5 font-bold uppercase border-t-4 border-x-4 border-[#000000] rounded-t-xl translate-y-[4px] ml-2 cursor-pointer text-[10px] xs:text-xs sm:text-base ${
                        activeTab === 'write' ? 'bg-[#FFFFFF] z-10' : 'bg-[#FFCE18]/30 hover:bg-[#FFCE18]/50'
                      }`}
                    >
                      ✍️ Write Explanation
                    </button>
                  </div>

                  {/* Tab Panels */}
                  <div className="pt-4">
                    {activeTab === 'speak' ? (
                      <div className="space-y-6">
                        <div className="border-4 border-[#000000] rounded-2xl bg-zinc-50 p-4 sm:p-8 flex flex-col items-center justify-center space-y-4">
                          
                          {isRecording ? (
                            <div className="w-full space-y-6">
                              {/* Recording Active View */}
                              <div className="flex justify-center items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping shrink-0"></span>
                                <span className="font-bold text-[10px] xs:text-xs sm:text-sm uppercase tracking-widest text-[#000000]">Transcribing Real-Time Audio...</span>
                              </div>

                              {/* Active Audio Wave visualizer */}
                              <div className="h-16 flex items-center justify-center gap-1 sm:gap-1.5">
                                {Array.from({ length: 24 }).map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className={`w-1 bg-[#000000] rounded-full sm:w-1.5 ${i >= 12 ? 'hidden xs:block' : ''}`}
                                    animate={{
                                      height: [
                                        '10px',
                                        `${15 + Math.random() * 45}px`,
                                        '10px'
                                      ]
                                    }}
                                    transition={{
                                      duration: 0.5 + Math.random() * 0.5,
                                      repeat: Infinity,
                                      ease: 'easeInOut'
                                    }}
                                  />
                                ))}
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-[#FFFFFF] border-2 border-[#000000] h-4 rounded-full overflow-hidden">
                                <div className="bg-[#FFCE18] h-full" style={{ width: `${recordingProgress}%` }} />
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={handleToggleRecord}
                              className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FFCE18] border-4 border-[#000000] rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_0px_#000000] transition-all cursor-pointer shrink-0"
                            >
                              <Mic size={32} className="sm:w-9 sm:h-9" strokeWidth={2.5} />
                            </button>
                          )}

                          <p className="font-bold uppercase text-[10px] sm:text-sm text-center">
                            {isRecording ? 'Recording... Click button to stop & submit' : 'Click microphone to simulate talking aloud'}
                          </p>
                        </div>

                        {/* Speech Real-Time Transcript Display */}
                        {simulatedTranscript && (
                          <div className="border-4 border-[#000000] p-4 sm:p-5 rounded-2xl bg-[#FFCE18]/10">
                            <h4 className="font-bold uppercase text-[10px] sm:text-xs tracking-wider mb-2">Speech-to-Text Transcript:</h4>
                            <p className="font-bold italic text-sm sm:text-lg">"{simulatedTranscript}"</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <textarea
                          value={typedExplanation}
                          onChange={(e) => setTypedExplanation(e.target.value)}
                          placeholder={`Explain ${customTopic || selectedPreset.name} in your own words as if teaching a 12-year-old...`}
                          className="w-full h-44 bg-[#FFFFFF] border-4 border-[#000000] p-3.5 sm:p-4 rounded-2xl font-bold text-sm sm:text-base focus:outline-none focus:bg-[#FFCE18]/5 shadow-[4px_4px_0px_0px_#000000] resize-none"
                        />
                        
                        {/* Quick fills */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                          <span className="font-bold text-xs uppercase">Quick Fill:</span>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setTypedExplanation(selectedPreset.goodExp.text)}
                              className="border-2 border-[#000000] bg-[#FFFFFF] px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase hover:bg-zinc-100 cursor-pointer"
                            >
                              Load Strong Explanation
                            </button>
                            <button
                              onClick={() => setTypedExplanation(selectedPreset.badExp.text)}
                              className="border-2 border-[#000000] bg-[#FFFFFF] px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase hover:bg-zinc-100 cursor-pointer"
                            >
                              Load Weak Explanation
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between sm:items-center pt-6 border-t-4 border-[#000000]">
                    <button
                      onClick={handleResetSimulator}
                      className="border-4 border-[#000000] bg-[#FFFFFF] px-6 py-3 rounded-xl font-bold uppercase hover:bg-zinc-100 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer w-full sm:w-auto text-center"
                    >
                      Back
                    </button>
                    
                    {activeTab === 'write' && (
                      <button
                        onClick={() => handleSubmitExplanation(typedExplanation)}
                        disabled={!typedExplanation.trim()}
                        className="bg-[#FFCE18] border-4 border-[#000000] px-8 py-3.5 rounded-xl font-bold uppercase hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#000000] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_0px_#000000] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer w-full sm:w-auto text-center"
                      >
                        Analyze Explanation
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: ANALYZING LOADING SCREEN */}
              {simulatorStep === 'loading' && (
                <motion.div 
                  key="step-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 flex flex-col items-center justify-center space-y-6"
                >
                  <div className="w-16 h-16 border-8 border-t-transparent border-[#000000] rounded-full animate-spin"></div>
                  
                  <div className="text-center space-y-2">
                    <h4 className="text-2xl font-bold uppercase">Teaching Session Under Review</h4>
                    <p className="font-bold text-sm tracking-wider uppercase bg-[#FFCE18] px-3 py-1 inline-block border-2 border-[#000000]">
                      Comparing explanation with semantic curriculum model...
                    </p>
                  </div>
                  
                  <div className="w-full max-w-md bg-[#FFFFFF] border-4 border-[#000000] h-6 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-[#FFCE18] h-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2.2, ease: 'linear' }}
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 4: REPORT CARD & SPACED INTERVALS */}
              {simulatorStep === 'results' && (
                <motion.div 
                  key="step-results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  
                  {/* Results Header */}
                  <div className="border-b-4 border-[#000000] pb-4 flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <span className="text-xs uppercase font-bold bg-[#FFCE18] border-2 border-[#000000] px-2 py-0.5 rounded mr-2">Evaluation Complete</span>
                      <h3 className="text-2xl font-bold uppercase mt-1">Topic: {resultsData.title}</h3>
                    </div>
                    <button
                      onClick={handleResetSimulator}
                      className="group flex items-center gap-1.5 border-2 border-[#000000] px-3 py-1.5 rounded-lg font-bold text-xs uppercase bg-[#FFFFFF] hover:bg-zinc-100 shadow-[2px_2px_0px_0px_#000000] transition-all cursor-pointer"
                    >
                      <RotateCcw size={14} /> Teach New Subject
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Stats Column */}
                    <div className="lg:col-span-6 space-y-6">
                      
                      {/* Clarity Score Big Block */}
                      <div className="border-4 border-[#000000] rounded-2xl bg-[#FFCE18] p-4 sm:p-6 flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6 shadow-[4px_4px_0px_0px_#000000]">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl border-4 border-[#000000] bg-[#FFFFFF] flex flex-col items-center justify-center">
                          <span className="text-3xl sm:text-4xl font-bold">{resultsData.clarity}%</span>
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">clarity</span>
                        </div>
                        <div>
                          <h4 className="text-base sm:text-lg font-bold uppercase mb-1">Concept Mastery Score</h4>
                          <p className="font-bold text-xs sm:text-sm">
                            {resultsData.clarity >= 80 
                              ? "Excellent explanation! Your teaching maps closely to the curriculum framework."
                              : "Some gaps detected. You have the general idea, but key concepts are missing."}
                          </p>
                        </div>
                      </div>

                      {/* Detail Metrics */}
                      <div className="border-4 border-[#000000] p-4 sm:p-6 rounded-2xl space-y-4">
                        <h4 className="font-bold uppercase text-xs sm:text-sm border-b-2 border-[#000000] pb-2">Diagnostic Metrics</h4>
                        
                        <div className="space-y-3">
                          {/* Accuracy */}
                          <div>
                            <div className="flex justify-between font-bold text-xs uppercase mb-1">
                              <span>Factual Accuracy</span>
                              <span>{resultsData.accuracy}%</span>
                            </div>
                            <div className="bg-[#FFFFFF] border-2 border-[#000000] h-3 rounded-full overflow-hidden">
                              <div className="bg-[#FFCE18] h-full" style={{ width: `${resultsData.accuracy}%` }} />
                            </div>
                          </div>

                          {/* Confidence */}
                          <div>
                            <div className="flex justify-between font-bold text-xs uppercase mb-1">
                              <span>Speech Confidence & Pacing</span>
                              <span>{resultsData.confidence}%</span>
                            </div>
                            <div className="bg-[#FFFFFF] border-2 border-[#000000] h-3 rounded-full overflow-hidden">
                              <div className="bg-[#FFCE18] h-full" style={{ width: `${resultsData.confidence}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Coach Feedback text */}
                      <div className="border-4 border-[#000000] p-4 sm:p-6 rounded-2xl bg-[#FFFFFF]">
                        <h4 className="font-bold uppercase text-xs sm:text-sm mb-3">AI Coach Critique</h4>
                        <p className="font-bold text-sm sm:text-base leading-relaxed italic">
                          "{resultsData.feedback}"
                        </p>
                      </div>

                    </div>

                    {/* Right Gaps & Scheduling Column */}
                    <div className="lg:col-span-6 space-y-6">
                      
                      {/* Concept Matrix */}
                      <div className="border-4 border-[#000000] p-4 sm:p-6 rounded-2xl bg-[#FFFFFF] space-y-4">
                        <h4 className="font-bold uppercase text-xs sm:text-sm border-b-2 border-[#000000] pb-2">Concept Coverage Mapping</h4>
                        
                        <div className="space-y-2.5">
                          {resultsData.mastered.map((concept, i) => (
                            <div key={i} className="flex gap-2.5 items-start font-bold text-xs sm:text-sm bg-zinc-50 border border-zinc-200 p-2.5 rounded-lg">
                              <div className="bg-[#FFCE18] border-2 border-[#000000] rounded p-0.5 text-[#000000] shrink-0 mt-0.5">
                                <Check size={14} strokeWidth={3} />
                              </div>
                              <span>Mastered: {concept}</span>
                            </div>
                          ))}

                          {resultsData.gaps.map((concept, i) => (
                            <div key={i} className="flex gap-2.5 items-start font-bold text-xs sm:text-sm bg-[#FFCE18]/10 border-2 border-[#000000] p-2.5 rounded-lg">
                              <div className="bg-[#000000] text-[#FFFFFF] rounded p-0.5 shrink-0 mt-0.5">
                                <AlertCircle size={14} strokeWidth={3} />
                              </div>
                              <span className="text-[#000000]">Missing Concept: {concept}</span>
                            </div>
                          ))}

                          {resultsData.gaps.length === 0 && (
                            <p className="font-bold text-sm text-center py-2 text-zinc-600">
                              🎉 Perfect score! No knowledge gaps detected in this concept.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Spaced Repetition Scheduling */}
                      <div className="border-4 border-[#000000] p-4 sm:p-6 rounded-2xl bg-[#FFFFFF] space-y-4 shadow-[4px_4px_0px_0px_#000000]">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                          <h4 className="font-bold uppercase text-xs sm:text-sm">Review Schedule</h4>
                          <span className="text-[9px] sm:text-xs uppercase font-bold bg-[#000000] text-[#FFFFFF] px-2.5 py-1 rounded w-fit">SuperMemo-2 SM2 Algorithm</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          
                          {/* Session 1 */}
                          <div className="border-2 border-[#000000] p-3 rounded-xl bg-[#FFCE18] flex sm:flex-col items-center justify-between sm:justify-center sm:text-center gap-2 sm:gap-0 select-none">
                            <div className="text-left sm:text-center">
                              <p className="text-[10px] uppercase font-bold text-[#000000]/60">Session 1</p>
                              <p className="font-bold text-sm mt-0.5 sm:mt-1">24 Hours</p>
                            </div>
                            <span className="text-[9px] uppercase font-bold border border-[#000000] bg-[#FFFFFF] px-2 py-0.5 rounded shrink-0 sm:mt-1.5">
                              {resultsData.gaps.length > 0 ? 'Review Gaps' : 'Active Recall'}
                            </span>
                          </div>
                          
                          {/* Session 2 */}
                          <div className="border-2 border-[#000000] p-3 rounded-xl bg-[#FFFFFF] flex sm:flex-col items-center justify-between sm:justify-center sm:text-center gap-2 sm:gap-0 select-none">
                            <div className="text-left sm:text-center">
                              <p className="text-[10px] uppercase font-bold text-zinc-500">Session 2</p>
                              <p className="font-bold text-sm mt-0.5 sm:mt-1">3 Days</p>
                            </div>
                            <span className="text-[9px] uppercase font-bold border border-[#000000] bg-zinc-100 px-2 py-0.5 rounded shrink-0 sm:mt-1.5">
                              Consolidation
                            </span>
                          </div>

                          {/* Session 3 */}
                          <div className="border-2 border-[#000000] p-3 rounded-xl bg-[#FFFFFF] flex sm:flex-col items-center justify-between sm:justify-center sm:text-center gap-2 sm:gap-0 select-none">
                            <div className="text-left sm:text-center">
                              <p className="text-[10px] uppercase font-bold text-zinc-500">Session 3</p>
                              <p className="font-bold text-sm mt-0.5 sm:mt-1">10 Days</p>
                            </div>
                            <span className="text-[9px] uppercase font-bold border border-[#000000] bg-zinc-100 px-2 py-0.5 rounded shrink-0 sm:mt-1.5">
                              Retention test
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </section>

      {/* Day-One vs Day-14 Active Comparison */}
      <section className="py-12 sm:py-20 bg-[#FFFFFF] border-b-4 border-[#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">
                Feynman Learning Curve
              </h2>
              <p className="text-sm sm:text-lg font-bold">
                Watch how explanation clarity improves over a 2-week active recall cycle.
              </p>
            </div>

            {/* Toggle Topic Control */}
            <div className="border-4 border-[#000000] p-1 sm:p-1.5 rounded-xl flex gap-2">
              <button
                onClick={() => setCompareTopic('dns')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-[10px] xs:text-xs uppercase cursor-pointer ${
                  compareTopic === 'dns' ? 'bg-[#FFCE18]' : 'hover:bg-zinc-100'
                }`}
              >
                DNS Explained
              </button>
              <button
                onClick={() => setCompareTopic('react')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-[10px] xs:text-xs uppercase cursor-pointer ${
                  compareTopic === 'react' ? 'bg-[#FFCE18]' : 'hover:bg-zinc-100'
                }`}
              >
                React Reconciliation
              </button>
            </div>
          </div>

          {/* Double Column Comparison Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Day 1 - Raw explanation */}
            <div className="border-4 border-[#000000] p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[#FFFFFF] shadow-[4px_4px_0px_0px_#000000]">
              <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2 border-b-2 border-[#000000]/10 pb-3 mb-2">
                  <span className="font-bold uppercase text-[10px] xs:text-xs border border-[#000000] px-2 py-0.5 bg-zinc-100 rounded">
                    Initial Explanation
                  </span>
                  <span className="border-2 border-[#000000] bg-[#000000] text-[#FFFFFF] font-bold text-[10px] xs:text-xs uppercase px-2.5 py-0.5 rounded">
                    Day 1
                  </span>
                </div>
                
                <h4 className="text-xl sm:text-2xl font-bold">
                  {compareTopic === 'dns' ? 'Domain Name System (DNS)' : 'React Virtual DOM'}
                </h4>

                <p className="font-bold italic text-sm sm:text-base leading-relaxed text-zinc-600">
                  {compareTopic === 'dns' 
                    ? '"Um, so DNS is like, a thing that, uh, translates website names, like google.com, to, you know, numbers. I think it uses servers or something. It is slow and sometimes it fails."' 
                    : '"React is like, quick because it has a fake DOM. And it checks what changes and updates it. I don\'t really know how it compares them though, just that it does."'}
                </p>

                <div className="border-t-2 border-[#000000] pt-4 grid grid-cols-3 gap-1.5 text-center font-bold uppercase">
                  <div>
                    <span className="text-[8px] xs:text-[10px] text-zinc-500 block mb-1">Clarity Score</span>
                    <span className="text-base sm:text-xl">34%</span>
                  </div>
                  <div>
                    <span className="text-[8px] xs:text-[10px] text-zinc-500 block mb-1">Filler Words</span>
                    <span className="text-base sm:text-xl text-red-600">12</span>
                  </div>
                  <div>
                    <span className="text-[8px] xs:text-[10px] text-zinc-500 block mb-1">Knowledge Gaps</span>
                    <span className="text-base sm:text-xl text-red-600">4 Gaps</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Day 14 - Mastered explanation */}
            <div className="border-4 border-[#000000] p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[#FFCE18] shadow-[8px_8px_0px_0px_#000000]">
              <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2 border-b-2 border-[#000000]/15 pb-3 mb-2">
                  <span className="font-bold uppercase text-[10px] xs:text-xs border border-[#000000] px-2 py-0.5 bg-[#FFFFFF] rounded">
                    Mastered Explanation
                  </span>
                  <span className="border-2 border-[#000000] bg-[#FFFFFF] text-[#000000] font-bold text-[10px] xs:text-xs uppercase px-2.5 py-0.5 rounded">
                    Day 14 (3 Reviews)
                  </span>
                </div>

                <h4 className="text-xl sm:text-2xl font-bold">
                  {compareTopic === 'dns' ? 'Domain Name System (DNS)' : 'React Virtual DOM'}
                </h4>

                <p className="font-bold italic text-sm sm:text-base leading-relaxed">
                  {compareTopic === 'dns'
                    ? '"DNS is the decentralized naming system that translates human-readable domain names into IP addresses. It operates on a hierarchical tree structure: queries start at root servers, check TLD servers, and retrieve records from authoritative name servers using UDP port 53."'
                    : '"React reconciles state changes using a virtual representation of the DOM. When state changes, it generates a new virtual tree, performs a diffing algorithm (O(n) complexity heuristics) to identify changes, and bundles updates to the real DOM, avoiding expensive repaints."'}
                </p>

                <div className="border-t-2 border-[#000000] pt-4 grid grid-cols-3 gap-1.5 text-center font-bold uppercase">
                  <div>
                    <span className="text-[8px] xs:text-[10px] text-zinc-700 block mb-1">Clarity Score</span>
                    <span className="text-base sm:text-xl">96%</span>
                  </div>
                  <div>
                    <span className="text-[8px] xs:text-[10px] text-zinc-700 block mb-1">Filler Words</span>
                    <span className="text-base sm:text-xl">0</span>
                  </div>
                  <div>
                    <span className="text-[8px] xs:text-[10px] text-zinc-700 block mb-1">Knowledge Gaps</span>
                    <span className="text-base sm:text-xl">0 Gaps</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Posters Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6 border-b-4 border-[#000000]">
        
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">
            Features Built For Mastery
          </h2>
          <p className="text-lg md:text-xl font-bold max-w-2xl mx-auto">
            We combined speech analytics, AI reasoning models, and cognitive learning theories to make active learning effortless.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="border-4 border-[#000000] bg-[#FFFFFF] p-8 rounded-3xl shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] transition-all">
            <div className="w-12 h-12 border-2 border-[#000000] bg-[#FFCE18] rounded-xl flex items-center justify-center font-bold mb-6">
              <Mic size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold uppercase mb-3">Speech Evaluation</h3>
            <p className="font-bold text-sm leading-relaxed text-zinc-700">
              Speak naturally as if talking to a friend. Our engine transcribes and analyzes clarity, verbal gaps, pacing, and filler words to gauge real confidence.
            </p>
          </div>

          {/* Card 2 */}
          <div className="border-4 border-[#000000] bg-[#FFFFFF] p-8 rounded-3xl shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] transition-all">
            <div className="w-12 h-12 border-2 border-[#000000] bg-[#FFCE18] rounded-xl flex items-center justify-center font-bold mb-6">
              <Sliders size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold uppercase mb-3">Semantic Gap Finder</h3>
            <p className="font-bold text-sm leading-relaxed text-zinc-700">
              Our AI maps your speech transcript against an expert reference schema to verify core concepts, pinpointing what you forgot or misstated.
            </p>
          </div>

          {/* Card 3 */}
          <div className="border-4 border-[#000000] bg-[#FFFFFF] p-8 rounded-3xl shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] transition-all">
            <div className="w-12 h-12 border-2 border-[#000000] bg-[#FFCE18] rounded-xl flex items-center justify-center font-bold mb-6">
              <Calendar size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold uppercase mb-3">Adaptive Spaced Reviews</h3>
            <p className="font-bold text-sm leading-relaxed text-zinc-700">
              Reviews are scheduled using an advanced spaced repetition algorithm based on your score, testing you exactly when your memory starts to fade.
            </p>
          </div>

          {/* Card 4 */}
          <div className="border-4 border-[#000000] bg-[#FFFFFF] p-8 rounded-3xl shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] transition-all">
            <div className="w-12 h-12 border-2 border-[#000000] bg-[#FFCE18] rounded-xl flex items-center justify-center font-bold mb-6">
              <Clock size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold uppercase mb-3">Historical Memory</h3>
            <p className="font-bold text-sm leading-relaxed text-zinc-700">
              Listen to your original audio explanation and track visual progress logs. Compare Day 1 vs Day 30 side-by-side to witness conceptual growth.
            </p>
          </div>

          {/* Card 5 */}
          <div className="border-4 border-[#000000] bg-[#FFFFFF] p-8 rounded-3xl shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] transition-all">
            <div className="w-12 h-12 border-2 border-[#000000] bg-[#FFCE18] rounded-xl flex items-center justify-center font-bold mb-6">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold uppercase mb-3">Topic Curriculum Library</h3>
            <p className="font-bold text-sm leading-relaxed text-zinc-700">
              Prepare for interviews or exams with structured curriculums mapping out System Design, Computer Science, Economics, Biology, and History.
            </p>
          </div>

          {/* Card 6 */}
          <div className="border-4 border-[#000000] bg-[#FFFFFF] p-8 rounded-3xl shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] transition-all">
            <div className="w-12 h-12 border-2 border-[#000000] bg-[#FFCE18] rounded-xl flex items-center justify-center font-bold mb-6">
              <TrendingUp size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold uppercase mb-3">Consistency Analytics</h3>
            <p className="font-bold text-sm leading-relaxed text-zinc-700">
              Build daily learning habit loops. Monitor consistency, check streaks, and watch your aggregate conceptual scope grow over time.
            </p>
          </div>

        </div>

      </section>

      {/* Progress & Streaks Analytics Interactive Dashboard */}
      <section className="py-20 bg-[#FFFFFF] border-b-4 border-[#000000]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Dashboard Description */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Build Learning Streaks
            </h2>
            <p className="text-lg font-bold leading-relaxed">
              Consistently explaining ideas moves them into long-term memory. Track your streaks, total teaching sessions, and check off daily reviews in your calendar.
            </p>
            
            <div className="space-y-4">
              <div className="border-4 border-[#000000] bg-[#FFCE18] p-4 rounded-xl flex items-center gap-4">
                <Flame size={32} className="text-[#000000]" strokeWidth={2.5} />
                <div>
                  <h4 className="font-bold text-lg uppercase">14-Day Streak</h4>
                  <p className="text-xs uppercase font-bold">Active recall habit locked in</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border-4 border-[#000000] p-4 rounded-xl text-center bg-[#FFFFFF]">
                  <p className="text-3xl font-bold">48</p>
                  <p className="text-xs uppercase font-bold mt-1">topics taught</p>
                </div>
                <div className="border-4 border-[#000000] p-4 rounded-xl text-center bg-[#FFFFFF]">
                  <p className="text-3xl font-bold">220m</p>
                  <p className="text-xs uppercase font-bold mt-1">explain time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Calendar grid */}
          <div className="lg:col-span-7">
            <div className="border-4 border-[#000000] rounded-3xl p-4 sm:p-6 md:p-8 bg-[#FFFFFF] shadow-[8px_8px_0px_0px_#000000]">
              
              <div className="border-b-2 border-[#000000] pb-4 mb-6 flex justify-between items-center flex-wrap gap-2">
                <h4 className="font-bold uppercase tracking-wider text-sm">Consistency Tracker</h4>
                <div className="flex gap-4 items-center text-xs font-bold uppercase">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 bg-[#FFCE18] border-2 border-[#000000] rounded"></span>
                    <span>Taught</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 bg-[#FFFFFF] border-2 border-[#000000] rounded"></span>
                    <span>Missed</span>
                  </div>
                </div>
              </div>

              {/* Grid representation */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-3 mb-6">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="text-center font-bold text-xs uppercase text-zinc-500 py-1">
                    {day}
                  </div>
                ))}
                
                {streakDays.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleStreakDay(idx)}
                    className={`aspect-square border-2 border-[#000000] rounded-lg font-bold text-[10px] sm:text-xs transition-colors flex items-center justify-center cursor-pointer select-none ${
                      day.active ? 'bg-[#FFCE18]' : 'bg-[#FFFFFF] hover:bg-zinc-100'
                    }`}
                  >
                    {day.day}
                  </button>
                ))}
              </div>

              <p className="text-xs font-bold uppercase tracking-wide text-zinc-600 text-center">
                💡 Tap on calendar days to toggle habit completion history manually.
              </p>

            </div>
          </div>

        </div>
      </section>

      {/* Curated Curriculum List */}
      <section className="py-10 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 border-b-4 border-[#000000]">
        
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight">
            Curriculum Topic Library
          </h2>
          <p className="text-sm sm:text-lg md:text-xl font-bold max-w-2xl mx-auto">
            Choose a subject area and jump straight into an explanation to build complete conceptual mapping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card: Computer Science */}
          <div className="border-4 border-[#000000] p-6 rounded-2xl bg-[#FFFFFF] space-y-4 shadow-[4px_4px_0px_0px_#000000]">
            <h3 className="text-xl sm:text-2xl font-bold uppercase border-b-2 border-[#000000] pb-2 flex justify-between items-center gap-2 flex-wrap sm:flex-nowrap">
              <span>💻 Systems & Software</span>
              <span className="text-xs font-bold border border-[#000000] bg-[#FFCE18] px-2 py-0.5 rounded shrink-0">Core CS</span>
            </h3>
            <div className="space-y-2.5">
              {[
                { name: 'Load Balancers', desc: 'Reverse proxies distributing server networks' },
                { name: 'Quantum Computing', desc: 'Computing logic utilizing quantum superposition' },
                { name: 'DNS (Domain Name System)', desc: 'Translating domains to IP addresses' },
                { name: 'Database Sharding', desc: 'Horizontal partition of databases across servers' }
              ].map((topic, i) => (
                <div key={i} className="flex justify-between items-center border border-[#000000] p-3 rounded-xl hover:bg-[#FFCE18]/10 transition-colors gap-3">
                  <div>
                    <h5 className="font-bold text-sm">{topic.name}</h5>
                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide mt-0.5">{topic.desc}</p>
                  </div>
                  <button
                    onClick={() => handleLoadCurriculumTopic(topic.name)}
                    className="border-2 border-[#000000] bg-[#FFCE18] px-2.5 py-1 rounded-lg text-xs font-bold uppercase shadow-[1.5px_1.5px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2.5px_2.5px_0px_0px_#000000] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer shrink-0"
                  >
                    Teach
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Science & Academics */}
          <div className="border-4 border-[#000000] p-6 rounded-2xl bg-[#FFFFFF] space-y-4 shadow-[4px_4px_0px_0px_#000000]">
            <h3 className="text-xl sm:text-2xl font-bold uppercase border-b-2 border-[#000000] pb-2 flex justify-between items-center gap-2 flex-wrap sm:flex-nowrap">
              <span>🔬 Science & Learning</span>
              <span className="text-xs font-bold border border-[#000000] bg-[#FFCE18] px-2 py-0.5 rounded shrink-0">Academics</span>
            </h3>
            <div className="space-y-2.5">
              {[
                { name: 'Photosynthesis', desc: 'Plants converting light to chemical energy' },
                { name: 'Spaced Repetition', desc: 'Ebbinghaus forgetting curves and recalls' },
                { name: 'Mitochondria function', desc: 'Chemical conversion of ATP inside cell bodies' },
                { name: 'Inflationary Cosmology', desc: 'Exponential expansion of the early universe' }
              ].map((topic, i) => (
                <div key={i} className="flex justify-between items-center border border-[#000000] p-3 rounded-xl hover:bg-[#FFCE18]/10 transition-colors gap-3">
                  <div>
                    <h5 className="font-bold text-sm">{topic.name}</h5>
                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide mt-0.5">{topic.desc}</p>
                  </div>
                  <button
                    onClick={() => handleLoadCurriculumTopic(topic.name)}
                    className="border-2 border-[#000000] bg-[#FFCE18] px-2.5 py-1 rounded-lg text-xs font-bold uppercase shadow-[1.5px_1.5px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2.5px_2.5px_0px_0px_#000000] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer shrink-0"
                  >
                    Teach
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* Waitlist CTA Poster Banner */}
      <section id="waitlist-section" className="bg-[#FFCE18] border-b-4 border-[#000000] py-12 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none">
            Join the Waitlist
          </h2>
          <p className="text-base sm:text-xl md:text-2xl font-bold max-w-xl mx-auto leading-relaxed">
            Get early access to personalized AI evaluation, speech analytics, and smart review loops.
          </p>

          <div className="max-w-md mx-auto">
            {waitlistSubmitted ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="border-4 border-[#000000] bg-[#FFFFFF] p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000000] text-center"
              >
                <p className="text-2xl font-bold uppercase mb-1">🎉 You're on the list!</p>
                <p className="font-bold text-sm">
                  We've saved your spot. We'll contact you at <span className="underline">{waitlistEmail}</span> when early access slots open.
                </p>
                <div className="mt-4 inline-block bg-[#FFCE18] border-2 border-[#000000] px-3 py-1 rounded-md font-bold text-xs uppercase">
                  Waitlist Position: #3,492
                </div>
              </motion.div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleWaitlistSubmit(waitlistEmail);
                }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    disabled={waitlistSaving}
                    className="flex-1 bg-[#FFFFFF] border-4 border-[#000000] px-4 py-3 rounded-xl font-bold text-sm sm:text-base shadow-[4px_4px_0px_0px_#000000] focus:outline-none focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[6px_6px_0px_0px_#000000] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={waitlistSaving}
                    className="bg-[#000000] text-[#FFFFFF] border-4 border-[#000000] font-bold text-xs sm:text-base px-6 py-3 rounded-xl hover:bg-[#FFFFFF] hover:text-[#000000] shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer uppercase disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#000000] disabled:hover:text-[#FFFFFF] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                  >
                    {waitlistSaving ? 'Saving...' : 'Join Waitlist'}
                  </button>
                </div>
                {waitlistError && (
                  <p className="font-bold text-sm text-red-700 border-2 border-red-700 bg-white px-3 py-2 rounded-lg shadow-[3px_3px_0px_0px_#000000]">
                    {waitlistError}
                  </p>
                )}
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#000000]">
                  🔒 No spam. We only send launch updates and early access invites.
                </p>
              </form>
            )}
          </div>
          
          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('simulator');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-4 border-[#000000] bg-[#FFFFFF] text-[#000000] font-bold text-sm px-6 py-3 rounded-xl shadow-[4px_4px_0px_0px_#000000] hover:bg-[#000000] hover:text-[#FFFFFF] transition-all cursor-pointer uppercase"
            >
              Start Practice Simulator
            </button>
          </div>
        </div>
      </section>

      {/* Stark Neo-Brutalist Footer */}
      <footer className="bg-[#FFFFFF] py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t-4 border-[#000000] pt-12">
          
          <div className="flex items-center gap-3">
            <img 
              src={teachbackLogo} 
              alt="TeachBack Logo" 
              className="w-8 h-8 border-2 border-[#000000] rounded-lg shadow-[1.5px_1.5px_0px_0px_#000000]"
            />
            <span className="font-bold text-xl uppercase tracking-wider">TeachBack</span>
            <span className="text-[10px] font-bold uppercase border border-[#000000] px-2 py-0.5 rounded bg-[#FFCE18]">
              varp labs product
            </span>
          </div>

          <div className="flex flex-wrap gap-6 font-bold text-xs uppercase">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Feynman Method</a>
            <a href="#" className="hover:underline">Curriculum DB</a>
          </div>

          <div className="font-bold text-xs text-zinc-500 uppercase">
            © {new Date().getFullYear()} Varp Labs. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}
