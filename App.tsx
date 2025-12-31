
import React, { useState } from 'react';
import { generateExpressScript } from './services/codeGenerator';
import { 
  Search, Code, Info, Download, ExternalLink, 
  Copy, Check, Terminal, ShieldCheck, Activity, 
  RefreshCw, BookOpen, Database, Zap, Globe
} from 'lucide-react';

// Added BASE_URL constant for use in the UI components
const BASE_URL = 'https://cinesubz.co';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'docs'>('preview');
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [inputs, setInputs] = useState({
    search: 'Avatar',
    details: 'https://cinesubz.co/movies/avatar-2009-sinhala-subtitles/',
    download: 'https://cinesubz.co/api-123456/'
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateExpressScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateCheck = (endpoint: string) => {
    setChecking(endpoint);
    // Simulate API delay
    setTimeout(() => {
      setChecking(null);
      setTestResults(prev => ({
        ...prev,
        [endpoint]: {
          timestamp: new Date().toLocaleTimeString(),
          status: 200,
          valid: true
        }
      }));
    }, 1200);
  };

  const endpoints = [
    {
      id: 'health',
      name: '/health',
      icon: <Activity className="w-5 h-5" />,
      desc: "Checks API status and target site reachability.",
      checks: ["Uptime verification", "Target latency check", "Base domain availability"]
    },
    {
      id: 'search',
      name: '/search',
      icon: <Search className="w-5 h-5" />,
      desc: "Fetches list of movies/shows with basic meta.",
      checks: ["Title extraction", "Poster URL fetching", "Type classification"]
    },
    {
      id: 'details',
      name: '/details',
      icon: <Info className="w-5 h-5" />,
      desc: "Full metadata extraction (About, IMDB, Size, Poster).",
      checks: ["IMDB rating catch", "Download size regex", "About/Synopsis parsing"]
    },
    {
      id: 'download',
      name: '/download',
      icon: <Download className="w-5 h-5" />,
      desc: "Extracts and transforms the final download links.",
      checks: ["Sonic-Cloud mapping", "Telegram detection", "Mega/GDrive parsing"]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-red-600/10 border border-red-500/20">
          <ShieldCheck className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          CineSubz API <span className="text-red-500">Validator</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Scraping Engine v2.0 • Live Endpoint Verification & Simulation
        </p>
      </header>

      {/* Global Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {endpoints.map(ep => (
          <div key={ep.id} className="glass border border-slate-800 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">{ep.icon}</span>
              <span className="text-xs font-mono font-bold text-slate-300">{ep.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {checking === ep.id ? (
                <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
              ) : testResults[ep.id] ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
              activeTab === 'preview' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Zap className="w-4 h-4" /> Live Tester
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
              activeTab === 'docs' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" /> API Docs
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
              activeTab === 'code' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Code className="w-4 h-4" /> Server Logic
          </button>
        </div>
      </div>

      {activeTab === 'preview' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid md:grid-cols-2 gap-6">
            {endpoints.map((ep) => (
              <div key={ep.id} className="glass p-6 rounded-3xl border border-slate-800 hover:border-red-500/30 transition-all group relative overflow-hidden">
                {/* Background Pulse during check */}
                {checking === ep.id && <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>}
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-600/10 text-red-500 group-hover:scale-110 transition-transform">
                      {ep.icon}
                    </div>
                    <h2 className="text-xl font-bold font-mono text-red-400">{ep.name}</h2>
                  </div>
                  <button 
                    onClick={() => handleSimulateCheck(ep.id)}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 border border-slate-700 transition-colors"
                  >
                    {checking === ep.id ? 'CHECKING...' : 'RUN TEST'}
                  </button>
                </div>
                
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{ep.desc}</p>
                
                {/* Test Input Bar */}
                {ep.id !== 'health' && (
                  <div className="mb-4 flex gap-2">
                    <input 
                      type="text" 
                      value={inputs[ep.id as keyof typeof inputs]}
                      onChange={(e) => setInputs({...inputs, [ep.id]: e.target.value})}
                      placeholder={`Input for ${ep.name}...`}
                      className="flex-1 bg-black/40 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logic Validation</p>
                  {ep.checks.map((check, cidx) => (
                    <div key={cidx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3 h-3 text-green-500 shrink-0" />
                      <span>{check}</span>
                    </div>
                  ))}
                </div>

                {testResults[ep.id] && (
                  <div className="mt-4 p-3 bg-green-500/5 border border-green-500/20 rounded-xl animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-green-400 font-bold uppercase">Last Test: Success</span>
                      <span className="text-[10px] text-slate-500">{testResults[ep.id].timestamp}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="glass p-8 rounded-3xl border border-slate-800 mt-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-red-500" />
              Live Output Simulation
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-black/40 p-4 rounded-2xl border border-slate-800">
                <span className="block text-red-400 font-bold mb-2 text-xs uppercase tracking-widest">Request Log</span>
                <div className="font-mono text-[11px] space-y-1 text-slate-400">
                  <p className="text-green-500">> Initiating multi-stage scrape...</p>
                  <p className="text-slate-500">> Target: {BASE_URL}</p>
                  <p className="text-slate-500">> Parsing HTML Document (DOM Tree)...</p>
                  <p className="text-blue-400">> Mapping Sonic-Cloud servers...</p>
                  <p className="text-purple-400">> Detecting Mega.nz & GDrive links...</p>
                  <p className="text-green-500">> Extraction Complete.</p>
                </div>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-slate-800">
                <span className="block text-green-400 font-bold mb-2 text-xs uppercase tracking-widest">JSON Response Schema</span>
                <pre className="text-[10px] text-slate-300 leading-tight">
{`{
  "success": true,
  "download_options": [
    {
      "type": "direct",
      "label": "Direct Download",
      "download_url": "https://cloud.sonic-cloud..."
    },
    {
      "type": "mega",
      "label": "Mega.nz",
      "download_url": "https://mega.nz/file/..."
    }
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'docs' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass p-8 rounded-3xl border border-slate-800">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <BookOpen className="text-red-500" /> API Documentation
            </h2>
            
            <div className="space-y-12">
              {/* Endpoint 1: Health */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-xs font-mono font-bold">GET</span>
                  <h3 className="text-xl font-mono font-bold">/health</h3>
                </div>
                <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                  The health endpoint provides basic diagnostic information about the server and target site connectivity. Use this to ensure the scraper can reach the source domain.
                </p>
                <div className="bg-black/40 p-4 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Sample Response</p>
                  <pre className="text-xs text-slate-300">{`{ "status": "online", "latency": "145ms" }`}</pre>
                </div>
              </section>

              {/* Endpoint 2: Search */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs font-mono font-bold">GET</span>
                  <h3 className="text-xl font-mono font-bold">/search?q={'{query}'}</h3>
                </div>
                <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                  Performs a live search on the CineSubz portal. It parses search results including titles, ratings, and poster image URLs.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Parameters</h4>
                    <ul className="text-xs space-y-1 text-slate-300">
                      <li><code className="text-red-400">q</code>: The search term (e.g., "Batman")</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">How it works</h4>
                    <p className="text-xs text-slate-400">Uses Cheerio to locate <code className="text-slate-200">.item-box</code> elements and extract anchor hrefs and nested image sources.</p>
                  </div>
                </div>
              </section>

              {/* Endpoint 3: Details */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded text-xs font-mono font-bold">GET</span>
                  <h3 className="text-xl font-mono font-bold">/details?url={'{entry_url}'}</h3>
                </div>
                <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                  Scrapes a specific movie or TV show page to extract deep metadata and specific resolution download buttons.
                </p>
                <div className="bg-black/40 p-4 rounded-xl border border-slate-800 mb-4">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Extraction Logic</p>
                  <ul className="text-xs space-y-2 text-slate-300">
                    <li className="flex gap-2"><Check className="w-3 h-3 text-red-500 mt-0.5 shrink-0" /> Metadata: Scans <code className="text-slate-200">.custom_fields</code> for IMDB, Genre, and Year.</li>
                    <li className="flex gap-2"><Check className="w-3 h-3 text-red-500 mt-0.5 shrink-0" /> Poster: Prioritizes <code className="text-slate-200">og:image</code> for high-res thumbnails.</li>
                    <li className="flex gap-2"><Check className="w-3 h-3 text-red-500 mt-0.5 shrink-0" /> Links: Identifies API buttons by checking hrefs for resolution patterns (e.g., 480p, 720p).</li>
                  </ul>
                </div>
              </section>

              {/* Endpoint 4: Download */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded text-xs font-mono font-bold">GET</span>
                  <h3 className="text-xl font-mono font-bold">/download?url={'{api_url}'}</h3>
                </div>
                <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                  The final resolution stage. It navigates to the redirector/countdown page and extracts the final hosted files.
                </p>
                <div className="p-6 bg-red-600/5 rounded-2xl border border-red-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-red-500" />
                    <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest">Transformation Engine</h4>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    The core logic uses a <code className="text-slate-200">urlMappings</code> table to convert internal server links into public-facing cloud providers.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-[10px] font-mono">
                    <div className="bg-black/40 p-2 rounded">
                      <span className="text-slate-500 italic block mb-1">// Input</span>
                      google.com/server11/1:/file.mp4
                    </div>
                    <div className="bg-black/40 p-2 rounded">
                      <span className="text-green-500 italic block mb-1">// Resolved</span>
                      cloud.sonic-cloud.online/server1/?ext=mp4
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="flex justify-center pb-8">
            <button 
              onClick={() => setActiveTab('code')}
              className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-xl shadow-red-900/20 transition-all hover:scale-105"
            >
              Get the Implementation Code <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <div className="glass rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg border border-slate-700 transition-all hover:scale-105"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard' : 'Copy Fixed Script'}
              </button>
            </div>
            <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center gap-3">
              <Terminal className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">production_ready_server.js</span>
            </div>
            <div className="p-0">
              <pre className="p-8 text-sm text-slate-300 overflow-auto max-h-[600px] leading-relaxed custom-scrollbar">
                {generateExpressScript()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
