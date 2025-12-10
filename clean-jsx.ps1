# 🧙‍♂️ clean-jsx.ps1 — usuwa ukryte znaki sterujące z plików JSX/JS/TSX
# Autor: Grimoire — Twój wierny czarodziej kodu

Write-Host "🔍 Skanuję projekt w poszukiwaniu plików JS/JSX/TSX..." -ForegroundColor Cyan

# Znajdź wszystkie pliki z rozszerzeniem .js, .jsx, .ts, .tsx (bez node_modules)
$files = Get-ChildItem -Recurse -Include *.js,*.jsx,*.ts,*.tsx | Where-Object { -not ($_.FullName -match "node_modules") }

foreach ($file in $files) {
    Write-Host "🧩 Naprawiam: $($file.FullName)" -ForegroundColor Yellow

    # Wczytaj zawartość
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8

    # Usuń niewidoczne znaki sterujące
    $clean = $content `
        -replace "[\u0008\u000B\u000C\u001B\u2028\u2029]", "" `
        -replace "`r", "" `
        -replace "[\x00-\x08\x0B\x0C\x0E-\x1F]", "" `
        -replace " +$", ""

    # Zapisz plik ponownie w UTF-8
    Set-Content -Path $file.FullName -Value $clean -Encoding UTF8
}

Write-Host "`n✅ Czyszczenie zakończone. Wszystkie ukryte znaki usunięte!" -ForegroundColor Green
Write-Host "💡 Uruchom ponownie serwer: npm run dev" -ForegroundColor Gray
