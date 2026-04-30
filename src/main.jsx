import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './supabase'
import { LogOut, Users, Dumbbell, ClipboardList, UserRound, ShieldCheck, PlusCircle, CalendarDays, Pencil, Trash2, X, Languages, LockKeyhole, Search } from 'lucide-react'
import './styles.css'

const TEXT = {
  ar: {
    loginTitle: 'Gym Zaman', loginSub: 'نظام إدارة داخلي', staffOnly: 'دخول مخصص للموظفين فقط',
    email: 'الإيميل', password: 'الباسورد', login: 'دخول', logging: 'جاري الدخول...',
    loggedInAs: 'مسجل دخول باسم', dashboard: 'الرئيسية', clients: 'العملاء', logs: 'تقارير اليوم', programs: 'برامج PT',
    owner: 'لوحة الأونر', director: 'لوحة المدير', trainer: 'لوحة المدرب',
    hero: 'سيستم داخلي آمن لمتابعة تقارير المدربين وبرامج التدريب الشخصي.',
    todayLogs: 'تقارير اليوم', rotationToday: 'Rotation اليوم', ptToday: 'PT اليوم', freeToday: 'Free Service اليوم',
    myClients: 'عملائي', myLogs: 'تقاريري', myPrograms: 'برامجي',
    addClient: 'إضافة عميل', clientName: 'اسم العميل', phone: 'رقم الهاتف', goal: 'الهدف', level: 'المستوى', status: 'الحالة',
    saveClient: 'حفظ العميل', clientSaved: 'تم حفظ العميل بنجاح.',
    addLog: 'تسجيل اليوم', date: 'التاريخ', shift: 'الشيفت', checkIn: 'الحضور', checkOut: 'الانصراف',
    rotation: 'Rotation', newClients: 'عملاء جدد', ptSessions: 'جلسات PT', freeService: 'خدمة مجانية', notes: 'ملاحظات',
    saveLog: 'حفظ التقرير', logSaved: 'تم حفظ التقرير بنجاح.',
    addProgram: 'إضافة برنامج PT', selectClient: 'اختر العميل', programName: 'اسم البرنامج', duration: 'المدة بالأسابيع',
    exercises: 'التمارين / الخطة', saveProgram: 'حفظ البرنامج', programSaved: 'تم حفظ البرنامج بنجاح.',
    control: 'تحكم', edit: 'تعديل', delete: 'حذف', save: 'حفظ التعديل', logout: 'خروج', noData: 'لا توجد بيانات.',
    adminNote: 'تحكم الإدارة: اختار مدرب بالإيميل لعرض عملائه وتقاريره وبرامجه فقط، أو اعرض الكل.',
    trainerNote: 'صفحة المدرب: تظهر بياناتك أنت فقط حسب صلاحيات قاعدة البيانات.',
    filterByTrainer: 'اختيار المدرب بالإيميل', allTrainers: 'كل المدربين', trainerEmail: 'إيميل المدرب'
  },
  en: {
    loginTitle: 'Gym Zaman', loginSub: 'Internal Management System', staffOnly: 'Staff access only',
    email: 'Email', password: 'Password', login: 'Login', logging: 'Signing in...',
    loggedInAs: 'Logged in as', dashboard: 'Dashboard', clients: 'Clients', logs: 'Daily Logs', programs: 'PT Programs',
    owner: 'Owner Dashboard', director: 'Fitness Director Dashboard', trainer: 'Trainer Dashboard',
    hero: 'Secure internal system for coach reports and PT program tracking.',
    todayLogs: "Today's Logs", rotationToday: 'Rotation Today', ptToday: 'PT Today', freeToday: 'Free Service Today',
    myClients: 'My Clients', myLogs: 'My Logs', myPrograms: 'My Programs',
    addClient: 'Add Client', clientName: 'Client Name', phone: 'Phone', goal: 'Goal', level: 'Level', status: 'Status',
    saveClient: 'Save Client', clientSaved: 'Client saved successfully.',
    addLog: 'Add Daily Log', date: 'Date', shift: 'Shift', checkIn: 'Check In', checkOut: 'Check Out',
    rotation: 'Rotation', newClients: 'New Clients', ptSessions: 'PT Sessions', freeService: 'Free Service', notes: 'Notes',
    saveLog: 'Save Log', logSaved: 'Daily log saved successfully.',
    addProgram: 'Add PT Program', selectClient: 'Select Client', programName: 'Program Name', duration: 'Duration Weeks',
    exercises: 'Exercises / Plan', saveProgram: 'Save Program', programSaved: 'PT program saved successfully.',
    control: 'Control', edit: 'Edit', delete: 'Delete', save: 'Save Changes', logout: 'Logout', noData: 'No data found.',
    adminNote: 'Admin control: choose a trainer by email to view only their clients, logs, and programs, or view all.',
    trainerNote: 'Trainer view: only your own data appears based on database security.',
    filterByTrainer: 'Filter by Trainer Email', allTrainers: 'All Trainers', trainerEmail: 'Trainer Email'
  }
}

function StatCard({ title, value, icon }) {
  return <div className="card stat"><div><p className="muted">{title}</p><h2>{value}</h2></div><div className="icon">{icon}</div></div>
}

function LanguageButton({ lang, setLang }) {
  return <button className="lang-btn" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} type="button"><Languages size={16}/>{lang === 'ar' ? 'English' : 'عربي'}</button>
}

function Login({ lang, setLang }) {
  const t = TEXT[lang]
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="login-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="login-card clean-login">
        <div className="top-line">
          <div className="brand"><div className="brand-mark">GZ</div><div><h1>{t.loginTitle}</h1><p>{t.loginSub}</p></div></div>
          <LanguageButton lang={lang} setLang={setLang}/>
        </div>
        <div className="secure-note"><LockKeyhole size={18}/><span>{t.staffOnly}</span></div>
        <form onSubmit={handleLogin}>
          <label>{t.email}</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@gymzaman.com"/>
          <label>{t.password}</label><input value={password} onChange={e=>setPassword(e.target.value)} type="password"/>
          {error && <div className="error">{error}</div>}
          <button disabled={loading}>{loading ? t.logging : t.login}</button>
        </form>
      </div>
    </div>
  )
}

function Layout({ profile, children, lang, setLang }) {
  const t = TEXT[lang]
  const roleLabel = profile?.role?.replaceAll('_', ' ')
  return (
    <div className="app" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <aside>
        <div className="side-brand"><div className="brand-mark small">GZ</div><div><h3>Gym Zaman</h3><p>{roleLabel}</p></div></div>
        <nav><a><ShieldCheck size={18}/>{t.dashboard}</a><a><Users size={18}/>{t.clients}</a><a><Dumbbell size={18}/>{t.logs}</a><a><ClipboardList size={18}/>{t.programs}</a></nav>
        <LanguageButton lang={lang} setLang={setLang}/>
        <button className="logout" onClick={()=>supabase.auth.signOut()}><LogOut size={18}/>{t.logout}</button>
      </aside>
      <main><header><div><p className="muted">{t.loggedInAs}</p><h1>{profile.full_name}</h1></div><div className="pill"><UserRound size={16}/>{roleLabel}</div></header>{children}</main>
    </div>
  )
}

function Table({ title, rows, columns, canManage, onEdit, onDelete, t }) {
  return <div className="card"><h3>{title}</h3>{rows.length === 0 ? <p className="muted">{t.noData}</p> :
    <div className="table-wrap"><table><thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}{canManage && <th>{t.control}</th>}</tr></thead>
      <tbody>{rows.map((r,i)=><tr key={r.id || i}>{columns.map(c=><td key={c.key}>{String(r[c.key] ?? '-')}</td>)}{canManage && <td><div className="row-actions"><button className="small-action edit" onClick={()=>onEdit(r)}><Pencil size={14}/>{t.edit}</button><button className="small-action delete" onClick={()=>onDelete(r)}><Trash2 size={14}/>{t.delete}</button></div></td>}</tr>)}</tbody>
    </table></div>}
  </div>
}

function Modal({ title, children, onClose }) {
  return <div className="modal-backdrop"><div className="modal-card wide"><div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose}><X size={18}/></button></div>{children}</div></div>
}

function EditForm({ type, row, onClose, onSaved, lang }) {
  const t = TEXT[lang]
  const defaults = type === 'client' ? {
    full_name: row.full_name || '', phone: row.phone || '', goal: row.goal || '', level: row.level || 'beginner', status: row.status || 'active'
  } : type === 'log' ? {
    log_date: row.log_date || new Date().toISOString().slice(0,10), shift: row.shift || 'PM', check_in: row.check_in || '15:00', check_out: row.check_out || '23:00',
    rotation_count: row.rotation_count || 0, new_clients_count: row.new_clients_count || 0, pt_sessions_count: row.pt_sessions_count || 0, free_service_count: row.free_service_count || 0, notes: row.notes || ''
  } : {
    program_name: row.program_name || '', goal: row.goal || '', duration_weeks: row.duration_weeks || 4, exercises: row.exercises || '', notes: row.notes || '', status: row.status || 'active'
  }
  const [form, setForm] = useState(defaults)
  const [message, setMessage] = useState('')
  const table = type === 'client' ? 'clients' : type === 'log' ? 'trainer_daily_logs' : 'pt_programs'
  function f(k,v){setForm(p=>({...p,[k]:v}))}
  async function submit(e){
    e.preventDefault()
    const payload = {...form}
    ;['rotation_count','new_clients_count','pt_sessions_count','free_service_count','duration_weeks'].forEach(k=>{ if(payload[k] !== undefined) payload[k] = Number(payload[k] || 0) })
    const { error } = await supabase.from(table).update(payload).eq('id', row.id)
    if(error) setMessage(error.message); else { onSaved(); onClose() }
  }
  return <Modal title={`${t.edit} ${type}`} onClose={onClose}><form className="grid-form simple-form" onSubmit={submit}>
    {type==='client' && <><div><label>{t.clientName}</label><input value={form.full_name} onChange={e=>f('full_name',e.target.value)}/></div><div><label>{t.phone}</label><input value={form.phone} onChange={e=>f('phone',e.target.value)}/></div><div><label>{t.goal}</label><input value={form.goal} onChange={e=>f('goal',e.target.value)}/></div><div><label>{t.level}</label><select value={form.level} onChange={e=>f('level',e.target.value)}><option>beginner</option><option>intermediate</option><option>advanced</option></select></div><div><label>{t.status}</label><select value={form.status} onChange={e=>f('status',e.target.value)}><option>active</option><option>inactive</option></select></div></>}
    {type==='log' && <><div><label>{t.date}</label><input type="date" value={form.log_date} onChange={e=>f('log_date',e.target.value)}/></div><div><label>{t.shift}</label><select value={form.shift} onChange={e=>f('shift',e.target.value)}><option>AM</option><option>PM</option></select></div><div><label>{t.checkIn}</label><input type="time" value={form.check_in} onChange={e=>f('check_in',e.target.value)}/></div><div><label>{t.checkOut}</label><input type="time" value={form.check_out} onChange={e=>f('check_out',e.target.value)}/></div><div><label>{t.rotation}</label><input type="number" value={form.rotation_count} onChange={e=>f('rotation_count',e.target.value)}/></div><div><label>{t.newClients}</label><input type="number" value={form.new_clients_count} onChange={e=>f('new_clients_count',e.target.value)}/></div><div><label>{t.ptSessions}</label><input type="number" value={form.pt_sessions_count} onChange={e=>f('pt_sessions_count',e.target.value)}/></div><div><label>{t.freeService}</label><input type="number" value={form.free_service_count} onChange={e=>f('free_service_count',e.target.value)}/></div><div className="full"><label>{t.notes}</label><textarea value={form.notes} onChange={e=>f('notes',e.target.value)}/></div></>}
    {type==='program' && <><div><label>{t.programName}</label><input value={form.program_name} onChange={e=>f('program_name',e.target.value)}/></div><div><label>{t.goal}</label><input value={form.goal} onChange={e=>f('goal',e.target.value)}/></div><div><label>{t.duration}</label><input type="number" value={form.duration_weeks} onChange={e=>f('duration_weeks',e.target.value)}/></div><div><label>{t.status}</label><select value={form.status} onChange={e=>f('status',e.target.value)}><option>active</option><option>inactive</option></select></div><div className="full"><label>{t.exercises}</label><textarea value={form.exercises} onChange={e=>f('exercises',e.target.value)}/></div><div className="full"><label>{t.notes}</label><textarea value={form.notes} onChange={e=>f('notes',e.target.value)}/></div></>}
    {message && <div className="error full">{message}</div>}<button>{t.save}</button></form></Modal>
}

function AddClientForm({ profile, branches, onSaved, lang }) {
  const t=TEXT[lang]; const [form,setForm]=useState({full_name:'',phone:'',goal:'Hypertrophy',level:'beginner'}); const [msg,setMsg]=useState('')
  function f(k,v){setForm(p=>({...p,[k]:v}))}
  async function submit(e){e.preventDefault(); const {error}=await supabase.from('clients').insert({full_name:form.full_name,phone:form.phone,goal:form.goal,level:form.level,branch_id:profile.branch_id||branches[0]?.id,assigned_trainer_id:profile.role==='trainer'?profile.id:null,status:'active',created_by:profile.id}); if(error)setMsg(error.message); else{setMsg(t.clientSaved);setForm({full_name:'',phone:'',goal:'Hypertrophy',level:'beginner'});onSaved()}}
  return <div className="card compact-card"><h3><PlusCircle size={18}/>{t.addClient}</h3><form className="grid-form simple-form" onSubmit={submit}><div><label>{t.clientName}</label><input required value={form.full_name} onChange={e=>f('full_name',e.target.value)}/></div><div><label>{t.phone}</label><input value={form.phone} onChange={e=>f('phone',e.target.value)}/></div><div><label>{t.goal}</label><input value={form.goal} onChange={e=>f('goal',e.target.value)}/></div><div><label>{t.level}</label><select value={form.level} onChange={e=>f('level',e.target.value)}><option>beginner</option><option>intermediate</option><option>advanced</option></select></div>{msg && <div className="success full">{msg}</div>}<button>{t.saveClient}</button></form></div>
}

function DailyLogForm({ profile, onSaved, lang }) {
  const t=TEXT[lang], today=new Date().toISOString().slice(0,10); const [form,setForm]=useState({log_date:today,shift:'PM',check_in:'15:00',check_out:'23:00',rotation_count:0,new_clients_count:0,pt_sessions_count:0,free_service_count:0,notes:''}); const [msg,setMsg]=useState('')
  function f(k,v){setForm(p=>({...p,[k]:v}))}
  async function submit(e){e.preventDefault(); const payload={...form,trainer_id:profile.id,branch_id:profile.branch_id,rotation_count:Number(form.rotation_count||0),new_clients_count:Number(form.new_clients_count||0),pt_sessions_count:Number(form.pt_sessions_count||0),free_service_count:Number(form.free_service_count||0)}; const {error}=await supabase.from('trainer_daily_logs').insert(payload); if(error)setMsg(error.message); else{setMsg(t.logSaved);onSaved()}}
  return <div className="card compact-card"><h3><PlusCircle size={18}/>{t.addLog}</h3><form className="grid-form simple-form" onSubmit={submit}><div><label>{t.date}</label><input type="date" value={form.log_date} onChange={e=>f('log_date',e.target.value)}/></div><div><label>{t.shift}</label><select value={form.shift} onChange={e=>f('shift',e.target.value)}><option>AM</option><option>PM</option></select></div><div><label>{t.checkIn}</label><input type="time" value={form.check_in} onChange={e=>f('check_in',e.target.value)}/></div><div><label>{t.checkOut}</label><input type="time" value={form.check_out} onChange={e=>f('check_out',e.target.value)}/></div><div><label>{t.rotation}</label><input type="number" value={form.rotation_count} onChange={e=>f('rotation_count',e.target.value)}/></div><div><label>{t.newClients}</label><input type="number" value={form.new_clients_count} onChange={e=>f('new_clients_count',e.target.value)}/></div><div><label>{t.ptSessions}</label><input type="number" value={form.pt_sessions_count} onChange={e=>f('pt_sessions_count',e.target.value)}/></div><div><label>{t.freeService}</label><input type="number" value={form.free_service_count} onChange={e=>f('free_service_count',e.target.value)}/></div><div className="full"><label>{t.notes}</label><textarea value={form.notes} onChange={e=>f('notes',e.target.value)}/></div>{msg && <div className="success full">{msg}</div>}<button>{t.saveLog}</button></form></div>
}

function PTProgramForm({ profile, clients, onSaved, lang }) {
  const t=TEXT[lang]; const [form,setForm]=useState({client_id:'',program_name:'Hypertrophy Program',goal:'Hypertrophy',duration_weeks:4,exercises:'',notes:''}); const [msg,setMsg]=useState('')
  function f(k,v){setForm(p=>({...p,[k]:v}))}
  async function submit(e){e.preventDefault(); const client=clients.find(c=>c.id===form.client_id); const payload={...form,duration_weeks:Number(form.duration_weeks||0),trainer_id:profile.id,branch_id:profile.branch_id||client?.branch_id,status:'active',created_by:profile.id}; const {error}=await supabase.from('pt_programs').insert(payload); if(error)setMsg(error.message); else{setMsg(t.programSaved);setForm({client_id:'',program_name:'Hypertrophy Program',goal:'Hypertrophy',duration_weeks:4,exercises:'',notes:''});onSaved()}}
  return <div className="card compact-card"><h3><PlusCircle size={18}/>{t.addProgram}</h3><form className="grid-form simple-form" onSubmit={submit}><div><label>{t.selectClient}</label><select required value={form.client_id} onChange={e=>f('client_id',e.target.value)}><option value="">---</option>{clients.map(c=><option key={c.id} value={c.id}>{c.full_name}</option>)}</select></div><div><label>{t.programName}</label><input value={form.program_name} onChange={e=>f('program_name',e.target.value)}/></div><div><label>{t.goal}</label><input value={form.goal} onChange={e=>f('goal',e.target.value)}/></div><div><label>{t.duration}</label><input type="number" value={form.duration_weeks} onChange={e=>f('duration_weeks',e.target.value)}/></div><div className="full"><label>{t.exercises}</label><textarea value={form.exercises} onChange={e=>f('exercises',e.target.value)} placeholder={'Day 1: Chest + Triceps\nDay 2: Back + Biceps'}/></div><div className="full"><label>{t.notes}</label><textarea value={form.notes} onChange={e=>f('notes',e.target.value)}/></div>{msg && <div className="success full">{msg}</div>}<button>{t.saveProgram}</button></form></div>
}

function TrainerFilter({ trainers, selectedTrainerId, setSelectedTrainerId, t }) {
  return <div className="card filter-card"><h3><Search size={18}/>{t.filterByTrainer}</h3><select value={selectedTrainerId} onChange={e=>setSelectedTrainerId(e.target.value)}><option value="all">{t.allTrainers}</option>{trainers.map(tr=><option key={tr.id} value={tr.id}>{tr.email} — {tr.full_name}</option>)}</select></div>
}

function Dashboard({ profile, lang }) {
  const t=TEXT[lang]
  const [clients,setClients]=useState([]), [logs,setLogs]=useState([]), [branches,setBranches]=useState([]), [programs,setPrograms]=useState([]), [trainers,setTrainers]=useState([])
  const [loading,setLoading]=useState(true), [notice,setNotice]=useState(''), [edit,setEdit]=useState(null), [selectedTrainerId,setSelectedTrainerId]=useState('all')
  const isAdmin=profile.role==='owner'||profile.role==='fitness_director', isTrainer=profile.role==='trainer'

  async function load(){
    setLoading(true)
    const calls = [
      supabase.from('clients').select('*').order('created_at',{ascending:false}),
      supabase.from('trainer_daily_logs').select('*').order('created_at',{ascending:false}),
      supabase.from('branches').select('*').order('name'),
      supabase.from('pt_programs').select('*').order('created_at',{ascending:false})
    ]
    if (isAdmin) calls.push(supabase.from('profiles').select('id, full_name, email, role, branch_id, status').in('role',['trainer','head_coach']).order('email'))
    const res = await Promise.all(calls)
    const [c,l,b,p,tr] = res
    if(c.error)setNotice(c.error.message); if(p.error)setNotice(p.error.message); if(tr?.error)setNotice(tr.error.message)
    setClients(c.data||[]); setLogs(l.data||[]); setBranches(b.data||[]); setPrograms(p.data||[]); setTrainers(tr?.data||[])
    setLoading(false)
  }

  useEffect(()=>{load()},[])

  async function del(table,row,label){ if(!confirm(`Delete ${label}?`)) return; const {error}=await supabase.from(table).delete().eq('id',row.id); if(error)alert(error.message); else load() }

  const clientMapAll = Object.fromEntries(clients.map(c=>[c.id,c.full_name]))
  const trainerMap = Object.fromEntries(trainers.map(tr=>[tr.id,tr.email]))

  const visibleClients = isAdmin && selectedTrainerId !== 'all' ? clients.filter(c=>c.assigned_trainer_id===selectedTrainerId) : clients
  const visibleLogs = isAdmin && selectedTrainerId !== 'all' ? logs.filter(l=>l.trainer_id===selectedTrainerId) : logs
  const visibleProgramsRaw = isAdmin && selectedTrainerId !== 'all' ? programs.filter(p=>p.trainer_id===selectedTrainerId) : programs
  const visiblePrograms = visibleProgramsRaw.map(p=>({...p,client_name:clientMapAll[p.client_id]||'-', trainer_email: trainerMap[p.trainer_id] || '-'}))
  const visibleClientsRows = visibleClients.map(c=>({...c, trainer_email: trainerMap[c.assigned_trainer_id] || '-'}))
  const visibleLogsRows = visibleLogs.map(l=>({...l, trainer_email: trainerMap[l.trainer_id] || '-'}))

  const today=new Date().toISOString().slice(0,10), todayLogs=visibleLogs.filter(x=>x.log_date===today), rows=isAdmin?todayLogs:visibleLogs
  const totals={logs:rows.length,rotation:rows.reduce((s,r)=>s+Number(r.rotation_count||0),0),pt:rows.reduce((s,r)=>s+Number(r.pt_sessions_count||0),0),free:rows.reduce((s,r)=>s+Number(r.free_service_count||0),0)}
  const title=profile.role==='owner'?t.owner:profile.role==='fitness_director'?t.director:profile.role==='trainer'?t.trainer:t.dashboard

  if(loading)return <div className="card">Loading...</div>
  return <><section className="hero simple-hero"><h2>{title}</h2><p>{t.hero}</p></section>{notice&&<div className="error">{notice}</div>}
    {isAdmin && <TrainerFilter trainers={trainers} selectedTrainerId={selectedTrainerId} setSelectedTrainerId={setSelectedTrainerId} t={t}/>}
    <section className="stats-grid"><StatCard title={isAdmin?t.todayLogs:t.myLogs} value={totals.logs} icon={<CalendarDays/>}/><StatCard title={isAdmin?t.rotationToday:t.myClients} value={isAdmin?totals.rotation:visibleClients.length} icon={<Users/>}/><StatCard title={isAdmin?t.ptToday:t.myPrograms} value={isAdmin?totals.pt:visiblePrograms.length} icon={<Dumbbell/>}/><StatCard title={t.freeToday} value={totals.free} icon={<ClipboardList/>}/></section>
    <div className="card note"><b>{isAdmin?t.adminNote:t.trainerNote}</b></div>
    {(isTrainer||isAdmin)&&<AddClientForm profile={profile} branches={branches} onSaved={load} lang={lang}/>}
    {isTrainer&&<DailyLogForm profile={profile} onSaved={load} lang={lang}/>}
    {isTrainer&&<PTProgramForm profile={profile} clients={visibleClients} onSaved={load} lang={lang}/>}
    <Table title={isTrainer?t.myClients:t.clients} rows={visibleClientsRows} canManage={isAdmin} onEdit={r=>setEdit({type:'client',row:r})} onDelete={r=>del('clients',r,r.full_name)} t={t} columns={[...(isAdmin?[{key:'trainer_email',label:t.trainerEmail}]:[]),{key:'full_name',label:t.clientName},{key:'phone',label:t.phone},{key:'goal',label:t.goal},{key:'level',label:t.level},{key:'status',label:t.status}]}/>
    <Table title={isTrainer?t.myLogs:t.logs} rows={visibleLogsRows} canManage={isAdmin} onEdit={r=>setEdit({type:'log',row:r})} onDelete={r=>del('trainer_daily_logs',r,r.log_date)} t={t} columns={[...(isAdmin?[{key:'trainer_email',label:t.trainerEmail}]:[]),{key:'log_date',label:t.date},{key:'shift',label:t.shift},{key:'rotation_count',label:t.rotation},{key:'pt_sessions_count',label:t.ptSessions},{key:'free_service_count',label:t.freeService},{key:'notes',label:t.notes}]}/>
    <Table title={isTrainer?t.myPrograms:t.programs} rows={visiblePrograms} canManage={isAdmin} onEdit={r=>setEdit({type:'program',row:r})} onDelete={r=>del('pt_programs',r,r.program_name)} t={t} columns={[...(isAdmin?[{key:'trainer_email',label:t.trainerEmail}]:[]),{key:'client_name',label:t.clientName},{key:'program_name',label:t.programName},{key:'goal',label:t.goal},{key:'duration_weeks',label:t.duration},{key:'status',label:t.status}]}/>
    {edit&&<EditForm type={edit.type} row={edit.row} onClose={()=>setEdit(null)} onSaved={load} lang={lang}/>}
  </>
}

function App() {
  const [lang,setLang]=useState(localStorage.getItem('gymzaman_lang')||'ar'), [session,setSession]=useState(null), [profile,setProfile]=useState(null), [loading,setLoading]=useState(true), [profileError,setProfileError]=useState('')
  useEffect(()=>{localStorage.setItem('gymzaman_lang',lang)},[lang])
  useEffect(()=>{supabase.auth.getSession().then(({data})=>{setSession(data.session);setLoading(false)}); const {data}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s)); return ()=>data.subscription.unsubscribe()},[])
  useEffect(()=>{async function run(){setProfile(null);setProfileError(''); if(!session?.user?.id)return; const {data,error}=await supabase.from('profiles').select('*').eq('id',session.user.id).single(); if(error)setProfileError(error.message); else setProfile(data)} run()},[session])
  if(loading)return <div className="loading">Loading...</div>
  if(!session)return <Login lang={lang} setLang={setLang}/>
  if(profileError)return <div className="login-page"><div className="login-card"><h2>Profile Error</h2><p className="error">{profileError}</p><button onClick={()=>supabase.auth.signOut()}>Logout</button></div></div>
  if(!profile)return <div className="loading">Loading profile...</div>
  return <Layout profile={profile} lang={lang} setLang={setLang}><Dashboard profile={profile} lang={lang}/></Layout>
}

createRoot(document.getElementById('root')).render(<App/>)
