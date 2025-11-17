"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import type {
  SearchResponse,
  MediaItemWithLinks,
  CollectionItem,
} from "@/lib/nasa-types";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const getImageUrl = (item: MediaItemWithLinks): string | null => {
  return item.links?.find((link) => link.render === "image")?.href || null;
};

const getHighResImageUrl = (item: MediaItemWithLinks): string | null => {
  if (item.orig) return item.orig;
  const imageLink = item.links
    ?.sort((a, b) => {
      const sizeA = a.size || 0;
      const sizeB = b.size || 0;
      return sizeB - sizeA;
    })
    .find((link) => link.render === "image");
  return imageLink?.href || getImageUrl(item);
};

export default function Page() {
  const [search, setSearch] = React.useState("");
  const [collection, setCollection] = React.useState<{
    data: MediaItemWithLinks[];
  } | null>(null);
  const [raw, setRaw] = React.useState("");

  React.useEffect(() => {
    if (search === "") {
      setCollection(null);
      setRaw("");
      return;
    }

    fetch(
      `/api/nasa/images/search${
        search ? `?q=${encodeURIComponent(search)}` : ""
      }`
    )
      .then((res) => res.json())
      .then((response: SearchResponse) => {
        const allItems: MediaItemWithLinks[] = [];
        if (response.collection?.items) {
          response.collection.items.forEach((item: CollectionItem) => {
            if (item.data && Array.isArray(item.data)) {
              allItems.push(
                ...item.data.map((dataItem) => ({
                  ...dataItem,
                  links: item.links,
                  href: item.href,
                }))
              );
            }
          });
        }

        const collection = {
          data: allItems,
        };

        setCollection(collection);
        setRaw(JSON.stringify(response, null, 2));
        const fetchedHrefs = new Set<string>();
        for (const item of allItems) {
          if (!item.href) continue;
          if (fetchedHrefs.has(item.href)) continue;
          fetchedHrefs.add(item.href);
          fetch(item.href)
            .then((res) => res.json())
            .then((data: unknown) => {
              if (!Array.isArray(data)) return;
              const assets = data as string[];

              if (assets.length === 0) return;

              const origCandidate = assets.find((d) =>
                String(d).includes("~orig")
              );

              const thumbnailCandidate = assets.find((d) =>
                String(d).includes("~thumb")
              );

              const thumb = thumbnailCandidate || assets[0];

              const orig = origCandidate || assets[0];

              setCollection((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  data: prev.data.map((it) =>
                    it.href === item.href ? { ...it, orig, thumb } : it
                  ),
                };
              });
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
        setCollection(null);
        setRaw(String(err));
      });
  }, [search]);

  return (
    <div>
      <Input
        className="max-w-2xl mb-8"
        value={search}
        placeholder="Mars Perseverance rover"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collection?.data?.map((item, idx) => {
          const imageUrl = getImageUrl(item);
          return (
            <div key={item.nasa_id ?? idx} className="border h-fit">
              <div className="p-4">
                <h3 className="font-semibold text-lg">
                  {item.title ?? "Untitled"}
                  {item.date_created && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      • {new Date(item.date_created).getFullYear()}
                    </span>
                  )}
                  {item.photographer && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      • {item.photographer}
                    </span>
                  )}
                </h3>
                {(item.thumbnail || imageUrl) && (
                  <Image
                    src={item.thumbnail || imageUrl || ""}
                    alt={item.description_508 || item.title || "NASA Image"}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover my-2"
                  />
                )}
                {item.keywords?.slice(0, 10).map((keyword) => (
                  <div
                    key={keyword}
                    className="inline-block bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground mr-2 mb-2"
                  >
                    {keyword}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <Link
                  className="inline-flex items-center text-blue-500 hover:underline"
                  href={getHighResImageUrl(item) || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Original {item.media_type}{" "}
                  <ExternalLink className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <pre className="mt-4 max-w-3xl overflow-auto text-xs">{raw}</pre>
    </div>
  );
}
