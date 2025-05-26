'use client';

import Image from "next/image";
import { spotifySDK } from "./lib/spotify";
import { useEffect, useState } from "react";

export default function Home() {
  const [table, setTable] = useState([]);

  useEffect(() => {
    spotifySDK.search("The Beatles", ["artist"]).then((items) => {
      console.table(items.artists.items.map((item) => ({
        name: item.name,
        followers: item.followers.total,
        popularity: item.popularity,
      })));

    });

  }, []);

  return (
    <div></div>
  );
}
