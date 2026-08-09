"use client";

import { useEffect } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/use-api";
import type { AppNotification } from "@/components/app/AppNotificationBell";

type NotificationScope = "admin" | "customer";

let echo: Echo<"reverb"> | null = null;

function getEcho(token?: string) {
  const key = process.env.NEXT_PUBLIC_REVERB_APP_KEY;
  const host = process.env.NEXT_PUBLIC_REVERB_HOST ?? "127.0.0.1";
  const port = Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080);
  const scheme = process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "http";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!key || !token || !apiUrl) {
    return null;
  }

  if (echo) {
    return echo;
  }

  window.Pusher = Pusher;
  echo = new Echo({
    broadcaster: "reverb",
    key,
    wsHost: host,
    wsPort: port,
    wssPort: port,
    forceTLS: scheme === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${apiUrl}/api/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    }
  });

  return echo;
}

export function useNotifications(scope: NotificationScope) {
  const { data: session } = useSession();
  const { request, token } = useApi();
  const queryClient = useQueryClient();
  const queryKey = [scope, "notifications"] as const;
  const path = `/${scope}/notifications`;

  const query = useQuery({
    queryKey,
    enabled: Boolean(token),
    queryFn: () => request<AppNotification[]>(path)
  });

  useEffect(() => {
    const userId = session?.user?.id;
    const client = getEcho(token);

    if (!client || !userId) {
      return;
    }

    const channelName = `App.Models.User.${userId}`;
    const channel = client.private(channelName);

    channel.notification(() => {
      queryClient.invalidateQueries({ queryKey: [scope, "notifications"] });
    });

    return () => {
      client.leave(channelName);
    };
  }, [queryClient, scope, session?.user?.id, token]);

  return query;
}

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}
