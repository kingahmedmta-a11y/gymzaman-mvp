$FilePath = Join-Path (Get-Location) "src\main.jsx"

if (!(Test-Path $FilePath)) {
  Write-Host "ERROR: src\main.jsx not found. Run this from inside gymzaman-mvp folder." -ForegroundColor Red
  exit 1
}

$content = Get-Content $FilePath -Raw

$fixedNav = @'
<nav>
  <a><ShieldCheck size={18}/>{t.dashboard}</a>
  <a><Users size={18}/>{t.clients}</a>
  <a><Dumbbell size={18}/>{t.logs}</a>
  <a><ClipboardList size={18}/>{t.programs}</a>
  {['senior','head_coach','fitness_director','owner'].includes(profile?.role) && (
    <a><UserCog size={18}/>{t.staffManagement}</a>
  )}
</nav>
'@

$pattern = '<nav>[\s\S]*?\{t\.dashboard\}[\s\S]*?\{t\.staffManagement\}[\s\S]*?</nav>'

if ($content -notmatch $pattern) {
  Write-Host "WARNING: Could not find nav block. No changes were made." -ForegroundColor Yellow
  Write-Host "Use README_FIX.txt and replace the nav block manually." -ForegroundColor Yellow
  exit 2
}

$content = [regex]::Replace($content, $pattern, $fixedNav, 1)
$content = $content.Replace("<p>{t.hero}</p>", "")

Set-Content -Path $FilePath -Value $content -Encoding UTF8

Write-Host "DONE: src\main.jsx navigation fixed." -ForegroundColor Green
Write-Host "Now run: npm run build" -ForegroundColor Cyan
