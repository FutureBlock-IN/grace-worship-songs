"use client";

import React from "react";
import { Search } from "lucide-react";

import { FirebaseWorshipSearch } from "@/components/search/firebase-worship-search";
import { SearchContentTypeTabs } from "@/components/search/search-content-type-tabs";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffectiveWorshipCollectionTab } from "@/hooks/use-effective-worship-collection-tab";
import { useIsTyping } from "@/hooks/use-store";
import { getSearchPlaceholder } from "@/lib/worship-collection";

type MobileSearchProps = {
  topSearch: React.JSX.Element;
};

export function MobileSearch({ topSearch }: MobileSearchProps) {
  const [query, setQuery] = React.useState("");

  const debouncedQuery = useDebounce(query.trim(), 500);
  const [_, setIsTyping] = useIsTyping();
  const { activeTab, setActiveTab, isRouteLocked } =
    useEffectiveWorshipCollectionTab();

  const searchPlaceholder = getSearchPlaceholder(activeTab);

  React.useEffect(() => {
    setIsTyping(debouncedQuery.length > 0);
  }, [debouncedQuery, setIsTyping]);

  return (
    <>
      <div className="relative mx-auto max-w-md">
        <Search className="absolute left-2 top-3 size-4 text-muted-foreground" />

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-8"
        />
      </div>

      {!isRouteLocked ? (
        <SearchContentTypeTabs activeTab={activeTab} onTabChange={setActiveTab} />
      ) : null}

      {!debouncedQuery.length && topSearch}

      <FirebaseWorshipSearch query={debouncedQuery} />
    </>
  );
}
