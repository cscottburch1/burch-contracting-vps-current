import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const baseUrl = 'https://burchcontracting.com';
const expectedSitemaps = [
  `${baseUrl}/sitemap.xml`,
  `${baseUrl}/sitemaps/local-pages.xml`,
  `${baseUrl}/sitemaps/calculators.xml`,
  `${baseUrl}/sitemaps/content.xml`,
];

function assertContains(content, expected, fileLabel) {
  const missing = expected.filter((value) => !content.includes(value));
  if (missing.length > 0) {
    const details = missing.map((value) => `  - ${value}`).join('\n');
    throw new Error(`${fileLabel} is missing expected sitemap lines:\n${details}`);
  }
}

async function main() {
  const repoRoot = process.cwd();
  const publicRobotsPath = resolve(repoRoot, 'public/robots.txt');
  const dynamicRobotsPath = resolve(repoRoot, 'src/app/robots.ts');

  const [publicRobots, dynamicRobots] = await Promise.all([
    readFile(publicRobotsPath, 'utf8'),
    readFile(dynamicRobotsPath, 'utf8'),
  ]);

  assertContains(publicRobots, expectedSitemaps, 'public/robots.txt');
  assertContains(dynamicRobots, expectedSitemaps, 'src/app/robots.ts');

  console.log('SEO validation passed: robots sitemap declarations are synchronized.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
