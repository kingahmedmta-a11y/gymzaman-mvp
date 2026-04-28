import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './supabase'
import {
  LogOut,
  Users,
  Dumbbell,
  ClipboardList,
  Building2,
  UserRound,
  ShieldCheck,
  PlusCircle,
  CalendarDays,
  Pencil,
  Trash2,
  X
} from 'lucide-react'
import './styles.css'

function StatCard({ title, value, icon }) {
  return (
    <div className="card stat">
      <div>
        <p className="muted">{title}</p>
        <h2>{value}</h2>
      </div>
      <div className="icon">{icon}</div>
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('trainer1@gymzaman.com')
  const [password, setPassword] = useState('Trainer@123456')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <div className="brand-mark">GZ</div>
          <div>
            <h1>Gym Zaman</h1>
            <p>Free MVP Management System</p>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />

          <label>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" />

          {error && <div className="error">{error}</div>}

          <button disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>

        <div className="demo-box">
          <p><b>Demo accounts</b></p>
          <p>Owner: owner@gymzaman.com</p>
          <p>Director: director@gymzaman.com</p>
          <p>Trainer: trainer1@gymzaman.com</p>
        </div>
      </div>
    </div>
  )
}

function Layout({ profile, children }) {
  async function logout() {
    await supabase.auth.signOut()
  }

  const roleLabel = profile?.role?.replaceAll('_', ' ')

  return (
    <div className="app">
      <aside>
        <div className="side-brand">
          <div className="brand-mark small">GZ</div>
          <div>
            <h3>Gym Zaman</h3>
            <p>{roleLabel}</p>
          </div>
        </div>

        <nav>
          <a><ShieldCheck size={18}/> Dashboard</a>
          <a><Users size={18}/> Clients</a>
          <a><Dumbbell size={18}/> Daily Logs</a>
        </nav>

        <button className="logout" onClick={logout}><LogOut size={18}/> Logout</button>
      </aside>

      <main>
        <header>
          <div>
            <p className="muted">Logged in as</p>
            <h1>{profile.full_name}</h1>
          </div>
          <div className="pill"><UserRound size={16}/> {roleLabel}</div>
        </header>
        {children}
      </main>
    </div>
  )
}

function EditClientModal({ row, onClose, onSaved }) {
  const [form, setForm] = useState({
    full_name: row.full_name || '',
    phone: row.phone || '',
    goal: row.goal || '',
    level: row.level || 'beginner',
    status: row.status || 'active'
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('clients')
      .update(form)
      .eq('id', row.id)

    if (error) {
      setMessage(error.message)
    } else {
      onSaved()
      onClose()
    }
    setSaving(false)
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-head">
          <h3>Edit Client</h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form className="grid-form simple-form" onSubmit={submit}>
          <div>
            <label>Client Name</label>
            <input value={form.full_name} onChange={e => updateField('full_name', e.target.value)} />
          </div>

          <div>
            <label>Phone</label>
            <input value={form.phone} onChange={e => updateField('phone', e.target.value)} />
          </div>

          <div>
            <label>Goal</label>
            <input value={form.goal} onChange={e => updateField('goal', e.target.value)} />
          </div>

          <div>
            <label>Level</label>
            <select value={form.level} onChange={e => updateField('level', e.target.value)}>
              <option>beginner</option>
              <option>intermediate</option>
              <option>advanced</option>
            </select>
          </div>

          <div>
            <label>Status</label>
            <select value={form.status} onChange={e => updateField('status', e.target.value)}>
              <option>active</option>
              <option>inactive</option>
            </select>
          </div>

          {message && <div className="error full">{message}</div>}
          <button disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  )
}

function EditLogModal({ row, onClose, onSaved }) {
  const [form, setForm] = useState({
    log_date: row.log_date || new Date().toISOString().slice(0, 10),
    shift: row.shift || 'PM',
    check_in: row.check_in || '15:00',
    check_out: row.check_out || '23:00',
    rotation_count: row.rotation_count || 0,
    new_clients_count: row.new_clients_count || 0,
    pt_sessions_count: row.pt_sessions_count || 0,
    free_service_count: row.free_service_count || 0,
    notes: row.notes || ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const payload = {
      ...form,
      rotation_count: Number(form.rotation_count || 0),
      new_clients_count: Number(form.new_clients_count || 0),
      pt_sessions_count: Number(form.pt_sessions_count || 0),
      free_service_count: Number(form.free_service_count || 0)
    }

    const { error } = await supabase
      .from('trainer_daily_logs')
      .update(payload)
      .eq('id', row.id)

    if (error) {
      setMessage(error.message)
    } else {
      onSaved()
      onClose()
    }
    setSaving(false)
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card wide">
        <div className="modal-head">
          <h3>Edit Daily Log</h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form className="grid-form simple-form" onSubmit={submit}>
          <div>
            <label>Date</label>
            <input type="date" value={form.log_date} onChange={e => updateField('log_date', e.target.value)} />
          </div>

          <div>
            <label>Shift</label>
            <select value={form.shift} onChange={e => updateField('shift', e.target.value)}>
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>

          <div>
            <label>Check In</label>
            <input type="time" value={form.check_in} onChange={e => updateField('check_in', e.target.value)} />
          </div>

          <div>
            <label>Check Out</label>
            <input type="time" value={form.check_out} onChange={e => updateField('check_out', e.target.value)} />
          </div>

          <div>
            <label>Rotation</label>
            <input type="number" value={form.rotation_count} onChange={e => updateField('rotation_count', e.target.value)} />
          </div>

          <div>
            <label>New Clients</label>
            <input type="number" value={form.new_clients_count} onChange={e => updateField('new_clients_count', e.target.value)} />
          </div>

          <div>
            <label>PT Sessions</label>
            <input type="number" value={form.pt_sessions_count} onChange={e => updateField('pt_sessions_count', e.target.value)} />
          </div>

          <div>
            <label>Free Service</label>
            <input type="number" value={form.free_service_count} onChange={e => updateField('free_service_count', e.target.value)} />
          </div>

          <div className="full">
            <label>Notes</label>
            <textarea value={form.notes} onChange={e => updateField('notes', e.target.value)} />
          </div>

          {message && <div className="error full">{message}</div>}
          <button disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  )
}

function Table({ title, rows, columns, canManage = false, onEdit, onDelete, emptyText = 'No data found.' }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {rows.length === 0 ? (
        <p className="muted">{emptyText}</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {columns.map(col => <th key={col.key}>{col.label}</th>)}
                {canManage && <th>Control</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id || idx}>
                  {columns.map(col => <td key={col.key}>{String(row[col.key] ?? '-')}</td>)}
                  {canManage && (
                    <td>
                      <div className="row-actions">
                        <button className="small-action edit" onClick={() => onEdit(row)}><Pencil size={14}/> Edit</button>
                        <button className="small-action delete" onClick={() => onDelete(row)}><Trash2 size={14}/> Delete</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function TrainerDailyLogForm({ profile, onSaved }) {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    log_date: today,
    shift: 'PM',
    check_in: '15:00',
    check_out: '23:00',
    rotation_count: 0,
    new_clients_count: 0,
    pt_sessions_count: 0,
    free_service_count: 0,
    notes: ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const payload = {
      trainer_id: profile.id,
      branch_id: profile.branch_id,
      log_date: form.log_date,
      shift: form.shift,
      check_in: form.check_in,
      check_out: form.check_out,
      rotation_count: Number(form.rotation_count || 0),
      new_clients_count: Number(form.new_clients_count || 0),
      pt_sessions_count: Number(form.pt_sessions_count || 0),
      free_service_count: Number(form.free_service_count || 0),
      issues: '',
      notes: form.notes
    }

    const { error } = await supabase.from('trainer_daily_logs').insert(payload)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Daily log saved successfully.')
      setForm({
        log_date: today,
        shift: 'PM',
        check_in: '15:00',
        check_out: '23:00',
        rotation_count: 0,
        new_clients_count: 0,
        pt_sessions_count: 0,
        free_service_count: 0,
        notes: ''
      })
      onSaved()
    }

    setSaving(false)
  }

  return (
    <div className="card compact-card">
      <h3><PlusCircle size={18}/> سجل اليوم</h3>
      <p className="muted form-help">اكتب الأرقام المهمة فقط عشان التقرير يبقى سريع ومش ضغط على المدرب.</p>

      <form className="grid-form simple-form" onSubmit={submit}>
        <div>
          <label>Date</label>
          <input type="date" value={form.log_date} onChange={e => updateField('log_date', e.target.value)} />
        </div>

        <div>
          <label>Shift</label>
          <select value={form.shift} onChange={e => updateField('shift', e.target.value)}>
            <option>AM</option>
            <option>PM</option>
          </select>
        </div>

        <div>
          <label>Check In</label>
          <input type="time" value={form.check_in} onChange={e => updateField('check_in', e.target.value)} />
        </div>

        <div>
          <label>Check Out</label>
          <input type="time" value={form.check_out} onChange={e => updateField('check_out', e.target.value)} />
        </div>

        <div>
          <label>Rotation</label>
          <input type="number" value={form.rotation_count} onChange={e => updateField('rotation_count', e.target.value)} />
        </div>

        <div>
          <label>New Clients</label>
          <input type="number" value={form.new_clients_count} onChange={e => updateField('new_clients_count', e.target.value)} />
        </div>

        <div>
          <label>PT Sessions</label>
          <input type="number" value={form.pt_sessions_count} onChange={e => updateField('pt_sessions_count', e.target.value)} />
        </div>

        <div>
          <label>Free Service</label>
          <input type="number" value={form.free_service_count} onChange={e => updateField('free_service_count', e.target.value)} />
        </div>

        <div className="full">
          <label>Notes</label>
          <textarea value={form.notes} onChange={e => updateField('notes', e.target.value)} placeholder="ملاحظات مختصرة..." />
        </div>

        {message && <div className={message.includes('success') ? 'success full' : 'error full'}>{message}</div>}

        <button disabled={saving}>{saving ? 'Saving...' : 'Save Daily Log'}</button>
      </form>
    </div>
  )
}

function AddClientForm({ profile, branches, onSaved }) {
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    goal: 'Hypertrophy',
    level: 'beginner'
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const branchId = profile.branch_id || branches[0]?.id

    const payload = {
      full_name: form.full_name,
      phone: form.phone,
      gender: '',
      age: null,
      branch_id: branchId,
      assigned_trainer_id: profile.role === 'trainer' ? profile.id : null,
      goal: form.goal,
      level: form.level,
      medical_notes: '',
      status: 'active',
      created_by: profile.id
    }

    const { error } = await supabase.from('clients').insert(payload)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Client saved successfully.')
      setForm({
        full_name: '',
        phone: '',
        goal: 'Hypertrophy',
        level: 'beginner'
      })
      onSaved()
    }

    setSaving(false)
  }

  return (
    <div className="card compact-card">
      <h3><PlusCircle size={18}/> أضف عميل</h3>
      <form className="grid-form simple-form" onSubmit={submit}>
        <div>
          <label>Client Name</label>
          <input required value={form.full_name} onChange={e => updateField('full_name', e.target.value)} />
        </div>

        <div>
          <label>Phone</label>
          <input value={form.phone} onChange={e => updateField('phone', e.target.value)} />
        </div>

        <div>
          <label>Goal</label>
          <input value={form.goal} onChange={e => updateField('goal', e.target.value)} />
        </div>

        <div>
          <label>Level</label>
          <select value={form.level} onChange={e => updateField('level', e.target.value)}>
            <option>beginner</option>
            <option>intermediate</option>
            <option>advanced</option>
          </select>
        </div>

        {message && <div className={message.includes('success') ? 'success full' : 'error full'}>{message}</div>}

        <button disabled={saving}>{saving ? 'Saving...' : 'Save Client'}</button>
      </form>
    </div>
  )
}

function Dashboard({ profile }) {
  const [clients, setClients] = useState([])
  const [trainerLogs, setTrainerLogs] = useState([])
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  const [editingClient, setEditingClient] = useState(null)
  const [editingLog, setEditingLog] = useState(null)

  const isAdmin = profile.role === 'owner' || profile.role === 'fitness_director'
  const isTrainer = profile.role === 'trainer'
  const canAddClient = isTrainer || isAdmin

  async function loadData() {
    setLoading(true)
    setNotice('')

    const [clientsRes, logsRes, branchesRes] = await Promise.all([
      supabase.from('clients').select('*').order('created_at', { ascending: false }),
      supabase.from('trainer_daily_logs').select('*').order('created_at', { ascending: false }),
      supabase.from('branches').select('*').order('name')
    ])

    if (clientsRes.error) setNotice(clientsRes.error.message)
    setClients(clientsRes.data || [])
    setTrainerLogs(logsRes.data || [])
    setBranches(branchesRes.data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function deleteClient(row) {
    const ok = window.confirm(`Delete client: ${row.full_name}?`)
    if (!ok) return

    const { error } = await supabase.from('clients').delete().eq('id', row.id)
    if (error) alert(error.message)
    else loadData()
  }

  async function deleteLog(row) {
    const ok = window.confirm(`Delete daily log: ${row.log_date}?`)
    if (!ok) return

    const { error } = await supabase.from('trainer_daily_logs').delete().eq('id', row.id)
    if (error) alert(error.message)
    else loadData()
  }

  const today = new Date().toISOString().slice(0, 10)
  const todayLogs = trainerLogs.filter(log => log.log_date === today)

  const totals = useMemo(() => {
    const rows = isAdmin ? todayLogs : trainerLogs
    return {
      logs: rows.length,
      rotation: rows.reduce((sum, row) => sum + Number(row.rotation_count || 0), 0),
      pt: rows.reduce((sum, row) => sum + Number(row.pt_sessions_count || 0), 0),
      free: rows.reduce((sum, row) => sum + Number(row.free_service_count || 0), 0)
    }
  }, [isAdmin, todayLogs, trainerLogs])

  const title = useMemo(() => {
    if (profile.role === 'owner') return 'Owner Dashboard'
    if (profile.role === 'fitness_director') return 'Fitness Director Dashboard'
    if (profile.role === 'trainer') return 'Trainer Dashboard'
    return 'Dashboard'
  }, [profile.role])

  if (loading) return <div className="card">Loading dashboard...</div>

  return (
    <>
      <section className="hero simple-hero">
        <h2>{title}</h2>
        <p>
          نسخة بسيطة: أرقام يومية مهمة فقط، بدون ضغط أو تفاصيل زيادة.
        </p>
      </section>

      {notice && <div className="error">{notice}</div>}

      {isAdmin ? (
        <section className="stats-grid">
          <StatCard title="Today's Logs" value={totals.logs} icon={<CalendarDays />} />
          <StatCard title="Total Rotation Today" value={totals.rotation} icon={<Users />} />
          <StatCard title="PT Sessions Today" value={totals.pt} icon={<Dumbbell />} />
          <StatCard title="Free Service Today" value={totals.free} icon={<ClipboardList />} />
        </section>
      ) : (
        <section className="stats-grid">
          <StatCard title="My Clients" value={clients.length} icon={<Users />} />
          <StatCard title="My Logs" value={trainerLogs.length} icon={<CalendarDays />} />
          <StatCard title="My PT Sessions" value={totals.pt} icon={<Dumbbell />} />
          <StatCard title="My Free Service" value={totals.free} icon={<ClipboardList />} />
        </section>
      )}

      {isAdmin && (
        <div className="card note">
          <b>Owner / Director Control:</b> تقدر تعدل أو تحذف العملاء والتقارير اليومية من أزرار Edit / Delete داخل الجداول.
        </div>
      )}

      {isTrainer && (
        <div className="card note">
          <b>Trainer View:</b> المطلوب من المدرب بسيط: يسجل اليوم ويضيف العميل المهم فقط.
        </div>
      )}

      {canAddClient && <AddClientForm profile={profile} branches={branches} onSaved={loadData} />}
      {isTrainer && <TrainerDailyLogForm profile={profile} onSaved={loadData} />}

      <Table
        title={isTrainer ? 'عملائي' : 'Clients'}
        rows={clients}
        canManage={isAdmin}
        onEdit={setEditingClient}
        onDelete={deleteClient}
        columns={[
          { key: 'full_name', label: 'Client' },
          { key: 'phone', label: 'Phone' },
          { key: 'goal', label: 'Goal' },
          { key: 'level', label: 'Level' },
          { key: 'status', label: 'Status' }
        ]}
      />

      <Table
        title={isTrainer ? 'تقاريري اليومية' : 'Trainer Daily Logs'}
        rows={trainerLogs}
        canManage={isAdmin}
        onEdit={setEditingLog}
        onDelete={deleteLog}
        columns={[
          { key: 'log_date', label: 'Date' },
          { key: 'shift', label: 'Shift' },
          { key: 'rotation_count', label: 'Rotation' },
          { key: 'pt_sessions_count', label: 'PT Sessions' },
          { key: 'free_service_count', label: 'Free Service' },
          { key: 'notes', label: 'Notes' }
        ]}
      />

      {isAdmin && (
        <Table
          title="Branches"
          rows={branches}
          columns={[
            { key: 'name', label: 'Branch' },
            { key: 'location', label: 'Location' },
            { key: 'status', label: 'Status' }
          ]}
        />
      )}

      {editingClient && (
        <EditClientModal
          row={editingClient}
          onClose={() => setEditingClient(null)}
          onSaved={loadData}
        />
      )}

      {editingLog && (
        <EditLogModal
          row={editingLog}
          onClose={() => setEditingLog(null)}
          onSaved={loadData}
        />
      )}
    </>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    async function loadProfile() {
      setProfile(null)
      setProfileError('')
      if (!session?.user?.id) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) setProfileError(error.message)
      else setProfile(data)
    }

    loadProfile()
  }, [session])

  if (loading) return <div className="loading">Loading...</div>
  if (!session) return <Login />

  if (profileError) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Profile Error</h2>
          <p className="error">{profileError}</p>
          <p>This usually means the user exists in Authentication but has no matching row in public.profiles.</p>
          <button onClick={() => supabase.auth.signOut()}>Logout</button>
        </div>
      </div>
    )
  }

  if (!profile) return <div className="loading">Loading profile...</div>

  return (
    <Layout profile={profile}>
      <Dashboard profile={profile} />
    </Layout>
  )
}

createRoot(document.getElementById('root')).render(<App />)
