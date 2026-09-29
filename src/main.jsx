import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Bell, Bot,
  Boxes, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp,
  Command, Compass, CreditCard, Download, Gauge, Home, Inbox, Layers3, Lightbulb,
  LoaderCircle, Menu, MessageSquareText, Moon, MoreHorizontal, MousePointer2, PanelLeftClose,
  Play, Plus, RefreshCw, Search, Send, Settings, Share2, Sparkles, Sun, Target,
  TrendingUp, TriangleAlert, UserRound, Users, WandSparkles, X, Zap
} from 'lucide-react';
import './styles.css';

const views = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'acquisition', label: 'Acquisition', icon: Compass },
  { id: 'engagement', label: 'Engagement', icon: Activity },
  { id: 'revenue', label: 'Revenue', icon: CreditCard },
  { id: 'users', label: 'Users', icon: Users },
];

const metricsByView = {
  overview: [
    { label: 'Active users', value: '24,892', delta: '+12.4%', good: true, note: 'vs. previous period', spark: [6,9,8,13,11,16,15,19,18,23,22,26] },
    { label: 'Activation rate', value: '64.8%', delta: '+3.2%', good: true, note: '1,240 activated', spark: [8,9,12,11,13,15,14,17,19,18,20,22] },
    { label: 'Net revenue', value: '$128.4k', delta: '+8.1%', good: true, note: '$11.2k expansion', spark: [8,10,9,12,14,13,16,14,19,21,20,23] },
    { label: 'Churn rate', value: '2.41%', delta: '−0.6%', good: true, note: '94 accounts at risk', spark: [22,21,20,21,18,17,18,15,16,13,12,11] },
  ],
  acquisition: [
    { label: 'New visitors', value: '41,293', delta: '+18.9%', good: true, note: '55.2% organic', spark: [6,9,8,11,14,15,13,18,20,19,24,27] },
    { label: 'Signup conversion', value: '8.7%', delta: '+1.4%', good: true, note: '3,592 signups', spark: [8,8,10,9,12,12,14,16,15,18,17,20] },
    { label: 'Blended CAC', value: '$42.10', delta: '−7.2%', good: true, note: '$6.8k saved', spark: [22,21,20,19,21,17,18,15,16,13,14,12] },
    { label: 'Qualified leads', value: '1,864', delta: '+22.6%', good: true, note: '51.9% of signups', spark: [6,8,7,10,12,11,15,17,16,20,23,26] },
  ],
  engagement: [
    { label: 'Weekly active', value: '18,426', delta: '+9.8%', good: true, note: '74.0% of MAU', spark: [8,9,11,10,13,16,15,17,19,18,21,23] },
    { label: 'Sessions / user', value: '4.8', delta: '+0.7', good: true, note: '35 min. average', spark: [7,9,9,11,10,13,14,14,16,17,17,19] },
    { label: 'Feature adoption', value: '38.4%', delta: '+4.3%', good: true, note: 'AI actions lead', spark: [8,10,9,12,14,15,15,18,19,20,22,25] },
    { label: 'D30 retention', value: '68.1%', delta: '−1.2%', good: false, note: '2 cohorts below goal', spark: [21,20,22,19,20,18,19,16,17,15,14,13] },
  ],
  revenue: [
    { label: 'Monthly revenue', value: '$382.6k', delta: '+14.2%', good: true, note: '$4.59m run rate', spark: [8,9,11,12,14,13,17,18,19,21,23,26] },
    { label: 'Revenue / account', value: '$1,482', delta: '+5.8%', good: true, note: '248 paid accounts', spark: [8,10,9,11,12,14,13,16,18,17,19,21] },
    { label: 'Expansion MRR', value: '$24.8k', delta: '+19.4%', good: true, note: '32 upgrades', spark: [7,8,11,9,13,14,17,15,19,20,24,27] },
    { label: 'Gross churn', value: '$9.2k', delta: '+2.1%', good: false, note: '14 cancellations', spark: [10,9,11,10,13,12,14,13,15,14,17,18] },
  ],
  users: [
    { label: 'Total accounts', value: '8,294', delta: '+7.6%', good: true, note: '248 paid', spark: [8,9,10,11,12,13,15,16,18,19,21,23] },
    { label: 'Power users', value: '2,104', delta: '+16.8%', good: true, note: '25.4% of users', spark: [7,8,10,9,12,14,13,17,19,21,20,24] },
    { label: 'Teams created', value: '384', delta: '+12.1%', good: true, note: '1.8 seats / team', spark: [8,10,9,11,14,13,15,17,16,20,19,22] },
    { label: 'At-risk users', value: '492', delta: '+4.9%', good: false, note: 'Needs attention', spark: [8,9,10,10,11,12,13,13,15,14,16,17] },
  ],
};

const chartData = {
  overview: { title: 'Active users', value: '24,892', previous: '22,145', points: [36,39,37,43,41,48,46,52,55,51,59,61,57,66,63,70,72,68,76,74,82,85,81,89,92,96,93,101] },
  acquisition: { title: 'New visitors', value: '41,293', previous: '34,730', points: [28,35,31,39,42,37,47,51,48,55,49,61,58,63,69,65,74,71,79,76,84,81,91,88,98,101,96,108] },
  engagement: { title: 'Weekly active users', value: '18,426', previous: '16,782', points: [34,38,37,42,40,46,49,47,52,50,57,59,56,62,61,66,69,67,72,71,75,78,76,82,81,87,85,91] },
  revenue: { title: 'Monthly recurring revenue', value: '$382.6k', previous: '$335.1k', points: [31,34,37,35,41,44,42,48,51,49,56,54,61,63,62,69,67,74,76,73,81,84,82,89,92,90,97,101] },
  users: { title: 'Total accounts', value: '8,294', previous: '7,705', points: [32,34,36,39,38,42,45,44,49,52,50,55,57,56,62,64,63,69,71,70,76,78,77,83,85,84,89,92] },
};

const sources = [
  { name: 'Organic search', icon: Search, visitors: '18,492', rate: '12.4%', width: 86, change: '+18.2%' },
  { name: 'Product-led referral', icon: Share2, visitors: '9,824', rate: '16.8%', width: 68, change: '+31.4%' },
  { name: 'Paid social', icon: MousePointer2, visitors: '7,301', rate: '6.2%', width: 51, change: '+4.1%' },
  { name: 'Direct', icon: Compass, visitors: '5,676', rate: '8.9%', width: 39, change: '−2.3%' },
];

function Sparkline({ values, bad }) {
  const max = Math.max(...values), min = Math.min(...values);
  const pts = values.map((v,i)=> `${(i/(values.length-1))*100},${32-((v-min)/(max-min||1))*25}`).join(' ');
  return <svg className="spark" viewBox="0 0 100 36" preserveAspectRatio="none"><polyline points={pts} fill="none" stroke={bad?'var(--red)':'var(--ink)'} strokeWidth="2" vectorEffect="non-scaling-stroke"/><circle cx="100" cy={pts.split(' ').at(-1).split(',')[1]} r="2.5" fill={bad?'var(--red)':'var(--accent)'}/></svg>
}

function MainChart({ view }) {
  const data = chartData[view];
  const max = Math.max(...data.points), min=Math.min(...data.points);
  const coords = data.points.map((v,i)=>[24+(i/(data.points.length-1))*736, 190-((v-min)/(max-min))*130]);
  const line = coords.map(p=>p.join(',')).join(' ');
  const area = `24,205 ${line} 760,205`;
  return <section className="card chart-card">
    <div className="card-head">
      <div><div className="eyebrow">{data.title}</div><div className="chart-value">{data.value} <span><ArrowUpRight size={13}/>12.4%</span></div></div>
      <div className="legend"><span><i className="dot now"/>Current</span><span><i className="dot prev"/>Previous</span></div>
    </div>
    <div className="chart-wrap">
      <div className="y-labels"><span>{view==='revenue'?'$400k':'30k'}</span><span>{view==='revenue'?'$300k':'20k'}</span><span>{view==='revenue'?'$200k':'10k'}</span><span>0</span></div>
      <svg viewBox="0 0 780 230" preserveAspectRatio="none" className="main-chart" aria-label={`${data.title} trend chart`}>
        <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity=".32"/><stop offset="1" stopColor="var(--accent)" stopOpacity="0"/></linearGradient></defs>
        {[35,90,145,200].map(y=><line key={y} x1="24" y1={y} x2="760" y2={y} className="gridline"/>)}
        <polyline points={coords.map(([x,y])=>`${x},${y+25}`).join(' ')} fill="none" className="previous-line"/>
        <polygon points={area} fill="url(#fill)"/>
        <polyline points={line} fill="none" className="current-line"/>
        <line x1="574" y1="42" x2="574" y2="205" className="focus-line"/>
        <circle cx="574" cy={coords[20][1]} r="5" className="focus-dot"/>
      </svg>
      <div className="tooltip" style={{left:'69%', top:'16%'}}><strong>Sep 22</strong><span>{view==='revenue'?'$14,820':'1,284 users'}</span><small>+18.2% vs prev.</small></div>
      <div className="x-labels"><span>Sep 1</span><span>Sep 8</span><span>Sep 15</span><span>Sep 22</span><span>Sep 28</span></div>
    </div>
  </section>
}

function Sidebar({ active, setActive, open, onClose }) {
 return <aside className={`sidebar ${open?'open':''}`}>
   <div className="brand"><div className="brand-mark"><span/></div><span>signal</span><button className="mobile-close" onClick={onClose}><X size={19}/></button></div>
   <button className="workspace"><div className="workspace-icon">A</div><div><b>Acme, Inc.</b><span>Growth workspace</span></div><ChevronDown size={15}/></button>
   <nav>
    <p>Analytics</p>
    {views.map(v=><button key={v.id} className={active===v.id?'active':''} onClick={()=>{setActive(v.id);onClose()}}><v.icon size={18}/><span>{v.label}</span>{v.id==='users'&&<em>8.2k</em>}</button>)}
    <p>Intelligence</p>
    <button className={active==='copilot'?'active ai-nav':''} onClick={()=>{setActive('copilot');onClose()}}><Sparkles size={18}/><span>AI Copilot</span><i className="new-badge">New</i></button>
    <button><Target size={18}/><span>Goals</span></button>
    <button><Bell size={18}/><span>Alerts</span><em>3</em></button>
   </nav>
   <div className="sidebar-bottom">
    <div className="usage"><div><span>Events this month</span><b>7.8m / 10m</b></div><div className="usage-track"><span/></div></div>
    <button><CircleHelp size={18}/>Help & docs</button><button><Settings size={18}/>Settings</button>
    <div className="profile"><div className="avatar">MK</div><div><b>Mina Kim</b><span>mina@acme.co</span></div><MoreHorizontal size={17}/></div>
   </div>
 </aside>
}

function Topbar({ view, setMenu, theme, setTheme, stateMode, setStateMode }) {
 const title = view==='copilot'?'AI Copilot':views.find(v=>v.id===view)?.label;
 return <header className="topbar">
   <div className="title-wrap"><button className="menu-btn" onClick={()=>setMenu(true)}><Menu size={21}/></button><div><h1>{title}</h1><p>Sep 1–28, 2026</p></div></div>
   <div className="top-actions">
    <button className="search-btn"><Search size={17}/><span>Search anything...</span><kbd>⌘ K</kbd></button>
    <div className="state-picker"><button className="icon-btn state-trigger" title="Preview UI states"><Activity size={17}/></button><div className="state-menu"><small>Preview UI state</small>{['live','loading','empty','error'].map(s=><button key={s} onClick={()=>setStateMode(s)} className={stateMode===s?'selected':''}>{s==='live'?<CheckCircle2/>:s==='loading'?<LoaderCircle/>:s==='empty'?<Inbox/>:<TriangleAlert/>}<span>{s}</span>{stateMode===s&&<Check size={14}/>}</button>)}</div></div>
    <button className="icon-btn" onClick={()=>setTheme(theme==='light'?'dark':'light')} title="Toggle theme">{theme==='light'?<Moon size={18}/>:<Sun size={18}/>}</button>
    <button className="icon-btn notification"><Bell size={18}/><i/></button>
    <button className="date-btn"><CalendarDays size={16}/><span>Last 28 days</span><ChevronDown size={14}/></button>
   </div>
 </header>
}

function MetricGrid({ view }) { return <div className="metrics-grid">{metricsByView[view].map((m,i)=><article className="metric-card" key={m.label} style={{animationDelay:`${i*60}ms`}}><div className="metric-top"><span>{m.label}</span><MoreHorizontal size={17}/></div><div className="metric-main"><strong>{m.value}</strong><Sparkline values={m.spark} bad={!m.good}/></div><div className="metric-foot"><span className={m.good?'positive':'negative'}>{m.good?<ArrowUpRight/>:<ArrowDownRight/>}{m.delta}</span><small>{m.note}</small></div></article>)}</div> }

function InsightRail({ view }) {
 const text = view==='engagement'?'D30 retention slipped in two SMB cohorts. Users who skip team invites are 2.4× more likely to churn.':view==='revenue'?'Expansion revenue is accelerating. AI-feature adopters upgrade 19 days earlier than other accounts.':view==='acquisition'?'Product-led referrals grew 31%. Invited teammates convert 2.1× better than paid traffic.':'Activation rose after the onboarding update. The lift is concentrated among teams of 5–20.';
 return <aside className="insight-card">
   <div className="insight-label"><Sparkles size={15}/><span>Signal insight</span><i>Just now</i></div>
   <h3>{view==='engagement'?'Retention risk found':view==='revenue'?'Expansion opportunity':view==='acquisition'?'Referral loop is working':'Your activation lift is real'}</h3>
   <p>{text}</p>
   <div className="evidence"><span>Confidence</span><b>94%</b><div><i style={{width:'94%'}}/></div></div>
   <button>Explore this insight <ArrowRight size={15}/></button>
 </aside>
}

function Funnel({view}) {
 const title = view==='revenue'?'Revenue movement':view==='engagement'?'Core journey':view==='users'?'Account health':'Activation funnel';
 const steps = view==='revenue'?[['Starting MRR','$335k',100],['Expansion','+$24.8k',78],['New business','+$32.0k',64],['Churn','−$9.2k',45]]:[['Visited','41,293',100],['Signed up','3,592',78],['Created project','2,614',61],['Activated','2,328',48]];
 return <section className="card funnel-card"><div className="card-title"><div><h3>{title}</h3><p>Conversion by key milestone</p></div><button><MoreHorizontal/></button></div><div className="funnel">{steps.map((s,i)=><div className="funnel-row" key={s[0]}><div className="funnel-meta"><span>{s[0]}</span><b>{s[1]}</b></div><div className="funnel-bar"><span style={{width:`${s[2]}%`}}/></div>{i<steps.length-1&&<small>{[8.7,72.8,89.1][i]}%</small>}</div>)}</div><button className="text-action">View funnel report <ArrowRight/></button></section>
}

function SourcesTable({view}) { return <section className="card source-card"><div className="card-title"><div><h3>{view==='users'?'Top user segments':'Acquisition sources'}</h3><p>Performance and conversion</p></div><button className="compact">View report <ArrowRight/></button></div><div className="table-head"><span>Source</span><span>Visitors</span><span>Conv. rate</span><span>Change</span></div>{sources.map((s,i)=><div className="source-row" key={s.name}><div className="source-name"><div><s.icon size={15}/></div><span>{view==='users'?['Power users','Growing teams','New users','At risk'][i]:s.name}</span></div><span>{s.visitors}</span><div><b>{s.rate}</b><i><em style={{width:`${s.width}%`}}/></i></div><span className={s.change.startsWith('−')?'down':'up'}>{s.change}</span></div>)}</section> }

function LiveFeed() { const items=[['PL','Project launched','Olivia Martin','2m'],['AI','Asked AI to summarize','Noah Williams','8m'],['UP','Upgraded to Scale','Luma Labs','14m'],['IN','Invited 4 teammates','Kai Chen','21m']]; return <section className="card feed-card"><div className="card-title"><div><h3>Live activity</h3><p>High-signal events</p></div><span className="live"><i/>Live</span></div><div className="feed-list">{items.map((x,i)=><div className="feed-item" key={x[1]}><div className={`feed-icon f${i}`}>{x[0]}</div><div><b>{x[1]}</b><span>{x[2]}</span></div><time>{x[3]}</time></div>)}</div></section> }

function StateView({mode, onReset}) {
 if(mode==='loading') return <div className="state-page loading-state"><div className="skeleton sk-title"/><div className="skeleton sk-sub"/><div className="skeleton-grid">{[1,2,3,4].map(i=><div className="skeleton sk-card" key={i}/>)}</div><div className="skeleton sk-chart"/><div className="loading-label"><LoaderCircle className="spin"/>Crunching the latest events…</div></div>;
 if(mode==='empty') return <div className="state-page center-state"><div className="state-illustration"><BarChart3/><span className="mini-bar b1"/><span className="mini-bar b2"/><span className="mini-bar b3"/></div><h2>Your insights start here</h2><p>Connect a data source or install the SDK to see your first meaningful signals. Most teams are up and running in under 10 minutes.</p><div className="state-actions"><button className="primary"><Plus/>Connect data source</button><button>Read setup guide <ArrowRight/></button></div></div>;
 return <div className="state-page center-state"><div className="error-icon"><TriangleAlert/></div><h2>We couldn't load this view</h2><p>Your data is safe. There was a problem reaching the analytics service. Try again, or check the service status.</p><div className="error-code">ERR_SYNC_TIMEOUT · 09:42:18 UTC</div><div className="state-actions"><button className="primary" onClick={onReset}><RefreshCw/>Try again</button><button>View status</button></div></div>;
}

function StandardDashboard({view}) { return <>
 <div className="context-row"><div><h2>{view==='overview'?'Good morning, Mina.':`${views.find(v=>v.id===view)?.label} performance`}</h2><p>{view==='overview'?"Here's what changed across your product.":'Key signals and opportunities for this period.'}</p></div><div className="context-actions"><button><Download/><span>Export</span></button><button><Share2/><span>Share</span></button><button className="primary"><Plus/><span>Add report</span></button></div></div>
 <MetricGrid view={view}/>
 <div className="analysis-grid"><MainChart view={view}/><InsightRail view={view}/></div>
 <div className="bottom-grid"><SourcesTable view={view}/><Funnel view={view}/><LiveFeed/></div>
 </> }

function Copilot() {
 const [query,setQuery]=useState(''); const [messages,setMessages]=useState([]);
 const ask=()=>{if(!query.trim())return;setMessages(m=>[...m,{q:query,a:'I found a meaningful change: activation is up 12.4%, driven mostly by teams that invite a colleague in their first session. The strongest opportunity is to surface invites immediately after project creation.'}]);setQuery('')}
 return <div className="copilot-page">
   <div className="copilot-hero"><div className="ai-orb"><Sparkles/></div><div><span className="eyebrow">AI COPILOT</span><h2>What do you want to understand?</h2><p>Ask questions, investigate changes, and turn any insight into action.</p></div></div>
   <div className="ask-box"><div className="ask-top"><Sparkles/><textarea value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask()}}} placeholder="Ask about your product data…"/></div><div className="ask-bottom"><div><button><Layers3/>All data</button><button><CalendarDays/>Last 28 days</button></div><button className="send" onClick={ask}><Send/></button></div></div>
   {messages.map((m,i)=><div className="conversation" key={i}><div className="question"><div className="avatar small">MK</div><p>{m.q}</p></div><div className="answer"><div className="ai-small"><Sparkles/></div><div><p>{m.a}</p><div className="answer-actions"><button><WandSparkles/>Create experiment</button><button><Bell/>Set alert</button><button><Share2/>Share</button></div></div></div></div>)}
   {!messages.length&&<><div className="prompt-grid"><button onClick={()=>setQuery('Why did activation increase this month?')}><TrendingUp/><div><b>Explain a change</b><span>Why did activation increase this month?</span></div><ArrowRight/></button><button onClick={()=>setQuery('Which accounts are most likely to churn?')}><Target/><div><b>Find an opportunity</b><span>Which accounts are likely to churn?</span></div><ArrowRight/></button><button onClick={()=>setQuery('Create a weekly growth report')}><WandSparkles/><div><b>Build a report</b><span>Create my weekly growth briefing</span></div><ArrowRight/></button></div>
   <div className="agent-section"><div className="section-head"><div><h3>Agent recommendations</h3><p>Actions prepared from your latest signals</p></div><button>View activity <ArrowRight/></button></div><div className="recommendations"><article><div className="rec-icon amber"><Zap/></div><div className="rec-body"><span>ACTIVATION · HIGH IMPACT</span><h4>Test team invite prompt after project creation</h4><p>Predicted to lift activation by 4–7% based on current behavior.</p><div><button className="primary"><Play/>Review & launch</button><button>Dismiss</button></div></div><div className="impact"><small>EST. IMPACT</small><b>+$18.2k</b><span>annual revenue</span></div></article><article><div className="rec-icon lilac"><Bell/></div><div className="rec-body"><span>RETENTION · MONITOR</span><h4>Alert when high-value accounts go quiet</h4><p>12 accounts have dropped below their normal usage baseline.</p><div><button><Check/>Approve alert</button><button>Adjust</button></div></div><div className="impact"><small>ACCOUNTS</small><b>12</b><span>$42k at risk</span></div></article></div></div></>}
 </div>
}

function App(){
 const [view,setView]=useState('overview'); const [theme,setTheme]=useState(()=>localStorage.getItem('signal-theme')||'light'); const [menu,setMenu]=useState(false); const [stateMode,setStateMode]=useState('live');
 useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('signal-theme',theme)},[theme]);
 return <div className="app"><Sidebar active={view} setActive={v=>{setView(v);setStateMode('live')}} open={menu} onClose={()=>setMenu(false)}/>{menu&&<div className="backdrop" onClick={()=>setMenu(false)}/>}<div className="main-shell"><Topbar view={view} setMenu={setMenu} theme={theme} setTheme={setTheme} stateMode={stateMode} setStateMode={setStateMode}/><main>{stateMode!=='live'?<StateView mode={stateMode} onReset={()=>setStateMode('live')}/>:view==='copilot'?<Copilot/>:<StandardDashboard view={view}/>}</main></div></div>
}

createRoot(document.getElementById('root')).render(<App/>);
