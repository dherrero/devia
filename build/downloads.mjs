// Download stats for the Devia Desktop GitHub releases.
// Local dev tool — run with: npm run downloads
//
// Counts GitHub's per-asset download_count across all releases and splits
// real installers (.exe/.dmg/.zip/.AppImage/.deb) from auto-updater metadata
// (.yml/.blockmap), which inflate the raw total without being human downloads.
//
// Optional: set GITHUB_TOKEN to raise the API rate limit (60→5000 req/h).

const REPO = process.env.DEVIA_REPO || 'dherrero/devia';
const INSTALLER_RE = /\.(exe|dmg|zip|AppImage|deb)$/i;

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function fetchReleases() {
  const out = [];
  for (let page = 1; ; page++) {
    const url = `https://api.github.com/repos/${REPO}/releases?per_page=100&page=${page}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`GitHub API ${res.status} ${res.statusText} — ${await res.text()}`);
    }
    const batch = await res.json();
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

const fmt = (n) => String(n).padStart(6);

function main(releases) {
  if (releases.length === 0) {
    console.log('No releases found for', REPO);
    return;
  }

  let grandInstallers = 0;
  let grandMeta = 0;

  // Newest first (the API already returns them in that order).
  for (const rel of releases) {
    const tag = rel.tag_name || rel.name || '(untagged)';
    const installers = rel.assets.filter((a) => INSTALLER_RE.test(a.name));
    const relInstallers = installers.reduce((s, a) => s + a.download_count, 0);
    const relMeta = rel.assets
      .filter((a) => !INSTALLER_RE.test(a.name))
      .reduce((s, a) => s + a.download_count, 0);
    grandInstallers += relInstallers;
    grandMeta += relMeta;

    console.log(`\n${tag}  —  ${relInstallers} installer download(s)`);
    if (installers.length === 0) {
      console.log('  (no installer assets)');
    } else {
      for (const a of installers.sort((x, y) => y.download_count - x.download_count)) {
        console.log(`  ${fmt(a.download_count)}  ${a.name}`);
      }
    }
  }

  console.log('\n' + '─'.repeat(48));
  console.log(`  Installers (real downloads): ${grandInstallers}`);
  console.log(`  Auto-updater metadata:       ${grandMeta}  (.yml / .blockmap)`);
  console.log(`  Raw total (all assets):      ${grandInstallers + grandMeta}`);
}

fetchReleases()
  .then(main)
  .catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
