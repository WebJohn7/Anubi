/** Neutral placeholder brand for the public build. The study is of anubi.io's layout and motion, not its identity. */
export const BRAND = "Norva";

/** Prefixes a /public path with the deploy base path (e.g. "/Anubi" on GitHub Pages). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
