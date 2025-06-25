let fileSha = null;

async function getFile() {
  const res = await fetch(`https://api.github.com/repos/${CONFIG.GITHUB_REPO}/contents/${CONFIG.GITHUB_FILE_PATH}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${errorText}`);
  }

  const json = await res.json();

  if (!json.content || !json.sha) {
    throw new Error('Invalid response: missing content or sha');
  }

  fileSha = json.sha;
  const content = atob(json.content.replace(/\n/g, ''));
  return JSON.parse(content);
}

async function saveFile(data) {
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
  const res = await fetch(`https://api.github.com/repos/${CONFIG.GITHUB_REPO}/contents/${CONFIG.GITHUB_FILE_PATH}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Update data.json',
      content,
      sha: fileSha,
      branch: CONFIG.GITHUB_BRANCH
    })
  });
  const json = await res.json();
  fileSha = json.content.sha;
}
