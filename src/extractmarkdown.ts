import fetch from 'node-fetch';

export async function extractMarkdown(html: string): Promise<string | null> {
    const response = await fetch('https://api.indiepitcher.com/utils/extract_markdown', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ html })
    });

    if (!response.ok) {
        throw new Error('Network response was ' + response.status);
    }

    const data = await response.json();
    return data.markdown;
  }