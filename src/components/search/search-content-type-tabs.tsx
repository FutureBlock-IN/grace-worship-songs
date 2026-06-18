"use client";

import type { WorshipCollectionTab } from "@/hooks/use-store";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SearchContentTypeTabsProps = {
  activeTab: WorshipCollectionTab;
  onTabChange: (tab: WorshipCollectionTab) => void;
};

export function SearchContentTypeTabs({
  activeTab,
  onTabChange,
}: SearchContentTypeTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as WorshipCollectionTab)}
      className="w-full"
    >
      <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-lg bg-muted/50 p-1">
        <TabsTrigger value="songs" className="rounded-md text-xs sm:text-sm">
          Songs
        </TabsTrigger>
        <TabsTrigger value="ceremonies" className="rounded-md text-xs sm:text-sm">
          Ceremonies
        </TabsTrigger>
        <TabsTrigger value="articles" className="rounded-md text-xs sm:text-sm">
          Articles
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
