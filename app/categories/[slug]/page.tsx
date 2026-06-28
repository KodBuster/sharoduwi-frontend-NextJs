import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryPage } from "@/components/CategoryPage";
import { COLLECTIONS, getCollectionBySlug } from "@/lib/data";
import { isValidCollectionSlug, type CollectionSlug } from "@/lib/products";
import { getCatalogProducts, getCatalogSource } from "@/lib/products-service";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return COLLECTIONS.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = isValidCollectionSlug(slug) ? getCollectionBySlug(slug) : undefined;

  if (!collection) {
    return { title: "Коллекция не найдена — ШАРОДУВЫ" };
  }

  return {
    title: `${collection.name} — ШАРОДУВЫ`,
    description: `${collection.name}: ${collection.sub}. Гелиевые шары и композиции в Жуковском и Раменском районе.`,
  };
}

export default async function CollectionRoutePage({ params }: PageProps) {
  const { slug } = await params;

  if (!isValidCollectionSlug(slug)) {
    notFound();
  }

  const collectionSlug = slug as CollectionSlug;
  const initialProducts = await getCatalogProducts({
    collection: collectionSlug,
  }).catch(() => []);

  return (
    <CategoryPage
      slug={collectionSlug}
      initialProducts={initialProducts}
      initialSource={getCatalogSource()}
    />
  );
}
