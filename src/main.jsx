import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './supabase'
import { LogOut, Users, Dumbbell, ClipboardList, UserRound, ShieldCheck, PlusCircle, CalendarDays, Pencil, Trash2, X, Languages, LockKeyhole, Search, UserCog, Save } from 'lucide-react'
import './styles.css'

const TEXT = {
  ar: {
    loginTitle: 'Gym Zaman', loginSub: 'نظام إدارة داخلي', staffOnly: 'دخول مخصص للموظفين فقط',
    email: 'الإيميل', password: 'الباسورد', login: 'دخول', logging: 'جاري الدخول...',
    loggedInAs: 'مسجل دخول باسم', dashboard: 'الرئيسية', clients: 'العملاء', logs: 'تقارير اليوم', programs: 'برامج PT',
    staffManagement: 'إدارة الفريق', owner: 'لوحة الأونر', director: 'لوحة المدير', trainer: 'لوحة المدرب',
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
    filterByTrainer: 'اختيار المدرب بالإيميل', allTrainers: 'كل المدربين', trainerEmail: 'إيميل المدرب',
    staffNote: 'إدارة الفريق: تعديل الدور، الفرع، والحالة. تظهر فقط للأونر والديركتور.',
    fullName: 'الاسم', branch: 'الفرع', role: 'الدور', saveStaff: 'حفظ بيانات المدرب', savedStaff: 'تم حفظ بيانات المدرب.',
    active: 'active', inactive: 'inactive',
    seniorReport: 'تقرير السينيور', addSeniorReport: 'إضافة تقرير سينيور', branchPressure: 'ضغط الفرع', serviceNotes: 'ملاحظات الخدمة',
    coachCommitment: 'التزام المدربين', clientIssues: 'مشاكل العملاء', actionsTaken: 'الإجراءات التي تمت', resolved: 'تم الحل؟', saveSeniorReport: 'حفظ تقرير السينيور', seniorReportSaved: 'تم حفظ تقرير السينيور بنجاح.',
    trainerProfile: 'ملف المدرب', coachEvaluation: 'تقييم المدرب', evaluationHistory: 'سجل التقييمات',
    technicalScore: 'التقييم الفني', behaviorScore: 'التقييم السلوكي', leadershipScore: 'تقييم القيادة', serviceScore: 'تقييم الخدمة',
    evaluatorNotes: 'ملاحظات المقيم', saveEvaluation: 'حفظ التقييم', evaluationSaved: 'تم حفظ التقييم بنجاح.',
    selectedTrainerInfo: 'بيانات المدرب المختار', problemDescription: 'وصف المشكلة', evaluatedBy: 'تم التقييم بواسطة'
  },
  en: {
    loginTitle: 'Gym Zaman', loginSub: 'Internal Management System', staffOnly: 'Staff access only',
    email: 'Email', password: 'Password', login: 'Login', logging: 'Signing in...',
    loggedInAs: 'Logged in as', dashboard: 'Dashboard', clients: 'Clients', logs: 'Daily Logs', programs: 'PT Programs',
    staffManagement: 'Staff Management', owner: 'Owner Dashboard', director: 'Fitness Director Dashboard', trainer: 'Trainer Dashboard',
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
    filterByTrainer: 'Filter by Trainer Email', allTrainers: 'All Trainers', trainerEmail: 'Trainer Email',
    staffNote: 'Staff Management: update role, branch, and status. Visible only for Owner and Director.',
    fullName: 'Full Name', branch: 'Branch', role: 'Role', saveStaff: 'Save Staff Data', savedStaff: 'Staff data saved.',
    active: 'active', inactive: 'inactive',
    seniorReport: 'Senior Report', addSeniorReport: 'Add Senior Report', branchPressure: 'Branch Pressure', serviceNotes: 'Service Notes',
    coachCommitment: 'Coach Commitment', clientIssues: 'Client Issues', actionsTaken: 'Actions Taken', resolved: 'Resolved?', saveSeniorReport: 'Save Senior Report', seniorReportSaved: 'Senior report saved successfully.',
    trainerProfile: 'Trainer Profile', coachEvaluation: 'Coach Evaluation', evaluationHistory: 'Evaluation History',
    technicalScore: 'Technical Score', behaviorScore: 'Behavior Score', leadershipScore: 'Leadership Score', serviceScore: 'Service Score',
    evaluatorNotes: 'Evaluator Notes', saveEvaluation: 'Save Evaluation', evaluationSaved: 'Evaluation saved successfully.',
    selectedTrainerInfo: 'Selected Trainer Info', problemDescription: 'Problem Description', evaluatedBy: 'Evaluated By'
  }
}

const ROLE_OPTIONS = ['trainer', 'senior', 'head_coach', 'fitness_director', 'owner']
const STATUS_OPTIONS = ['active', 'inactive']

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
        <nav><a><ShieldCheck size={18}/>{t.dashboard}</a><a><Users size={18}/>{t.clients}</a><a><Dumbbell size={18}/>{t.logs}</a><a><ClipboardList size={18}/>{t.programs}</a><a><UserCog size={18}/>{t.staffManagement}</a></nav>
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


function SeniorDailyReportForm({ profile, onSaved, lang }) {
  const t = TEXT[lang]
  const today = new Date().toISOString().slice(0,10)
  const [form, setForm] = useState({
    report_date: today,
    branch_pressure: '',
    service_notes: '',
    coach_commitment_notes: '',
    client_issues: '',
    actions_taken: '',
    problem_description: '',
    resolved: 'no',
    notes: ''
  })
  const [msg, setMsg] = useState('')

  function f(k, v) {
    setForm(p => ({ ...p, [k]: v }))
  }

  async function submit(e) {
    e.preventDefault()
    const payload = {
      senior_id: profile.id,
      branch_id: profile.branch_id,
      report_date: form.report_date,
      branch_pressure: form.branch_pressure,
      service_notes: form.service_notes,
      coach_commitment_notes: form.coach_commitment_notes,
      client_issues: form.client_issues,
      actions_taken: form.actions_taken,
      problem_description: form.problem_description,
      resolved: form.resolved === 'yes',
      notes: form.notes
    }

    const { error } = await supabase.from('senior_daily_reports').insert(payload)
    if (error) setMsg(error.message)
    else {
      setMsg(t.seniorReportSaved)
      setForm({
        report_date: today,
        branch_pressure: '',
        service_notes: '',
        coach_commitment_notes: '',
        client_issues: '',
        actions_taken: '',
        problem_description: '',
        resolved: 'no',
        notes: ''
      })
      onSaved()
    }
  }

  return (
    <div className="card compact-card senior-report-card">
      <h3><ClipboardList size={18}/>{t.addSeniorReport}</h3>
      <form className="grid-form simple-form" onSubmit={submit}>
        <div>
          <label>{t.date}</label>
          <input type="date" value={form.report_date} onChange={e => f('report_date', e.target.value)} />
        </div>

        <div>
          <label>{t.branchPressure}</label>
          <select value={form.branch_pressure} onChange={e => f('branch_pressure', e.target.value)}>
            <option value="">---</option>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </div>

        <div>
          <label>{t.resolved}</label>
          <select value={form.resolved} onChange={e => f('resolved', e.target.value)}>
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>

        <div className="full">
          <label>{t.problemDescription}</label>
          <textarea value={form.problem_description} onChange={e => f('problem_description', e.target.value)} placeholder="What exactly was the problem?" />
        </div>

        <div className="full">
          <label>{t.serviceNotes}</label>
          <textarea value={form.service_notes} onChange={e => f('service_notes', e.target.value)} placeholder="Service quality, floor support, member handling..." />
        </div>

        <div className="full">
          <label>{t.coachCommitment}</label>
          <textarea value={form.coach_commitment_notes} onChange={e => f('coach_commitment_notes', e.target.value)} placeholder="Attendance, appearance, floor presence, cooperation..." />
        </div>

        <div className="full">
          <label>{t.clientIssues}</label>
          <textarea value={form.client_issues} onChange={e => f('client_issues', e.target.value)} placeholder="Complaints, repeated questions, service gaps..." />
        </div>

        <div className="full">
          <label>{t.actionsTaken}</label>
          <textarea value={form.actions_taken} onChange={e => f('actions_taken', e.target.value)} placeholder="What did the senior do today?" />
        </div>

        <div className="full">
          <label>{t.notes}</label>
          <textarea value={form.notes} onChange={e => f('notes', e.target.value)} />
        </div>

        {msg && <div className={msg.includes('success') || msg.includes('بنجاح') ? 'success full' : 'error full'}>{msg}</div>}
        <button>{t.saveSeniorReport}</button>
      </form>
    </div>
  )
}


function TrainerFilter({ trainers, selectedTrainerId, setSelectedTrainerId, t }) {
  return <div className="card filter-card"><h3><Search size={18}/>{t.filterByTrainer}</h3><select value={selectedTrainerId} onChange={e=>setSelectedTrainerId(e.target.value)}><option value="all">{t.allTrainers}</option>{trainers.map(tr=><option key={tr.id} value={tr.id}>{tr.email} — {tr.full_name}</option>)}</select></div>
}

function StaffManagement({ staff, branches, onSaved, t }) {
  const [rows, setRows] = useState(staff)
  const [savingId, setSavingId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => setRows(staff), [staff])

  function updateRow(id, field, value) {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row))
  }

  async function saveRow(row) {
    setSavingId(row.id)
    setMessage('')
    const payload = {
      full_name: row.full_name,
      email: row.email,
      role: row.role,
      branch_id: row.branch_id || null,
      status: row.status || 'active'
    }
    const { error } = await supabase.from('profiles').update(payload).eq('id', row.id)
    if (error) setMessage(error.message)
    else {
      setMessage(t.savedStaff)
      onSaved()
    }
    setSavingId('')
  }

  return (
    <div className="card staff-card">
      <h3><UserCog size={18}/>{t.staffManagement}</h3>
      <p className="muted">{t.staffNote}</p>
      {message && <div className={message === t.savedStaff ? 'success' : 'error'}>{message}</div>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t.fullName}</th>
              <th>{t.email}</th>
              <th>{t.role}</th>
              <th>{t.branch}</th>
              <th>{t.status}</th>
              <th>{t.control}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                <td><input className="table-input" value={row.full_name || ''} onChange={e => updateRow(row.id, 'full_name', e.target.value)} /></td>
                <td><input className="table-input" value={row.email || ''} onChange={e => updateRow(row.id, 'email', e.target.value)} /></td>
                <td>
                  <select className="table-select" value={row.role || 'trainer'} onChange={e => updateRow(row.id, 'role', e.target.value)}>
                    {ROLE_OPTIONS.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </td>
                <td>
                  <select className="table-select" value={row.branch_id || ''} onChange={e => updateRow(row.id, 'branch_id', e.target.value)}>
                    <option value="">---</option>
                    {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
                  </select>
                </td>
                <td>
                  <select className="table-select" value={row.status || 'active'} onChange={e => updateRow(row.id, 'status', e.target.value)}>
                    {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </td>
                <td>
                  <button className="small-action save" onClick={() => saveRow(row)} disabled={savingId === row.id}>
                    <Save size={14}/>{savingId === row.id ? 'Saving...' : t.save}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


function TrainerProfilePanel({ trainer, branches, clients, logs, programs, evaluations, t }) {
  if (!trainer) return null
  const branch = branches.find(b => b.id === trainer.branch_id)
  const trainerClients = clients.filter(c => c.assigned_trainer_id === trainer.id)
  const trainerLogs = logs.filter(l => l.trainer_id === trainer.id)
  const trainerPrograms = programs.filter(p => p.trainer_id === trainer.id)
  const trainerEvaluations = evaluations.filter(e => e.trainer_id === trainer.id)
  const totalPt = trainerLogs.reduce((s, r) => s + Number(r.pt_sessions_count || 0), 0)
  const totalFree = trainerLogs.reduce((s, r) => s + Number(r.free_service_count || 0), 0)
  const totalRotation = trainerLogs.reduce((s, r) => s + Number(r.rotation_count || 0), 0)

  return (
    <div className="card trainer-profile-card">
      <h3><UserRound size={18}/>{t.trainerProfile}</h3>
      <div className="profile-grid">
        <div><span>{t.fullName}</span><b>{trainer.full_name || '-'}</b></div>
        <div><span>{t.email}</span><b>{trainer.email || '-'}</b></div>
        <div><span>{t.role}</span><b>{trainer.role || '-'}</b></div>
        <div><span>{t.branch}</span><b>{branch?.name || '-'}</b></div>
        <div><span>{t.status}</span><b>{trainer.status || '-'}</b></div>
        <div><span>{t.clients}</span><b>{trainerClients.length}</b></div>
        <div><span>{t.programs}</span><b>{trainerPrograms.length}</b></div>
        <div><span>{t.logs}</span><b>{trainerLogs.length}</b></div>
        <div><span>{t.ptSessions}</span><b>{totalPt}</b></div>
        <div><span>{t.freeService}</span><b>{totalFree}</b></div>
        <div><span>{t.rotation}</span><b>{totalRotation}</b></div>
        <div><span>{t.evaluationHistory}</span><b>{trainerEvaluations.length}</b></div>
      </div>
    </div>
  )
}

function CoachEvaluationForm({ profile, targetTrainerId, eligibleTrainers, onSaved, lang }) {
  const t = TEXT[lang]
  const [form, setForm] = useState({
    trainer_id: targetTrainerId || '',
    evaluation_date: new Date().toISOString().slice(0,10),
    technical_score: 80,
    behavior_score: 80,
    leadership_score: 80,
    service_score: 80,
    evaluator_notes: ''
  })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (targetTrainerId) setForm(p => ({ ...p, trainer_id: targetTrainerId }))
  }, [targetTrainerId])

  function f(k,v){ setForm(p => ({...p, [k]: v})) }

  async function submit(e){
    e.preventDefault()
    if (!form.trainer_id) {
      setMsg('Select trainer first')
      return
    }
    const target = eligibleTrainers.find(x => x.id === form.trainer_id)
    const payload = {
      trainer_id: form.trainer_id,
      evaluator_id: profile.id,
      branch_id: target?.branch_id || profile.branch_id,
      evaluation_date: form.evaluation_date,
      technical_score: Number(form.technical_score || 0),
      behavior_score: Number(form.behavior_score || 0),
      leadership_score: Number(form.leadership_score || 0),
      service_score: Number(form.service_score || 0),
      evaluator_notes: form.evaluator_notes
    }
    const { error } = await supabase.from('trainer_evaluations').insert(payload)
    if (error) setMsg(error.message)
    else {
      setMsg(t.evaluationSaved)
      setForm({
        trainer_id: targetTrainerId || '',
        evaluation_date: new Date().toISOString().slice(0,10),
        technical_score: 80,
        behavior_score: 80,
        leadership_score: 80,
        service_score: 80,
        evaluator_notes: ''
      })
      onSaved()
    }
  }

  return (
    <div className="card coach-eval-card">
      <h3><ClipboardList size={18}/>{t.coachEvaluation}</h3>
      <form className="grid-form simple-form" onSubmit={submit}>
        <div>
          <label>{t.trainerEmail}</label>
          <select value={form.trainer_id} onChange={e => f('trainer_id', e.target.value)} disabled={Boolean(targetTrainerId)}>
            <option value="">---</option>
            {eligibleTrainers.map(tr => <option key={tr.id} value={tr.id}>{tr.email} — {tr.full_name}</option>)}
          </select>
        </div>
        <div>
          <label>{t.date}</label>
          <input type="date" value={form.evaluation_date} onChange={e => f('evaluation_date', e.target.value)} />
        </div>
        <div>
          <label>{t.technicalScore}</label>
          <input type="number" min="0" max="100" value={form.technical_score} onChange={e => f('technical_score', e.target.value)} />
        </div>
        <div>
          <label>{t.behaviorScore}</label>
          <input type="number" min="0" max="100" value={form.behavior_score} onChange={e => f('behavior_score', e.target.value)} />
        </div>
        <div>
          <label>{t.leadershipScore}</label>
          <input type="number" min="0" max="100" value={form.leadership_score} onChange={e => f('leadership_score', e.target.value)} />
        </div>
        <div>
          <label>{t.serviceScore}</label>
          <input type="number" min="0" max="100" value={form.service_score} onChange={e => f('service_score', e.target.value)} />
        </div>
        <div className="full">
          <label>{t.evaluatorNotes}</label>
          <textarea value={form.evaluator_notes} onChange={e => f('evaluator_notes', e.target.value)} />
        </div>
        {msg && <div className={msg.includes('success') || msg.includes('بنجاح') ? 'success full' : 'error full'}>{msg}</div>}
        <button>{t.saveEvaluation}</button>
      </form>
    </div>
  )
}

function Dashboard({ profile, lang }) {
  const t=TEXT[lang]
  const [clients,setClients]=useState([]), [logs,setLogs]=useState([]), [branches,setBranches]=useState([]), [programs,setPrograms]=useState([]), [staff,setStaff]=useState([]), [seniorReports,setSeniorReports]=useState([]), [evaluations,setEvaluations]=useState([])
  const [loading,setLoading]=useState(true), [notice,setNotice]=useState(''), [edit,setEdit]=useState(null), [selectedTrainerId,setSelectedTrainerId]=useState('all')
  const isAdmin=profile.role==='owner'||profile.role==='fitness_director', isTrainer=profile.role==='trainer', isSenior=profile.role==='senior', isHeadCoach=profile.role==='head_coach'

  async function load(){
    setLoading(true)
    const calls = [
      supabase.from('clients').select('*').order('created_at',{ascending:false}),
      supabase.from('trainer_daily_logs').select('*').order('created_at',{ascending:false}),
      supabase.from('branches').select('*').order('name'),
      supabase.from('pt_programs').select('*').order('created_at',{ascending:false}),
      supabase.from('senior_daily_reports').select('*').order('created_at',{ascending:false}),
      supabase.from('trainer_evaluations').select('*').order('created_at',{ascending:false})
    ]
    if (isAdmin || isHeadCoach) calls.push(supabase.from('profiles').select('id, full_name, email, role, branch_id, status').order('email'))
    const res = await Promise.all(calls)
    const [c,l,b,p,sr,e,s] = res
    if(c.error)setNotice(c.error.message); if(p.error)setNotice(p.error.message); if(sr.error)setNotice(sr.error.message); if(e.error)setNotice(e.error.message); if(s?.error)setNotice(s.error.message)
    setClients(c.data||[]); setLogs(l.data||[]); setBranches(b.data||[]); setPrograms(p.data||[]); setSeniorReports(sr.data||[]); setEvaluations(e.data||[]); setStaff(s?.data||[])
    setLoading(false)
  }

  useEffect(()=>{load()},[])

  async function del(table,row,label){ if(!confirm(`Delete ${label}?`)) return; const {error}=await supabase.from(table).delete().eq('id',row.id); if(error)alert(error.message); else load() }

  const trainers = staff.filter(s => ['trainer','senior','head_coach'].includes(s.role))
  const selectedTrainer = selectedTrainerId !== 'all' ? staff.find(s => s.id === selectedTrainerId) : null
  const evaluableTrainers = isHeadCoach ? staff.filter(s => s.branch_id === profile.branch_id && ['trainer','senior'].includes(s.role)) : trainers
  const clientMapAll = Object.fromEntries(clients.map(c=>[c.id,c.full_name]))
  const trainerMap = Object.fromEntries(staff.map(tr=>[tr.id,tr.email]))

  const visibleClients = isAdmin && selectedTrainerId !== 'all' ? clients.filter(c=>c.assigned_trainer_id===selectedTrainerId) : clients
  const visibleLogs = isAdmin && selectedTrainerId !== 'all' ? logs.filter(l=>l.trainer_id===selectedTrainerId) : logs
  const visibleProgramsRaw = isAdmin && selectedTrainerId !== 'all' ? programs.filter(p=>p.trainer_id===selectedTrainerId) : programs
  const visiblePrograms = visibleProgramsRaw.map(p=>({...p,client_name:clientMapAll[p.client_id]||'-', trainer_email: trainerMap[p.trainer_id] || '-'}))
  const visibleClientsRows = visibleClients.map(c=>({...c, trainer_email: trainerMap[c.assigned_trainer_id] || '-'}))
  const visibleLogsRows = visibleLogs.map(l=>({...l, trainer_email: trainerMap[l.trainer_id] || '-'}))
  const visibleSeniorReportsRaw = isAdmin ? seniorReports : seniorReports.filter(r => r.senior_id === profile.id)
  const visibleSeniorReports = visibleSeniorReportsRaw.map(r => ({...r, senior_email: trainerMap[r.senior_id] || '-'}))
  const visibleEvaluationsRaw = isAdmin && selectedTrainerId !== 'all' ? evaluations.filter(ev => ev.trainer_id === selectedTrainerId) : evaluations
  const visibleEvaluations = visibleEvaluationsRaw.map(ev => ({...ev, trainer_email: trainerMap[ev.trainer_id] || '-', evaluator_email: trainerMap[ev.evaluator_id] || (ev.evaluator_id === profile.id ? profile.email : '-')}))

  const today=new Date().toISOString().slice(0,10), todayLogs=visibleLogs.filter(x=>x.log_date===today), rows=isAdmin?todayLogs:visibleLogs
  const totals={logs:rows.length,rotation:rows.reduce((s,r)=>s+Number(r.rotation_count||0),0),pt:rows.reduce((s,r)=>s+Number(r.pt_sessions_count||0),0),free:rows.reduce((s,r)=>s+Number(r.free_service_count||0),0)}
  const title=profile.role==='owner'?t.owner:profile.role==='fitness_director'?t.director:profile.role==='trainer'?t.trainer:t.dashboard

  if(loading)return <div className="card">Loading...</div>
  return <><section className="hero simple-hero"><h2>{title}</h2><p>{t.hero}</p></section>{notice&&<div className="error">{notice}</div>}
    {isAdmin && <TrainerFilter trainers={trainers} selectedTrainerId={selectedTrainerId} setSelectedTrainerId={setSelectedTrainerId} t={t}/>}
    {isAdmin && selectedTrainer && <TrainerProfilePanel trainer={selectedTrainer} branches={branches} clients={clients} logs={logs} programs={programs} evaluations={evaluations} t={t}/>}
    {(isAdmin && selectedTrainer) && <CoachEvaluationForm profile={profile} targetTrainerId={selectedTrainer.id} eligibleTrainers={evaluableTrainers} onSaved={load} lang={lang}/>}
    {isHeadCoach && <CoachEvaluationForm profile={profile} targetTrainerId={''} eligibleTrainers={evaluableTrainers} onSaved={load} lang={lang}/>}
    <section className="stats-grid"><StatCard title={isAdmin?t.todayLogs:t.myLogs} value={totals.logs} icon={<CalendarDays/>}/><StatCard title={isAdmin?t.rotationToday:t.myClients} value={isAdmin?totals.rotation:visibleClients.length} icon={<Users/>}/><StatCard title={isAdmin?t.ptToday:t.myPrograms} value={isAdmin?totals.pt:visiblePrograms.length} icon={<Dumbbell/>}/><StatCard title={t.freeToday} value={totals.free} icon={<ClipboardList/>}/></section>
    <div className="card note"><b>{isAdmin?t.adminNote:t.trainerNote}</b></div>
    {isAdmin && <StaffManagement staff={staff} branches={branches} onSaved={load} t={t}/>}
    {(isTrainer||isAdmin)&&<AddClientForm profile={profile} branches={branches} onSaved={load} lang={lang}/>}
    {isTrainer&&<DailyLogForm profile={profile} onSaved={load} lang={lang}/>}
    {isSenior&&<SeniorDailyReportForm profile={profile} onSaved={load} lang={lang}/>}
    {isTrainer&&<PTProgramForm profile={profile} clients={visibleClients} onSaved={load} lang={lang}/>}
    <Table title={isTrainer?t.myClients:t.clients} rows={visibleClientsRows} canManage={isAdmin} onEdit={r=>setEdit({type:'client',row:r})} onDelete={r=>del('clients',r,r.full_name)} t={t} columns={[...(isAdmin?[{key:'trainer_email',label:t.trainerEmail}]:[]),{key:'full_name',label:t.clientName},{key:'phone',label:t.phone},{key:'goal',label:t.goal},{key:'level',label:t.level},{key:'status',label:t.status}]}/>
    <Table title={isTrainer?t.myLogs:t.logs} rows={visibleLogsRows} canManage={isAdmin} onEdit={r=>setEdit({type:'log',row:r})} onDelete={r=>del('trainer_daily_logs',r,r.log_date)} t={t} columns={[...(isAdmin?[{key:'trainer_email',label:t.trainerEmail}]:[]),{key:'log_date',label:t.date},{key:'shift',label:t.shift},{key:'rotation_count',label:t.rotation},{key:'pt_sessions_count',label:t.ptSessions},{key:'free_service_count',label:t.freeService},{key:'notes',label:t.notes}]}/>
    <Table title={isTrainer?t.myPrograms:t.programs} rows={visiblePrograms} canManage={isAdmin} onEdit={r=>setEdit({type:'program',row:r})} onDelete={r=>del('pt_programs',r,r.program_name)} t={t} columns={[...(isAdmin?[{key:'trainer_email',label:t.trainerEmail}]:[]),{key:'client_name',label:t.clientName},{key:'program_name',label:t.programName},{key:'goal',label:t.goal},{key:'duration_weeks',label:t.duration},{key:'status',label:t.status}]}/>
    {(isAdmin || isSenior) && <Table title={t.seniorReport} rows={visibleSeniorReports} canManage={false} t={t} columns={[...(isAdmin?[{key:'senior_email',label:t.trainerEmail}]:[]),{key:'report_date',label:t.date},{key:'branch_pressure',label:t.branchPressure},{key:'problem_description',label:t.problemDescription},{key:'service_notes',label:t.serviceNotes},{key:'client_issues',label:t.clientIssues},{key:'actions_taken',label:t.actionsTaken},{key:'resolved',label:t.resolved},{key:'notes',label:t.notes}]}/>}
    {(isAdmin || isHeadCoach) && <Table title={t.evaluationHistory} rows={visibleEvaluations} canManage={false} t={t} columns={[{key:'trainer_email',label:t.trainerEmail},{key:'evaluation_date',label:t.date},{key:'technical_score',label:t.technicalScore},{key:'behavior_score',label:t.behaviorScore},{key:'leadership_score',label:t.leadershipScore},{key:'service_score',label:t.serviceScore},{key:'evaluator_notes',label:t.evaluatorNotes}]}/>}
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
