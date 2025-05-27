'use client';

import { useEffect, useState } from "react";
import getUserIdFromUrl from "./util/getUserIdFromUrl";
import { getUser } from "./actions/spotify";
import BlenderForm from "./components/BlenderForm";
import { AppState } from "./types/enums";
import { User } from "@spotify/web-api-ts-sdk";

export default function Home() {

  const [users, setUsers] = useState<User[]>([]);

  const [appState, setAppState] = useState<AppState>(AppState.FORM);

  useEffect(() => {
    for (const user of users) {
      console.log(user.display_name);
    }
  }, [users]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <BlenderForm setUsers={setUsers} />
    </div>
  );
}
