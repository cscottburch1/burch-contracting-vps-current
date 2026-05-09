#!/usr/bin/env node

const DEFAULT_BASE_URL = "https://burchcontracting.com";
const baseUrlArg = process.argv.find((arg) => arg.startsWith("--base-url="));
const baseUrl = (baseUrlArg ? baseUrlArg.split("=")[1] : DEFAULT_BASE_URL).replace(/\/$/, "");

const checks = [
  "/",
  "/api/health",
  "/robots.txt",
  "/sitemaps/content.xml",
  "/blog",
  "/cost",
  "/projects",
];

async function checkUrl(pathname) {
  const url = `${baseUrl}${pathname}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "burch-production-smoke/1.0",
      },
    });
    return {
      pathname,
      status: response.status,
      ok: response.status >= 200 && response.status < 400,
    };
  } catch (error) {
    return {
      pathname,
      status: "ERROR",
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function run() {
  console.log(`Running production smoke checks against ${baseUrl}`);

  const results = [];
  for (const pathname of checks) {
    // Run sequentially to keep server load low and produce readable output order.
    const result = await checkUrl(pathname);
    results.push(result);
  }

  let failed = 0;
  for (const result of results) {
    const detail = result.error ? ` (${result.error})` : "";
    console.log(`${result.ok ? "PASS" : "FAIL"} ${result.pathname} -> ${result.status}${detail}`);
    if (!result.ok) {
      failed += 1;
    }
  }

  if (failed > 0) {
    console.error(`Smoke checks failed: ${failed}/${results.length} endpoints did not pass.`);
    process.exit(1);
  }

  console.log(`Smoke checks passed: ${results.length}/${results.length} endpoints healthy.`);
}

run().catch((error) => {
  console.error("Unexpected smoke-check failure", error);
  process.exit(1);
});