import {
  SETTLEMENT_NAMES,
  SETTLEMENT_SLUGS,
  getG6SettlementNames,
  G4_TOP_NAMES,
  G5_TOP_NAMES,
  isG6Eligible,
} from "./lib/direct-settlements.mjs";
import { buildGeoCampaignGroups } from "./lib/direct-geo-groups.mjs";

const userListRaw = `Жуковский
Раменское
Быково
Ильинский
Кратово
Родники
Удельная
Бронницы 
Ганусово 
Гжелка 
Гжельского кирпичного завода 
Денежниково 
Дружба 
Дубовая Роща 
Имени Тельмана 
Комбината стройматериалов‑1 
Комбината стройматериалов‑2 
Красковский СВХ 
Кузяевского фарфорового завода 
Ленина ВЭИ 
Машиностроитель 
Мирный 
Опытное Поле 
Раменской агрохимстанции (РАОС) 
Ремзавода 
Рылеево 
Сафоновский СВХ 
Санатория «Раменское» 
Спартак 
Шевлягинского завода 
Электроизолятор 
Агашкино 
Аксёново 
Амирово 
Антоново 
Аринино 
Арменево 
Бахтеево 
Белозериха 
Бельково 
Бисерово 
Боршева 
Бояркино 
Бритово 
Верхнее Мячково 
Вишняково 
Владимировка 
Власово 
Воловое 
Володино 
Вороново 
Воскресенское 
Вялки 
Ганусово 
Гжель 
Григорово 
Давыдово 
Дементьево 
Еганово 
Заворово 
Загорново 
Захарово 
Зелёная Слобода 
Зюзино 
Ивановка 
Игнатьево 
Ильинское 
Карпово 
Константиново 
Кривцы 
Малышево 
Марково 
Михеево 
Никоновское 
Никулино 
Новое 
Новохаритоново 
Петровское 
Поповка 
Речицы 
Рыболово 
Салтыково 
Сельцо 
Синьково 
Софьино 
Степановское 
Татаринцево 
Ульянино 
Фомино 
Шилово 
Аргуново 
Бубново 
Булгаково 
Василево 
Васильево 
Верея 
Вертячево 
Верхнее Велино 
Вохринка 
Галушино 
Головино 
Глебово 
Дергаево 
Денисьево 
Дурниха 
Дьяково 
Ждановское 
Жирово 
Жирошкино 
Жуково 
Заболотье 
Забусово 
Заворово 
Загорново 
Залесье 
Заозерье 
Запрудное 
Захариха 
Какузево 
Каменное Тяжино 
Капустино 
Клишева 
Костино 
Кошерово 
Коробово 
Копнино 
Коняшино 
Косякино 
Кочина Гора 
Кулаково 
Кузяево 
Левино 
Липкино 
Литвиново 
Локтевая 
Лубнинка 
Лужки 
Макаровка 
Малое Саврасово 
Малышево 
Марково 
Меткомелино 
Мещеры 
Митьково 
Минино 
Михнево 
Морозово 
Надеждино 
Натальино 
Нащекино 
Нестерово 
Нижнее Велино 
Нижнее Мячково 
Никитское 
Новомайково 
Новомарьинка 
Овчинкино 
Островцы 
Панино 
Патрикеево 
Паткино 
Пестовка 
Першино 
Пласкинино 
Плетениха 
Подберезное 
Поддубье 
Починки 
Прудки 
деревня Пушкино 
Редькино 
Рогачёво 
Рыбаки 
Рылеево 
Сальково 
Сельвачево 
Семеновское 
Сидорово 
Слободка 
Соколово‑Хомьяново 
Старково 
Старомайково 
Становое 
Тимонино 
Толмачево 
Турыгино 
Устиновка 
Федино 
Фенино 
Фрязино 
Хлыново 
Холуденево 
Хрипань 
Чекменево 
Чулково 
Шевлягино 
Ширяево 
Шувайлово 
Щеголево 
Юрово 
Юрасово 
Юсупово 
Яньшино 
Люберцы
Дзержинский
Жилино-1
Красково
Малаховка
Марусино
Мирный
Октябрьский
Томилино
Балластный Карьер
Егорово
Жилино-2
Михнево
Опытное Поле
Чкалово
Кирилловка
Лукьяновка
Машково
Мотяково
Пехорка
Сельцо
Сосновка
Токарёво
Торбеево
Хлыстово
Часовня?`;

function norm(s) {
  return s
    .trim()
    .replace(/[‑–—]/g, "-")
    .replace(/\?+$/, "")
    .replace(/\s+/g, " ");
}

function groupSettlementName(groupName) {
  const m = groupName.match(/\. (.+)$/);
  return m ? m[1] : groupName;
}

function sanitizeGroupLabel(name) {
  return norm(name)
    .replace(/\([^)]*\)/g, "")
    .replace(/[«»]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function inCampaign(name, groups) {
  const target = sanitizeGroupLabel(name);
  return groups.some((g) => sanitizeGroupLabel(groupSettlementName(g.name)) === target);
}

const userItems = userListRaw.split(/\n+/).map(norm).filter(Boolean);
const userUnique = [...new Set(userItems)];
const userDupes = [...new Set(userItems.filter((x, i, a) => a.indexOf(x) !== i))];

const campaignGroups = buildGeoCampaignGroups();

const notInData = [];
const inDataNotCampaign = [];

for (const u of userUnique) {
  const canonical = SETTLEMENT_NAMES.find((d) => norm(d) === norm(u));
  if (!canonical) {
    notInData.push(u);
    continue;
  }
  if (!inCampaign(canonical, campaignGroups)) {
    inDataNotCampaign.push(canonical);
  }
}

const fromDataNotUser = SETTLEMENT_NAMES.filter(
  (d) => !userUnique.some((u) => norm(u) === norm(d))
);

const missingFromCampaign = SETTLEMENT_NAMES.filter(
  (n) => !inCampaign(n, campaignGroups)
);

const excludedFromG6 = SETTLEMENT_NAMES.filter(
  (n) =>
    !isG6Eligible(n) &&
    !["Жуковский", "Раменское", "Люберцы", "Дзержинский"].includes(n) &&
    !G4_TOP_NAMES.includes(n) &&
    !G5_TOP_NAMES.includes(n)
);

console.log("=== SUMMARY ===");
console.log("User list lines:", userItems.length);
console.log("User unique:", userUnique.length);
console.log("User duplicates in list:", userDupes.join(", ") || "none");
console.log("Site/campaign SETTLEMENT_NAMES:", SETTLEMENT_NAMES.length);
console.log("Campaign groups:", campaignGroups.length);
console.log("G6 groups:", getG6SettlementNames().length);

console.log("\n=== NOT IN SITE DATA (from user list) ===");
console.log(notInData.length ? notInData : "none");

console.log("\n=== IN DATA + USER LIST BUT NOT IN CAMPAIGN ===");
console.log(inDataNotCampaign.length ? inDataNotCampaign : "none");

console.log("\n=== IN DATA BUT NOT IN USER LIST ===");
console.log(fromDataNotUser.length ? fromDataNotUser : "none");

console.log("\n=== ALL SETTLEMENT_NAMES MISSING FROM CAMPAIGN ===");
console.log(missingFromCampaign.length ? missingFromCampaign : "none");

console.log("\n=== EXCLUDED FROM G6 (special cases) ===");
console.log(excludedFromG6);

console.log("\n=== PAGES (all SETTLEMENT_NAMES get /{slug}) ===");
for (const n of missingFromCampaign) {
  const slug = SETTLEMENT_SLUGS.get(n);
  console.log(`  ${n} → https://sharoduwi.ru/${slug} (page есть, отдельной группы в кампании нет)`);
}
console.log(
  "Остальные",
  SETTLEMENT_NAMES.length - missingFromCampaign.length,
  "НП: страница https://sharoduwi.ru/{slug} + группа в кампании"
);

console.log("\n=== SANITIZED CAMPAIGN NAMES (для справки) ===");
for (const n of ["Раменской агрохимстанции (РАОС)", "Санатория «Раменское»"]) {
  const g = campaignGroups.find((x) => inCampaign(n, [x]));
  if (g) console.log(`  ${n} → группа «${g.name}» → ${g.slug}`);
}
