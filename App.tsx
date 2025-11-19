import React, { useState } from 'react';
import { AppStage, ScenarioData, AnalysisData } from './types';
import { generateScenario, analyzePerformance } from './services/geminiService';
import { TransformationGame } from './components/TransformationGame';
import { ChevronRight, BrainCircuit, CheckCircle } from './components/Icons';

const App = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.HERO);
  const [scenario, setScenario] = useState<ScenarioData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [finalScore, setFinalScore] = useState(0);

  const startProcess = async () => {
    setStage(AppStage.SCENARIO_LOADING);
    const data = await generateScenario();
    setScenario(data);
    setStage(AppStage.GAME_INTRO);
  };

  const startGame = () => {
    setStage(AppStage.PLAYING);
  };

  const handleGameComplete = async (score: number) => {
    setFinalScore(score);
    setStage(AppStage.ANALYZING);
    
    if (scenario) {
      // Pass lines cleared as "moves" logic
      const analysisResult = await analyzePerformance(score, 5, scenario);
      setAnalysis(analysisResult);
      setStage(AppStage.RESULTS);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 overflow-hidden relative selection:bg-amber-500/30 font-sans">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-sky-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        
        {/* Stage: HERO */}
        {stage === AppStage.HERO && (
          <div className="max-w-4xl text-center space-y-8 animate-fade-in-up">
            <h2 className="text-amber-500 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">
              Higher Education Transformation
            </h2>
            <h1 className="text-4xl md:text-6xl font-serif text-slate-100 leading-tight">
              Driving higher levels of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-sky-100">performance through expertise</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto font-light">
              We partner with colleges, universities, and systems to drive transformative, measurable, enduring improvements. 
              Experience how strategic alignment creates capacity for growth.
            </p>
            <div className="pt-10">
              <button 
                onClick={startProcess}
                className="group relative px-8 py-4 bg-sky-900 text-sky-100 rounded-sm overflow-hidden transition-all hover:bg-sky-800 shadow-lg hover:shadow-sky-900/30"
              >
                <div className="absolute inset-0 border border-white/10 group-hover:border-white/20 transition-colors"></div>
                <span className="relative z-10 flex items-center font-medium tracking-widest uppercase text-xs">
                  Begin Simulation
                  <ChevronRight />
                </span>
              </button>
              <p className="mt-4 text-xs text-slate-500 uppercase tracking-widest">
                Strategic Alignment Exercise
              </p>
            </div>
          </div>
        )}

        {/* Stage: SCENARIO LOADING */}
        {stage === AppStage.SCENARIO_LOADING && (
          <div className="flex flex-col items-center space-y-6">
            <BrainCircuit className="w-12 h-12 text-amber-500 animate-pulse" />
            <p className="text-slate-400 font-mono text-xs tracking-widest uppercase">Analyzing Institutional Data...</p>
          </div>
        )}

        {/* Stage: GAME INTRO */}
        {stage === AppStage.GAME_INTRO && scenario && (
          <div className="max-w-2xl w-full glass-panel p-8 md:p-12 rounded-sm shadow-2xl border-t-4 border-amber-500">
            <div className="mb-4 flex items-center space-x-2">
               <div className="h-px w-8 bg-slate-500"></div>
               <span className="text-slate-400 font-serif italic text-sm">The Challenge</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-white">{scenario.title}</h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed font-light">
              {scenario.description}
            </p>
            <div className="bg-red-950/30 border border-red-900/50 p-6 mb-8 rounded-sm">
              <span className="text-red-400 text-xs font-bold tracking-widest uppercase block mb-2">Critical Implications</span>
              <p className="text-red-200/80 font-serif italic">{scenario.stakes}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 uppercase tracking-widest">Role: University President</span>
              <button 
                onClick={startGame}
                className="px-8 py-3 bg-slate-100 text-slate-900 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-white transition-colors shadow-lg"
              >
                Initiate Reform
              </button>
            </div>
          </div>
        )}

        {/* Stage: PLAYING */}
        {stage === AppStage.PLAYING && (
          <div className="w-full flex flex-col items-center">
             <div className="mb-8 text-center max-w-xl">
                <h3 className="text-2xl font-serif text-slate-200 mb-2">Resource Alignment</h3>
                <p className="text-sm text-slate-400">
                   Fit the incoming resources (blocks) together to execute strategic initiatives (clear lines).
                   <br/><span className="text-amber-400">Do not let operational debt pile up.</span>
                </p>
             </div>
            <TransformationGame onComplete={handleGameComplete} />
          </div>
        )}

        {/* Stage: ANALYZING */}
        {stage === AppStage.ANALYZING && (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-2 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-400 font-mono text-xs tracking-widest uppercase">Consulting Partners Reviewing...</p>
          </div>
        )}

        {/* Stage: RESULTS */}
        {stage === AppStage.RESULTS && analysis && (
           <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-fadeIn">
             
             {/* Left Column: Analysis */}
             <div className="glass-panel p-10 rounded-sm border-t-4 border-sky-600">
                <div className="flex items-center space-x-4 mb-8">
                   <CheckCircle className="w-8 h-8 text-emerald-500" />
                   <div>
                      <h2 className="text-2xl font-serif text-white">Strategic Assessment</h2>
                      <p className="text-xs text-slate-500 uppercase tracking-widest">Simulation Complete</p>
                   </div>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <div className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-3">Partner Feedback</div>
                    <p className="text-slate-300 text-lg leading-relaxed font-serif italic">
                      "{analysis.feedback}"
                    </p>
                  </div>
                  
                  <div className="flex items-baseline space-x-4 border-t border-white/5 pt-6">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase tracking-widest">Efficiency Score</span>
                        <span className="text-5xl font-light text-white mt-1">{analysis.score}</span>
                    </div>
                    <div className="flex flex-col border-l border-white/5 pl-4">
                        <span className="text-xs text-slate-500 uppercase tracking-widest">Goals Met</span>
                        <span className="text-2xl font-light text-slate-300 mt-1">{finalScore}</span>
                    </div>
                  </div>
                </div>
             </div>

             {/* Right Column: The Pitch */}
             <div className="space-y-8 pt-4">
               <div>
                   <h3 className="text-2xl font-serif text-white mb-4">The Lynnerup & Ansell Approach</h3>
                   <div className="h-1 w-12 bg-amber-500 mb-6"></div>
                   <p className="text-slate-400 leading-relaxed mb-6">
                     Real institutional transformation doesn't happen by chance. It happens when resources, strategy, and people are perfectly aligned.
                     <br/><br/>
                     {analysis.consultantNote}
                   </p>
               </div>

               <div className="grid grid-cols-1 gap-4">
                   <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                       <h4 className="text-sky-400 font-bold text-sm uppercase mb-1">Our Mission</h4>
                       <p className="text-sm text-slate-400">To deliver high impact acting as trusted, objective advisors dedicated to your success.</p>
                   </div>
               </div>
               
               <div className="pt-4">
                 <a href="https://lynnerupansell.com" target="_blank" rel="noreferrer" className="block w-full">
                    <button className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold tracking-widest text-xs uppercase transition-colors rounded-sm shadow-lg">
                      Schedule Consultation
                    </button>
                 </a>
                 <p className="mt-4 text-[10px] text-center text-slate-600 uppercase tracking-widest">
                   Strategy • Planning • Execution
                 </p>
               </div>
             </div>

           </div>
        )}
      </main>
    </div>
  );
};

export default App;