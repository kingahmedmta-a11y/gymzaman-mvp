# Gym Zaman - Fix Trainer Overview
# Run from inside: C:\Users\MK-Store\Desktop\gymzaman-mvp

$FilePath = Join-Path (Get-Location) "src\main.jsx"

if (!(Test-Path $FilePath)) {
  Write-Host "ERROR: src\main.jsx not found. Run this script from inside gymzaman-mvp folder." -ForegroundColor Red
  exit 1
}

$content = Get-Content $FilePath -Raw

# 1) Remove trainer permission note text/card
$content = $content.Replace("صفحة المدرب: تظهر بياناتك أنت فقط حسب صلاحيات قاعدة البيانات.", "")
$content = $content.Replace("Trainer page: only your own data appears according to database permissions.", "")

# Remove common card/note blocks if they became empty after removing the text
$content = [regex]::Replace($content, '<div className="card note">\s*<b>\s*</b>\s*</div>', '', 'Singleline')
$content = [regex]::Replace($content, '<div className="card note">\s*</div>', '', 'Singleline')

# 2) Make trainer overview show action options directly instead of empty collapsed areas.
# If the app has activeTab === 'overview', inject quick action cards for trainer.
$quickActions = @'
{activeTab === 'overview' && isTrainer && (
  <div className="trainer-quick-actions">
    <button type="button" onClick={() => setActiveTab('inputs')}>{t.inputs}</button>
    <button type="button" onClick={() => setActiveTab('clients')}>{t.clients}</button>
    <button type="button" onClick={() => setActiveTab('logs')}>{t.logs}</button>
    <button type="button" onClick={() => setActiveTab('programs')}>{t.programs}</button>
  </div>
)}
'@

if ($content -notmatch "trainer-quick-actions") {
  # Insert after the stats/cards area or before the first activeTab inputs block.
  $content = $content.Replace("{activeTab === 'inputs' &&", $quickActions + "`n`n{activeTab === 'inputs' &&")
}

Set-Content -Path $FilePath -Value $content -Encoding UTF8

Write-Host "DONE: Trainer note removed and quick actions added." -ForegroundColor Green
Write-Host "Now run: npm run build" -ForegroundColor Cyan
