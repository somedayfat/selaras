export async function saveToGithub(filePath: string, content: string, commitMessage: string) {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.warn("GITHUB_TOKEN is missing. Skipping auto-push to GitHub.");
    return false;
  }

  const owner = "somedayfat";
  const repo = "selaras";
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  try {
    // 1. Get current file SHA
    const getRes = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Selaras-CMS",
      },
    });

    let sha = "";
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    } else if (getRes.status !== 404) {
      console.error("Failed to fetch file SHA from GitHub:", await getRes.text());
      return false;
    }

    // 2. Base64 encode the new content
    const base64Content = Buffer.from(content, "utf-8").toString("base64");

    // 3. Update the file
    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Selaras-CMS",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
        sha: sha || undefined,
        branch: "main",
      }),
    });

    if (putRes.ok) {
      console.log(`Successfully pushed ${filePath} to GitHub.`);
      return true;
    } else {
      console.error("Failed to push to GitHub:", await putRes.text());
      return false;
    }
  } catch (error) {
    console.error("Error during GitHub auto-push:", error);
    return false;
  }
}
