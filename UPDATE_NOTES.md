# Gym Zaman MVP - Update Notes

## تم تحديث السيستم في هذه النسخة

- منع المدرب من رؤية بيانات أي مدرب آخر على مستوى الواجهة.
- تنظيم عرض البيانات حسب الدور: Trainer / Senior / Head Coach / Fitness Director / Owner.
- Head Coach و Senior يشوفوا بيانات الفرع فقط: الكباتن، العملاء، التقارير، الحضور، التقييمات.
- Fitness Director و Owner يشوفوا كل الفروع وكل التقارير.
- إضافة ملف سياسات Supabase RLS داخل `supabase/gymzaman_rls_policies.sql` لتأمين قاعدة البيانات نفسها، وليس إخفاء البيانات من الواجهة فقط.
- تحسين وضوح الواجهة والـ dropdowns والـ tabs.
- إزالة النص التوضيحي غير المرغوب من صفحة المدرب.
- تحسين تقارير Head Coach وتجميع الأداء الشهري على مستوى الفرع.

## مهم جدا

تحديث الواجهة وحده لا يكفي للخصوصية. لازم تشغيل ملف:

`supabase/gymzaman_rls_policies.sql`

داخل Supabase SQL Editor بعد مراجعة أسماء الجداول والأعمدة.

## التشغيل

```bash
npm install
npm run dev
```

## البناء للإنتاج

```bash
npm run build
```
