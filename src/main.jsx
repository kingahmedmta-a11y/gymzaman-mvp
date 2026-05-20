import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './supabase'
import { LogOut, Users, Dumbbell, ClipboardList, UserRound, ShieldCheck, PlusCircle, CalendarDays, Pencil, Trash2, X, Languages, LockKeyhole, Search, UserCog, Save } from 'lucide-react'
import './styles.css'

const TEXT = {
  ar: {
    loginTitle: 'Gym Zaman', loginSub: 'نظام إدارة داخلي', staffOnly: 'دخول مخصص للموظفين فقط', selectBranch: 'اختيار الفرع', autoSavedDraft: 'تم الحفظ تلقائيًا كمسودة', branchLoginMismatch: 'تنبيه: الفرع المختار في شاشة الدخول مختلف عن الفرع المسجل لحسابك. تم تطبيق صلاحية فرعك المسجل فقط.',
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
    adminNote: 'تحكم الإدارة: اختار مدرب لعرض ملفه أو اعرض الكل.',
    trainerNote: '',
    filterByTrainer: 'اختيار المدرب', allTrainers: 'كل المدربين', trainerEmail: 'اسم المدرب',
    staffNote: 'إدارة الفريق: تعديل الدور، الفرع، والحالة. تظهر فقط للأونر والديركتور.',
    fullName: 'الاسم', branch: 'الفرع', role: 'الدور', saveStaff: 'حفظ بيانات المدرب', savedStaff: 'تم حفظ بيانات المدرب.',
    active: 'active', inactive: 'inactive',
    seniorReport: 'تقرير السينيور', addSeniorReport: 'إضافة تقرير سينيور', branchPressure: 'ضغط الفرع', serviceNotes: 'ملاحظات الخدمة',
    coachCommitment: 'التزام المدربين', clientIssues: 'مشاكل العملاء', actionsTaken: 'الإجراءات التي تمت', resolved: 'تم الحل؟', saveSeniorReport: 'حفظ تقرير السينيور', seniorReportSaved: 'تم حفظ تقرير السينيور بنجاح.',
    trainerProfile: 'ملف المدرب', trainerFile: 'ملف المدرب الكامل', trainerFiles: 'ملفات المدربين', autoEvaluation: 'التقييم التلقائي', automaticScore: 'الدرجة التلقائية', activityScore: 'درجة النشاط', attendanceScore: 'درجة الالتزام', reportingScore: 'درجة التقارير', headCoachScore: 'تقييم الهيد كوتش', evaluationPreview: 'معاينة التقييم النهائي', coachEvaluation: 'تقييم المدرب', evaluationHistory: 'سجل التقييمات',
    technicalScore: 'التقييم الفني', behaviorScore: 'التقييم السلوكي', leadershipScore: 'تقييم القيادة', serviceScore: 'تقييم الخدمة',
    evaluatorNotes: 'ملاحظات المقيم', saveEvaluation: 'حفظ التقييم', evaluationSaved: 'تم حفظ التقييم بنجاح.',
    selectedTrainerInfo: 'بيانات المدرب المختار', problemDescription: 'وصف المشكلة', evaluatedBy: 'تم التقييم بواسطة',
    headCoachReport: 'تقرير الهيد كوتش', addHeadCoachReport: 'إضافة تقرير هيد كوتش',
    tasksDone: 'المهام التي تمت', followUps: 'المتابعات', trainerIssues: 'مشاكل المدربين', branchSummary: 'ملخص الفرع',
    saveHeadCoachReport: 'حفظ تقرير الهيد كوتش', headCoachReportSaved: 'تم حفظ تقرير الهيد كوتش بنجاح.',
    totalSessionsDone: 'عدد السيشنز المنفذة', floorTasks: 'مهام الأرضية',
    attendance: 'الحضور والانصراف', addAttendance: 'تسجيل حضور وانصراف', attendanceSaved: 'تم حفظ الحضور والانصراف بنجاح.',
    expectedIn: 'ميعاد الحضور الرسمي', expectedOut: 'ميعاد الانصراف الرسمي', lateMinutes: 'دقائق التأخير', overtimeMinutes: 'دقائق الأوفر تايم',
    finalScore: 'النتيجة النهائية', grade: 'التقدير', recommendation: 'التوصية', excellent: 'Excellent', good: 'Good', needsImprovement: 'Needs Improvement',
    performanceDashboard: 'لوحة الأداء', topBySessions: 'أعلى مدرب سيشنز', topByFreeService: 'أعلى مدرب Free Service', trainersNoReport: 'مدربين بدون تقرير اليوم', activeCoaches: 'مدربين نشطين', totalClients: 'إجمالي العملاء',
    monthlyReport: 'التقرير الشهري للمدربين', reportMonth: 'شهر التقرير', totalLogs: 'عدد التقارير', totalLate: 'إجمالي التأخير', totalOvertime: 'إجمالي الأوفر تايم', avgEvaluation: 'متوسط التقييم',
    branchComparison: 'مقارنة الفروع', alerts: 'تنبيهات وملاحظات', alertType: 'نوع التنبيه', alertDetails: 'التفاصيل', noAlerts: 'لا توجد تنبيهات حاليًا',
    branchName: 'اسم الفرع', totalRotation: 'إجمالي Rotation', totalFreeService: 'إجمالي Free Service', totalPrograms: 'إجمالي البرامج', unresolvedProblems: 'مشاكل غير محلولة',
    tabOverview: 'Overview', tabTrainerData: 'بيانات المدربين', tabInputs: 'إدخال البيانات', tabReports: 'التقارير', tabStaff: 'إدارة الفريق',
    searchPlaceholder: 'بحث بالاسم / الهاتف / الملاحظات...', exportCsv: 'تصدير CSV', auditLog: 'سجل التعديلات',
    clientFollowup: 'متابعة العميل', lastContactDate: 'آخر تواصل', nextFollowupDate: 'ميعاد المتابعة القادم', followupNotes: 'ملاحظات المتابعة', needDirectorSupport: 'يحتاج تدخل المدير؟',
    reception: 'الريسيبشن', sales: 'السيلز', receptionLog: 'تقرير الريسيبشن', salesLead: 'Lead سيلز', addReceptionLog: 'إضافة تقرير ريسيبشن', addSalesLead: 'إضافة Lead سيلز', visitorName: 'اسم الزائر / العميل', leadName: 'اسم العميل', source: 'المصدر', interest: 'الاهتمام', outcome: 'النتيجة', inquiryType: 'نوع الاستفسار', handledBy: 'تم بواسطة', nextAction: 'الخطوة القادمة', assignedCoach: 'الكوتش المستلم', assignRotationToCoach: 'توزيع العميل على كوتش', saveReceptionLog: 'حفظ تقرير الريسيبشن', saveSalesLead: 'حفظ Lead السيلز', receptionSaved: 'تم حفظ تقرير الريسيبشن بنجاح.', salesSaved: 'تم حفظ Lead السيلز بنجاح.', deleteReports: 'حذف التقارير', addClientPage: 'إضافة عميل جديد', clientFile: 'ملف العميل', clientProfile: 'صفحة العميل', parq7: 'PAR-Q7', fitnessTest: 'Fitness Test', ptProgramFile: 'برنامج PT داخل ملف العميل', age: 'العمر', heightCm: 'الطول سم', weightKg: 'الوزن كجم', bloodPressure: 'ضغط الدم', restingHr: 'نبض الراحة', medicalHistory: 'تاريخ مرضي / إصابات', currentPain: 'ألم حالي', medications: 'أدوية', emergencyContact: 'رقم طوارئ', chestPain: 'ألم في الصدر أثناء المجهود', dizziness: 'دوخة أو فقدان اتزان', heartCondition: 'مشكلة بالقلب', bloodPressureIssue: 'مشكلة ضغط', boneJointIssue: 'مشكلة عظام أو مفاصل', doctorRestriction: 'منع طبي من التمرين', otherMedical: 'مشكلة صحية أخرى', pushupTest: 'Push-up Test', plankTest: 'Plank Test', squatTest: 'Squat Test', flexibilityTest: 'Flexibility Test', cardioTest: 'Cardio Test', postureNotes: 'Posture Notes', clearanceStatus: 'حالة السماح بالتمرين', clearanceOk: 'مسموح بالتمرين', clearanceReview: 'محتاج مراجعة / متابعة', latestPtPrograms: 'برامج PT الخاصة بالعميل', selectClientFile: 'اختر عميل لفتح ملفه',
    entityType: 'نوع البيانات', action: 'الإجراء', changedBy: 'تم بواسطة', changedAt: 'وقت التعديل', backupData: 'حفظ نسخة من كل الداتا', exportAllData: 'تصدير كل البيانات JSON', securityStatus: 'حالة الأمان', autoSystem: 'النظام التلقائي', systemReady: 'السيستم جاهز ومؤمن', savedAutomatically: 'أي تسجيل بيتم حفظه وتحديث التقارير تلقائيًا', ownerDirectorControl: 'التحكم الكامل للأونر والفيتنس ديركتور فقط', quickActions: 'اختصارات سريعة', openClientIntake: 'فتح إضافة عميل', openDataEntry: 'فتح الإدخال اليومي', openReports: 'فتح التقارير'
  },
  en: {
    loginTitle: 'Gym Zaman', loginSub: 'Internal Management System', staffOnly: 'Staff access only', selectBranch: 'Select Branch', autoSavedDraft: 'Auto-saved as draft', branchLoginMismatch: 'Notice: the branch selected on login differs from your saved account branch. Your saved branch permission was applied.',
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
    adminNote: 'Admin control: choose a trainer to view their file, or view all.',
    trainerNote: '',
    filterByTrainer: 'Filter by Trainer', allTrainers: 'All Trainers', trainerEmail: 'Trainer Name',
    staffNote: 'Staff Management: update role, branch, and status. Visible only for Owner and Director.',
    fullName: 'Full Name', branch: 'Branch', role: 'Role', saveStaff: 'Save Staff Data', savedStaff: 'Staff data saved.',
    active: 'active', inactive: 'inactive',
    seniorReport: 'Senior Report', addSeniorReport: 'Add Senior Report', branchPressure: 'Branch Pressure', serviceNotes: 'Service Notes',
    coachCommitment: 'Coach Commitment', clientIssues: 'Client Issues', actionsTaken: 'Actions Taken', resolved: 'Resolved?', saveSeniorReport: 'Save Senior Report', seniorReportSaved: 'Senior report saved successfully.',
    trainerProfile: 'Trainer Profile', trainerFile: 'Full Trainer File', trainerFiles: 'Trainer Files', autoEvaluation: 'Automatic Evaluation', automaticScore: 'Automatic Score', activityScore: 'Activity Score', attendanceScore: 'Attendance Score', reportingScore: 'Reporting Score', headCoachScore: 'Head Coach Score', evaluationPreview: 'Final Evaluation Preview', coachEvaluation: 'Coach Evaluation', evaluationHistory: 'Evaluation History',
    technicalScore: 'Technical Score', behaviorScore: 'Behavior Score', leadershipScore: 'Leadership Score', serviceScore: 'Service Score',
    evaluatorNotes: 'Evaluator Notes', saveEvaluation: 'Save Evaluation', evaluationSaved: 'Evaluation saved successfully.',
    selectedTrainerInfo: 'Selected Trainer Info', problemDescription: 'Problem Description', evaluatedBy: 'Evaluated By',
    headCoachReport: 'Head Coach Report', addHeadCoachReport: 'Add Head Coach Report',
    tasksDone: 'Tasks Done', followUps: 'Follow-ups', trainerIssues: 'Trainer Issues', branchSummary: 'Branch Summary',
    saveHeadCoachReport: 'Save Head Coach Report', headCoachReportSaved: 'Head Coach report saved successfully.',
    totalSessionsDone: 'Total Sessions Done', floorTasks: 'Floor Tasks',
    attendance: 'Attendance', addAttendance: 'Add Attendance', attendanceSaved: 'Attendance saved successfully.',
    expectedIn: 'Expected In', expectedOut: 'Expected Out', lateMinutes: 'Late Minutes', overtimeMinutes: 'Overtime Minutes',
    finalScore: 'Final Score', grade: 'Grade', recommendation: 'Recommendation', excellent: 'Excellent', good: 'Good', needsImprovement: 'Needs Improvement',
    performanceDashboard: 'Performance Dashboard', topBySessions: 'Top Trainer by Sessions', topByFreeService: 'Top Trainer by Free Service', trainersNoReport: 'Trainers with No Report Today', activeCoaches: 'Active Coaches', totalClients: 'Total Clients',
    monthlyReport: 'Monthly Trainer Report', reportMonth: 'Report Month', totalLogs: 'Total Logs', totalLate: 'Total Late', totalOvertime: 'Total Overtime', avgEvaluation: 'Avg Evaluation',
    branchComparison: 'Branch Comparison', alerts: 'Alerts & Notes', alertType: 'Alert Type', alertDetails: 'Details', noAlerts: 'No alerts currently',
    branchName: 'Branch Name', totalRotation: 'Total Rotation', totalFreeService: 'Total Free Service', totalPrograms: 'Total Programs', unresolvedProblems: 'Unresolved Problems',
    tabOverview: 'Overview', tabTrainerData: 'Trainer Data', tabInputs: 'Data Entry', tabReports: 'Reports', tabStaff: 'Staff Management',
    searchPlaceholder: 'Search by name / phone / notes...', exportCsv: 'Export CSV', auditLog: 'Audit Log',
    clientFollowup: 'Client Follow-up', lastContactDate: 'Last Contact', nextFollowupDate: 'Next Follow-up', followupNotes: 'Follow-up Notes', needDirectorSupport: 'Need Director Support?',
    reception: 'Reception', sales: 'Sales', receptionLog: 'Reception Log', salesLead: 'Sales Lead', addReceptionLog: 'Add Reception Log', addSalesLead: 'Add Sales Lead', visitorName: 'Visitor / Client Name', leadName: 'Client Name', source: 'Source', interest: 'Interest', outcome: 'Outcome', inquiryType: 'Inquiry Type', handledBy: 'Handled By', nextAction: 'Next Action', assignedCoach: 'Assigned Coach', assignRotationToCoach: 'Assign Rotation to Coach', saveReceptionLog: 'Save Reception Log', saveSalesLead: 'Save Sales Lead', receptionSaved: 'Reception log saved successfully.', salesSaved: 'Sales lead saved successfully.', deleteReports: 'Delete Reports', addClientPage: 'Add New Client', clientFile: 'Client File', clientProfile: 'Client Page', parq7: 'PAR-Q7', fitnessTest: 'Fitness Test', ptProgramFile: 'PT Program in Client File', age: 'Age', heightCm: 'Height cm', weightKg: 'Weight kg', bloodPressure: 'Blood Pressure', restingHr: 'Resting HR', medicalHistory: 'Medical History / Injuries', currentPain: 'Current Pain', medications: 'Medications', emergencyContact: 'Emergency Contact', chestPain: 'Chest pain during exercise', dizziness: 'Dizziness or loss of balance', heartCondition: 'Heart condition', bloodPressureIssue: 'Blood pressure issue', boneJointIssue: 'Bone or joint issue', doctorRestriction: 'Doctor restriction', otherMedical: 'Other medical issue', pushupTest: 'Push-up Test', plankTest: 'Plank Test', squatTest: 'Squat Test', flexibilityTest: 'Flexibility Test', cardioTest: 'Cardio Test', postureNotes: 'Posture Notes', clearanceStatus: 'Clearance Status', clearanceOk: 'Clear to train', clearanceReview: 'Needs review / follow-up', latestPtPrograms: 'Client PT Programs', selectClientFile: 'Choose a client to open file',
    entityType: 'Entity Type', action: 'Action', changedBy: 'Changed By', changedAt: 'Changed At', backupData: 'Save All Data Backup', exportAllData: 'Export All Data JSON', securityStatus: 'Security Status', autoSystem: 'Automatic System', systemReady: 'System ready and secured', savedAutomatically: 'Every entry is saved and reports update automatically', ownerDirectorControl: 'Full control is Owner and Fitness Director only', quickActions: 'Quick Actions', openClientIntake: 'Open Client Intake', openDataEntry: 'Open Daily Entry', openReports: 'Open Reports'
  }
}


Object.assign(TEXT.ar, {
  shiftPlanner: 'جدول الشيفتات', addShift: 'إضافة شيفت', offDay: 'هذا التاريخ أجازة استثنائية', offDayWeekday: 'يوم الأجازة الأسبوعي', appliesWeekly: 'تثبيت الجدول أسبوعيًا', shiftTemplate: 'قالب الشيفت', coachFullFile: 'ملف كامل لكل مدرب', openTrainerFile: 'فتح ملف المدرب', trainerDirectory: 'دليل المدربين', selectBranchFilter: 'فلترة حسب الفرع', allBranches: 'كل الفروع', professionalNote: 'كل مدرب له صفحة مستقلة تجمع الشيفتات والمهام والطلبات والحضور والتارجت والعملاء والتقييمات.', shiftSaved: 'تم حفظ الشيفت بنجاح.',
  attendancePage: 'تسجيل الحضور', punchIn: 'تسجيل حضور الآن', punchOut: 'تسجيل انصراف الآن', attendancePunchSaved: 'تم تسجيل الحضور/الانصراف تلقائيًا.', todayShift: 'شيفت اليوم', noShiftToday: 'لا يوجد شيفت مسجل لك اليوم.',
  requests: 'طلبات المدرب', requestType: 'نوع الطلب', latePermission: 'إذن تأخير', vacationRequest: 'طلب أجازة', advanceRequest: 'طلب سلفة', requestDate: 'تاريخ الطلب', requestedMinutes: 'الدقائق المطلوبة', amount: 'المبلغ', reason: 'السبب', requestSaved: 'تم حفظ الطلب بنجاح.', approvalStatus: 'حالة الموافقة',
  targetPlan: 'خطة تحقيق التارجت', targetMonth: 'شهر التارجت', monthlyTarget: 'التارجت الشهري', currentAchievement: 'المحقق حاليًا', actionPlan: 'خطة التنفيذ', expectedChallenges: 'التحديات المتوقعة', supportNeeded: 'الدعم المطلوب', targetPlanSaved: 'تم حفظ خطة التارجت بنجاح.',
  trainerTasks: 'مهام المدربين', assignTask: 'إضافة مهمة للمدرب', taskTitle: 'عنوان المهمة', taskDetails: 'تفاصيل المهمة', dueDate: 'تاريخ التسليم', priority: 'الأولوية', taskStatus: 'حالة المهمة', taskSaved: 'تم حفظ المهمة بنجاح.', markDone: 'تم التنفيذ',
  automaticAttendanceSummary: 'تجميع تلقائي للحضور', totalDelayMinutes: 'إجمالي دقائق التأخير', totalOvertimeMinutes: 'إجمالي دقائق الأوفر تايم', totalAbsenceDays: 'إجمالي أيام الغياب',
  totalPermissionMinutes: 'إجمالي دقائق الأذونات', approvedPermissions: 'الأذونات المقبولة', pendingRequests: 'طلبات تحت المراجعة', approve: 'موافقة', reject: 'رفض', approvalNote: 'ملاحظة الموافقة / الرفض', approvedBy: 'تمت الموافقة بواسطة', reviewedAt: 'وقت المراجعة',
  separatePagesNote: 'كل قسم في صفحة مستقلة وواضحة، والحفظ والتجميع يتم تلقائيًا.'
})
Object.assign(TEXT.en, {
  shiftPlanner: 'Shift Planner', addShift: 'Add Shift', offDay: 'Exceptional Day Off', offDayWeekday: 'Weekly Day Off', appliesWeekly: 'Apply Weekly Schedule', shiftTemplate: 'Shift Template', coachFullFile: 'Full Coach File', openTrainerFile: 'Open Coach File', trainerDirectory: 'Trainer Directory', selectBranchFilter: 'Filter by Branch', allBranches: 'All Branches', professionalNote: 'Each coach has a separate professional file combining shifts, tasks, requests, attendance, target plans, clients, and evaluations.', shiftSaved: 'Shift saved successfully.',
  attendancePage: 'Attendance Punch', punchIn: 'Check In Now', punchOut: 'Check Out Now', attendancePunchSaved: 'Attendance updated automatically.', todayShift: "Today's Shift", noShiftToday: 'No shift is scheduled for you today.',
  requests: 'Coach Requests', requestType: 'Request Type', latePermission: 'Late Permission', vacationRequest: 'Vacation Request', advanceRequest: 'Advance Request', requestDate: 'Request Date', requestedMinutes: 'Requested Minutes', amount: 'Amount', reason: 'Reason', requestSaved: 'Request saved successfully.', approvalStatus: 'Approval Status',
  targetPlan: 'Monthly Target Plan', targetMonth: 'Target Month', monthlyTarget: 'Monthly Target', currentAchievement: 'Current Achievement', actionPlan: 'Action Plan', expectedChallenges: 'Expected Challenges', supportNeeded: 'Support Needed', targetPlanSaved: 'Target plan saved successfully.',
  trainerTasks: 'Trainer Tasks', assignTask: 'Assign Task', taskTitle: 'Task Title', taskDetails: 'Task Details', dueDate: 'Due Date', priority: 'Priority', taskStatus: 'Task Status', taskSaved: 'Task saved successfully.', markDone: 'Done',
  automaticAttendanceSummary: 'Automatic Attendance Summary', totalDelayMinutes: 'Total Delay Minutes', totalOvertimeMinutes: 'Total Overtime Minutes', totalAbsenceDays: 'Total Absence Days',
  totalPermissionMinutes: 'Total Permission Minutes', approvedPermissions: 'Approved Permissions', pendingRequests: 'Pending Requests', approve: 'Approve', reject: 'Reject', approvalNote: 'Approval / Rejection Note', approvedBy: 'Approved By', reviewedAt: 'Reviewed At',
  separatePagesNote: 'Each module is placed on a separate clear page, with automatic saving and aggregation.'
})

const ROLE_OPTIONS = ['trainer', 'senior', 'head_coach', 'reception', 'sales', 'fitness_director', 'owner']
const STATUS_OPTIONS = ['active', 'inactive']

const LOGIN_BRANCH_OPTIONS = ['Miami', 'Moharram Bey', 'Janaklis']

function displayTwoName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).join(' ') || '-'
}

function displayCoachName(profile) {
  return displayTwoName(profile?.full_name || profile?.name || '')
}

function useAutoSavedForm(storageKey, initialValue) {
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? { ...initialValue, ...JSON.parse(saved) } : initialValue
    } catch {
      return initialValue
    }
  })
  const [draftSaved, setDraftSaved] = useState(false)
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(form))
    setDraftSaved(true)
    const timer = setTimeout(() => setDraftSaved(false), 1200)
    return () => clearTimeout(timer)
  }, [storageKey, form])
  const clearDraft = (nextValue = initialValue) => {
    localStorage.removeItem(storageKey)
    setForm(nextValue)
  }
  return [form, setForm, draftSaved, clearDraft]
}


function logAudit(actorId, action, entityType, entityId, details = {}) {
  if (!actorId) return Promise.resolve()
  return supabase.from('audit_logs').insert({
    actor_id: actorId,
    action,
    entity_type: entityType,
    entity_id: entityId || null,
    details
  })
}

function rowMatches(row, query) {
  if (!query) return true
  const q = query.toLowerCase()
  return Object.values(row || {}).some(value => String(value ?? '').toLowerCase().includes(q))
}

function exportRowsToCsv(filename, rows) {
  if (!rows || rows.length === 0) return
  const keys = Array.from(rows.reduce((set, row) => {
    Object.keys(row || {}).forEach(k => set.add(k))
    return set
  }, new Set()))
  const escapeCsv = value => {
    const text = String(value ?? '')
    return `"${text.replaceAll('"', '""')}"`
  }
  const csv = [keys.join(','), ...rows.map(row => keys.map(k => escapeCsv(row[k])).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function ExportButton({ rows, filename, t }) {
  return <button className="export-btn" type="button" onClick={() => exportRowsToCsv(filename, rows)}>{t.exportCsv}</button>
}

function SearchBox({ value, onChange, t }) {
  return (
    <div className="card search-card">
      <Search size={18}/>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={t.searchPlaceholder}/>
    </div>
  )
}

function TabBar({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="tabs-bar">
      {tabs.map(tab => (
        <button key={tab.key} className={activeTab === tab.key ? 'active' : ''} onClick={() => setActiveTab(tab.key)} type="button">
          {tab.label}
        </button>
      ))}
    </div>
  )
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
  const [loginBranch, setLoginBranch] = useState(localStorage.getItem('gymzaman_login_branch') || LOGIN_BRANCH_OPTIONS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true); setError('')
    localStorage.setItem('gymzaman_login_branch', loginBranch)
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
          <label>{t.selectBranch}</label><select value={loginBranch} onChange={e=>setLoginBranch(e.target.value)}>{LOGIN_BRANCH_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}</select>
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
  const isControlAdmin = ['owner','fitness_director'].includes(profile?.role)
  const navItems = [
    { key: 'overview', label: t.dashboard, icon: <ShieldCheck size={18}/> },
    { key: 'addClient', label: t.addClientPage || t.clients, icon: <Users size={18}/> },
    { key: 'trainerData', label: t.tabTrainerData, icon: <Dumbbell size={18}/>, roles: ['owner','fitness_director','senior','head_coach'] },
    { key: 'attendancePage', label: t.attendancePage, icon: <CalendarDays size={18}/> },
    { key: 'shifts', label: t.shiftPlanner, icon: <CalendarDays size={18}/>, roles: ['owner','fitness_director'] },
    { key: 'requests', label: t.requests, icon: <ClipboardList size={18}/> },
    { key: 'targetPlan', label: t.targetPlan, icon: <ClipboardList size={18}/> },
    { key: 'tasks', label: t.trainerTasks, icon: <UserCog size={18}/> },
    { key: 'reports', label: t.tabReports, icon: <ClipboardList size={18}/> },
    { key: 'reception', label: t.reception, icon: <Users size={18}/>, roles: ['owner','fitness_director','reception'] },
    { key: 'sales', label: t.sales, icon: <PlusCircle size={18}/>, roles: ['owner','fitness_director','sales'] },
    { key: 'staff', label: t.staffManagement, icon: <UserCog size={18}/>, roles: ['owner','fitness_director'] }
  ].filter(item => !item.roles || item.roles.includes(profile?.role)).filter(item => !(['reception','sales'].includes(profile?.role) && !['overview', profile.role].includes(item.key)))
  const navigate = key => window.dispatchEvent(new CustomEvent('gymzaman:navigate', { detail: key }))
  return (
    <div className="app" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <aside>
        <div className="side-brand"><div className="brand-mark small">GZ</div><div><h3>Gym Zaman</h3><p>{roleLabel}</p></div></div>
        <nav className="side-nav">{navItems.map(item => <button key={item.key} type="button" onClick={() => navigate(item.key)}>{item.icon}{item.label}</button>)}</nav>
        <LanguageButton lang={lang} setLang={setLang}/>
        <button className="logout" onClick={()=>supabase.auth.signOut()}><LogOut size={18}/>{t.logout}</button>
      </aside>
      <main><header><div><p className="muted">{t.loggedInAs}</p><h1>{profile.full_name}</h1></div><div className="pill"><UserRound size={16}/>{roleLabel}{profile?.branch_name ? ` • ${profile.branch_name}` : ''}</div></header>{children}</main>
    </div>
  )
}

function formatCell(value) {
  if (value === null || value === undefined || value === '') return '-'
  if (typeof value === 'boolean') return value ? 'yes' : 'no'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function Table({ title, rows, columns, canManage, canEdit, canDelete, onEdit, onDelete, t }) {
  const showEdit = canEdit ?? canManage
  const showDelete = canDelete ?? canManage
  const showControl = showEdit || showDelete
  return <div className="card"><h3>{title}</h3>{rows.length === 0 ? <p className="muted">{t.noData}</p> :
    <div className="table-wrap"><table><thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}{showControl && <th>{t.control}</th>}</tr></thead>
      <tbody>{rows.map((r,i)=><tr key={r.id || i}>{columns.map(c=><td key={c.key}>{formatCell(r[c.key])}</td>)}{showControl && <td><div className="row-actions">{showEdit && <button className="small-action edit" onClick={()=>onEdit(r)}><Pencil size={14}/>{t.edit}</button>}{showDelete && <button className="small-action delete" onClick={()=>onDelete(r)}><Trash2 size={14}/>{t.delete}</button>}</div></td>}</tr>)}</tbody>
    </table></div>}
  </div>
}

function Modal({ title, children, onClose }) {
  return <div className="modal-backdrop"><div className="modal-card wide"><div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose}><X size={18}/></button></div>{children}</div></div>
}

function EditForm({ type, row, onClose, onSaved, lang }) {
  const t = TEXT[lang]
  const defaults = type === 'attendance' ? {
    attendance_date: row.attendance_date || new Date().toISOString().slice(0,10), shift: row.shift || 'PM', expected_in: row.expected_in || '15:00', expected_out: row.expected_out || '23:00', check_in: row.check_in || '15:00', check_out: row.check_out || '23:00', notes: row.notes || ''
  } : type === 'client' ? {
    full_name: row.full_name || '', phone: row.phone || '', goal: row.goal || '', level: row.level || 'beginner', status: row.status || 'active', last_contact_date: row.last_contact_date || '', next_followup_date: row.next_followup_date || '', need_director_support: row.need_director_support ? 'yes' : 'no', followup_notes: row.followup_notes || ''
  } : type === 'log' ? {
    log_date: row.log_date || new Date().toISOString().slice(0,10), shift: row.shift || 'PM', check_in: row.check_in || '15:00', check_out: row.check_out || '23:00',
    rotation_count: row.rotation_count || 0, new_clients_count: row.new_clients_count || 0, pt_sessions_count: row.pt_sessions_count || 0, free_service_count: row.free_service_count || 0, notes: row.notes || ''
  } : {
    program_name: row.program_name || '', goal: row.goal || '', duration_weeks: row.duration_weeks || 4, exercises: row.exercises || '', notes: row.notes || '', status: row.status || 'active'
  }
  const [form, setForm] = useState(defaults)
  const [message, setMessage] = useState('')
  const table = type === 'attendance' ? 'attendance_logs' : type === 'client' ? 'clients' : type === 'log' ? 'trainer_daily_logs' : 'pt_programs'
  function f(k,v){setForm(p=>({...p,[k]:v}))}
  async function submit(e){
    e.preventDefault()
    const payload = {...form}
    if (type === 'client') {
      payload.need_director_support = form.need_director_support === 'yes'
      payload.last_contact_date = form.last_contact_date || null
      payload.next_followup_date = form.next_followup_date || null
    }
    if (type === 'attendance') { const calc = calculateLateAndOvertime(form.check_in, form.check_out, form.expected_in, form.expected_out); payload.late_minutes = calc.late; payload.overtime_minutes = calc.overtime }
    ;['rotation_count','new_clients_count','pt_sessions_count','free_service_count','duration_weeks'].forEach(k=>{ if(payload[k] !== undefined) payload[k] = Number(payload[k] || 0) })
    const { error } = await supabase.from(table).update(payload).eq('id', row.id)
    if(error) setMessage(error.message); else { onSaved(); onClose() }
  }
  return <Modal title={`${t.edit} ${type}`} onClose={onClose}><form className="grid-form simple-form" onSubmit={submit}>
    {type==='attendance' && <><div><label>{t.date}</label><input type="date" value={form.attendance_date} onChange={e=>f('attendance_date',e.target.value)}/></div><div><label>{t.shift}</label><select value={form.shift} onChange={e=>f('shift',e.target.value)}><option>AM</option><option>PM</option></select></div><div><label>{t.expectedIn}</label><input type="time" value={form.expected_in} onChange={e=>f('expected_in',e.target.value)}/></div><div><label>{t.expectedOut}</label><input type="time" value={form.expected_out} onChange={e=>f('expected_out',e.target.value)}/></div><div><label>{t.checkIn}</label><input type="time" value={form.check_in} onChange={e=>f('check_in',e.target.value)}/></div><div><label>{t.checkOut}</label><input type="time" value={form.check_out} onChange={e=>f('check_out',e.target.value)}/></div><div className="full"><label>{t.notes}</label><textarea value={form.notes} onChange={e=>f('notes',e.target.value)}/></div></>}
    {type==='client' && <>
      <div><label>{t.clientName}</label><input value={form.full_name} onChange={e=>f('full_name',e.target.value)}/></div>
      <div><label>{t.phone}</label><input value={form.phone} onChange={e=>f('phone',e.target.value)}/></div>
      <div><label>{t.goal}</label><input value={form.goal} onChange={e=>f('goal',e.target.value)}/></div>
      <div><label>{t.level}</label><select value={form.level} onChange={e=>f('level',e.target.value)}><option>beginner</option><option>intermediate</option><option>advanced</option></select></div>
      <div><label>{t.status}</label><select value={form.status} onChange={e=>f('status',e.target.value)}><option>active</option><option>follow_up</option><option>need_support</option><option>inactive</option></select></div>
      <div><label>{t.lastContactDate}</label><input type="date" value={form.last_contact_date} onChange={e=>f('last_contact_date',e.target.value)}/></div>
      <div><label>{t.nextFollowupDate}</label><input type="date" value={form.next_followup_date} onChange={e=>f('next_followup_date',e.target.value)}/></div>
      <div><label>{t.needDirectorSupport}</label><select value={form.need_director_support} onChange={e=>f('need_director_support',e.target.value)}><option value="no">no</option><option value="yes">yes</option></select></div>
      <div className="full"><label>{t.followupNotes}</label><textarea value={form.followup_notes} onChange={e=>f('followup_notes',e.target.value)}/></div>
    </>}
    {type==='log' && <><div><label>{t.date}</label><input type="date" value={form.log_date} onChange={e=>f('log_date',e.target.value)}/></div><div><label>{t.shift}</label><select value={form.shift} onChange={e=>f('shift',e.target.value)}><option>AM</option><option>PM</option></select></div><div><label>{t.checkIn}</label><input type="time" value={form.check_in} onChange={e=>f('check_in',e.target.value)}/></div><div><label>{t.checkOut}</label><input type="time" value={form.check_out} onChange={e=>f('check_out',e.target.value)}/></div><div><label>{t.rotation}</label><input type="number" value={form.rotation_count} onChange={e=>f('rotation_count',e.target.value)}/></div><div><label>{t.newClients}</label><input type="number" value={form.new_clients_count} onChange={e=>f('new_clients_count',e.target.value)}/></div><div><label>{t.ptSessions}</label><input type="number" value={form.pt_sessions_count} onChange={e=>f('pt_sessions_count',e.target.value)}/></div><div><label>{t.freeService}</label><input type="number" value={form.free_service_count} onChange={e=>f('free_service_count',e.target.value)}/></div><div className="full"><label>{t.notes}</label><textarea value={form.notes} onChange={e=>f('notes',e.target.value)}/></div></>}
    {type==='program' && <><div><label>{t.programName}</label><input value={form.program_name} onChange={e=>f('program_name',e.target.value)}/></div><div><label>{t.goal}</label><input value={form.goal} onChange={e=>f('goal',e.target.value)}/></div><div><label>{t.duration}</label><input type="number" value={form.duration_weeks} onChange={e=>f('duration_weeks',e.target.value)}/></div><div><label>{t.status}</label><select value={form.status} onChange={e=>f('status',e.target.value)}><option>active</option><option>inactive</option></select></div><div className="full"><label>{t.exercises}</label><textarea value={form.exercises} onChange={e=>f('exercises',e.target.value)}/></div><div className="full"><label>{t.notes}</label><textarea value={form.notes} onChange={e=>f('notes',e.target.value)}/></div></>}
    {message && <div className="error full">{message}</div>}<button>{t.save}</button></form></Modal>
}

function AddClientForm({ profile, branches, onSaved, lang }) {
  const t=TEXT[lang]
  const today = new Date().toISOString().slice(0,10)
  const clientInitial={
    full_name:'', phone:'', age:'', height_cm:'', weight_kg:'', emergency_contact:'',
    goal:'Hypertrophy', level:'beginner', status:'active',
    last_contact_date:today, next_followup_date:'', need_director_support:'no', followup_notes:'',
    medical_history:'', current_pain:'', medications:'',
    chest_pain:'no', dizziness:'no', heart_condition:'no', blood_pressure_issue:'no', bone_joint_issue:'no', doctor_restriction:'no', other_medical:'no',
    blood_pressure:'', resting_hr:'', pushup_test:'', plank_test:'', squat_test:'', flexibility_test:'', cardio_test:'', posture_notes:'',
    program_name:'Foundation PT Program', duration_weeks:4, exercises:'', program_notes:''
  }
  const [form,setForm,draftSaved,clearDraft]=useAutoSavedForm(`gymzaman_draft_client_${profile.id}`, clientInitial)
  const [msg,setMsg]=useState('')
  function f(k,v){setForm(p=>({...p,[k]:v}))}
  const parqAnswers = ['chest_pain','dizziness','heart_condition','blood_pressure_issue','bone_joint_issue','doctor_restriction','other_medical']
  const needsReview = parqAnswers.some(k => form[k] === 'yes')
  async function submit(e){
    e.preventDefault()
    const parq7 = {
      chest_pain: form.chest_pain, dizziness: form.dizziness, heart_condition: form.heart_condition,
      blood_pressure_issue: form.blood_pressure_issue, bone_joint_issue: form.bone_joint_issue,
      doctor_restriction: form.doctor_restriction, other_medical: form.other_medical,
      clearance_status: needsReview ? 'review' : 'clear', completed_at: new Date().toISOString()
    }
    const fitness_test = {
      blood_pressure: form.blood_pressure, resting_hr: form.resting_hr, pushup_test: form.pushup_test,
      plank_test: form.plank_test, squat_test: form.squat_test, flexibility_test: form.flexibility_test,
      cardio_test: form.cardio_test, posture_notes: form.posture_notes, completed_at: new Date().toISOString()
    }
    const payload = {
      full_name:form.full_name, phone:form.phone, goal:form.goal, level:form.level, status:form.status,
      branch_id:profile.branch_id||branches[0]?.id, assigned_trainer_id:profile.role==='trainer'?profile.id:null, created_by:profile.id,
      age: form.age ? Number(form.age) : null, height_cm: form.height_cm ? Number(form.height_cm) : null, weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      emergency_contact: form.emergency_contact, medical_history: form.medical_history, current_pain: form.current_pain, medications: form.medications,
      parq7, fitness_test,
      last_contact_date: form.last_contact_date || null, next_followup_date: form.next_followup_date || null,
      need_director_support: form.need_director_support === 'yes' || needsReview, followup_notes: form.followup_notes
    }
    const {data,error}=await supabase.from('clients').insert(payload).select('id').single()
    if(error){ setMsg(error.message); return }
    if(form.exercises || form.program_name){
      await supabase.from('pt_programs').insert({
        client_id: data.id, trainer_id: profile.id, branch_id: profile.branch_id || branches[0]?.id,
        program_name: form.program_name || 'PT Program', goal: form.goal, duration_weeks: Number(form.duration_weeks || 4),
        exercises: form.exercises, notes: form.program_notes, status: 'active'
      })
    }
    await logAudit(profile.id, 'insert', 'client_file', data?.id, { client: form.full_name, parq_clearance: parq7.clearance_status })
    setMsg(t.clientSaved)
    clearDraft(clientInitial)
    onSaved()
  }
  const yesNo = <><option value="no">no</option><option value="yes">yes</option></>
  return <div className="card compact-card client-intake-card"><h3><PlusCircle size={18}/>{t.addClientPage}</h3><form className="grid-form simple-form" onSubmit={submit}>
    <div className="section-title full">{t.clientProfile}</div>
    <div><label>{t.clientName}</label><input required value={form.full_name} onChange={e=>f('full_name',e.target.value)}/></div>
    <div><label>{t.phone}</label><input value={form.phone} onChange={e=>f('phone',e.target.value)}/></div>
    <div><label>{t.age}</label><input type="number" value={form.age} onChange={e=>f('age',e.target.value)}/></div>
    <div><label>{t.heightCm}</label><input type="number" value={form.height_cm} onChange={e=>f('height_cm',e.target.value)}/></div>
    <div><label>{t.weightKg}</label><input type="number" value={form.weight_kg} onChange={e=>f('weight_kg',e.target.value)}/></div>
    <div><label>{t.emergencyContact}</label><input value={form.emergency_contact} onChange={e=>f('emergency_contact',e.target.value)}/></div>
    <div><label>{t.goal}</label><input value={form.goal} onChange={e=>f('goal',e.target.value)}/></div>
    <div><label>{t.level}</label><select value={form.level} onChange={e=>f('level',e.target.value)}><option>beginner</option><option>intermediate</option><option>advanced</option></select></div>
    <div><label>{t.status}</label><select value={form.status} onChange={e=>f('status',e.target.value)}><option>active</option><option>follow_up</option><option>need_support</option><option>inactive</option></select></div>
    <div><label>{t.lastContactDate}</label><input type="date" value={form.last_contact_date} onChange={e=>f('last_contact_date',e.target.value)}/></div>
    <div><label>{t.nextFollowupDate}</label><input type="date" value={form.next_followup_date} onChange={e=>f('next_followup_date',e.target.value)}/></div>
    <div><label>{t.needDirectorSupport}</label><select value={form.need_director_support} onChange={e=>f('need_director_support',e.target.value)}><option value="no">no</option><option value="yes">yes</option></select></div>
    <div className="full"><label>{t.medicalHistory}</label><textarea value={form.medical_history} onChange={e=>f('medical_history',e.target.value)}/></div>
    <div><label>{t.currentPain}</label><input value={form.current_pain} onChange={e=>f('current_pain',e.target.value)}/></div>
    <div><label>{t.medications}</label><input value={form.medications} onChange={e=>f('medications',e.target.value)}/></div>

    <div className="section-title full">{t.parq7}</div>
    <div><label>{t.chestPain}</label><select value={form.chest_pain} onChange={e=>f('chest_pain',e.target.value)}>{yesNo}</select></div>
    <div><label>{t.dizziness}</label><select value={form.dizziness} onChange={e=>f('dizziness',e.target.value)}>{yesNo}</select></div>
    <div><label>{t.heartCondition}</label><select value={form.heart_condition} onChange={e=>f('heart_condition',e.target.value)}>{yesNo}</select></div>
    <div><label>{t.bloodPressureIssue}</label><select value={form.blood_pressure_issue} onChange={e=>f('blood_pressure_issue',e.target.value)}>{yesNo}</select></div>
    <div><label>{t.boneJointIssue}</label><select value={form.bone_joint_issue} onChange={e=>f('bone_joint_issue',e.target.value)}>{yesNo}</select></div>
    <div><label>{t.doctorRestriction}</label><select value={form.doctor_restriction} onChange={e=>f('doctor_restriction',e.target.value)}>{yesNo}</select></div>
    <div><label>{t.otherMedical}</label><select value={form.other_medical} onChange={e=>f('other_medical',e.target.value)}>{yesNo}</select></div>
    <div className={needsReview ? 'error full' : 'success full'}>{t.clearanceStatus}: {needsReview ? t.clearanceReview : t.clearanceOk}</div>

    <div className="section-title full">{t.fitnessTest}</div>
    <div><label>{t.bloodPressure}</label><input value={form.blood_pressure} onChange={e=>f('blood_pressure',e.target.value)} placeholder="120/80"/></div>
    <div><label>{t.restingHr}</label><input value={form.resting_hr} onChange={e=>f('resting_hr',e.target.value)} placeholder="72 bpm"/></div>
    <div><label>{t.pushupTest}</label><input value={form.pushup_test} onChange={e=>f('pushup_test',e.target.value)} placeholder="reps"/></div>
    <div><label>{t.plankTest}</label><input value={form.plank_test} onChange={e=>f('plank_test',e.target.value)} placeholder="seconds"/></div>
    <div><label>{t.squatTest}</label><input value={form.squat_test} onChange={e=>f('squat_test',e.target.value)} placeholder="reps / notes"/></div>
    <div><label>{t.flexibilityTest}</label><input value={form.flexibility_test} onChange={e=>f('flexibility_test',e.target.value)} /></div>
    <div><label>{t.cardioTest}</label><input value={form.cardio_test} onChange={e=>f('cardio_test',e.target.value)} /></div>
    <div className="full"><label>{t.postureNotes}</label><textarea value={form.posture_notes} onChange={e=>f('posture_notes',e.target.value)}/></div>

    <div className="section-title full">{t.ptProgramFile}</div>
    <div><label>{t.programName}</label><input value={form.program_name} onChange={e=>f('program_name',e.target.value)}/></div>
    <div><label>{t.duration}</label><input type="number" value={form.duration_weeks} onChange={e=>f('duration_weeks',e.target.value)}/></div>
    <div className="full"><label>{t.exercises}</label><textarea value={form.exercises} onChange={e=>f('exercises',e.target.value)} placeholder={'Day 1: Push\nDay 2: Pull\nDay 3: Legs'}/></div>
    <div className="full"><label>{t.notes}</label><textarea value={form.program_notes} onChange={e=>f('program_notes',e.target.value)}/></div>
    <div className="full"><label>{t.followupNotes}</label><textarea value={form.followup_notes} onChange={e=>f('followup_notes',e.target.value)}/></div>
    {draftSaved && <div className="draft-hint full"><Save size={14}/>{t.autoSavedDraft}</div>}{msg && <div className="success full">{msg}</div>}<button>{t.saveClient}</button>
  </form></div>
}

function DailyLogForm({ profile, onSaved, lang }) {
  const t=TEXT[lang], today=new Date().toISOString().slice(0,10); const logInitial={log_date:today,shift:'PM',check_in:'15:00',check_out:'23:00',rotation_count:0,new_clients_count:0,pt_sessions_count:0,free_service_count:0,notes:''}; const [form,setForm,draftSaved,clearDraft]=useAutoSavedForm(`gymzaman_draft_log_${profile.id}`, logInitial); const [msg,setMsg]=useState('')
  function f(k,v){setForm(p=>({...p,[k]:v}))}
  async function submit(e){e.preventDefault(); const payload={...form,trainer_id:profile.id,branch_id:profile.branch_id,rotation_count:Number(form.rotation_count||0),new_clients_count:Number(form.new_clients_count||0),pt_sessions_count:Number(form.pt_sessions_count||0),free_service_count:Number(form.free_service_count||0)}; const {error}=await supabase.from('trainer_daily_logs').insert(payload); if(error)setMsg(error.message); else{await logAudit(profile.id, 'insert', 'trainer_daily_log', null, { date: form.log_date, pt: payload.pt_sessions_count, free: payload.free_service_count }); setMsg(t.logSaved);clearDraft(logInitial);onSaved()}}
  return <div className="card compact-card"><h3><PlusCircle size={18}/>{t.addLog}</h3><form className="grid-form simple-form" onSubmit={submit}><div><label>{t.date}</label><input type="date" value={form.log_date} onChange={e=>f('log_date',e.target.value)}/></div><div><label>{t.shift}</label><select value={form.shift} onChange={e=>f('shift',e.target.value)}><option>AM</option><option>PM</option></select></div><div><label>{t.checkIn}</label><input type="time" value={form.check_in} onChange={e=>f('check_in',e.target.value)}/></div><div><label>{t.checkOut}</label><input type="time" value={form.check_out} onChange={e=>f('check_out',e.target.value)}/></div><div><label>{t.rotation}</label><input type="number" value={form.rotation_count} onChange={e=>f('rotation_count',e.target.value)}/></div><div><label>{t.newClients}</label><input type="number" value={form.new_clients_count} onChange={e=>f('new_clients_count',e.target.value)}/></div><div><label>{t.ptSessions}</label><input type="number" value={form.pt_sessions_count} onChange={e=>f('pt_sessions_count',e.target.value)}/></div><div><label>{t.freeService}</label><input type="number" value={form.free_service_count} onChange={e=>f('free_service_count',e.target.value)}/></div><div className="full"><label>{t.notes}</label><textarea value={form.notes} onChange={e=>f('notes',e.target.value)}/></div>{draftSaved && <div className="draft-hint full"><Save size={14}/>{t.autoSavedDraft}</div>}{msg && <div className="success full">{msg}</div>}<button>{t.saveLog}</button></form></div>
}

function PTProgramForm({ profile, clients, onSaved, lang }) {
  const t=TEXT[lang]; const programInitial={client_id:'',program_name:'Hypertrophy Program',goal:'Hypertrophy',duration_weeks:4,exercises:'',notes:''}; const [form,setForm,draftSaved,clearDraft]=useAutoSavedForm(`gymzaman_draft_program_${profile.id}`, programInitial); const [msg,setMsg]=useState('')
  function f(k,v){setForm(p=>({...p,[k]:v}))}
  async function submit(e){e.preventDefault(); const client=clients.find(c=>c.id===form.client_id); const payload={...form,duration_weeks:Number(form.duration_weeks||0),trainer_id:profile.id,branch_id:profile.branch_id||client?.branch_id,status:'active',created_by:profile.id}; const {error}=await supabase.from('pt_programs').insert(payload); if(error)setMsg(error.message); else{await logAudit(profile.id, 'insert', 'pt_program', null, { client_id: form.client_id, program: form.program_name }); setMsg(t.programSaved);clearDraft(programInitial);onSaved()}}
  return <div className="card compact-card"><h3><PlusCircle size={18}/>{t.addProgram}</h3><form className="grid-form simple-form" onSubmit={submit}><div><label>{t.selectClient}</label><select required value={form.client_id} onChange={e=>f('client_id',e.target.value)}><option value="">---</option>{clients.map(c=><option key={c.id} value={c.id}>{c.full_name}</option>)}</select></div><div><label>{t.programName}</label><input value={form.program_name} onChange={e=>f('program_name',e.target.value)}/></div><div><label>{t.goal}</label><input value={form.goal} onChange={e=>f('goal',e.target.value)}/></div><div><label>{t.duration}</label><input type="number" value={form.duration_weeks} onChange={e=>f('duration_weeks',e.target.value)}/></div><div className="full"><label>{t.exercises}</label><textarea value={form.exercises} onChange={e=>f('exercises',e.target.value)} placeholder={'Day 1: Chest + Triceps\nDay 2: Back + Biceps'}/></div><div className="full"><label>{t.notes}</label><textarea value={form.notes} onChange={e=>f('notes',e.target.value)}/></div>{draftSaved && <div className="draft-hint full"><Save size={14}/>{t.autoSavedDraft}</div>}{msg && <div className="success full">{msg}</div>}<button>{t.saveProgram}</button></form></div>
}


function SeniorDailyReportForm({ profile, onSaved, lang }) {
  const t = TEXT[lang]
  const today = new Date().toISOString().slice(0,10)
  const seniorReportInitial = {
    report_date: today,
    branch_pressure: '',
    total_sessions_done: 0,
    free_service_count: 0,
    floor_tasks: '',
    service_notes: '',
    coach_commitment_notes: '',
    client_issues: '',
    actions_taken: '',
    problem_description: '',
    resolved: 'no',
    notes: ''
  }
  const [form, setForm, draftSaved, clearDraft] = useAutoSavedForm(`gymzaman_draft_senior_report_${profile.id}`, seniorReportInitial)
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
      total_sessions_done: Number(form.total_sessions_done || 0),
      free_service_count: Number(form.free_service_count || 0),
      floor_tasks: form.floor_tasks,
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
      clearDraft(seniorReportInitial)
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
          <label>{t.totalSessionsDone}</label>
          <input type="number" min="0" value={form.total_sessions_done} onChange={e => f('total_sessions_done', e.target.value)} />
        </div>

        <div>
          <label>{t.freeService}</label>
          <input type="number" min="0" value={form.free_service_count} onChange={e => f('free_service_count', e.target.value)} />
        </div>

        <div>
          <label>{t.resolved}</label>
          <select value={form.resolved} onChange={e => f('resolved', e.target.value)}>
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>

        <div className="full">
          <label>{t.floorTasks}</label>
          <textarea value={form.floor_tasks} onChange={e => f('floor_tasks', e.target.value)} placeholder="Floor tasks, follow-up, service support..." />
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

        {draftSaved && <div className="draft-hint full"><Save size={14}/>{t.autoSavedDraft}</div>}
        {msg && <div className={msg.includes('success') || msg.includes('بنجاح') ? 'success full' : 'error full'}>{msg}</div>}
        <button>{t.saveSeniorReport}</button>
      </form>
    </div>
  )
}


function ClientFilePanel({ client, programs, trainerName, t }) {
  if (!client) return <div className="card"><h3>{t.clientFile}</h3><p className="muted">{t.selectClientFile}</p></div>
  const parq = client.parq7 || {}
  const fit = client.fitness_test || {}
  const clientPrograms = programs.filter(p => p.client_id === client.id)
  const infoRows = [
    [t.clientName, client.full_name], [t.phone, client.phone], [t.age, client.age], [t.heightCm, client.height_cm], [t.weightKg, client.weight_kg],
    [t.goal, client.goal], [t.level, client.level], [t.status, client.status], [t.trainer, trainerName || '-'], [t.emergencyContact, client.emergency_contact],
    [t.medicalHistory, client.medical_history], [t.currentPain, client.current_pain], [t.medications, client.medications]
  ]
  const parqRows = [
    [t.chestPain, parq.chest_pain], [t.dizziness, parq.dizziness], [t.heartCondition, parq.heart_condition],
    [t.bloodPressureIssue, parq.blood_pressure_issue], [t.boneJointIssue, parq.bone_joint_issue], [t.doctorRestriction, parq.doctor_restriction],
    [t.otherMedical, parq.other_medical], [t.clearanceStatus, parq.clearance_status === 'review' ? t.clearanceReview : t.clearanceOk]
  ]
  const fitRows = [
    [t.bloodPressure, fit.blood_pressure], [t.restingHr, fit.resting_hr], [t.pushupTest, fit.pushup_test], [t.plankTest, fit.plank_test],
    [t.squatTest, fit.squat_test], [t.flexibilityTest, fit.flexibility_test], [t.cardioTest, fit.cardio_test], [t.postureNotes, fit.posture_notes]
  ]
  const MiniTable = ({title, rows}) => <div className="mini-section"><h4>{title}</h4><div className="table-wrap"><table><tbody>{rows.map(([k,v],i)=><tr key={i}><th>{k}</th><td>{String(v ?? '-')}</td></tr>)}</tbody></table></div></div>
  return <div className="card client-file-card"><h3><UserRound size={18}/>{t.clientFile}: {client.full_name}</h3>
    <div className="client-file-grid"><MiniTable title={t.clientProfile} rows={infoRows}/><MiniTable title={t.parq7} rows={parqRows}/><MiniTable title={t.fitnessTest} rows={fitRows}/></div>
    <h4>{t.latestPtPrograms}</h4>
    {clientPrograms.length === 0 ? <p className="muted">{t.noData}</p> : <div className="table-wrap"><table><thead><tr><th>{t.programName}</th><th>{t.goal}</th><th>{t.duration}</th><th>{t.exercises}</th><th>{t.notes}</th></tr></thead><tbody>{clientPrograms.map(p => <tr key={p.id}><td>{p.program_name}</td><td>{p.goal}</td><td>{p.duration_weeks}</td><td>{p.exercises}</td><td>{p.notes}</td></tr>)}</tbody></table></div>}
  </div>
}

function TrainerFilter({ trainers, selectedTrainerId, setSelectedTrainerId, t }) {
  return <div className="card filter-card"><h3><Search size={18}/>{t.filterByTrainer}</h3><select value={selectedTrainerId} onChange={e=>setSelectedTrainerId(e.target.value)}><option value="all">{t.allTrainers}</option>{trainers.map(tr=><option key={tr.id} value={tr.id}>{displayCoachName(tr)}</option>)}</select></div>
}

function StaffManagement({ staff, branches, onSaved, t, currentProfile }) {
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
      await logAudit(currentProfile?.id, 'update', 'profile', row.id, { email: row.email, role: row.role, branch_id: row.branch_id, status: row.status })
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




function minutesFromTime(timeValue) {
  if (!timeValue) return 0
  const [h, m] = String(timeValue).split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

function calculateLateAndOvertime(checkIn, checkOut, expectedIn, expectedOut) {
  const late = Math.max(0, minutesFromTime(checkIn) - minutesFromTime(expectedIn))
  const overtime = Math.max(0, minutesFromTime(checkOut) - minutesFromTime(expectedOut))
  return { late, overtime }
}

function gradeFromScore(score, t) {
  if (score >= 85) return t.excellent
  if (score >= 70) return t.good
  return t.needsImprovement
}

function recommendationFromScore(score) {
  if (score >= 85) return 'Maintain performance and consider leadership tasks'
  if (score >= 70) return 'Good level, follow up small improvement points'
  return 'Needs improvement plan and close follow-up'
}

function AttendanceForm({ profile, onSaved, lang }) {
  const t = TEXT[lang]
  const today = new Date().toISOString().slice(0,10)
  const attendanceInitial = {
    attendance_date: today,
    shift: 'PM',
    expected_in: '15:00',
    expected_out: '23:00',
    check_in: '15:00',
    check_out: '23:00',
    notes: ''
  }
  const [form, setForm, draftSaved, clearDraft] = useAutoSavedForm(`gymzaman_draft_attendance_${profile.id}`, attendanceInitial)
  const [msg, setMsg] = useState('')

  function f(k, v) { setForm(p => ({ ...p, [k]: v })) }

  const calc = calculateLateAndOvertime(form.check_in, form.check_out, form.expected_in, form.expected_out)

  async function submit(e) {
    e.preventDefault()
    const payload = {
      trainer_id: profile.id,
      branch_id: profile.branch_id,
      attendance_date: form.attendance_date,
      shift: form.shift,
      expected_in: form.expected_in,
      expected_out: form.expected_out,
      check_in: form.check_in,
      check_out: form.check_out,
      late_minutes: calc.late,
      overtime_minutes: calc.overtime,
      notes: form.notes
    }
    const { error } = await supabase.from('attendance_logs').insert(payload)
    if (error) setMsg(error.message)
    else {
      setMsg(t.attendanceSaved)
      clearDraft(attendanceInitial)
      onSaved()
    }
  }

  return (
    <div className="card compact-card attendance-card">
      <h3><CalendarDays size={18}/>{t.addAttendance}</h3>
      <form className="grid-form simple-form" onSubmit={submit}>
        <div><label>{t.date}</label><input type="date" value={form.attendance_date} onChange={e=>f('attendance_date', e.target.value)} /></div>
        <div><label>{t.shift}</label><select value={form.shift} onChange={e=>f('shift', e.target.value)}><option>AM</option><option>PM</option></select></div>
        <div><label>{t.expectedIn}</label><input type="time" value={form.expected_in} onChange={e=>f('expected_in', e.target.value)} /></div>
        <div><label>{t.expectedOut}</label><input type="time" value={form.expected_out} onChange={e=>f('expected_out', e.target.value)} /></div>
        <div><label>{t.checkIn}</label><input type="time" value={form.check_in} onChange={e=>f('check_in', e.target.value)} /></div>
        <div><label>{t.checkOut}</label><input type="time" value={form.check_out} onChange={e=>f('check_out', e.target.value)} /></div>
        <div><label>{t.lateMinutes}</label><input value={calc.late} readOnly /></div>
        <div><label>{t.overtimeMinutes}</label><input value={calc.overtime} readOnly /></div>
        <div className="full"><label>{t.notes}</label><textarea value={form.notes} onChange={e=>f('notes', e.target.value)} /></div>
        {draftSaved && <div className="draft-hint full"><Save size={14}/>{t.autoSavedDraft}</div>}
        {msg && <div className={msg.includes('success') || msg.includes('بنجاح') ? 'success full' : 'error full'}>{msg}</div>}
        <button>{t.save}</button>
      </form>
    </div>
  )
}

function PerformanceDashboard({ staff, clients, logs, attendanceLogs, t }) {
  const activeCoaches = staff.filter(s => ['trainer','senior','head_coach'].includes(s.role) && s.status === 'active')
  const today = new Date().toISOString().slice(0,10)
  const todayReports = new Set(logs.filter(l => l.log_date === today).map(l => l.trainer_id))
  const noReport = activeCoaches.filter(c => !todayReports.has(c.id)).length

  const totalsByTrainer = activeCoaches.map(coach => {
    const coachLogs = logs.filter(l => l.trainer_id === coach.id)
    return {
      ...coach,
      totalPt: coachLogs.reduce((s, r) => s + Number(r.pt_sessions_count || 0), 0),
      totalFree: coachLogs.reduce((s, r) => s + Number(r.free_service_count || 0), 0),
      late: attendanceLogs.filter(a => a.trainer_id === coach.id).reduce((s, a) => s + Number(a.late_minutes || 0), 0)
    }
  })

  const topSessions = [...totalsByTrainer].sort((a,b) => b.totalPt - a.totalPt)[0]
  const topFree = [...totalsByTrainer].sort((a,b) => b.totalFree - a.totalFree)[0]

  return (
    <div className="card performance-card">
      <h3><ShieldCheck size={18}/>{t.performanceDashboard}</h3>
      <div className="profile-grid">
        <div><span>{t.activeCoaches}</span><b>{activeCoaches.length}</b></div>
        <div><span>{t.totalClients}</span><b>{clients.length}</b></div>
        <div><span>{t.trainersNoReport}</span><b>{noReport}</b></div>
        <div><span>{t.topBySessions}</span><b>{topSessions ? `${topSessions.full_name} (${topSessions.totalPt})` : '-'}</b></div>
        <div><span>{t.topByFreeService}</span><b>{topFree ? `${topFree.full_name} (${topFree.totalFree})` : '-'}</b></div>
      </div>
    </div>
  )
}


function HeadCoachDailyReportForm({ profile, onSaved, lang }) {
  const t = TEXT[lang]
  const today = new Date().toISOString().slice(0,10)
  const headReportInitial = {
    report_date: today,
    total_sessions_done: 0,
    free_service_count: 0,
    rotation_count: 0,
    trainer_issues: '',
    tasks_done: '',
    follow_ups: '',
    branch_summary: '',
    notes: ''
  }
  const [form, setForm, draftSaved, clearDraft] = useAutoSavedForm(`gymzaman_draft_head_report_${profile.id}`, headReportInitial)
  const [msg, setMsg] = useState('')

  function f(k,v){ setForm(p => ({...p, [k]: v})) }

  async function submit(e){
    e.preventDefault()
    const payload = {
      head_coach_id: profile.id,
      branch_id: profile.branch_id,
      report_date: form.report_date,
      total_sessions_done: Number(form.total_sessions_done || 0),
      free_service_count: Number(form.free_service_count || 0),
      rotation_count: Number(form.rotation_count || 0),
      trainer_issues: form.trainer_issues,
      tasks_done: form.tasks_done,
      follow_ups: form.follow_ups,
      branch_summary: form.branch_summary,
      notes: form.notes
    }
    const { error } = await supabase.from('head_coach_daily_reports').insert(payload)
    if (error) setMsg(error.message)
    else {
      setMsg(t.headCoachReportSaved)
      clearDraft(headReportInitial)
      onSaved()
    }
  }

  return (
    <div className="card compact-card head-report-card">
      <h3><ClipboardList size={18}/>{t.addHeadCoachReport}</h3>
      <form className="grid-form simple-form" onSubmit={submit}>
        <div>
          <label>{t.date}</label>
          <input type="date" value={form.report_date} onChange={e => f('report_date', e.target.value)} />
        </div>
        <div>
          <label>{t.totalSessionsDone}</label>
          <input type="number" min="0" value={form.total_sessions_done} onChange={e => f('total_sessions_done', e.target.value)} />
        </div>
        <div>
          <label>{t.freeService}</label>
          <input type="number" min="0" value={form.free_service_count} onChange={e => f('free_service_count', e.target.value)} />
        </div>
        <div>
          <label>{t.rotation}</label>
          <input type="number" min="0" value={form.rotation_count} onChange={e => f('rotation_count', e.target.value)} />
        </div>
        <div className="full">
          <label>{t.tasksDone}</label>
          <textarea value={form.tasks_done} onChange={e => f('tasks_done', e.target.value)} placeholder="Daily operational tasks completed..." />
        </div>
        <div className="full">
          <label>{t.followUps}</label>
          <textarea value={form.follow_ups} onChange={e => f('follow_ups', e.target.value)} placeholder="Coach follow-ups, member follow-ups, unresolved items..." />
        </div>
        <div className="full">
          <label>{t.trainerIssues}</label>
          <textarea value={form.trainer_issues} onChange={e => f('trainer_issues', e.target.value)} placeholder="Late attendance, floor weakness, service issue..." />
        </div>
        <div className="full">
          <label>{t.branchSummary}</label>
          <textarea value={form.branch_summary} onChange={e => f('branch_summary', e.target.value)} placeholder="Overall branch status today..." />
        </div>
        <div className="full">
          <label>{t.notes}</label>
          <textarea value={form.notes} onChange={e => f('notes', e.target.value)} />
        </div>
        {draftSaved && <div className="draft-hint full"><Save size={14}/>{t.autoSavedDraft}</div>}
        {msg && <div className={msg.includes('success') || msg.includes('بنجاح') ? 'success full' : 'error full'}>{msg}</div>}
        <button>{t.saveHeadCoachReport}</button>
      </form>
    </div>
  )
}



function calculateAutomaticTrainerScore(trainer, logs, attendanceLogs, evaluations, month = new Date().toISOString().slice(0,7)) {
  const monthLogs = logs.filter(l => l.trainer_id === trainer.id && monthOf(l.log_date) === month)
  const monthAttendance = attendanceLogs.filter(a => a.trainer_id === trainer.id && monthOf(a.attendance_date) === month)
  const monthEvaluations = evaluations.filter(e => e.trainer_id === trainer.id && monthOf(e.evaluation_date || e.created_at) === month)
  const totalPt = monthLogs.reduce((s, r) => s + Number(r.pt_sessions_count || 0), 0)
  const totalFree = monthLogs.reduce((s, r) => s + Number(r.free_service_count || 0), 0)
  const totalRotation = monthLogs.reduce((s, r) => s + Number(r.rotation_count || 0), 0)
  const lateMinutes = monthAttendance.reduce((s, r) => s + Number(r.late_minutes || 0), 0)
  const headCoachScores = monthEvaluations.map(e => (Number(e.technical_score||0)+Number(e.behavior_score||0)+Number(e.leadership_score||0)+Number(e.service_score||0))/4)
  const headCoachScore = headCoachScores.length ? avg(headCoachScores) : 80
  const activityScore = Math.min(100, Math.round((totalPt * 5) + (totalFree * 3) + (totalRotation * 2)))
  const attendanceScore = Math.max(0, Math.min(100, 100 - Math.round(lateMinutes / 5)))
  const reportingScore = Math.min(100, Math.round((monthLogs.length / 22) * 100))
  const automaticScore = Math.round((headCoachScore * 0.40) + (activityScore * 0.25) + (attendanceScore * 0.20) + (reportingScore * 0.15))
  return { automaticScore, activityScore, attendanceScore, reportingScore, headCoachScore, totalPt, totalFree, totalRotation, lateMinutes, totalLogs: monthLogs.length }
}

function TrainerProfilePanel({ trainer, branches, clients, logs, programs, attendanceLogs = [], evaluations, shifts = [], requests = [], targetPlans = [], tasks = [], t, showEmail = false, lang = 'ar' }) {
  if (!trainer) return null
  const branch = branches.find(b => b.id === trainer.branch_id)
  const trainerClients = clients.filter(c => c.assigned_trainer_id === trainer.id || c.created_by === trainer.id)
  const trainerLogs = logs.filter(l => l.trainer_id === trainer.id)
  const trainerPrograms = programs.filter(p => p.trainer_id === trainer.id)
  const trainerEvaluations = evaluations.filter(e => e.trainer_id === trainer.id)
  const trainerAttendance = attendanceLogs.filter(a => a.trainer_id === trainer.id)
  const trainerShifts = shifts.filter(s => s.trainer_id === trainer.id || s.coach_id === trainer.id)
  const trainerRequests = requests.filter(r => r.trainer_id === trainer.id || r.coach_id === trainer.id || r.requested_by === trainer.id)
  const trainerPlans = targetPlans.filter(p => p.trainer_id === trainer.id || p.coach_id === trainer.id)
  const trainerTaskRows = tasks.filter(task => task.trainer_id === trainer.id || task.coach_id === trainer.id)
  const auto = calculateAutomaticTrainerScore(trainer, logs, attendanceLogs, evaluations)
  const totalPt = trainerLogs.reduce((s, r) => s + Number(r.pt_sessions_count || 0), 0)
  const totalFree = trainerLogs.reduce((s, r) => s + Number(r.free_service_count || 0), 0)
  const totalRotation = trainerLogs.reduce((s, r) => s + Number(r.rotation_count || 0), 0)
  const month = thisMonthISO()
  const monthAttendance = trainerAttendance.filter(a => monthOf(a.attendance_date || a.work_date || a.created_at) === month)
  const monthRequests = trainerRequests.filter(r => monthOf(r.request_date || r.created_at) === month)
  const attendanceSummary = {
    late: monthAttendance.reduce((sum, r) => sum + Number(r.late_minutes || 0), 0),
    overtime: monthAttendance.reduce((sum, r) => sum + Number(r.overtime_minutes || 0), 0),
    permissions: monthRequests.filter(r => ['approved','accepted'].includes(r.status) && ['late_permission','permission','late'].includes(r.request_type)).reduce((sum, r) => sum + Number(r.requested_minutes || 0), 0),
    pending: monthRequests.filter(r => !r.status || r.status === 'pending').length
  }
  const latestShift = [...trainerShifts].sort((a,b)=>String(b.shift_date||b.created_at||'').localeCompare(String(a.shift_date||a.created_at||'')))[0]
  const currentPlan = trainerPlans.find(p => String(p.target_month || '').slice(0,7) === month) || trainerPlans[0]
  const openTasks = trainerTaskRows.filter(x => (x.status || 'pending') !== 'done').length
  const doneTasks = trainerTaskRows.filter(x => (x.status || '') === 'done').length
  return (
    <div className="card trainer-profile-card pro-trainer-file">
      <div className="trainer-file-header">
        <div>
          <h3><UserRound size={18}/>{t.coachFullFile || t.trainerProfile}</h3>
          <p className="muted">{t.professionalNote}</p>
        </div>
        <div className="file-badge">{displayCoachName(trainer)}</div>
      </div>
      <div className="summary-grid">
        <div><span>{t.fullName}</span><b>{getRowName(trainer)}</b></div>
        {showEmail && <div><span>{t.email}</span><b>{trainer.email || '-'}</b></div>}
        <div><span>{t.role}</span><b>{trainer.role || '-'}</b></div>
        <div><span>{t.branch}</span><b>{branch?.name || trainer.branch_name || '-'}</b></div>
        <div><span>{t.status}</span><b>{trainer.status || (trainer.active === false ? 'inactive' : 'active')}</b></div>
        <div><span>{t.autoEvaluation}</span><b>{auto.total}% • {gradeFromScore(auto.total, t)}</b></div>
      </div>
      <div className="summary-grid">
        <div><span>{t.clients}</span><b>{trainerClients.length}</b></div>
        <div><span>{t.programs}</span><b>{trainerPrograms.length}</b></div>
        <div><span>{t.totalLogs}</span><b>{trainerLogs.length}</b></div>
        <div><span>{t.ptSessions}</span><b>{totalPt}</b></div>
        <div><span>{t.freeService}</span><b>{totalFree}</b></div>
        <div><span>{t.rotation}</span><b>{totalRotation}</b></div>
      </div>
      <div className="summary-grid">
        <div><span>{t.shift}</span><b>{isShiftOffDay(latestShift, todayISO()) ? t.offDay : (latestShift?.shift || latestShift?.shift_name || '-')}</b></div>
        <div><span>{t.expectedIn}</span><b>{latestShift?.expected_in || latestShift?.start_time || '-'}</b></div>
        <div><span>{t.expectedOut}</span><b>{latestShift?.expected_out || latestShift?.end_time || '-'}</b></div>
        <div><span>{t.offDayWeekday}</span><b>{weekdayLabel(latestShift?.off_day_weekday, lang)}</b></div>
        <div><span>{t.totalDelayMinutes}</span><b>{attendanceSummary.late}</b></div>
        <div><span>{t.totalOvertimeMinutes}</span><b>{attendanceSummary.overtime}</b></div>
        <div><span>{t.totalPermissionMinutes}</span><b>{attendanceSummary.permissions}</b></div>
        <div><span>{t.pendingRequests}</span><b>{attendanceSummary.pending}</b></div>
        <div><span>{t.trainerTasks}</span><b>{openTasks} / {doneTasks}</b></div>
        <div><span>{t.targetPlan}</span><b>{currentPlan?.target_month || '-'}</b></div>
      </div>
      <Table title={t.shiftPlanner} rows={trainerShifts.slice(0, 12).map(s=>({...s, off_day_name: weekdayLabel(s.off_day_weekday, lang)}))} canManage={false} t={t} columns={[{key:'shift_date',label:t.date},{key:'shift',label:t.shift},{key:'expected_in',label:t.expectedIn},{key:'expected_out',label:t.expectedOut},{key:'is_off_day',label:t.offDay},{key:'off_day_name',label:t.offDayWeekday},{key:'notes',label:t.notes}]} />
      <Table title={t.requests} rows={trainerRequests.slice(0, 12)} canManage={false} t={t} columns={[{key:'request_date',label:t.date},{key:'request_type',label:t.requestType},{key:'requested_minutes',label:t.requestedMinutes},{key:'amount',label:t.amount},{key:'status',label:t.approvalStatus},{key:'reason',label:t.reason}]} />
      <Table title={t.trainerTasks} rows={trainerTaskRows.slice(0, 12)} canManage={false} t={t} columns={[{key:'task_title',label:t.taskTitle},{key:'due_date',label:t.dueDate},{key:'priority',label:t.priority},{key:'status',label:t.taskStatus},{key:'task_details',label:t.taskDetails}]} />
      <Table title={t.targetPlan} rows={trainerPlans.slice(0, 8)} canManage={false} t={t} columns={[{key:'target_month',label:t.targetMonth},{key:'monthly_target',label:t.monthlyTarget},{key:'current_achievement',label:t.currentAchievement},{key:'action_plan',label:t.actionPlan},{key:'support_needed',label:t.supportNeeded}]} />
      <Table title={t.clients} rows={trainerClients.slice(0, 10)} canManage={false} t={t} columns={[{key:'full_name',label:t.clientName},{key:'phone',label:t.phone},{key:'age',label:t.age},{key:'weight_kg',label:t.weightKg},{key:'goal',label:t.goal},{key:'status',label:t.status},{key:'next_followup_date',label:t.nextFollowupDate}]} />
      <Table title={t.attendance} rows={trainerAttendance.slice(0, 10)} canManage={false} t={t} columns={[{key:'attendance_date',label:t.date},{key:'shift',label:t.shift},{key:'check_in',label:t.checkIn},{key:'check_out',label:t.checkOut},{key:'late_minutes',label:t.lateMinutes},{key:'overtime_minutes',label:t.overtimeMinutes}]} />
      <Table title={t.logs} rows={trainerLogs.slice(0, 10)} canManage={false} t={t} columns={[{key:'log_date',label:t.date},{key:'shift',label:t.shift},{key:'rotation_count',label:t.rotation},{key:'pt_sessions_count',label:t.ptSessions},{key:'free_service_count',label:t.freeService},{key:'notes',label:t.notes}]} />
      <Table title={t.programs} rows={trainerPrograms.slice(0, 10)} canManage={false} t={t} columns={[{key:'program_name',label:t.programName},{key:'goal',label:t.goal},{key:'duration_weeks',label:t.duration},{key:'status',label:t.status}]} />
      <Table title={t.evaluationHistory} rows={trainerEvaluations.map(ev => { const score = Math.round((Number(ev.technical_score||0)+Number(ev.behavior_score||0)+Number(ev.leadership_score||0)+Number(ev.service_score||0))/4); return {...ev, final_score: score, grade: gradeFromScore(score, t)} }).slice(0,10)} canManage={false} t={t} columns={[{key:'evaluation_date',label:t.date},{key:'technical_score',label:t.technicalScore},{key:'behavior_score',label:t.behaviorScore},{key:'leadership_score',label:t.leadershipScore},{key:'service_score',label:t.serviceScore},{key:'final_score',label:t.finalScore},{key:'grade',label:t.grade},{key:'evaluator_notes',label:t.evaluatorNotes}]} />
    </div>
  )
}

function TrainerDirectory({ trainers, branches, selectedTrainerId, setSelectedTrainerId, t }) {
  const [branchFilter, setBranchFilter] = useState('all')
  const filtered = trainers.filter(tr => branchFilter === 'all' || tr.branch_id === branchFilter)
  return <div className="card trainer-directory">
    <div className="trainer-file-header"><h3><Users size={18}/>{t.trainerDirectory}</h3><select value={branchFilter} onChange={e=>setBranchFilter(e.target.value)}><option value="all">{t.allBranches}</option>{branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
    <div className="trainer-card-grid">{filtered.map(tr => <button key={tr.id} type="button" className={selectedTrainerId === tr.id ? 'trainer-mini-card active' : 'trainer-mini-card'} onClick={() => setSelectedTrainerId(tr.id)}>
      <b>{displayCoachName(tr)}</b><span>{tr.role || '-'}</span><small>{branches.find(b => b.id === tr.branch_id)?.name || tr.branch_name || '-'}</small><em>{t.openTrainerFile}</em>
    </button>)}</div>
  </div>
}

function CoachEvaluationForm({ profile, targetTrainerId, eligibleTrainers, onSaved, lang }) {
  const t = TEXT[lang]
  const evaluationInitial = {
    trainer_id: targetTrainerId || '',
    evaluation_date: new Date().toISOString().slice(0,10),
    technical_score: 80,
    behavior_score: 80,
    leadership_score: 80,
    service_score: 80,
    evaluator_notes: ''
  }
  const [form, setForm, draftSaved, clearDraft] = useAutoSavedForm(`gymzaman_draft_evaluation_${profile.id}_${targetTrainerId || 'new'}`, evaluationInitial)
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
    const { data, error } = await supabase.from('trainer_evaluations').insert(payload).select('id').single()
    if (error) setMsg(error.message)
    else {
      await logAudit(profile.id, 'insert', 'trainer_evaluation', data?.id, { trainer_id: form.trainer_id, score: Math.round((payload.technical_score+payload.behavior_score+payload.leadership_score+payload.service_score)/4) })
      setMsg(t.evaluationSaved)
      clearDraft(evaluationInitial)
      onSaved()
    }
  }

  const previewScore = Math.round((Number(form.technical_score||0)+Number(form.behavior_score||0)+Number(form.leadership_score||0)+Number(form.service_score||0))/4)

  return (
    <div className="card coach-eval-card">
      <h3><ClipboardList size={18}/>{t.coachEvaluation}</h3>
      <form className="grid-form simple-form" onSubmit={submit}>
        <div>
          <label>{t.trainerEmail}</label>
          <select value={form.trainer_id} onChange={e => f('trainer_id', e.target.value)} disabled={Boolean(targetTrainerId)}>
            <option value="">---</option>
            {eligibleTrainers.map(tr => <option key={tr.id} value={tr.id}>{displayCoachName(tr)}</option>)}
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
        <div className="score-preview">
          <span>{t.evaluationPreview}</span>
          <b>{previewScore}% — {gradeFromScore(previewScore, t)}</b>
        </div>
        <div className="full">
          <label>{t.evaluatorNotes}</label>
          <textarea value={form.evaluator_notes} onChange={e => f('evaluator_notes', e.target.value)} />
        </div>
        {draftSaved && <div className="draft-hint full"><Save size={14}/>{t.autoSavedDraft}</div>}
        {msg && <div className={msg.includes('success') || msg.includes('بنجاح') ? 'success full' : 'error full'}>{msg}</div>}
        <button>{t.saveEvaluation}</button>
      </form>
    </div>
  )
}


function monthOf(dateValue) {
  return String(dateValue || '').slice(0, 7)
}

function avg(values) {
  const nums = values.map(Number).filter(v => !Number.isNaN(v))
  if (!nums.length) return 0
  return Math.round(nums.reduce((a,b) => a + b, 0) / nums.length)
}

function AlertsPanel({ staff, logs, attendanceLogs, seniorReports, evaluations, t }) {
  const today = new Date().toISOString().slice(0,10)
  const activeCoaches = staff.filter(s => ['trainer','senior','head_coach'].includes(s.role) && s.status === 'active')
  const todayLogIds = new Set(logs.filter(l => l.log_date === today).map(l => l.trainer_id))
  const todayAttendance = attendanceLogs.filter(a => a.attendance_date === today)
  const alerts = []

  activeCoaches.forEach(coach => {
    if (!todayLogIds.has(coach.id)) alerts.push({ type: t.trainersNoReport, details: displayCoachName(coach) })
  })

  todayAttendance.filter(a => Number(a.late_minutes || 0) > 0).forEach(a => {
    const coach = staff.find(s => s.id === a.trainer_id)
    alerts.push({ type: t.lateMinutes, details: `${coach?.full_name || a.trainer_id}: ${a.late_minutes} min` })
  })

  seniorReports.filter(r => r.resolved === false).forEach(r => {
    const senior = staff.find(s => s.id === r.senior_id)
    alerts.push({ type: t.unresolvedProblems, details: `${senior?.full_name || '-'}: ${r.problem_description || r.client_issues || '-'}` })
  })

  evaluations.forEach(ev => {
    const score = Math.round((Number(ev.technical_score||0)+Number(ev.behavior_score||0)+Number(ev.leadership_score||0)+Number(ev.service_score||0))/4)
    if (score < 70) {
      const coach = staff.find(s => s.id === ev.trainer_id)
      alerts.push({ type: t.needsImprovement, details: `${coach?.full_name || '-'}: ${score}%` })
    }
  })

  return (
    <div className="card alerts-card">
      <h3><ShieldCheck size={18}/>{t.alerts}</h3>
      {alerts.length === 0 ? <p className="muted">{t.noAlerts}</p> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>{t.alertType}</th><th>{t.alertDetails}</th></tr></thead>
            <tbody>{alerts.slice(0, 20).map((a, i) => <tr key={i}><td>{a.type}</td><td>{a.details}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function BranchComparisonDashboard({ branches, staff, clients, logs, programs, attendanceLogs, seniorReports, headReports, t }) {
  const rows = branches.map(branch => {
    const branchStaff = staff.filter(s => s.branch_id === branch.id && ['trainer','senior','head_coach'].includes(s.role))
    const branchLogs = logs.filter(l => l.branch_id === branch.id)
    return {
      id: branch.id,
      branch_name: branch.name,
      active_coaches: branchStaff.filter(s => s.status === 'active').length,
      clients_count: clients.filter(c => c.branch_id === branch.id).length,
      logs_count: branchLogs.length,
      total_sessions: branchLogs.reduce((s,r)=>s+Number(r.pt_sessions_count||0),0),
      total_free: branchLogs.reduce((s,r)=>s+Number(r.free_service_count||0),0),
      total_rotation: branchLogs.reduce((s,r)=>s+Number(r.rotation_count||0),0),
      programs_count: programs.filter(p => p.branch_id === branch.id).length,
      late_minutes: attendanceLogs.filter(a => a.branch_id === branch.id).reduce((s,r)=>s+Number(r.late_minutes||0),0),
      unresolved: seniorReports.filter(r => r.branch_id === branch.id && r.resolved === false).length,
      head_reports: headReports.filter(r => r.branch_id === branch.id).length
    }
  })

  return (
    <div className="card branch-comparison-card">
      <h3><Users size={18}/>{t.branchComparison}</h3>
      <ExportButton rows={rows} filename="branch-comparison.csv" t={t}/>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>{t.branchName}</th><th>{t.activeCoaches}</th><th>{t.totalClients}</th><th>{t.totalLogs}</th><th>{t.ptSessions}</th><th>{t.totalFreeService}</th><th>{t.totalRotation}</th><th>{t.totalPrograms}</th><th>{t.totalLate}</th><th>{t.unresolvedProblems}</th><th>{t.headCoachReport}</th></tr>
          </thead>
          <tbody>
            {rows.map(r => <tr key={r.id}><td>{r.branch_name}</td><td>{r.active_coaches}</td><td>{r.clients_count}</td><td>{r.logs_count}</td><td>{r.total_sessions}</td><td>{r.total_free}</td><td>{r.total_rotation}</td><td>{r.programs_count}</td><td>{r.late_minutes}</td><td>{r.unresolved}</td><td>{r.head_reports}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MonthlyTrainerReport({ staff, clients, logs, programs, attendanceLogs, evaluations, t }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0,7))
  const coaches = staff.filter(s => ['trainer','senior','head_coach'].includes(s.role))
  const rows = coaches.map(coach => {
    const monthLogs = logs.filter(l => l.trainer_id === coach.id && monthOf(l.log_date) === selectedMonth)
    const monthAttendance = attendanceLogs.filter(a => a.trainer_id === coach.id && monthOf(a.attendance_date) === selectedMonth)
    const coachEvaluations = evaluations.filter(e => e.trainer_id === coach.id && monthOf(e.evaluation_date || e.created_at) === selectedMonth)
    const evalScores = coachEvaluations.map(e => (Number(e.technical_score||0)+Number(e.behavior_score||0)+Number(e.leadership_score||0)+Number(e.service_score||0))/4)
    const finalScore = avg(evalScores)
    return {
      id: coach.id,
      trainer_name: displayCoachName(coach),
      full_name: displayCoachName(coach),
      role: coach.role,
      clients_count: clients.filter(c => c.assigned_trainer_id === coach.id).length,
      programs_count: programs.filter(p => p.trainer_id === coach.id).length,
      total_logs: monthLogs.length,
      pt_sessions: monthLogs.reduce((s,r)=>s+Number(r.pt_sessions_count||0),0),
      free_service: monthLogs.reduce((s,r)=>s+Number(r.free_service_count||0),0),
      rotation: monthLogs.reduce((s,r)=>s+Number(r.rotation_count||0),0),
      late_minutes: monthAttendance.reduce((s,r)=>s+Number(r.late_minutes||0),0),
      overtime_minutes: monthAttendance.reduce((s,r)=>s+Number(r.overtime_minutes||0),0),
      avg_evaluation: finalScore,
      grade: finalScore ? gradeFromScore(finalScore, t) : '-'
    }
  })

  return (
    <div className="card monthly-report-card">
      <h3><ClipboardList size={18}/>{t.monthlyReport}</h3>
      <div className="month-control"><label>{t.reportMonth}</label><input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} /><ExportButton rows={rows} filename={`monthly-trainer-report-${selectedMonth}.csv`} t={t}/></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>{t.fullName}</th><th>{t.role}</th><th>{t.clients}</th><th>{t.programs}</th><th>{t.totalLogs}</th><th>{t.ptSessions}</th><th>{t.freeService}</th><th>{t.rotation}</th><th>{t.totalLate}</th><th>{t.totalOvertime}</th><th>{t.avgEvaluation}</th><th>{t.grade}</th></tr></thead>
          <tbody>{rows.map(r => <tr key={r.id}><td>{r.full_name}</td><td>{r.role}</td><td>{r.clients_count}</td><td>{r.programs_count}</td><td>{r.total_logs}</td><td>{r.pt_sessions}</td><td>{r.free_service}</td><td>{r.rotation}</td><td>{r.late_minutes}</td><td>{r.overtime_minutes}</td><td>{r.avg_evaluation || '-'}</td><td>{r.grade}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}


function AuditLogPanel({ auditLogs, staff, t }) {
  const actorMap = Object.fromEntries(staff.map(s => [s.id, displayCoachName(s)]))
  const rows = auditLogs.map(log => ({
    ...log,
    actor_email: actorMap[log.actor_id] || '-' ,
    details_text: typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details || '')
  }))
  return (
    <div className="card audit-card">
      <h3><ShieldCheck size={18}/>{t.auditLog}</h3>
      <ExportButton rows={rows} filename="audit-log.csv" t={t}/>
      <div className="table-wrap">
        <table>
          <thead><tr><th>{t.changedAt}</th><th>{t.changedBy}</th><th>{t.action}</th><th>{t.entityType}</th><th>{t.alertDetails}</th></tr></thead>
          <tbody>{rows.map(r => <tr key={r.id}><td>{String(r.created_at || '').replace('T',' ').slice(0,19)}</td><td>{r.actor_email}</td><td>{r.action}</td><td>{r.entity_type}</td><td>{r.details_text}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}


function ReceptionLogForm({ profile, onSaved, lang, staff = [] }) {
  const t = TEXT[lang]
  const today = new Date().toISOString().slice(0,10)
  const initial = { log_date: today, visitor_name: '', phone: '', inquiry_type: 'membership', outcome: 'follow_up', assigned_trainer_id: '', notes: '' }
  const [form, setForm, draftSaved, clearDraft] = useAutoSavedForm(`gymzaman_draft_reception_${profile.id}`, initial)
  const [msg, setMsg] = useState('')
  const eligibleCoaches = staff.filter(s => s.branch_id === profile.branch_id && ['trainer','senior','head_coach'].includes(s.role) && (s.status || 'active') === 'active')
  function f(k,v){ setForm(p => ({...p, [k]: v})) }
  async function submit(e){
    e.preventDefault()
    const payload = {
      reception_id: profile.id,
      branch_id: profile.branch_id,
      log_date: form.log_date,
      visitor_name: form.visitor_name,
      phone: form.phone,
      inquiry_type: form.inquiry_type,
      outcome: form.outcome,
      assigned_trainer_id: form.assigned_trainer_id || null,
      assigned_trainer_name: eligibleCoaches.find(c => c.id === form.assigned_trainer_id)?.full_name || null,
      notes: form.notes
    }
    const { data, error } = await supabase.from('reception_logs').insert(payload).select('id').single()
    if (error) setMsg(error.message)
    else { await logAudit(profile.id, 'insert', 'reception_log', data?.id, { visitor_name: form.visitor_name }); setMsg(t.receptionSaved); clearDraft(initial); onSaved() }
  }
  return <div className="card compact-card"><h3><Users size={18}/>{t.addReceptionLog}</h3><form className="grid-form simple-form" onSubmit={submit}>
    <div><label>{t.date}</label><input type="date" value={form.log_date} onChange={e=>f('log_date',e.target.value)}/></div>
    <div><label>{t.visitorName}</label><input value={form.visitor_name} onChange={e=>f('visitor_name',e.target.value)}/></div>
    <div><label>{t.phone}</label><input value={form.phone} onChange={e=>f('phone',e.target.value)}/></div>
    <div><label>{t.inquiryType}</label><select value={form.inquiry_type} onChange={e=>f('inquiry_type',e.target.value)}><option value="membership">membership</option><option value="pt">PT</option><option value="complaint">complaint</option><option value="freeze">freeze</option><option value="other">other</option></select></div>
    <div><label>{t.outcome}</label><select value={form.outcome} onChange={e=>f('outcome',e.target.value)}><option value="done">done</option><option value="follow_up">follow_up</option><option value="sent_to_sales">sent_to_sales</option><option value="need_manager">need_manager</option></select></div>
    <div><label>{t.assignRotationToCoach}</label><select value={form.assigned_trainer_id} onChange={e=>f('assigned_trainer_id',e.target.value)}><option value="">-</option>{eligibleCoaches.map(c => <option key={c.id} value={c.id}>{displayCoachName(c)}</option>)}</select></div>
    <div className="full"><label>{t.notes}</label><textarea value={form.notes} onChange={e=>f('notes',e.target.value)}/></div>
    {draftSaved && <div className="draft-hint full"><Save size={14}/>{t.autoSavedDraft}</div>}{msg && <div className={msg.includes('success') || msg.includes('بنجاح') ? 'success full' : 'error full'}>{msg}</div>}<button>{t.saveReceptionLog}</button>
  </form></div>
}

function SalesLeadForm({ profile, onSaved, lang, staff = [] }) {
  const t = TEXT[lang]
  const today = new Date().toISOString().slice(0,10)
  const initial = { lead_date: today, lead_name: '', phone: '', source: 'walk_in', interest: 'membership', status: 'new', next_followup_date: '', next_action: '', notes: '' }
  const [form, setForm, draftSaved, clearDraft] = useAutoSavedForm(`gymzaman_draft_sales_${profile.id}`, initial)
  const [msg, setMsg] = useState('')
  const eligibleCoaches = staff.filter(s => s.branch_id === profile.branch_id && ['trainer','senior','head_coach'].includes(s.role) && (s.status || 'active') === 'active')
  function f(k,v){ setForm(p => ({...p, [k]: v})) }
  async function submit(e){
    e.preventDefault()
    const payload = {
      sales_id: profile.id,
      branch_id: profile.branch_id,
      lead_date: form.lead_date,
      lead_name: form.lead_name,
      phone: form.phone,
      source: form.source,
      interest: form.interest,
      status: form.status,
      next_followup_date: form.next_followup_date || null,
      next_action: form.next_action,
      notes: form.notes
    }
    const { data, error } = await supabase.from('sales_leads').insert(payload).select('id').single()
    if (error) setMsg(error.message)
    else { await logAudit(profile.id, 'insert', 'sales_lead', data?.id, { lead_name: form.lead_name, status: form.status }); setMsg(t.salesSaved); clearDraft(initial); onSaved() }
  }
  return <div className="card compact-card"><h3><PlusCircle size={18}/>{t.addSalesLead}</h3><form className="grid-form simple-form" onSubmit={submit}>
    <div><label>{t.date}</label><input type="date" value={form.lead_date} onChange={e=>f('lead_date',e.target.value)}/></div>
    <div><label>{t.leadName}</label><input value={form.lead_name} onChange={e=>f('lead_name',e.target.value)}/></div>
    <div><label>{t.phone}</label><input value={form.phone} onChange={e=>f('phone',e.target.value)}/></div>
    <div><label>{t.source}</label><select value={form.source} onChange={e=>f('source',e.target.value)}><option value="walk_in">walk_in</option><option value="phone">phone</option><option value="facebook">facebook</option><option value="instagram">instagram</option><option value="referral">referral</option><option value="other">other</option></select></div>
    <div><label>{t.interest}</label><select value={form.interest} onChange={e=>f('interest',e.target.value)}><option value="membership">membership</option><option value="pt">PT</option><option value="renewal">renewal</option><option value="class">class</option><option value="other">other</option></select></div>
    <div><label>{t.status}</label><select value={form.status} onChange={e=>f('status',e.target.value)}><option value="new">new</option><option value="follow_up">follow_up</option><option value="won">won</option><option value="lost">lost</option><option value="need_manager">need_manager</option></select></div>
    <div><label>{t.nextFollowupDate}</label><input type="date" value={form.next_followup_date} onChange={e=>f('next_followup_date',e.target.value)}/></div>
    <div><label>{t.nextAction}</label><input value={form.next_action} onChange={e=>f('next_action',e.target.value)}/></div>
    <div className="full"><label>{t.notes}</label><textarea value={form.notes} onChange={e=>f('notes',e.target.value)}/></div>
    {draftSaved && <div className="draft-hint full"><Save size={14}/>{t.autoSavedDraft}</div>}{msg && <div className={msg.includes('success') || msg.includes('بنجاح') ? 'success full' : 'error full'}>{msg}</div>}<button>{t.saveSalesLead}</button>
  </form></div>
}


function QuickActions({ t, tabs, setActiveTab }) {
  const has = key => tabs.some(tab => tab.key === key)
  const actions = [
    has('addClient') && { key: 'addClient', label: t.openClientIntake, icon: <Users size={18}/> },
    has('inputs') && { key: 'inputs', label: t.openDataEntry, icon: <PlusCircle size={18}/> },
    has('reports') && { key: 'reports', label: t.openReports, icon: <ClipboardList size={18}/> }
  ].filter(Boolean)
  if (!actions.length) return null
  return <div className="quick-actions"><span>{t.quickActions}</span>{actions.map(a => <button key={a.key} type="button" onClick={() => setActiveTab(a.key)}>{a.icon}{a.label}</button>)}</div>
}

function SecurityStatusCard({ t }) {
  return <div className="card security-card">
    <h3><ShieldCheck size={18}/>{t.securityStatus}</h3>
    <div className="security-grid">
      <div><b>{t.systemReady}</b><p>{t.ownerDirectorControl}</p></div>
      <div><b>{t.autoSystem}</b><p>{t.savedAutomatically}</p></div>
    </div>
  </div>
}

function BackupPanel({ t, data }) {
  function downloadBackup() {
    const payload = { exported_at: new Date().toISOString(), system: 'Gym Zaman MVP', data }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gymzaman-backup-${new Date().toISOString().slice(0,10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }
  return <div className="card backup-card">
    <h3><Save size={18}/>{t.backupData}</h3>
    <p className="muted">{t.savedAutomatically}</p>
    <button type="button" className="print-btn" onClick={downloadBackup}>{t.exportAllData}</button>
  </div>
}


function nowTimeHHMM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

function todayISO() { return new Date().toISOString().slice(0,10) }
function thisMonthISO() { return new Date().toISOString().slice(0,7) }

const WEEKDAYS = [
  { value: 'saturday', ar: 'السبت', en: 'Saturday' },
  { value: 'sunday', ar: 'الأحد', en: 'Sunday' },
  { value: 'monday', ar: 'الاثنين', en: 'Monday' },
  { value: 'tuesday', ar: 'الثلاثاء', en: 'Tuesday' },
  { value: 'wednesday', ar: 'الأربعاء', en: 'Wednesday' },
  { value: 'thursday', ar: 'الخميس', en: 'Thursday' },
  { value: 'friday', ar: 'الجمعة', en: 'Friday' }
]
function weekdayLabel(value, lang='ar') {
  const item = WEEKDAYS.find(d => d.value === value)
  return item ? item[lang === 'ar' ? 'ar' : 'en'] : (value || '-')
}
function isoWeekday(dateStr) {
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
  const d = new Date(`${dateStr}T12:00:00`)
  return days[d.getDay()]
}
function isShiftOffDay(shift, dateStr) {
  if (!shift) return false
  if (shift.is_off_day || shift.is_day_off || shift.day_off) return true
  if ((shift.applies_weekly || shift.repeat_weekly) && (shift.off_day_weekday || shift.day_off_weekday)) {
    return (shift.off_day_weekday || shift.day_off_weekday) === isoWeekday(dateStr)
  }
  return false
}
function getRowName(row) { return row?.full_name || row?.name || row?.email || '-' }

function ShiftPlannerPage({ profile, staff, branches, shifts, onSaved, lang }) {
  const t = TEXT[lang]
  const trainers = staff.filter(s => ['trainer','senior','head_coach'].includes(s.role))
  const initial = { trainer_id: trainers[0]?.id || '', shift_date: todayISO(), shift: 'PM', expected_in: '15:00', expected_out: '23:00', is_off_day: false, off_day_weekday: 'friday', applies_weekly: true, notes: '' }
  const [form, setForm, draftSaved, clearDraft] = useAutoSavedForm(`gymzaman_shift_planner_${profile.id}`, initial)
  const [msg, setMsg] = useState('')
  useEffect(() => { if (!form.trainer_id && trainers[0]?.id) setForm(p => ({...p, trainer_id: trainers[0].id})) }, [staff.length])
  function f(k,v){ setForm(p => ({...p,[k]:v})) }
  async function submit(e) {
    e.preventDefault()
    const trainer = trainers.find(x => x.id === form.trainer_id)
    const payload = {
      trainer_id: form.trainer_id,
      branch_id: trainer?.branch_id || profile.branch_id,
      shift_date: form.shift_date,
      shift: form.shift,
      shift_name: form.shift,
      expected_in: form.expected_in,
      expected_out: form.expected_out,
      start_time: form.expected_in,
      end_time: form.expected_out,
      shift_start: form.expected_in,
      shift_end: form.expected_out,
      official_in: form.expected_in,
      official_out: form.expected_out,
      is_off_day: !!form.is_off_day,
      is_day_off: !!form.is_off_day,
      day_off: !!form.is_off_day,
      off_day_weekday: form.off_day_weekday,
      day_off_weekday: form.off_day_weekday,
      applies_weekly: !!form.applies_weekly,
      notes: form.notes,
      created_by: profile.id,
      updated_by: profile.id
    }
    const existing = shifts.find(s => s.trainer_id === payload.trainer_id && s.shift_date === payload.shift_date)
    const result = existing?.id
      ? await supabase.from('coach_shifts').update(payload).eq('id', existing.id).select('id').single()
      : await supabase.from('coach_shifts').insert(payload).select('id').single()
    const { data, error } = result
    if (error) setMsg(error.message)
    else { await logAudit(profile.id, existing?.id ? 'update' : 'insert', 'coach_shift', data?.id, payload); setMsg(t.shiftSaved); clearDraft(initial); onSaved() }
  }
  const rows = shifts.map(r => ({...r, trainer_name: displayCoachName(staff.find(s => s.id === r.trainer_id)), branch_name: branches.find(b => b.id === r.branch_id)?.name || r.branch_name || '-', off_day_name: weekdayLabel(r.off_day_weekday || r.day_off_weekday, lang)}))
  return <>
    <div className="card section-intro"><h3><CalendarDays size={18}/>{t.shiftPlanner}</h3><p className="muted">جدول الشيفتات هنا ثابت: تحدد لكل كوتش شيفته ويوم الأجازة الأسبوعي مرة واحدة، ويتغير فقط لو حبيت تعدل شيفت أو يوم أجازة. طلب الأجازة/الإذن موجود في صفحة طلبات المدرب بشكل منفصل.</p></div>
    <div className="card compact-card"><h3>{t.addShift}</h3><form className="grid-form simple-form" onSubmit={submit}>
      <div><label>{t.trainerEmail}</label><select value={form.trainer_id} onChange={e=>f('trainer_id',e.target.value)}>{trainers.map(tr => <option key={tr.id} value={tr.id}>{displayCoachName(tr)} • {tr.branch_name || ''}</option>)}</select></div>
      <div><label>{t.date}</label><input type="date" value={form.shift_date} onChange={e=>f('shift_date',e.target.value)}/></div>
      <div><label>{t.shift}</label><select value={form.shift} onChange={e=>{ const v=e.target.value; f('shift',v); if(v==='AM'){setForm(p=>({...p,shift:v,expected_in:'07:00',expected_out:'15:00'}))} else if(v==='PM'){setForm(p=>({...p,shift:v,expected_in:'15:00',expected_out:'23:00'}))} else {setForm(p=>({...p,shift:v}))}}}><option>AM</option><option>PM</option><option>Split</option></select></div>
      <div><label>{t.expectedIn}</label><input type="time" value={form.expected_in} onChange={e=>f('expected_in',e.target.value)}/></div>
      <div><label>{t.expectedOut}</label><input type="time" value={form.expected_out} onChange={e=>f('expected_out',e.target.value)}/></div>
      <div><label>{t.offDayWeekday}</label><select value={form.off_day_weekday} onChange={e=>f('off_day_weekday',e.target.value)}>{WEEKDAYS.map(d=><option key={d.value} value={d.value}>{lang==='ar'?d.ar:d.en}</option>)}</select></div>
      <div className="checkbox-line"><label><input type="checkbox" checked={!!form.applies_weekly} onChange={e=>f('applies_weekly',e.target.checked)}/> {t.appliesWeekly}</label></div>
      <div className="checkbox-line"><label><input type="checkbox" checked={!!form.is_off_day} onChange={e=>f('is_off_day',e.target.checked)}/> {t.offDay}</label></div>
      <p className="muted full">يوم الأجازة الأسبوعي جزء من جدول الشيفت الثابت. طلب الأجازة أو الإذن يتم من صفحة طلبات المدرب وليس من هنا.</p>
      <div className="full"><label>{t.notes}</label><textarea value={form.notes} onChange={e=>f('notes',e.target.value)}/></div>
      {draftSaved && <div className="draft-hint full"><Save size={14}/>{t.autoSavedDraft}</div>}{msg && <div className={msg.includes('success') || msg.includes('بنجاح') ? 'success full' : 'error full'}>{msg}</div>}
      <button>{t.save}</button>
    </form></div>
    <Table title={t.shiftPlanner} rows={rows} canEdit={false} canDelete={false} t={t} columns={[{key:'trainer_name',label:t.trainerEmail},{key:'branch_name',label:t.branch},{key:'shift_date',label:t.date},{key:'shift',label:t.shift},{key:'expected_in',label:t.expectedIn},{key:'expected_out',label:t.expectedOut},{key:'off_day_name',label:t.offDayWeekday},{key:'applies_weekly',label:t.appliesWeekly},{key:'notes',label:t.notes}]}/>
  </>
}

function AttendancePunchPage({ profile, staff, shifts, attendanceLogs, requests=[], onSaved, lang, canViewAll=false }) {
  const t = TEXT[lang]
  const today = todayISO()
  const myShift = shifts.find(s => s.trainer_id === profile.id && s.shift_date === today) || shifts.find(s => s.trainer_id === profile.id && (s.applies_weekly || s.repeat_weekly) && !s.is_off_day)
  const myLog = attendanceLogs.find(a => a.trainer_id === profile.id && a.attendance_date === today)
  const [msg, setMsg] = useState('')
  async function punch(kind) {
    const time = nowTimeHHMM()
    const expectedIn = myShift?.expected_in || '15:00'
    const expectedOut = myShift?.expected_out || '23:00'
    const base = {
      trainer_id: profile.id,
      branch_id: profile.branch_id,
      attendance_date: today,
      shift: myShift?.shift || 'PM',
      expected_in: expectedIn,
      expected_out: expectedOut,
      notes: isShiftOffDay(myShift, today) ? t.offDay : ''
    }
    const payload = kind === 'in' ? {...base, check_in: time, check_out: myLog?.check_out || null} : {...base, check_in: myLog?.check_in || expectedIn, check_out: time}
    const calc = calculateLateAndOvertime(payload.check_in || expectedIn, payload.check_out || expectedOut, expectedIn, expectedOut)
    payload.late_minutes = calc.late
    payload.overtime_minutes = calc.overtime
    let result
    if (myLog?.id) result = await supabase.from('attendance_logs').update(payload).eq('id', myLog.id).select('id').single()
    else result = await supabase.from('attendance_logs').insert(payload).select('id').single()
    if (result.error) setMsg(result.error.message)
    else { await logAudit(profile.id, kind === 'in' ? 'check_in' : 'check_out', 'attendance_log', result.data?.id, payload); setMsg(t.attendancePunchSaved); onSaved() }
  }
  const month = thisMonthISO()
  const monthRows = attendanceLogs.filter(a => a.trainer_id === profile.id && monthOf(a.attendance_date) === month)
  const permissionRows = requests.filter(r => (r.trainer_id === profile.id || r.coach_id === profile.id || r.requested_by === profile.id) && monthOf(r.request_date || r.created_at) === month && (r.status === 'approved' || r.status === 'accepted') && ['late_permission','permission','late'].includes(r.request_type))
  const summary = {
    late: monthRows.reduce((s,r)=>s+Number(r.late_minutes||0),0),
    overtime: monthRows.reduce((s,r)=>s+Number(r.overtime_minutes||0),0),
    permissions: permissionRows.reduce((s,r)=>s+Number(r.requested_minutes||0),0),
    absence: shifts.filter(s => s.trainer_id === profile.id && monthOf(s.shift_date) === month && !isShiftOffDay(s, s.shift_date) && !attendanceLogs.some(a => a.trainer_id === profile.id && a.attendance_date === s.shift_date)).length
  }
  const allRows = attendanceLogs.map(a => ({...a, trainer_name: displayCoachName(staff.find(s => s.id === a.trainer_id))}))
  return <>
    <div className="card section-intro"><h3><CalendarDays size={18}/>{t.attendancePage}</h3><p className="muted">{t.automaticAttendanceSummary}</p></div>
    {['trainer','senior','head_coach'].includes(profile.role) && <div className="card punch-card">
      <h3>{t.todayShift}</h3>
      <div className="summary-grid">
        <div><span>{t.shift}</span><b>{isShiftOffDay(myShift, today) ? t.offDay : (myShift?.shift || '-')}</b></div>
        <div><span>{t.expectedIn}</span><b>{myShift?.expected_in || '-'}</b></div>
        <div><span>{t.expectedOut}</span><b>{myShift?.expected_out || '-'}</b></div>
        <div><span>{t.checkIn}</span><b>{myLog?.check_in || '-'}</b></div>
        <div><span>{t.checkOut}</span><b>{myLog?.check_out || '-'}</b></div>
      </div>
      {!myShift && <p className="muted">{t.noShiftToday}</p>}
      <div className="button-row"><button type="button" onClick={()=>punch('in')}>{t.punchIn}</button><button type="button" onClick={()=>punch('out')}>{t.punchOut}</button></div>
      {msg && <div className={msg.includes('success') || msg.includes('بنجاح') ? 'success' : 'error'}>{msg}</div>}
    </div>}
    <div className="card"><h3>{t.automaticAttendanceSummary}</h3><div className="summary-grid"><div><span>{t.totalDelayMinutes}</span><b>{summary.late}</b></div><div><span>{t.totalOvertimeMinutes}</span><b>{summary.overtime}</b></div><div><span>{t.totalPermissionMinutes}</span><b>{summary.permissions}</b></div><div><span>{t.totalAbsenceDays}</span><b>{summary.absence}</b></div></div></div>
    {canViewAll && <Table title={t.attendance} rows={allRows} canManage={false} t={t} columns={[{key:'trainer_name',label:t.trainerEmail},{key:'attendance_date',label:t.date},{key:'shift',label:t.shift},{key:'expected_in',label:t.expectedIn},{key:'expected_out',label:t.expectedOut},{key:'check_in',label:t.checkIn},{key:'check_out',label:t.checkOut},{key:'late_minutes',label:t.lateMinutes},{key:'overtime_minutes',label:t.overtimeMinutes}]}/>} 
  </>
}

function CoachRequestsPage({ profile, requests, onSaved, lang, canViewAll=false, staff=[] }) {
  const t = TEXT[lang]
  const initial = { request_type: 'late_permission', request_date: todayISO(), requested_minutes: 0, amount: 0, reason: '' }
  const [form, setForm, draftSaved, clearDraft] = useAutoSavedForm(`gymzaman_requests_${profile.id}`, initial)
  const [msg, setMsg] = useState('')
  const [reviewNote, setReviewNote] = useState('')
  function f(k,v){ setForm(p => ({...p,[k]:v})) }
  async function submit(e){
    e.preventDefault()
    const payload = {
      trainer_id: profile.id,
      coach_id: profile.id,
      requested_by: profile.id,
      branch_id: profile.branch_id,
      request_type: form.request_type,
      request_date: form.request_date,
      requested_minutes: Number(form.requested_minutes||0),
      amount: Number(form.amount||0),
      reason: form.reason,
      status: 'pending',
      created_by: profile.id
    }
    const { data, error } = await supabase.from('coach_requests').insert(payload).select('id').single()
    if (error) setMsg(error.message)
    else { await logAudit(profile.id, 'insert', 'coach_request', data?.id, payload); setMsg(t.requestSaved); clearDraft(initial); onSaved() }
  }
  async function reviewRequest(row, status) {
    const payload = {
      status,
      admin_note: reviewNote || null,
      reviewed_by: profile.id,
      reviewed_at: new Date().toISOString(),
      approved_by: status === 'approved' ? profile.id : null,
      approved_at: status === 'approved' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }
    const { error } = await supabase.from('coach_requests').update(payload).eq('id', row.id)
    if (error) alert(error.message)
    else { await logAudit(profile.id, status, 'coach_request', row.id, payload); setReviewNote(''); onSaved() }
  }
  const visibleBase = canViewAll ? requests : requests.filter(r => r.trainer_id === profile.id || r.coach_id === profile.id || r.requested_by === profile.id)
  const visible = visibleBase.map(r => ({
    ...r,
    trainer_name: displayCoachName(staff.find(s => s.id === (r.trainer_id || r.coach_id || r.requested_by))) || displayCoachName(profile),
    status_label: r.status || 'pending'
  }))
  const month = thisMonthISO()
  const ownMonth = requests.filter(r => (r.trainer_id === profile.id || r.coach_id === profile.id || r.requested_by === profile.id) && monthOf(r.request_date || r.created_at) === month)
  const approvedPermissionMinutes = ownMonth
    .filter(r => (r.status === 'approved' || r.status === 'accepted') && ['late_permission','permission','late'].includes(r.request_type))
    .reduce((s,r)=>s+Number(r.requested_minutes || 0),0)
  const pendingCount = ownMonth.filter(r => !r.status || r.status === 'pending').length
  return <>
    {['trainer','senior','head_coach'].includes(profile.role) && <div className="card compact-card"><h3><ClipboardList size={18}/>{t.requests}</h3><form className="grid-form simple-form" onSubmit={submit}>
      <div><label>{t.requestType}</label><select value={form.request_type} onChange={e=>f('request_type',e.target.value)}><option value="late_permission">{t.latePermission}</option><option value="vacation">{t.vacationRequest}</option><option value="advance">{t.advanceRequest}</option></select></div>
      <div><label>{t.requestDate}</label><input type="date" value={form.request_date} onChange={e=>f('request_date',e.target.value)}/></div>
      <div><label>{t.requestedMinutes}</label><input type="number" value={form.requested_minutes} onChange={e=>f('requested_minutes',e.target.value)}/></div>
      <div><label>{t.amount}</label><input type="number" value={form.amount} onChange={e=>f('amount',e.target.value)}/></div>
      <div className="full"><label>{t.reason}</label><textarea value={form.reason} onChange={e=>f('reason',e.target.value)}/></div>
      {draftSaved && <div className="draft-hint full"><Save size={14}/>{t.autoSavedDraft}</div>}{msg && <div className={msg.includes('success') || msg.includes('بنجاح') ? 'success full' : 'error full'}>{msg}</div>}<button>{t.save}</button>
    </form></div>}
    <div className="card"><h3>{t.automaticAttendanceSummary}</h3><div className="summary-grid"><div><span>{t.totalPermissionMinutes}</span><b>{approvedPermissionMinutes}</b></div><div><span>{t.pendingRequests}</span><b>{pendingCount}</b></div><div><span>{t.reportMonth}</span><b>{month}</b></div></div></div>
    {canViewAll && <div className="card compact-card"><h3>{t.approvalStatus}</h3><div className="grid-form simple-form"><div className="full"><label>{t.approvalNote}</label><textarea value={reviewNote} onChange={e=>setReviewNote(e.target.value)} placeholder={t.approvalNote}/></div></div><p className="muted">اختار الطلب من الجدول واضغط موافقة أو رفض. كل قرار بيتحفظ ويتسجل تلقائيًا.</p></div>}
    <div className="card"><h3>{t.requests}</h3>{visible.length === 0 ? <p className="muted">{t.noData}</p> : <div className="table-wrap"><table><thead><tr>{canViewAll && <th>{t.trainerEmail}</th>}<th>{t.date}</th><th>{t.requestType}</th><th>{t.requestedMinutes}</th><th>{t.amount}</th><th>{t.reason}</th><th>{t.approvalStatus}</th>{canViewAll && <th>{t.control}</th>}</tr></thead><tbody>{visible.map((r,i)=><tr key={r.id || i}>{canViewAll && <td>{r.trainer_name}</td>}<td>{formatCell(r.request_date)}</td><td>{formatCell(r.request_type)}</td><td>{formatCell(r.requested_minutes)}</td><td>{formatCell(r.amount)}</td><td>{formatCell(r.reason)}</td><td>{formatCell(r.status_label)}</td>{canViewAll && <td><div className="row-actions"><button className="small-action save" type="button" onClick={()=>reviewRequest(r,'approved')}>{t.approve}</button><button className="small-action delete" type="button" onClick={()=>reviewRequest(r,'rejected')}>{t.reject}</button></div></td>}</tr>)}</tbody></table></div>}</div>
  </>
}

function TargetPlanPage({ profile, plans, onSaved, lang, canViewAll=false, staff=[] }) {
  const t = TEXT[lang]
  const initial = { target_month: thisMonthISO(), monthly_target: 0, current_achievement: 0, action_plan: '', expected_challenges: '', support_needed: '' }
  const [form, setForm, draftSaved, clearDraft] = useAutoSavedForm(`gymzaman_target_plan_${profile.id}`, initial)
  const [msg, setMsg] = useState('')
  function f(k,v){ setForm(p => ({...p,[k]:v})) }
  async function submit(e){ e.preventDefault(); const payload = { trainer_id: profile.id, branch_id: profile.branch_id, target_month: form.target_month, monthly_target: Number(form.monthly_target||0), current_achievement: Number(form.current_achievement||0), action_plan: form.action_plan, expected_challenges: form.expected_challenges, support_needed: form.support_needed, created_by: profile.id, updated_by: profile.id }; const { data, error } = await supabase.from('monthly_target_plans').upsert(payload, { onConflict: 'trainer_id,target_month' }).select('id').single(); if(error)setMsg(error.message); else { await logAudit(profile.id, 'upsert', 'monthly_target_plan', data?.id, payload); setMsg(t.targetPlanSaved); clearDraft(initial); onSaved() } }
  const visible = canViewAll ? plans.map(r => ({...r, trainer_name: displayCoachName(staff.find(s => s.id === r.trainer_id))})) : plans.filter(r => r.trainer_id === profile.id)
  return <>
    {['trainer','senior','head_coach'].includes(profile.role) && <div className="card compact-card"><h3><ClipboardList size={18}/>{t.targetPlan}</h3><form className="grid-form simple-form" onSubmit={submit}>
      <div><label>{t.targetMonth}</label><input type="month" value={form.target_month} onChange={e=>f('target_month',e.target.value)}/></div><div><label>{t.monthlyTarget}</label><input type="number" value={form.monthly_target} onChange={e=>f('monthly_target',e.target.value)}/></div><div><label>{t.currentAchievement}</label><input type="number" value={form.current_achievement} onChange={e=>f('current_achievement',e.target.value)}/></div>
      <div className="full"><label>{t.actionPlan}</label><textarea value={form.action_plan} onChange={e=>f('action_plan',e.target.value)}/></div><div className="full"><label>{t.expectedChallenges}</label><textarea value={form.expected_challenges} onChange={e=>f('expected_challenges',e.target.value)}/></div><div className="full"><label>{t.supportNeeded}</label><textarea value={form.support_needed} onChange={e=>f('support_needed',e.target.value)}/></div>
      {draftSaved && <div className="draft-hint full"><Save size={14}/>{t.autoSavedDraft}</div>}{msg && <div className={msg.includes('success') || msg.includes('بنجاح') ? 'success full' : 'error full'}>{msg}</div>}<button>{t.save}</button>
    </form></div>}
    <Table title={t.targetPlan} rows={visible} canManage={false} t={t} columns={[...(canViewAll?[{key:'trainer_name',label:t.trainerEmail}]:[]),{key:'target_month',label:t.targetMonth},{key:'monthly_target',label:t.monthlyTarget},{key:'current_achievement',label:t.currentAchievement},{key:'action_plan',label:t.actionPlan},{key:'support_needed',label:t.supportNeeded}]}/>
  </>
}

function TrainerTasksPage({ profile, staff, tasks, onSaved, lang, canAssign=false, canViewAll=false }) {
  const t = TEXT[lang]
  const trainers = staff.filter(s => ['trainer','senior','head_coach'].includes(s.role))
  const initial = { trainer_id: trainers[0]?.id || '', task_title: '', task_details: '', due_date: todayISO(), priority: 'normal' }
  const [form, setForm, draftSaved, clearDraft] = useAutoSavedForm(`gymzaman_tasks_${profile.id}`, initial)
  const [msg, setMsg] = useState('')
  useEffect(() => { if (!form.trainer_id && trainers[0]?.id) setForm(p => ({...p, trainer_id: trainers[0].id})) }, [staff.length])
  function f(k,v){ setForm(p => ({...p,[k]:v})) }
  async function submit(e){ e.preventDefault(); const tr = trainers.find(x => x.id === form.trainer_id); const payload = { trainer_id: form.trainer_id, branch_id: tr?.branch_id || profile.branch_id, task_title: form.task_title, task_details: form.task_details, due_date: form.due_date || null, priority: form.priority, status: 'pending', assigned_by: profile.id }; const { data, error } = await supabase.from('trainer_tasks').insert(payload).select('id').single(); if(error)setMsg(error.message); else { await logAudit(profile.id, 'insert', 'trainer_task', data?.id, payload); setMsg(t.taskSaved); clearDraft(initial); onSaved() } }
  async function markDone(task){ const { error } = await supabase.from('trainer_tasks').update({ status: 'done', completed_at: new Date().toISOString(), completed_by: profile.id }).eq('id', task.id); if(error) alert(error.message); else { await logAudit(profile.id, 'done', 'trainer_task', task.id, {}); onSaved() } }
  const visibleBase = canViewAll ? tasks : tasks.filter(r => r.trainer_id === profile.id)
  const visible = visibleBase.map(r => ({...r, trainer_name: displayCoachName(staff.find(s => s.id === r.trainer_id))}))
  return <>
    {canAssign && <div className="card compact-card"><h3><UserCog size={18}/>{t.assignTask}</h3><form className="grid-form simple-form" onSubmit={submit}>
      <div><label>{t.trainerEmail}</label><select value={form.trainer_id} onChange={e=>f('trainer_id',e.target.value)}>{trainers.map(tr => <option key={tr.id} value={tr.id}>{displayCoachName(tr)} • {tr.branch_name || ''}</option>)}</select></div>
      <div><label>{t.taskTitle}</label><input value={form.task_title} onChange={e=>f('task_title',e.target.value)}/></div><div><label>{t.dueDate}</label><input type="date" value={form.due_date} onChange={e=>f('due_date',e.target.value)}/></div><div><label>{t.priority}</label><select value={form.priority} onChange={e=>f('priority',e.target.value)}><option>low</option><option>normal</option><option>high</option><option>urgent</option></select></div>
      <div className="full"><label>{t.taskDetails}</label><textarea value={form.task_details} onChange={e=>f('task_details',e.target.value)}/></div>
      {draftSaved && <div className="draft-hint full"><Save size={14}/>{t.autoSavedDraft}</div>}{msg && <div className={msg.includes('success') || msg.includes('بنجاح') ? 'success full' : 'error full'}>{msg}</div>}<button>{t.save}</button>
    </form></div>}
    <div className="card"><h3>{t.trainerTasks}</h3>{visible.length===0?<p className="muted">{t.noData}</p>:<div className="table-wrap"><table><thead><tr>{canViewAll&&<th>{t.trainerEmail}</th>}<th>{t.taskTitle}</th><th>{t.dueDate}</th><th>{t.priority}</th><th>{t.taskStatus}</th><th>{t.taskDetails}</th>{!canViewAll&&<th>{t.control}</th>}</tr></thead><tbody>{visible.map(task=><tr key={task.id}>{canViewAll&&<td>{task.trainer_name}</td>}<td>{task.task_title}</td><td>{task.due_date}</td><td>{task.priority}</td><td>{task.status}</td><td>{task.task_details}</td>{!canViewAll&&<td>{task.status!=='done' && <button className="small-action edit" type="button" onClick={()=>markDone(task)}>{t.markDone}</button>}</td>}</tr>)}</tbody></table></div>}</div>
  </>
}

function Dashboard({ profile, lang }) {
  const t=TEXT[lang]
  const [clients,setClients]=useState([]), [logs,setLogs]=useState([]), [attendanceLogs,setAttendanceLogs]=useState([]), [branches,setBranches]=useState([]), [programs,setPrograms]=useState([]), [staff,setStaff]=useState([]), [seniorReports,setSeniorReports]=useState([]), [headReports,setHeadReports]=useState([]), [evaluations,setEvaluations]=useState([]), [receptionLogs,setReceptionLogs]=useState([]), [salesLeads,setSalesLeads]=useState([]), [auditLogs,setAuditLogs]=useState([]), [coachShifts,setCoachShifts]=useState([]), [coachRequests,setCoachRequests]=useState([]), [targetPlans,setTargetPlans]=useState([]), [trainerTasks,setTrainerTasks]=useState([])
  const [loading,setLoading]=useState(true), [notice,setNotice]=useState(''), [edit,setEdit]=useState(null), [selectedTrainerId,setSelectedTrainerId]=useState('all'), [selectedClientId,setSelectedClientId]=useState(''), [activeTab,setActiveTab]=useState('overview'), [searchQuery,setSearchQuery]=useState('')
  const isOwner=profile.role==='owner', isDirector=profile.role==='fitness_director', isAdmin=profile.role==='owner'||profile.role==='fitness_director', isControlAdmin=profile.role==='owner'||profile.role==='fitness_director', isTrainer=profile.role==='trainer', isSenior=profile.role==='senior', isHeadCoach=profile.role==='head_coach', isBranchLeader=['senior','head_coach'].includes(profile.role), isReception=profile.role==='reception', isSales=profile.role==='sales'

  async function load(){
    setLoading(true)
    const calls = [
      supabase.from('clients').select('*').order('created_at',{ascending:false}),
      supabase.from('trainer_daily_logs').select('*').order('created_at',{ascending:false}),
      supabase.from('branches').select('*').order('name'),
      supabase.from('pt_programs').select('*').order('created_at',{ascending:false}),
      supabase.from('senior_daily_reports').select('*').order('created_at',{ascending:false}),
      supabase.from('trainer_evaluations').select('*').order('created_at',{ascending:false}),
      supabase.from('head_coach_daily_reports').select('*').order('created_at',{ascending:false}),
      supabase.from('attendance_logs').select('*').order('created_at',{ascending:false}),
      isControlAdmin ? supabase.from('reception_logs').select('*').order('created_at',{ascending:false}) : Promise.resolve({data:[], error:null}),
      isControlAdmin ? supabase.from('sales_leads').select('*').order('created_at',{ascending:false}) : Promise.resolve({data:[], error:null}),
      isControlAdmin ? supabase.from('audit_logs').select('*').order('created_at',{ascending:false}).limit(150) : Promise.resolve({data:[], error:null}),
      supabase.from('coach_shifts').select('*').order('shift_date',{ascending:false}),
      supabase.from('coach_requests').select('*').order('created_at',{ascending:false}),
      supabase.from('monthly_target_plans').select('*').order('target_month',{ascending:false}),
      supabase.from('trainer_tasks').select('*').order('created_at',{ascending:false})
    ]
    if (!isTrainer) calls.push(supabase.from('profiles').select('id, full_name, email, role, branch_id, branch_name, status, active').order('full_name'))
    const res = await Promise.all(calls)
    const [c,l,b,p,sr,e,hr,a,rec,sales,au,shifts,requests,plans,tasks,s] = res
    if(c.error)setNotice(c.error.message); if(p.error)setNotice(p.error.message); if(sr.error)setNotice(sr.error.message); if(e.error)setNotice(e.error.message); if(hr.error)setNotice(hr.error.message); if(a.error)setNotice(a.error.message); if(rec.error)setNotice(rec.error.message); if(sales.error)setNotice(sales.error.message); if(au.error)setNotice(au.error.message); if(shifts.error)setNotice(shifts.error.message); if(requests.error)setNotice(requests.error.message); if(plans.error)setNotice(plans.error.message); if(tasks.error)setNotice(tasks.error.message); if(s?.error)setNotice(s.error.message)
    setClients(c.data||[]); setLogs(l.data||[]); setBranches(b.data||[]); setPrograms(p.data||[]); setSeniorReports(sr.data||[]); setEvaluations(e.data||[]); setHeadReports(hr.data||[]); setAttendanceLogs(a.data||[]); setReceptionLogs(rec.data||[]); setSalesLeads(sales.data||[]); setAuditLogs(au.data||[]); setCoachShifts(shifts.data||[]); setCoachRequests(requests.data||[]); setTargetPlans(plans.data||[]); setTrainerTasks(tasks.data||[]); setStaff(s?.data||[])
    setLoading(false)
  }

  useEffect(()=>{load()},[])
  useEffect(()=>{ const handler = e => setActiveTab(e.detail); window.addEventListener('gymzaman:navigate', handler); return () => window.removeEventListener('gymzaman:navigate', handler) },[])
  useEffect(()=>{ if((isControlAdmin || isBranchLeader) && activeTab === 'trainerData' && selectedTrainerId === 'all' && trainers[0]?.id) setSelectedTrainerId(trainers[0].id) }, [activeTab, staff.length])

  async function del(table,row,label){ if(!confirm(`Delete ${label}?`)) return; const {error}=await supabase.from(table).delete().eq('id',row.id); if(error)alert(error.message); else { await logAudit(profile.id, 'delete', table, row.id, { label }); load() } }

  const branchStaff = staff.filter(s => s.branch_id === profile.branch_id)
  const trainers = (isBranchLeader ? branchStaff : staff).filter(s => ['trainer','senior','head_coach'].includes(s.role))
  const selectedTrainer = selectedTrainerId !== 'all' ? trainers.find(s => s.id === selectedTrainerId) : (isTrainer ? profile : (trainers[0] || null))
  const evaluableTrainers = isBranchLeader ? branchStaff.filter(s => s.id !== profile.id && ['trainer','senior'].includes(s.role)) : trainers
  const clientMapAll = Object.fromEntries(clients.map(c=>[c.id,c.full_name]))
  const trainerMap = Object.fromEntries([...staff, profile].map(tr=>[tr.id,displayCoachName(tr)]))

  const scopeByTrainer = (rows, trainerField='trainer_id') => {
    if (isAdmin) return selectedTrainerId !== 'all' ? rows.filter(r => r[trainerField] === selectedTrainerId) : rows
    if (isBranchLeader) return rows.filter(r => r.branch_id === profile.branch_id)
    return rows.filter(r => r[trainerField] === profile.id || r.created_by === profile.id)
  }
  const visibleClients = isAdmin
    ? (selectedTrainerId !== 'all' ? clients.filter(c => c.assigned_trainer_id === selectedTrainerId) : clients)
    : isBranchLeader
      ? clients.filter(c => c.branch_id === profile.branch_id)
      : clients.filter(c => c.assigned_trainer_id === profile.id || c.created_by === profile.id)
  const selectedClient = selectedClientId ? visibleClients.find(c => c.id === selectedClientId) : visibleClients[0]
  const visibleLogs = scopeByTrainer(logs)
  const visibleProgramsRaw = scopeByTrainer(programs)
  const visibleProgramsBase = visibleProgramsRaw.map(p=>({...p,client_name:clientMapAll[p.client_id]||'-', trainer_name: trainerMap[p.trainer_id] || '-'}))
  const visibleClientsRowsBase = visibleClients.map(c=>({...c, trainer_name: trainerMap[c.assigned_trainer_id] || '-'}))
  const visibleLogsRowsBase = visibleLogs.map(l=>({...l, trainer_name: trainerMap[l.trainer_id] || '-'}))
  const visibleAttendanceRaw = scopeByTrainer(attendanceLogs)
  const visibleAttendanceBase = visibleAttendanceRaw.map(a => ({...a, trainer_name: trainerMap[a.trainer_id] || '-'}))
  const visibleSeniorReportsRaw = isAdmin ? seniorReports : isBranchLeader ? seniorReports.filter(r => r.branch_id === profile.branch_id) : seniorReports.filter(r => r.senior_id === profile.id)
  const visibleSeniorReportsBase = visibleSeniorReportsRaw.map(r => ({...r, senior_name: trainerMap[r.senior_id] || '-'}))
  const visibleHeadReportsRaw = isAdmin ? headReports : isBranchLeader ? headReports.filter(r => r.branch_id === profile.branch_id) : headReports.filter(r => r.head_coach_id === profile.id)
  const visibleHeadReportsBase = visibleHeadReportsRaw.map(r => ({...r, head_coach_name: trainerMap[r.head_coach_id] || '-'}))
  const visibleEvaluationsRaw = isAdmin
    ? (selectedTrainerId !== 'all' ? evaluations.filter(ev => ev.trainer_id === selectedTrainerId) : evaluations)
    : isBranchLeader
      ? evaluations.filter(ev => ev.branch_id === profile.branch_id)
      : evaluations.filter(ev => ev.trainer_id === profile.id)
  const visibleEvaluationsBase = visibleEvaluationsRaw.map(ev => { const score = Math.round((Number(ev.technical_score||0)+Number(ev.behavior_score||0)+Number(ev.leadership_score||0)+Number(ev.service_score||0))/4); return {...ev, final_score: score, grade: gradeFromScore(score, t), recommendation: recommendationFromScore(score), trainer_name: trainerMap[ev.trainer_id] || '-', evaluator_name: trainerMap[ev.evaluator_id] || (ev.evaluator_id === profile.id ? displayCoachName(profile) : '-')} })
  const scopeByBranchOrOwner = (rows, type) => isControlAdmin ? rows : []
  const visibleReceptionRaw = scopeByBranchOrOwner(receptionLogs, 'reception')
  const visibleSalesRaw = scopeByBranchOrOwner(salesLeads, 'sales')
  const visibleReceptionRowsBase = visibleReceptionRaw.map(r => ({...r, handled_by_name: trainerMap[r.reception_id] || '-', assigned_trainer_name: trainerMap[r.assigned_trainer_id] || r.assigned_trainer_name || '-'}))
  const visibleSalesRowsBase = visibleSalesRaw.map(r => ({...r, handled_by_name: trainerMap[r.sales_id] || '-'}))
  const visiblePrograms = visibleProgramsBase.filter(r => rowMatches(r, searchQuery))
  const visibleClientsRows = visibleClientsRowsBase.filter(r => rowMatches(r, searchQuery))
  const visibleLogsRows = visibleLogsRowsBase.filter(r => rowMatches(r, searchQuery))
  const visibleAttendance = visibleAttendanceBase.filter(r => rowMatches(r, searchQuery))
  const visibleSeniorReports = visibleSeniorReportsBase.filter(r => rowMatches(r, searchQuery))
  const visibleHeadReports = visibleHeadReportsBase.filter(r => rowMatches(r, searchQuery))
  const visibleEvaluations = visibleEvaluationsBase.filter(r => rowMatches(r, searchQuery))
  const visibleReceptionRows = visibleReceptionRowsBase.filter(r => rowMatches(r, searchQuery))
  const visibleSalesRows = visibleSalesRowsBase.filter(r => rowMatches(r, searchQuery))

  const today=new Date().toISOString().slice(0,10), todayLogs=visibleLogs.filter(x=>x.log_date===today), rows=isAdmin?todayLogs:visibleLogs
  const totals={logs:rows.length,rotation:rows.reduce((s,r)=>s+Number(r.rotation_count||0),0),pt:rows.reduce((s,r)=>s+Number(r.pt_sessions_count||0),0),free:rows.reduce((s,r)=>s+Number(r.free_service_count||0),0)}
  const selectedLoginBranch = localStorage.getItem('gymzaman_login_branch') || ''
  const profileBranchName = branches.find(b => b.id === profile.branch_id)?.name || profile.branch_name || ''
  const loginBranchMismatch = selectedLoginBranch && profileBranchName && selectedLoginBranch !== profileBranchName && !isAdmin
  const title=profile.role==='owner'?t.owner:profile.role==='fitness_director'?t.director:profile.role==='head_coach'?t.headCoachReport:profile.role==='senior'?t.seniorReport:profile.role==='reception'?t.reception:profile.role==='sales'?t.sales:profile.role==='trainer'?t.trainer:t.dashboard
  const tabs = isControlAdmin ? [
    {key:'overview', label:t.tabOverview},
    {key:'addClient', label:t.addClientPage},
    {key:'trainerData', label:t.tabTrainerData},
    {key:'shifts', label:t.shiftPlanner},
    {key:'attendancePage', label:t.attendancePage},
    {key:'requests', label:t.requests},
    {key:'targetPlan', label:t.targetPlan},
    {key:'tasks', label:t.trainerTasks},
    {key:'reports', label:t.tabReports},
    {key:'reception', label:t.reception},
    {key:'sales', label:t.sales},
    {key:'staff', label:t.tabStaff}
  ] : [
    {key:'overview', label:t.tabOverview},
    ...(!['reception','sales'].includes(profile.role) ? [{key:'addClient', label:t.addClientPage}] : []),
    {key:'attendancePage', label:t.attendancePage},
    {key:'requests', label:t.requests},
    {key:'targetPlan', label:t.targetPlan},
    {key:'tasks', label:t.trainerTasks},
    {key:'inputs', label:t.tabInputs},
    ...(['senior','head_coach'].includes(profile.role) ? [{key:'trainerData', label:t.tabTrainerData}] : []),
    ...(profile.role==='reception' ? [{key:'reception', label:t.reception}] : []),
    ...(profile.role==='sales' ? [{key:'sales', label:t.sales}] : []),
    {key:'reports', label:t.tabReports}
  ]

  if(loading)return <div className="card">Loading...</div>
  return <>
    <section className="hero simple-hero"><h2>{title}</h2></section>
    {notice&&<div className="error">{notice}</div>}
    {loginBranchMismatch && <div className="notice">{t.branchLoginMismatch}</div>}
    <TabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}/>
    <QuickActions t={t} tabs={tabs} setActiveTab={setActiveTab}/>
    {!isTrainer && <SearchBox value={searchQuery} onChange={setSearchQuery} t={t}/>}

    {activeTab === 'overview' && <>
      <section className="stats-grid"><StatCard title={isAdmin?t.todayLogs:t.myLogs} value={totals.logs} icon={<CalendarDays/>}/><StatCard title={isAdmin?t.rotationToday:t.myClients} value={isAdmin?totals.rotation:visibleClients.length} icon={<Users/>}/><StatCard title={isAdmin?t.ptToday:t.myPrograms} value={isAdmin?totals.pt:visiblePrograms.length} icon={<Dumbbell/>}/><StatCard title={t.freeToday} value={totals.free} icon={<ClipboardList/>}/></section>
      {isAdmin && <div className="card note"><b>{t.adminNote}</b></div>}
      {isControlAdmin && <SecurityStatusCard t={t}/>}
      {isControlAdmin && <BackupPanel t={t} data={{clients, logs, attendanceLogs, programs, staff, seniorReports, headReports, evaluations, receptionLogs, salesLeads, auditLogs, coachShifts, coachRequests, targetPlans, trainerTasks}}/>}
      {(isAdmin || isBranchLeader) && <PerformanceDashboard staff={isAdmin?staff:branchStaff} clients={visibleClients} logs={visibleLogs} attendanceLogs={visibleAttendanceRaw} t={t}/>}
      {(isAdmin || isBranchLeader) && <AlertsPanel staff={isAdmin?staff:branchStaff} logs={visibleLogs} attendanceLogs={visibleAttendanceRaw} seniorReports={visibleSeniorReportsRaw} evaluations={visibleEvaluationsRaw} t={t}/>}
      {isAdmin && <BranchComparisonDashboard branches={branches} staff={staff} clients={clients} logs={logs} programs={programs} attendanceLogs={attendanceLogs} seniorReports={seniorReports} headReports={headReports} t={t}/>}
      {isTrainer && <TrainerProfilePanel trainer={profile} showEmail={false} branches={branches} clients={clients} logs={logs} programs={programs} attendanceLogs={attendanceLogs} evaluations={evaluations} shifts={coachShifts} requests={coachRequests} targetPlans={targetPlans} tasks={trainerTasks} t={t} lang={lang}/>}
    </>}

    {activeTab === 'addClient' && <>
      {(isTrainer||isAdmin||isBranchLeader)&&<AddClientForm profile={profile} branches={branches} onSaved={load} lang={lang}/>} 
      {visibleClients.length > 0 && <div className="card filter-card"><h3><Search size={18}/>{t.selectClientFile}</h3><select value={selectedClient?.id || ''} onChange={e=>setSelectedClientId(e.target.value)}>{visibleClients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}</select></div>}
      <ClientFilePanel client={selectedClient} programs={programs} trainerName={trainerMap[selectedClient?.assigned_trainer_id]} t={t}/>
    </>}

    {activeTab === 'trainerData' && <>
      {(isAdmin || isBranchLeader) && <TrainerDirectory trainers={trainers} branches={branches} selectedTrainerId={selectedTrainerId} setSelectedTrainerId={setSelectedTrainerId} t={t}/>}
      {isBranchLeader && <Table title={t.staffManagement} rows={branchStaff.filter(r => rowMatches(r, searchQuery))} canManage={false} t={t} columns={[{key:'full_name',label:t.fullName},{key:'role',label:t.role},{key:'status',label:t.status}]}/>}
      {(isAdmin || isBranchLeader) && selectedTrainer && <TrainerProfilePanel trainer={selectedTrainer} showEmail={isAdmin} branches={branches} clients={clients} logs={logs} programs={programs} attendanceLogs={attendanceLogs} evaluations={evaluations} shifts={coachShifts} requests={coachRequests} targetPlans={targetPlans} tasks={trainerTasks} t={t} lang={lang}/>}
      {((isAdmin || isBranchLeader) && selectedTrainer) && <CoachEvaluationForm profile={profile} targetTrainerId={selectedTrainer.id} eligibleTrainers={evaluableTrainers} onSaved={load} lang={lang}/>}
      {isBranchLeader && !selectedTrainer && <CoachEvaluationForm profile={profile} targetTrainerId={''} eligibleTrainers={evaluableTrainers} onSaved={load} lang={lang}/>}
      {visibleClients.length > 0 && <div className="card filter-card"><h3><Search size={18}/>{t.selectClientFile}</h3><select value={selectedClient?.id || ''} onChange={e=>setSelectedClientId(e.target.value)}>{visibleClients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}</select></div>}
      <ClientFilePanel client={selectedClient} programs={programs} trainerName={trainerMap[selectedClient?.assigned_trainer_id]} t={t}/>
      <div className="table-actions"><ExportButton rows={visibleClientsRows} filename="clients.csv" t={t}/></div>
      <Table title={isTrainer?t.myClients:t.clients} rows={visibleClientsRows} canEdit={isAdmin || isBranchLeader} canDelete={isControlAdmin} onEdit={r=>setEdit({type:'client',row:r})} onDelete={r=>del('clients',r,r.full_name)} t={t} columns={[...((isAdmin||isBranchLeader)?[{key:'trainer_name',label:t.trainerEmail}]:[]),{key:'full_name',label:t.clientName},{key:'phone',label:t.phone},{key:'age',label:t.age},{key:'weight_kg',label:t.weightKg},{key:'goal',label:t.goal},{key:'level',label:t.level},{key:'status',label:t.status},{key:'next_followup_date',label:t.nextFollowupDate},{key:'need_director_support',label:t.needDirectorSupport}]}/>
      <div className="table-actions"><ExportButton rows={visibleAttendance} filename="attendance.csv" t={t}/></div>
      <Table title={t.attendance} rows={visibleAttendance} canEdit={isAdmin || isBranchLeader} canDelete={isControlAdmin} onEdit={r=>setEdit({type:'attendance',row:r})} onDelete={r=>del('attendance_logs',r,r.attendance_date)} t={t} columns={[...((isAdmin||isBranchLeader)?[{key:'trainer_name',label:t.trainerEmail}]:[]),{key:'attendance_date',label:t.date},{key:'shift',label:t.shift},{key:'check_in',label:t.checkIn},{key:'check_out',label:t.checkOut},{key:'late_minutes',label:t.lateMinutes},{key:'overtime_minutes',label:t.overtimeMinutes},{key:'notes',label:t.notes}]}/>
      <Table title={isTrainer?t.myLogs:t.logs} rows={visibleLogsRows} canEdit={isAdmin || isBranchLeader} canDelete={isControlAdmin} onEdit={r=>setEdit({type:'log',row:r})} onDelete={r=>del('trainer_daily_logs',r,r.log_date)} t={t} columns={[...((isAdmin||isBranchLeader)?[{key:'trainer_name',label:t.trainerEmail}]:[]),{key:'log_date',label:t.date},{key:'shift',label:t.shift},{key:'rotation_count',label:t.rotation},{key:'pt_sessions_count',label:t.ptSessions},{key:'free_service_count',label:t.freeService},{key:'notes',label:t.notes}]}/>
      <Table title={isTrainer?t.myPrograms:t.programs} rows={visiblePrograms} canEdit={isAdmin || isBranchLeader} canDelete={isControlAdmin} onEdit={r=>setEdit({type:'program',row:r})} onDelete={r=>del('pt_programs',r,r.program_name)} t={t} columns={[...((isAdmin||isBranchLeader)?[{key:'trainer_name',label:t.trainerEmail}]:[]),{key:'client_name',label:t.clientName},{key:'program_name',label:t.programName},{key:'goal',label:t.goal},{key:'duration_weeks',label:t.duration},{key:'status',label:t.status}]}/>
    </>}

    {activeTab === 'shifts' && isControlAdmin && <ShiftPlannerPage profile={profile} staff={staff} branches={branches} shifts={coachShifts} onSaved={load} lang={lang}/>}

    {activeTab === 'attendancePage' && <AttendancePunchPage profile={profile} staff={staff} shifts={coachShifts} attendanceLogs={attendanceLogs} requests={coachRequests} onSaved={load} lang={lang} canViewAll={isControlAdmin}/>}

    {activeTab === 'requests' && <CoachRequestsPage profile={profile} requests={coachRequests} onSaved={load} lang={lang} canViewAll={isControlAdmin} staff={staff}/>}

    {activeTab === 'targetPlan' && <TargetPlanPage profile={profile} plans={targetPlans} onSaved={load} lang={lang} canViewAll={isControlAdmin} staff={staff}/>}

    {activeTab === 'tasks' && <TrainerTasksPage profile={profile} staff={staff} tasks={trainerTasks} onSaved={load} lang={lang} canAssign={isControlAdmin} canViewAll={isControlAdmin}/>}

    {activeTab === 'inputs' && <>
      {(isTrainer || isSenior || isHeadCoach)&&<AttendanceForm profile={profile} onSaved={load} lang={lang}/>}
      {isTrainer&&<DailyLogForm profile={profile} onSaved={load} lang={lang}/>}
      {isSenior&&<SeniorDailyReportForm profile={profile} onSaved={load} lang={lang}/>}
      {isHeadCoach && <HeadCoachDailyReportForm profile={profile} onSaved={load} lang={lang}/>}
      {isTrainer&&<PTProgramForm profile={profile} clients={visibleClients} onSaved={load} lang={lang}/>}
      {isControlAdmin && <ReceptionLogForm profile={profile} staff={staff} onSaved={load} lang={lang}/>}
      {isControlAdmin && <SalesLeadForm profile={profile} staff={staff} onSaved={load} lang={lang}/>}
    </>}

    {activeTab === 'reception' && <>
      {isControlAdmin && <ReceptionLogForm profile={profile} staff={staff} onSaved={load} lang={lang}/>}      
      <div className="table-actions"><ExportButton rows={visibleReceptionRows} filename="reception-logs.csv" t={t}/></div>
      <Table title={t.receptionLog} rows={visibleReceptionRows} canEdit={false} canDelete={isControlAdmin} onDelete={r=>del('reception_logs',r,r.visitor_name || r.log_date)} t={t} columns={[...(isControlAdmin?[{key:'handled_by_name',label:t.handledBy}]:[]),{key:'log_date',label:t.date},{key:'visitor_name',label:t.visitorName},{key:'phone',label:t.phone},{key:'inquiry_type',label:t.inquiryType},{key:'assigned_trainer_name',label:t.assignedCoach},{key:'outcome',label:t.outcome},{key:'notes',label:t.notes}]} />
    </>}

    {activeTab === 'sales' && <>
      {isControlAdmin && <SalesLeadForm profile={profile} staff={staff} onSaved={load} lang={lang}/>}      
      <div className="table-actions"><ExportButton rows={visibleSalesRows} filename="sales-leads.csv" t={t}/></div>
      <Table title={t.salesLead} rows={visibleSalesRows} canEdit={false} canDelete={isControlAdmin} onDelete={r=>del('sales_leads',r,r.lead_name || r.lead_date)} t={t} columns={[...(isControlAdmin?[{key:'handled_by_name',label:t.handledBy}]:[]),{key:'lead_date',label:t.date},{key:'lead_name',label:t.leadName},{key:'phone',label:t.phone},{key:'source',label:t.source},{key:'interest',label:t.interest},{key:'status',label:t.status},{key:'next_followup_date',label:t.nextFollowupDate},{key:'next_action',label:t.nextAction},{key:'notes',label:t.notes}]} />
    </>}

    {activeTab === 'reports' && <>
      {isAdmin && <MonthlyTrainerReport staff={staff} clients={clients} logs={logs} programs={programs} attendanceLogs={attendanceLogs} evaluations={evaluations} t={t}/>}
      {isBranchLeader && <MonthlyTrainerReport staff={branchStaff} clients={visibleClients} logs={visibleLogs} programs={visibleProgramsRaw} attendanceLogs={visibleAttendanceRaw} evaluations={visibleEvaluationsRaw} t={t}/>}
      {(isAdmin || isSenior) && <Table title={t.seniorReport} rows={visibleSeniorReports} canEdit={false} canDelete={isControlAdmin} onDelete={r=>del('senior_daily_reports',r,r.report_date)} t={t} columns={[...(isAdmin?[{key:'senior_name',label:t.trainerEmail}]:[]),{key:'report_date',label:t.date},{key:'branch_pressure',label:t.branchPressure},{key:'total_sessions_done',label:t.totalSessionsDone},{key:'free_service_count',label:t.freeService},{key:'problem_description',label:t.problemDescription},{key:'floor_tasks',label:t.floorTasks},{key:'service_notes',label:t.serviceNotes},{key:'client_issues',label:t.clientIssues},{key:'actions_taken',label:t.actionsTaken},{key:'resolved',label:t.resolved},{key:'notes',label:t.notes}]}/>}
      {(isAdmin || isHeadCoach) && <Table title={t.headCoachReport} rows={visibleHeadReports} canEdit={false} canDelete={isControlAdmin} onDelete={r=>del('head_coach_daily_reports',r,r.report_date)} t={t} columns={[...(isAdmin?[{key:'head_coach_name',label:t.trainerEmail}]:[]),{key:'report_date',label:t.date},{key:'total_sessions_done',label:t.totalSessionsDone},{key:'free_service_count',label:t.freeService},{key:'rotation_count',label:t.rotation},{key:'tasks_done',label:t.tasksDone},{key:'follow_ups',label:t.followUps},{key:'trainer_issues',label:t.trainerIssues},{key:'branch_summary',label:t.branchSummary},{key:'notes',label:t.notes}]}/>}
      {(isAdmin || isHeadCoach) && <><div className="table-actions"><ExportButton rows={visibleEvaluations} filename="evaluations.csv" t={t}/></div><Table title={t.evaluationHistory} rows={visibleEvaluations} canEdit={false} canDelete={isControlAdmin} onDelete={r=>del('trainer_evaluations',r,r.evaluation_date)} t={t} columns={[{key:'trainer_name',label:t.trainerEmail},{key:'evaluation_date',label:t.date},{key:'technical_score',label:t.technicalScore},{key:'behavior_score',label:t.behaviorScore},{key:'leadership_score',label:t.leadershipScore},{key:'service_score',label:t.serviceScore},{key:'final_score',label:t.finalScore},{key:'grade',label:t.grade},{key:'recommendation',label:t.recommendation},{key:'evaluator_notes',label:t.evaluatorNotes}]}/></>}
      {isAdmin && <AuditLogPanel auditLogs={auditLogs} staff={staff} t={t}/>}
    </>}

    {activeTab === 'staff' && isControlAdmin && <StaffManagement staff={staff} branches={branches} onSaved={load} t={t} currentProfile={profile}/>}

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
  if((profile.status && profile.status !== 'active') || profile.active === false)return <div className="login-page"><div className="login-card"><h2>Account inactive</h2><p className="error">This account is inactive. Please contact the Owner or Fitness Director.</p><button onClick={()=>supabase.auth.signOut()}>Logout</button></div></div>
  return <Layout profile={profile} lang={lang} setLang={setLang}><Dashboard profile={profile} lang={lang}/></Layout>
}

createRoot(document.getElementById('root')).render(<App/>)
