import React from "react";

import { Player } from "@/components/player";
import { RootShell } from "@/components/root-shell";
import { Navbar } from "@/components/site-header/navbar";
import { getUser } from "@/lib/auth";
import { getUserPlaylists } from "@/lib/db/queries";

export default async function Layout({ children }: React.PropsWithChildren) {
  const user = await getUser();

  let userPlaylists;

  if (user) {
    userPlaylists = await getUserPlaylists(user.id);
  }

  return (
    <React.Fragment>
      <Navbar />
      <RootShell player={<Player user={user} playlists={userPlaylists} />}>
        {children}
      </RootShell>
    </React.Fragment>
  );
}
