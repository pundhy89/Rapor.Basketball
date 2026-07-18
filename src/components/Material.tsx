import { ArrowLeft, BookOpen, Target, Brain, Users, Activity, Trophy, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from './Layout';
import { useState } from 'react';

export function Material() {
  const [expandedSection, setExpandedSection] = useState<number | null>(1);

  const toggleSection = (id: number) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-3 sticky top-0 bg-gray-50 dark:bg-[#151720] z-10 py-2">
        <Link to="/" className="p-2 bg-white dark:bg-[#1A1C29] border border-white dark:border-black rounded-full hover:bg-gray-100 dark:bg-white/5 transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </Link>
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight">Materi Dasar</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Panduan Kurikulum Academy</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BookOpen className="w-32 h-32" />
        </div>
        <span className="bg-white dark:bg-[#1A1C29]/20 text-indigo-50 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm border border-white dark:border-black">
          Development Pathway
        </span>
        <h1 className="text-3xl font-black mt-4 mb-2 leading-tight">
          Basketball Academy Pathway
        </h1>
        <p className="text-indigo-100 text-sm leading-relaxed max-w-[90%]">
          Panduan komprehensif perkembangan atlet dari usia dini hingga level kompetitif berdasarkan 5 Pilar utama.
        </p>
      </div>

      <div className="space-y-4">
        {/* Section 1: SD Lower */}
        <PathwayCard 
          id={1}
          title="SD LOWER — Fundamental & Fun"
          age="<6–8 Tahun"
          focus="Mengenal bola, gerak tubuh, koordinasi, dan kecintaan terhadap basket."
          color="blue"
          isExpanded={expandedSection === 1}
          onToggle={() => toggleSection(1)}
        >
          <div className="space-y-4 text-sm">
            <ContentBlock title="Materi Utama">
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Mengenal bola basket</li>
                <li>Koordinasi mata dan tangan</li>
                <li>Keseimbangan tubuh</li>
                <li>Berlari, berhenti, melompat, berputar</li>
                <li>Mengenal konsep ruang dan arah</li>
                <li>Sportivitas dan kerja sama</li>
              </ul>
            </ContentBlock>
            
            <ContentBlock title="Teknik Basket">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SubSection title="Ball Handling">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Memegang dan mengontrol bola</li>
                    <li>Ball familiarization</li>
                    <li>Pound dribble sederhana</li>
                    <li>Dribble kanan dan kiri</li>
                    <li>Dribble sambil berjalan</li>
                  </ul>
                </SubSection>
                <SubSection title="Passing">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Chest pass</li>
                    <li>Bounce pass</li>
                    <li>Overhead pass</li>
                    <li>Passing berpasangan</li>
                  </ul>
                </SubSection>
                <SubSection title="Shooting">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>BEEF dasar (Balance, Eyes, Elbow, Follow through)</li>
                    <li>Shooting jarak sangat dekat</li>
                    <li>One-hand shooting dasar</li>
                  </ul>
                </SubSection>
                <SubSection title="Footwork">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Jump stop</li>
                    <li>Stride stop</li>
                    <li>Pivot dasar</li>
                    <li>Melompat dan mendarat dengan aman</li>
                  </ul>
                </SubSection>
              </div>
            </ContentBlock>

            <div className="grid grid-cols-2 gap-4">
              <ContentBlock title="Bentuk Latihan">
                <ul className="space-y-1 text-gray-700 dark:text-gray-300 font-medium">
                  <li className="flex justify-between border-b pb-1"><span>Permainan/Fun games</span><span className="text-blue-600 dark:text-blue-400">70%</span></li>
                  <li className="flex justify-between border-b pb-1"><span>Pengenalan teknik</span><span className="text-blue-600 dark:text-blue-400">20%</span></li>
                  <li className="flex justify-between"><span>Pertandingan sederhana</span><span className="text-blue-600 dark:text-blue-400">10%</span></li>
                </ul>
              </ContentBlock>
              
              <ContentBlock title="Target Kelulusan" className="bg-blue-50 dark:bg-blue-900/20 border border-white dark:border-blue-900/30">
                <ul className="list-disc pl-5 space-y-1 text-blue-900 dark:text-blue-200 text-xs">
                  <li>Mengontrol bola dgn percaya diri</li>
                  <li>Dribble kedua tangan</li>
                  <li>Passing sederhana</li>
                  <li>Shooting teknik dasar</li>
                  <li>Memahami aturan sederhana</li>
                </ul>
              </ContentBlock>
            </div>
          </div>
        </PathwayCard>

        {/* Section 2: SD Berkembang */}
        <PathwayCard 
          id={2}
          title="SD BERKEMBANG — Basic Skill"
          age="8–10 Tahun"
          focus="Membangun fundamental teknik secara konsisten."
          color="emerald"
          isExpanded={expandedSection === 2}
          onToggle={() => toggleSection(2)}
        >
          <div className="space-y-4 text-sm">
            <ContentBlock title="Materi Utama">
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300 grid grid-cols-2">
                <li>Ball handling</li>
                <li>Passing & receiving</li>
                <li>Shooting dasar</li>
                <li>Lay-up</li>
                <li>Defense dasar</li>
                <li>1-on-1</li>
                <li>Keputusan sederhana</li>
              </ul>
            </ContentBlock>
            
            <ContentBlock title="Teknik Basket">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SubSection title="Ball Handling">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Right-hand & Left-hand dribble</li>
                    <li>Crossover</li>
                    <li>Between the legs dasar</li>
                    <li>Behind the back pengenalan</li>
                    <li>Change of speed & direction</li>
                  </ul>
                </SubSection>
                <SubSection title="Passing">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Chest, Bounce, Overhead pass</li>
                    <li>Passing sambil bergerak</li>
                    <li>Passing dengan tekanan defense</li>
                  </ul>
                </SubSection>
                <SubSection title="Shooting & Finishing">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Form shooting, Set shot</li>
                    <li>Shooting setelah dribble</li>
                    <li>Right & Left-hand lay-up</li>
                    <li>Power lay-up, Jump stop finishing</li>
                  </ul>
                </SubSection>
                <SubSection title="Defense & Taktik">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Defensive stance, slide, close out</li>
                    <li>Menjaga pemain dgn/tanpa bola</li>
                    <li>1on1, 2on2, 3on3</li>
                    <li>Give and go, Spacing sederhana</li>
                  </ul>
                </SubSection>
              </div>
            </ContentBlock>

            <div className="grid grid-cols-2 gap-4">
              <ContentBlock title="Bentuk Latihan">
                <ul className="space-y-1 text-gray-700 dark:text-gray-300 font-medium">
                  <li className="flex justify-between border-b pb-1"><span>Teknik fundamental</span><span className="text-emerald-600 dark:text-emerald-400">40%</span></li>
                  <li className="flex justify-between border-b pb-1"><span>Game situation</span><span className="text-emerald-600 dark:text-emerald-400">30%</span></li>
                  <li className="flex justify-between border-b pb-1"><span>Koordinasi & agility</span><span className="text-emerald-600 dark:text-emerald-400">20%</span></li>
                  <li className="flex justify-between"><span>Pertandingan</span><span className="text-emerald-600 dark:text-emerald-400">10%</span></li>
                </ul>
              </ContentBlock>
              
              <ContentBlock title="Target Kelulusan" className="bg-emerald-50 dark:bg-emerald-900/20 border border-white dark:border-emerald-900/30">
                <ul className="list-disc pl-5 space-y-1 text-emerald-900 dark:text-emerald-200 text-xs">
                  <li>Dribble kedua tangan</li>
                  <li>Lay-up kanan dan kiri</li>
                  <li>Bermain 1-on-1</li>
                  <li>Memahami spacing</li>
                  <li>Melakukan defense dasar</li>
                  <li>Membuat keputusan sederhana</li>
                </ul>
              </ContentBlock>
            </div>
          </div>
        </PathwayCard>

        {/* Section 3: SD Upper */}
        <PathwayCard 
          id={3}
          title="SD UPPER — Skill Application"
          age="10–12 Tahun"
          focus="Mengaplikasikan teknik dalam situasi pertandingan (Tahu kapan harus menggunakan teknik)."
          color="amber"
          isExpanded={expandedSection === 3}
          onToggle={() => toggleSection(3)}
        >
          <div className="space-y-4 text-sm">
            <ContentBlock title="Teknik Basket">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SubSection title="Ball Handling">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Crossover, Between the legs, Behind the back</li>
                    <li>Hesitation, Change of pace</li>
                    <li>Retreat dribble, Protect the ball</li>
                  </ul>
                </SubSection>
                <SubSection title="Passing">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Passing dengan defense / dari dribble</li>
                    <li>Skip pass, Extra pass</li>
                    <li>Passing ke ruang kosong</li>
                  </ul>
                </SubSection>
                <SubSection title="Shooting & Finishing">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Catch and shoot, Pull-up shooting</li>
                    <li>Shooting dari berbagai spot</li>
                    <li>Lay-up dgn defense, Euro step dasar</li>
                    <li>Reverse lay-up, Floater dasar</li>
                    <li>Finishing tangan lemah</li>
                  </ul>
                </SubSection>
                <SubSection title="Defense & Taktik">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>On-ball, Help, Close out, Deny defense</li>
                    <li>2on2 s/d 5on5 dasar</li>
                    <li>Give and go, Pick and roll (pengenalan)</li>
                    <li>Fast break, Transition defense</li>
                  </ul>
                </SubSection>
              </div>
            </ContentBlock>

            <div className="grid grid-cols-2 gap-4">
              <ContentBlock title="Bentuk Latihan">
                <ul className="space-y-1 text-gray-700 dark:text-gray-300 font-medium">
                  <li className="flex justify-between border-b pb-1"><span>Individual skill</span><span className="text-amber-600 dark:text-amber-400">40%</span></li>
                  <li className="flex justify-between border-b pb-1"><span>Game situation</span><span className="text-amber-600 dark:text-amber-400">30%</span></li>
                  <li className="flex justify-between border-b pb-1"><span>Tactical understanding</span><span className="text-amber-600 dark:text-amber-400">20%</span></li>
                  <li className="flex justify-between"><span>Physical development</span><span className="text-amber-600 dark:text-amber-400">10%</span></li>
                </ul>
              </ContentBlock>
              
              <ContentBlock title="Target Kelulusan" className="bg-amber-50 dark:bg-amber-900/20 border border-white dark:border-amber-900/30">
                <ul className="list-disc pl-5 space-y-1 text-amber-900 dark:text-amber-200 text-xs">
                  <li>Gunakan teknik dlm permainan</li>
                  <li>Bermain dengan kedua tangan</li>
                  <li>Membaca situasi 1-on-1</li>
                  <li>Memahami konsep spacing</li>
                  <li>Melakukan fast break</li>
                  <li>Mengerti dasar team defense</li>
                </ul>
              </ContentBlock>
            </div>
          </div>
        </PathwayCard>

        {/* Section 4: SMP */}
        <PathwayCard 
          id={4}
          title="SMP — Performance & Tactical"
          age="12–15 Tahun"
          focus="Peningkatan kualitas teknik, pemahaman taktik, dan perkembangan fisik (Competitive preparation)."
          color="fuchsia"
          isExpanded={expandedSection === 4}
          onToggle={() => toggleSection(4)}
        >
          <div className="space-y-4 text-sm">
            <ContentBlock title="Teknik Individual">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SubSection title="Ball Handling & Passing">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Advanced moves (In/out, Spin move)</li>
                    <li>Ball protection under pressure</li>
                    <li>Passing dalam tekanan, Pocket pass</li>
                    <li>Drive and kick, Membaca rotasi defense</li>
                  </ul>
                </SubSection>
                <SubSection title="Shooting & Finishing">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Pull-up jumper, Side step, Step back</li>
                    <li>Shooting off the dribble</li>
                    <li>Contact finishing, Euro step, Pro hop</li>
                    <li>Floater, Reverse lay-up</li>
                  </ul>
                </SubSection>
                <SubSection title="Defense">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>On-ball & Help defense</li>
                    <li>Pick and roll defense</li>
                    <li>Rotation, Defensive communication</li>
                  </ul>
                </SubSection>
                <SubSection title="Taktik Tim">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>5-out / 4-out 1-in / Motion offense</li>
                    <li>Pick and roll / pop</li>
                    <li>Fast break & Secondary break</li>
                    <li>Zone & Man-to-man defense</li>
                  </ul>
                </SubSection>
              </div>
            </ContentBlock>

            <ContentBlock title="Physical Development" className="bg-fuchsia-50 dark:bg-fuchsia-900/20 border border-white dark:border-fuchsia-900/30">
              <p className="text-xs text-fuchsia-800 dark:text-fuchsia-200 font-medium mb-2">⚠️ Latihan menyesuaikan perkembangan biologis, bukan hanya usia kalender.</p>
              <ul className="list-disc pl-5 space-y-1 text-fuchsia-900 dark:text-fuchsia-200 grid grid-cols-2">
                <li>Speed & Agility</li>
                <li>Coordination</li>
                <li>Jumping ability</li>
                <li>Core stability</li>
                <li>Strength dasar</li>
                <li>Injury prevention</li>
              </ul>
            </ContentBlock>

            <div className="grid grid-cols-2 gap-4">
              <ContentBlock title="Bentuk Latihan">
                <ul className="space-y-1 text-gray-700 dark:text-gray-300 font-medium">
                  <li className="flex justify-between border-b pb-1"><span>Individual skill</span><span className="text-fuchsia-600 dark:text-fuchsia-400">35%</span></li>
                  <li className="flex justify-between border-b pb-1"><span>Tactical training</span><span className="text-fuchsia-600 dark:text-fuchsia-400">30%</span></li>
                  <li className="flex justify-between border-b pb-1"><span>Game situation</span><span className="text-fuchsia-600 dark:text-fuchsia-400">20%</span></li>
                  <li className="flex justify-between"><span>Physical dev.</span><span className="text-fuchsia-600 dark:text-fuchsia-400">15%</span></li>
                </ul>
              </ContentBlock>
              
              <ContentBlock title="Target Kelulusan" className="bg-fuchsia-50 dark:bg-fuchsia-900/20 border border-white dark:border-fuchsia-900/30">
                <ul className="list-disc pl-5 space-y-1 text-fuchsia-900 dark:text-fuchsia-200 text-xs">
                  <li>Bermain dalam sistem tim</li>
                  <li>Memahami posisi dan peran</li>
                  <li>Mengambil keputusan cepat</li>
                  <li>Bermain dalam tekanan</li>
                  <li>Memiliki senjata skill andalan</li>
                </ul>
              </ContentBlock>
            </div>
          </div>
        </PathwayCard>

        {/* Section 5: SMA */}
        <PathwayCard 
          id={5}
          title="SMA — High Performance"
          age="15–18 Tahun"
          focus="Performa kompetitif, spesialisasi posisi, dan persiapan level prestasi (Klub, Universitas, Pro)."
          color="rose"
          isExpanded={expandedSection === 5}
          onToggle={() => toggleSection(5)}
        >
          <div className="space-y-4 text-sm">
            <ContentBlock title="Individual Skill (Spesialisasi)">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SubSection title="Guard">
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>Advanced ball handling</li>
                    <li>PnR reading</li>
                    <li>Pull-up shooting</li>
                    <li>Playmaking & Decision</li>
                  </ul>
                </SubSection>
                <SubSection title="Wing">
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>Catch and shoot</li>
                    <li>Attack close out</li>
                    <li>Mid-range game</li>
                    <li>Transition finishing</li>
                  </ul>
                </SubSection>
                <SubSection title="Forward/Big">
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>Post moves & Face-up</li>
                    <li>PnR & Pop</li>
                    <li>Rim protection</li>
                    <li>Contact finishing</li>
                  </ul>
                </SubSection>
              </div>
            </ContentBlock>

            <ContentBlock title="Advanced System">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SubSection title="Shooting & Defense">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Game-speed / Movement shooting</li>
                    <li>Off-screen / PnR shooting</li>
                    <li>Switching, Hedge, Drop coverage</li>
                    <li>Full court press & Rotation</li>
                  </ul>
                </SubSection>
                <SubSection title="Taktik & Mental">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Special situation (End game, ATO)</li>
                    <li>Scouting & Game preparation</li>
                    <li>Leadership & Mental toughness</li>
                    <li>Team responsibility</li>
                  </ul>
                </SubSection>
              </div>
            </ContentBlock>

            <div className="grid grid-cols-2 gap-4">
              <ContentBlock title="Bentuk Latihan">
                <ul className="space-y-1 text-gray-700 dark:text-gray-300 font-medium">
                  <li className="flex justify-between border-b pb-1"><span>Individual skill</span><span className="text-rose-600 dark:text-rose-400">30%</span></li>
                  <li className="flex justify-between border-b pb-1"><span>Tactical training</span><span className="text-rose-600 dark:text-rose-400">30%</span></li>
                  <li className="flex justify-between border-b pb-1"><span>Game situation</span><span className="text-rose-600 dark:text-rose-400">20%</span></li>
                  <li className="flex justify-between border-b pb-1"><span>Physical perf.</span><span className="text-rose-600 dark:text-rose-400">15%</span></li>
                  <li className="flex justify-between"><span>Mental</span><span className="text-rose-600 dark:text-rose-400">5%</span></li>
                </ul>
              </ContentBlock>
              
              <ContentBlock title="Physical Performance" className="bg-rose-50 dark:bg-rose-900/20 border border-white dark:border-rose-900/30">
                <ul className="list-disc pl-5 space-y-1 text-rose-900 dark:text-rose-200 text-xs">
                  <li>Strength & Power</li>
                  <li>Speed & Agility</li>
                  <li>Conditioning</li>
                  <li>Recovery & Mobility</li>
                  <li>Injury prevention</li>
                </ul>
              </ContentBlock>
            </div>
          </div>
        </PathwayCard>
      </div>

      <div className="bg-white dark:bg-[#1A1C29] rounded-2xl p-6 border border-white dark:border-black shadow-sm mt-6">
        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Ringkasan Perkembangan
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-[#151720] text-gray-500 dark:text-gray-400 text-xs uppercase font-bold border-b border-white dark:border-black">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Level</th>
                <th className="px-4 py-3">Usia</th>
                <th className="px-4 py-3">Fokus Utama</th>
                <th className="px-4 py-3 rounded-tr-lg">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800 dark:text-gray-200">
              <tr>
                <td className="px-4 py-3 text-blue-700">SD Lower</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">&lt;6–8</td>
                <td className="px-4 py-3">Fun & Movement</td>
                <td className="px-4 py-3">Suka bermain basket</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-emerald-700">SD Berkembang</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">8–10</td>
                <td className="px-4 py-3">Basic Fundamental</td>
                <td className="px-4 py-3">Menguasai teknik dasar</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-amber-700">SD Upper</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">10–12</td>
                <td className="px-4 py-3">Skill Application</td>
                <td className="px-4 py-3">Gunakan teknik dlm game</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-fuchsia-700">SMP</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">12–15</td>
                <td className="px-4 py-3">Performance & Tactics</td>
                <td className="px-4 py-3">Bermain dlm sistem</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-rose-700">SMA</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">15–18</td>
                <td className="px-4 py-3">High Performance</td>
                <td className="px-4 py-3">Kompetitif & spesialisasi</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1C29] rounded-2xl p-6 shadow-sm border border-white dark:border-black mt-6">
        <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-500" />
          Konsep Utama Akademi (5 Pilar)
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
          Prinsip penting: Untuk anak usia dini jangan terlalu cepat memaksa spesialisasi posisi. Bangun athletic ability & fundamental skill. Spesialisasi dimulai usia SMP–SMA.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PilarCard 
            icon={<Target className="w-5 h-5" />} 
            title="1. Technical Skill" 
            items={['Dribbling', 'Passing', 'Shooting', 'Finishing', 'Footwork']}
            color="bg-blue-500"
          />
          <PilarCard 
            icon={<Brain className="w-5 h-5" />} 
            title="2. Tactical Understanding" 
            items={['1-on-1', '2-on-2', '3-on-3', '5-on-5', 'Offense', 'Defense']}
            color="bg-emerald-500"
          />
          <PilarCard 
            icon={<Activity className="w-5 h-5" />} 
            title="3. Physical Development" 
            items={['Speed', 'Agility', 'Strength', 'Power', 'Endurance', 'Mobility']}
            color="bg-amber-500"
          />
          <PilarCard 
            icon={<BookOpen className="w-5 h-5" />} 
            title="4. Mental Development" 
            items={['Discipline', 'Confidence', 'Focus', 'Leadership', 'Resilience']}
            color="bg-purple-500"
          />
          <PilarCard 
            icon={<Users className="w-5 h-5" />} 
            title="5. Character & Teamwork" 
            items={['Respect', 'Responsibility', 'Communication', 'Teamwork', 'Sportsmanship']}
            color="bg-rose-500"
          />
        </div>
      </div>
    </div>
  );
}

function PathwayCard({ id, title, age, focus, color, isExpanded, onToggle, children }: any) {
  const colors = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-white dark:border-blue-900/30', text: 'text-blue-900 dark:text-blue-100', badge: 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-white dark:border-emerald-900/30', text: 'text-emerald-900 dark:text-emerald-100', badge: 'bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-white dark:border-amber-900/30', text: 'text-amber-900 dark:text-amber-100', badge: 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200' },
    fuchsia: { bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20', border: 'border-white dark:border-fuchsia-900/30', text: 'text-fuchsia-900 dark:text-fuchsia-100', badge: 'bg-fuchsia-200 dark:bg-fuchsia-800 text-fuchsia-800 dark:text-fuchsia-200 dark:text-fuchsia-200' },
    rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-white dark:border-rose-900/30', text: 'text-rose-900 dark:text-rose-100', badge: 'bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200' },
  }[color as 'blue'|'emerald'|'amber'|'fuchsia'|'rose'];

  return (
    <div className={cn("rounded-2xl border transition-all duration-300 overflow-hidden", colors.bg, colors.border, isExpanded ? 'shadow-md' : 'shadow-sm')}>
      <button 
        onClick={onToggle}
        className="w-full text-left p-5 flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className={cn("font-bold text-lg", colors.text)}>{title}</h3>
            <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap", colors.badge)}>{age}</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium opacity-80 pr-6">{focus}</p>
        </div>
        <ChevronRight className={cn("w-6 h-6 shrink-0 transition-transform duration-300 mt-2", colors.text, isExpanded && "rotate-90")} />
      </button>
      
      <div className={cn("grid transition-all duration-300", isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">
          <div className="p-5 pt-0 border-t border-black/5 mt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentBlock({ title, children, className }: any) {
  return (
    <div className={cn("bg-white dark:bg-[#1A1C29] p-4 rounded-xl border border-white dark:border-black shadow-sm", className)}>
      <h4 className="font-bold text-gray-900 dark:text-white mb-2 border-b border-white dark:border-black pb-1">{title}</h4>
      {children}
    </div>
  );
}

function SubSection({ title, children }: any) {
  return (
    <div>
      <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">{title}</h5>
      <div className="text-gray-500 dark:text-gray-400 text-xs">{children}</div>
    </div>
  );
}

function PilarCard({ icon, title, items, color }: any) {
  return (
    <div className="bg-white dark:bg-black shadow-sm p-4 rounded-xl border border-white dark:border-black hover:border-blue-500 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", color)}>
          {icon}
        </div>
        <h4 className="font-bold text-gray-900 dark:text-white">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item: string) => (
          <span key={item} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
