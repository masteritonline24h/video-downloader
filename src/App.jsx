import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdBanner from './AdBanner';
import { 
  Download, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Video, 
  Sparkles, 
  Film,
  Play,
  Globe,
  SlidersHorizontal,
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  X, 
  HardDrive,
  Share2,
  Radius
} from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('1080p'); // State សម្រាប់កត់ត្រា Format ដែលបានជ្រើសរើស
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadingFormat, setDownloadingFormat] = useState(null);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // =========================================================================
  // RapidAPI Configuration 
  // =========================================================================
  const RAPIDAPI_KEY = "7f71fe82c2msh2a0b271e0340488p1a7d04jsn456295e51ff6";
  const RAPIDAPI_HOST = "instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com";

  // មុខងារ POST Request ទៅកាន់ RapidAPI ព្រមទាំងបញ្ជូន Format ទៅជាមួយ
  const handleFetchVideo = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMessage("សូមបញ្ចូល URL វីដេអូជាមុនសិន!");
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setVideoData(null);
    setDownloadComplete(false);

    try {
      const options = {
        method: 'POST',
        url: `https://${RAPIDAPI_HOST}/youtube/download`,
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST
        },
        data: {
          url: url.trim(),
          format: selectedFormat // ប្រើប្រាស់ Format ដែលអ្នកប្រើប្រាស់បានជ្រើសរើស
        }
      };

      const response = await axios.request(options);
      console.log("RapidAPI Response:", response.data);

      if (response.data) {
        setVideoData(response.data);
      } else {
        setErrorMessage("មិនមានទិន្នន័យឆ្លើយតបពី API ទេ។");
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
      if (error.response && error.response.status === 403) {
        setErrorMessage("កំហុស 403: API Key ឬ Subscription មិនត្រឹមត្រូវ។");
      } else {
        setErrorMessage(error.response?.data?.message || "មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់ Server។");
      }
    } finally {
      setLoading(false);
    }
  };

  // មុខងារ Download វីដេអូ
  const handleDownload = async (directVideoUrl, qualityLabel = "MP4 Video") => {
    if (!directVideoUrl) return;

    setDownloadingFormat(qualityLabel);
    setErrorMessage('');
    setDownloadComplete(false);

    try {
      const response = await axios.get(directVideoUrl, { responseType: 'blob' });
      
      if (response.data.type && response.data.type.includes('text/html')) {
        throw new Error("HTML response detected");
      }

      const blob = new Blob([response.data], { type: 'video/mp4' });
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `video_${selectedFormat}_${Date.now()}.mp4`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      setDownloadComplete(true);
    } catch (error) {
      console.warn("Direct blob download failed, opening in new tab:", error);
      window.open(directVideoUrl, '_blank');
      setDownloadComplete(true);
    } finally {
      setDownloadingFormat(null);
    }
  };

  // ទាញយក Video Links
  const getVideoLinks = () => {
    if (!videoData) return [];
    const links = [];
    if (videoData.url) links.push({ url: videoData.url, quality: `${selectedFormat} Full HD` });
    if (videoData.download_url) links.push({ url: videoData.download_url, quality: `${selectedFormat} Quality` });
    if (videoData.link) links.push({ url: videoData.link, quality: `Standard Quality` });

    if (Array.isArray(videoData.links)) {
      videoData.links.forEach((item, index) => {
        links.push({
          url: item.url || item.link || item,
          quality: item.quality || item.label || `Option ${index + 1}`
        });
      });
    }
    return links;
  };

  const videoLinks = getVideoLinks();

  // Toggle FAQ Accordion
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Navbar */}
      <nav className="relative z-10 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Social Media<span className="text-indigo-400"> Video Downloader</span>
            </span>
          </div>
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> <a href="">Download Full Source Codes</a>
          </div>
        </div>
      </nav>

      {/* Main Hero & Content */}
      <main className="relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col items-center flex-1">
        <div className="text-center max-w-2xl mb-10">
          <div className="font-koh inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            ទាញយកវីដេអូកម្រិត HD/4K និង MP3 ដោយឥតគិតថ្លៃ ១០០%
          </div>
          <h1 className="font-koh text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            ទាញយកវីដេអូពី <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">Social Media</span> យ៉ាងរហ័ស
          </h1>
          <p className="font-koh text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
            គ្រាន់តែចម្លង Link វីដេអូពី YouTube, Facebook, Instagram ឬ TikTok រួច Paste ចូលក្នុងប្រអប់ខាងក្រោមដើម្បីទាញយកដោយគ្មាន Watermark!
          </p>
        </div>

        {/* Input Form & Format Selector Box */}
        <div className="w-full max-w-2xl bg-slate-900/80 border border-slate-800/80 p-4 sm:p-5 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col gap-4">
          
          {/* Format Selection Toolbar */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-koh text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" /> ជ្រើសរើស ទម្រង់ / គុណភាពវីដេអូ:
            </span>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-indigo-400 font-semibold text-xs sm:text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="4k">4K Ultra HD</option>
              <option value="1080p">1080p Full HD</option>
              <option value="720p">720p HD</option>
              <option value="480p">480p SD</option>
              <option value="mp3">Audio Only (MP3)</option>
            </select>
          </div>

          <form onSubmit={handleFetchVideo} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 flex items-center">
              <Globe className="absolute left-4 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Paste video link here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl py-4 pl-12 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-koh px-8 py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 flex-shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> កំពុងទាញយក...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" /> ទាញយកវីដេអូ
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="w-full max-w-2xl mt-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold block mb-0.5">កត់សំគាល់:</span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Success Alert */}
        {downloadComplete && (
          <div className="w-full max-w-2xl mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">ការទាញយកវីដេអូដោយជោគជ័យ! សូមពិនិត្យមើលវីដេអូដែលបានទាញយកនៅក្នុង Browser Downloads</p>
          </div>
        )}

        {/* Result Card */}
        {videoData && (
          <div className="w-full max-w-2xl mt-8 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row gap-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="relative group w-full sm:w-52 h-44 bg-slate-950 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-800">
              {videoData.thumbnail || videoData.cover ? (
                <img
                  src={videoData.thumbnail || videoData.cover}
                  alt="Thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <Video className="w-10 h-10" />
                </div>
              )}
              <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                  <Play className="w-4 h-4 ml-0.5 fill-current" />
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400">
                    ទម្រង់: {selectedFormat.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-snug">
                  {videoData.title || "បានទាញយកវីដេអូដោយជោគជ័យ"}
                </h3>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">អាចទាញយកវីដេអូ</p>
                {videoLinks.length > 0 ? (
                  videoLinks.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleDownload(item.url, item.quality)}
                      disabled={downloadingFormat === item.quality}
                      className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 border border-slate-700/80 text-white py-3 px-4 rounded-xl transition flex items-center justify-between text-sm font-medium shadow-sm cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-indigo-400" />
                        <span>{item.quality}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold">
                        {downloadingFormat === item.quality ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> កំពុងដោនទ្បត...
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" /> ដោនទ្បត
                          </>
                        )}
                      </span>
                    </button>
                  ))
                ) : (
                  <button
                    onClick={() => handleDownload(videoData.url || videoData.download_url || videoData.link, "Video")}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 font-semibold text-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> ដោនទ្បត
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <section className="space-y-6 mt-8">
          <div className="text-center space-y-2">
            <AdBanner />
            <script src="https://www.highrevenueformat.com/4692dd0b42853ebbaace72d9a4822b95/invoke.js"></script>
            <h3 className="font-koh text-2xl font-bold text-white">របៀបទាញយកវីដេអូក្នុង ៣ ជំហានងាយៗ</h3>
            <p className="font-koh text-slate-400 text-sm">មិនបាច់ដំឡើង App ផ្សេង ចាយពេលត្រឹមតែប៉ុន្មានវិនាទី</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden group hover:border-indigo-500/50 transition-all">                            
              <h4 className="font-koh font-bold text-slate-200 text-base">ចម្លង Link វីដេអូ (Copy Link)</h4>
              <p className="font-koh text-xs text-slate-400 leading-relaxed">
                បើកកម្មវិធី YouTube, Facebook, Instagram ឬ TikTok រួចចុចលើប៊ូតុង <strong>Share</strong> ហើយជ្រើសរើសយក <strong>Copy Link</strong>។
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden group hover:border-indigo-500/50 transition-all">              
              <h4 className="font-koh font-bold text-slate-200 text-base">Paste ចូលក្នុងប្រអប់</h4>
              <p className="font-koh text-xs text-slate-400 leading-relaxed">
                ត្រឡប់មកកាន់គេហទំព័រនេះ រួច Paste Link ចូលក្នុងប្រអប់ស្វែងរក រួចចុចប៊ូតុង <strong>ទាញយកវីដេអូ</strong>។
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden group hover:border-indigo-500/50 transition-all">              
              <h4 className="font-koh font-bold text-slate-200 text-base">ជ្រើសរើស Quality & Download</h4>
              <p className="font-koh text-xs text-slate-400 leading-relaxed">
                ជ្រើសរើសកម្រិតគុណភាពវីដេអូ (1080p, 720p) ឬ MP3 រួចចុចប៊ូតុង <strong>Download</strong> ជាការស្រេច។
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/40 p-6 mt-8 md:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-koh text-2xl font-bold text-white">លក្ខណៈពិសេសចម្បងៗ</h3>
            <p className="font-koh text-slate-400 text-sm">ហេតុអ្វីត្រូវជ្រើសរើសប្រើប្រាស់ MediaDownloader?</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Zap />
              </div>              
              <h5 className="font-koh font-bold text-sm text-slate-200">ល្បឿនលឿនទាន់ចិត្ត</h5>
              <p className="font-koh text-xs text-slate-400">ដំណើរការទាញយកលឿន និងមិនចំណាយពេលរង់ចាំយូរ។</p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ShieldCheck />
              </div>              
              <h5 className="font-koh font-bold text-sm text-slate-200">សុវត្ថិភាព ១០០%</h5>
              <p className="font-koh text-xs text-slate-400">គ្មានមេរោគ គ្មានការទាមទារបង្កើត Account ឬទិន្នន័យផ្ទាល់ខ្លួន។</p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Video />
              </div>              
              <h5 className="font-koh font-bold text-sm text-slate-200">គ្មាន Watermark</h5>
              <p className="font-koh text-xs text-slate-400">ទាញយកវីដេអូ TikTok និង Reels ដោយគ្មានជាប់រូបសញ្ញាឡូហ្គោ។</p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Smartphone />
              </div>              
              <h5 className="font-koh font-bold text-sm text-slate-200">គាំទ្រគ្រប់ Device</h5>
              <p className="font-koh text-xs text-slate-400">ប្រើប្រាស់បានរលូនទាំងលើ iOS (iPhone/iPad), Android, និង Computer។</p>
            </div>
          </div>
        </section>

        <section className="space-y-6 max-w-3xl mx-auto mt-8">
          <div className="text-center space-y-2">
            <h3 className="font-koh text-2xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-indigo-400" /> សំណួរដែលជួបប្រទះញឹកញាប់ (FAQ)
            </h3>
          </div>

          <div className="font-koh space-y-3">
            {[
              {
                q: "តើការទាញយកវីដេអូនេះត្រូវចំណាយប្រាក់ឬទេ?",
                a: "ទេ! សេវាកម្មនេះគឺឥតគិតថ្លៃ ១០០% ហើយលោកអ្នកអាចទាញយកបានដោយមិនកំណត់ចំនួនដងឡើយ។"
              },
              {
                q: "តើខ្ញុំអាចទាញយកវីដេអូ TikTok ដោយគ្មាន Watermark បានដោយរបៀបណា?",
                a: "គ្រាន់តែ Copy Link វីដេអូ TikTok រួច Paste ចូលក្នុងប្រអប់ស្វែងរក ប្រព័ន្ធនឹងផ្ដល់ជម្រើស '1080p No Watermark' សម្រាប់ទាញយកភ្លាមៗ។"
              },
              {
                q: "តើវីដេអូដែលទាញយកបាន រក្សាទុកនៅឯណា?",
                a: "ជាទូទៅ វីដេអូត្រូវបានរក្សាទុកក្នុង Folder 'Downloads' នៅក្នុង Phone ឬ Computer របស់អ្នក។"
              },
              {
                q: "តើកម្មវិធីនេះគាំទ្រការបំលែងជាឯកសារសំឡេង MP3 ដែរឬទេ?",
                a: "បាទ! លោកអ្នកអាចជ្រើសរើស Format ជា MP3 ដើម្បីទាញយកតែសំឡេងតន្ត្រីចេញពីវីដេអូបាន។"
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left font-semibold text-slate-200 flex justify-between items-center text-sm hover:bg-slate-800/40"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-400 border-t border-slate-800/50 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="font-koh border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 z-10">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex items-center justify-center space-x-2 text-slate-400 font-semibold">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Social Media Downloader Platform - Khmer Support</span>
          </div>
          <p>© 2026 MediaDownloader. All rights reserved. រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
          <p>
            Disclaimer: គេហទំព័រនេះមិនមានការរក្សាទុកវីដេអូ ឬឯកសារនៅលើ Server ផ្ទាល់ខ្លួនឡើយ។ រាល់មាតិកាទាំងអស់គឺជារបស់ម្ចាស់ដើមនៃបណ្តាញសង្គមរៀងៗខ្លួន។
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;