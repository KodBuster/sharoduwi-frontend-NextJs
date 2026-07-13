# ШАРОДУВЫ Staff Alert — приложение в трее (Windows 10/11)

Фоновое приложение около часов Windows:
- слушает новые заказы через API опроса
- включает **громкий звуковой сигнал** даже без открытого окна
- **запускается вместе с Windows**
- не зависит от «протухшей» web-push подписки браузера

## Скачать и установить на другом компьютере

После деплоя сайта откройте на том ПК:

**https://sharoduwi.ru/downloads/Sharoduwy-Staff-Alert-Setup-1.0.0.exe**

или раздел Windows на странице `/staff-alert`.

1. Запустите установщик.
2. Если SmartScreen ругается: «Подробнее» → «Выполнить в любом случае».
3. При первом запуске укажите:
   - сайт: `https://sharoduwi.ru`
   - пароль Staff Alert
   - галочку «Запускать с Windows»
4. Иконка появится у часов (трей).

## Что нужно на сервере

1. Endpoint: `GET /api/staff-alert/poll`
2. Пароль = `STAFF_ALERT_PASSWORD`
3. Файл установщика в `public/downloads/Sharoduwy-Staff-Alert-Setup-1.0.0.exe`

## Сборка установщика заново

```powershell
cd desktop/staff-alert
npm install
npm approve-scripts electron
$env:CSC_IDENTITY_AUTO_DISCOVERY='false'
npm run dist
Copy-Item "dist\Sharoduwy-Staff-Alert-Setup-1.0.0.exe" "..\..\public\downloads\" -Force
```

## Важно

- Windows 10 / 11 (x64).
- Первый заказ после запуска не сигналит (запоминается), сигналят следующие.
- В Windows разрешите уведомления для «ШАРОДУВЫ Staff Alert».
