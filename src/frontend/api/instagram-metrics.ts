import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated } from "./_lib/session.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ connected: false, error: "unauthorized" });
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return res.status(200).json({ connected: false });
  }

  try {
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,followers_count,media_count&access_token=${token}`,
    );

    if (!meRes.ok) {
      return res.status(200).json({ connected: false, error: "Token inválido o expirado" });
    }

    const me = await meRes.json() as {
      username?: string;
      followers_count?: number;
      media_count?: number;
    };

    const mediaRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id,timestamp,like_count,comments_count&limit=12&access_token=${token}`,
    );
    const media = mediaRes.ok
      ? (await mediaRes.json() as { data?: Array<{ like_count?: number; comments_count?: number }> })
      : { data: [] };

    const posts = media.data ?? [];
    const recentLikes = posts.reduce((s, m) => s + (m.like_count ?? 0), 0);
    const recentComments = posts.reduce((s, m) => s + (m.comments_count ?? 0), 0);

    return res.status(200).json({
      connected: true,
      username: me.username ?? "",
      followers: me.followers_count ?? 0,
      postCount: me.media_count ?? 0,
      recentLikes,
      recentComments,
    });
  } catch {
    return res.status(200).json({ connected: false });
  }
}
