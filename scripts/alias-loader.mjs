import { statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/*
 * Minimal Node module resolver for this project's "@/..." import alias.
 *
 * The alias is declared in jsconfig.json, which Next's bundler reads but
 * plain `node` does not. Without this, any script that wants to read the
 * section configs directly cannot import them, and the alternative —
 * regex-scraping the files — silently misses the sections that build
 * their field lists programmatically (Amenities and Gallery both do).
 *
 * Used only by scripts/ and the tests, never at runtime.
 */
const SRC_DIR = path.resolve(import.meta.dirname, "..", "src");

/*
 * "server-only" throws when imported outside Next's server bundle. Under
 * plain `node --test` there is no bundle, so it resolves to an empty module
 * and the tests can load server code (lead-sink.js, bearer-auth.js).
 */
const EMPTY_MODULE = "data:text/javascript,export%20%7B%7D%3B";

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return { url: EMPTY_MODULE, shortCircuit: true };
  }

  if (!specifier.startsWith("@/")) {
    return nextResolve(specifier, context);
  }

  const base = path.join(SRC_DIR, specifier.slice(2));

  /*
   * The source omits extensions ("@/content/sections") and relies on
   * directory index resolution, both of which Node requires to be
   * explicit for ES modules.
   *
   * Must test for a FILE, not mere existence: "@/content/sections" is also
   * the name of a real directory, so an existence check matches the
   * directory first and hands Node a path it refuses to import.
   */
  for (const candidate of [base, `${base}.js`, path.join(base, "index.js")]) {
    if (statSync(candidate, { throwIfNoEntry: false })?.isFile()) {
      return nextResolve(pathToFileURL(candidate).href, context);
    }
  }

  return nextResolve(specifier, context);
}
