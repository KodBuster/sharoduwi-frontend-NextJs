import {
  COLLECTIONS,
  TAGS,
  type CollectionSlug,
  type ProductTag,
  type TagFilter,
} from "@/lib/data";

export const COLLECTION_SLUGS = COLLECTIONS.map((collection) => collection.slug);

export type { CollectionSlug, ProductTag, TagFilter };
export { TAGS };

export function isValidCollectionSlug(value: string): value is CollectionSlug {
  return (COLLECTION_SLUGS as readonly string[]).includes(value);
}

export function resolveCollectionSlug(
  input?: string | null
): CollectionSlug | undefined {
  if (!input || input === "all" || input === "Все") return undefined;
  if (isValidCollectionSlug(input)) return input;
  const byName = COLLECTIONS.find(
    (collection) => collection.name.toLowerCase() === input.toLowerCase()
  );
  return byName?.slug;
}

export function isValidTagFilter(value: string): value is TagFilter {
  return (TAGS as readonly string[]).includes(value);
}

const TAG_KEYWORDS: Record<ProductTag, string[]> = {
  Цифры: ["цифр", "числ", "number"],
  Композиции: ["композиц", "набор", "букет", "фонтан"],
  Латексные: ["латекс", "облако", "гелий", "шар"],
  Детям: ["дет", "мальчик", "девоч", "годик", "единорог", "космос"],
  Романтика: ["романт", "любл", "сердц"],
  Выписка: ["выписк", "новорож", "мальчик", "девочк"],
};

export function inferProductTags(...parts: (string | undefined)[]): ProductTag[] {
  const text = parts.filter(Boolean).join(" ").toLowerCase();
  const found = new Set<ProductTag>();

  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS) as [
    ProductTag,
    string[],
  ][]) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      found.add(tag);
    }
  }

  return [...found];
}

export function parseTagsFromPropertyValue(value: string): ProductTag[] {
  const found = new Set<ProductTag>();
  const lower = value.toLowerCase();

  for (const tag of TAGS) {
    if (tag === "Все") continue;
    if (lower.includes(tag.toLowerCase())) {
      found.add(tag);
    }
  }

  return [...found];
}
