import React, { useState } from 'react';
import { AppStage, ScenarioData, AnalysisData } from './types';
import { generateScenario, analyzePerformance } from './services/geminiService';
import { TransformationGame } from './components/TransformationGame';
import { ChevronRight, BrainCircuit, CheckCircle, RefreshCw, LALogo } from './components/Icons';

// New Icon for the landing page
const LayersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
);

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
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 md:py-12">
        
        {/* Stage: HERO - The High Quality Landing Page */}
        {stage === AppStage.HERO && (
          <div className="max-w-5xl w-full space-y-12 animate-fade-in-up">
            
            {/* Header Text */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center p-2 bg-slate-800/50 rounded-full border border-slate-700/50 mb-4">
                <span className="text-amber-500 text-[10px] font-bold tracking-[0.2em] uppercase px-2">
                  Institutional Transformation Simulation
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-slate-100 leading-tight tracking-tight">
                Align Strategy.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-slate-200 to-amber-100">Unlock Capacity.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-light">
                A strategic exercise designed to test your ability to execute institutional change amidst complexity.
              </p>
            </div>

            {/* How It Works Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {/* Step 1 */}
              <div className="glass-panel p-8 rounded-sm border-t-2 border-amber-500/50 hover:bg-slate-800/40 transition-colors group">
                <div className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <BrainCircuit className="text-amber-500 w-6 h-6" />
                </div>
                <h3 className="text-white font-serif text-lg mb-2">1. Contextualize</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  AI generates a unique, high-stakes higher education scenario (e.g., "The Retention Paradox" or "Fiscal Exigency") that requires immediate intervention.
                </p>
              </div>

              {/* Step 2 */}
              <div className="glass-panel p-8 rounded-sm border-t-2 border-sky-500/50 hover:bg-slate-800/40 transition-colors group">
                <div className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <LayersIcon className="text-sky-500 w-6 h-6" />
                </div>
                <h3 className="text-white font-serif text-lg mb-2">2. Execute</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Engage in a resource alignment challenge. Fit diverse institutional capabilities (blocks) together to clear bottlenecks and execute your strategy.
                </p>
              </div>

              {/* Step 3 */}
              <div className="glass-panel p-8 rounded-sm border-t-2 border-emerald-500/50 hover:bg-slate-800/40 transition-colors group">
                 <div className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <CheckCircle className="text-emerald-500 w-6 h-6" />
                </div>
                <h3 className="text-white font-serif text-lg mb-2">3. Evaluate</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Receive a comprehensive performance analysis from our virtual Senior Partners, offering tailored advice on your leadership approach.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <button 
                onClick={startProcess}
                className="group relative inline-flex items-center justify-center px-10 py-4 bg-sky-900 text-sky-100 rounded-sm overflow-hidden transition-all hover:bg-sky-800 shadow-xl hover:shadow-sky-900/40"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="relative z-10 flex items-center font-bold tracking-[0.15em] uppercase text-sm">
                  Start Simulation
                  <ChevronRight />
                </span>
              </button>
              <p className="mt-4 text-[10px] text-slate-600 uppercase tracking-widest">
                Powered by Lynnerup & Ansell
              </p>
            </div>
          </div>
        )}

        {/* Stage: SCENARIO LOADING */}
        {stage === AppStage.SCENARIO_LOADING && (
          <div className="flex flex-col items-center space-y-6">
            <BrainCircuit className="w-16 h-16 text-amber-500 animate-pulse" />
            <div className="text-center space-y-2">
               <h2 className="text-xl font-serif text-white">Generating Scenario</h2>
               <p className="text-slate-400 font-mono text-xs tracking-widest uppercase">Analyzing Institutional Data...</p>
            </div>
          </div>
        )}

        {/* Stage: GAME INTRO */}
        {stage === AppStage.GAME_INTRO && scenario && (
          <div className="max-w-3xl w-full glass-panel p-8 md:p-12 rounded-sm shadow-2xl border-t-4 border-amber-500 animate-fade-in-up">
            <div className="mb-6 flex items-center space-x-3">
               <div className="bg-amber-500 w-1 h-8"></div>
               <span className="text-amber-500 font-bold tracking-widest uppercase text-xs">Intelligence Report</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white leading-tight">{scenario.title}</h2>
            
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-lg text-slate-300 leading-relaxed font-light">
                {scenario.description}
              </p>
            </div>

            <div className="bg-red-950/20 border-l-2 border-red-500 pl-4 py-2 mb-10">
              <span className="text-red-400 text-xs font-bold tracking-widest uppercase block mb-1">The Stakes</span>
              <p className="text-red-200 font-serif italic">{scenario.stakes}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10 pt-8">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-slate-500 uppercase tracking-widest">System Ready</span>
              </div>
              <button 
                onClick={startGame}
                className="w-full md:w-auto px-8 py-3 bg-slate-100 text-slate-900 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-white transition-colors shadow-lg"
              >
                Initialize Reform
              </button>
            </div>
          </div>
        )}

        {/* Stage: PLAYING */}
        {stage === AppStage.PLAYING && (
          <div className="w-full flex flex-col items-center animate-fade-in-up">
             <div className="mb-8 text-center max-w-xl">
                <div className="inline-block px-3 py-1 bg-slate-800 rounded-full mb-3">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Execution Phase</span>
                </div>
                <h3 className="text-2xl font-serif text-slate-200 mb-2">Align Resources</h3>
                <p className="text-sm text-slate-400">
                   Fit the incoming capabilities (blocks) together to execute strategic initiatives.
                   <br/><span className="text-amber-400">Clear 5 lines to transform the institution.</span>
                </p>
             </div>
            <TransformationGame onComplete={handleGameComplete} />
          </div>
        )}

        {/* Stage: ANALYZING */}
        {stage === AppStage.ANALYZING && (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center">
              <h3 className="text-white font-serif text-lg">Evaluating Performance</h3>
              <p className="text-slate-400 font-mono text-xs tracking-widest uppercase mt-2">Consulting Partners Reviewing...</p>
            </div>
          </div>
        )}

        {/* Stage: RESULTS */}
        {stage === AppStage.RESULTS && analysis && (
           <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start animate-fade-in-up">
             
             {/* Left Column: Analysis */}
             <div className="glass-panel p-8 md:p-10 rounded-sm border-t-4 border-sky-600 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <CheckCircle className="w-32 h-32 text-sky-500" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-sky-900/50 rounded-full border border-sky-500/30">
                      <CheckCircle className="w-6 h-6 text-sky-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif text-white">Strategic Assessment</h2>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">Analysis Complete</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <div className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-3">Partner Feedback</div>
                      <p className="text-slate-300 text-lg leading-relaxed font-serif italic border-l-2 border-amber-500/30 pl-4">
                        "{analysis.feedback}"
                      </p>
                    </div>
                    
                    <div className="flex items-baseline space-x-8 border-t border-white/5 pt-6">
                      <div className="flex flex-col">
                          <span className="text-xs text-slate-500 uppercase tracking-widest">Efficiency Score</span>
                          <span className="text-6xl font-light text-white mt-2">{analysis.score}</span>
                      </div>
                      <div className="flex flex-col border-l border-white/5 pl-8">
                          <span className="text-xs text-slate-500 uppercase tracking-widest">Goals Met</span>
                          <span className="text-3xl font-light text-slate-300 mt-2">{finalScore} / 5</span>
                      </div>
                    </div>
                  </div>
                </div>
             </div>

             {/* Right Column: The Pitch */}
             <div className="space-y-8 lg:pt-4">
               <div className="glass-panel p-8 rounded-sm border border-white/5">
                   <h3 className="text-2xl font-serif text-white mb-4">The Lynnerup & Ansell Approach</h3>
                   <div className="h-1 w-12 bg-amber-500 mb-6"></div>
                   <p className="text-slate-400 leading-relaxed mb-6">
                     Real institutional transformation doesn't happen by chance. It happens when resources, strategy, and people are perfectly aligned.
                     <br/><br/>
                     {analysis.consultantNote}
                   </p>
                   
                   <div className="mt-8 pt-6 border-t border-white/5">
                     <h4 className="text-sky-400 font-bold text-xs uppercase tracking-widest mb-2">Our Commitment</h4>
                     <p className="text-sm text-slate-500 italic">To deliver high impact acting as trusted, objective advisors dedicated to your success.</p>
                   </div>
               </div>
               
               <div className="pt-2">
                 <a href="https://lynnerupansell.com" target="_blank" rel="noreferrer" className="block w-full transform hover:-translate-y-1 transition-transform duration-300">
                    <button className="w-full py-5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold tracking-[0.2em] text-xs uppercase transition-colors rounded-sm shadow-lg hover:shadow-amber-500/20 flex items-center justify-center space-x-2">
                      <span>Schedule Consultation</span>
                      <ChevronRight />
                    </button>
                 </a>
               </div>
               
               <div className="flex justify-center space-x-6 text-[10px] text-slate-600 uppercase tracking-widest">
                  <span>Strategy</span>
                  <span>•</span>
                  <span>Operations</span>
                  <span>•</span>
                  <span>People</span>
               </div>
             </div>

           </div>
        )}
      </main>
    </div>
  );
};

export default App;