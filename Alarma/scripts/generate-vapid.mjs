// Генерация VAPID-ключей для Web Push.
// Запуск:  node scripts/generate-vapid.mjs   (или  npm run vapid)
//
// Скопируйте вывод в файл .env.local (см. .env.example).
import webpush from "web-push";

const keys = webpush.generateVAPIDKeys();

console.log("\n✅ VAPID-ключи сгенерированы. Вставьте их в .env.local:\n");
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log(`VAPID_SUBJECT=mailto:admin@sharoduwi.ru\n`);
console.log("⚠️  Приватный ключ (VAPID_PRIVATE_KEY) держите в секрете — он только для сервера!\n");
