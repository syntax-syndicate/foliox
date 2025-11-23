export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  x?: string;
  instagram?: string;
}

export function parseSocialLinksFromReadme(readmeContent: string): SocialLinks {
  const links: SocialLinks = {};

  const linkedinPatterns = [
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9-]+)/gi,
    /linkedin\.com\/in\/([a-zA-Z0-9-]+)/gi,
    /\[LinkedIn\]\((https?:\/\/[^\s\)]+linkedin\.com[^\s\)]+)\)/gi,
    /\[LinkedIn\]\((https?:\/\/[^\s\)]+linkedin\.com\/in\/[^\s\)]+)\)/gi,
    /linkedin:\s*(https?:\/\/[^\s]+)/gi,
    /<a[^>]*href=["'](https?:\/\/[^"']*linkedin\.com[^"']*)["'][^>]*>/gi,
    /href=["'](https?:\/\/[^"']*linkedin\.com[^"']*)["']/gi,
  ];

  for (const pattern of linkedinPatterns) {
    const matches = readmeContent.matchAll(pattern);
    for (const match of matches) {
      let url: string | undefined;
      
      if (match[1]) {
        if (match[1].startsWith('http://') || match[1].startsWith('https://')) {
          url = match[1];
        } else if (match[1].match(/^[a-zA-Z0-9-]+$/)) {
          url = `https://www.linkedin.com/in/${match[1]}`;
        }
      }
      
      if (url && url.includes('linkedin.com')) {
        if (!url.startsWith('http')) {
          url = `https://${url}`;
        }
        links.linkedin = url;
        break;
      }
    }
    if (links.linkedin) break;
  }

  const twitterPatterns = [
    /twitter\.com\/([a-zA-Z0-9_]+)/gi,
    /x\.com\/([a-zA-Z0-9_]+)/gi,
    /\[Twitter\]\((https?:\/\/[^\s\)]+(?:twitter|x)\.com[^\s\)]+)\)/gi,
    /\[X\]\((https?:\/\/[^\s\)]+(?:twitter|x)\.com[^\s\)]+)\)/gi,
    /twitter:\s*(https?:\/\/[^\s]+)/gi,
    /x:\s*(https?:\/\/[^\s]+)/gi,
  ];

  for (const pattern of twitterPatterns) {
    const matches = readmeContent.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].startsWith('http')) {
        links.twitter = match[1];
        links.x = match[1];
      } else if (match[1]) {
        const username = match[1];
        links.twitter = `https://twitter.com/${username}`;
        links.x = `https://x.com/${username}`;
      }
      if (links.twitter) break;
    }
    if (links.twitter) break;
  }

  const instagramPatterns = [
    /instagram\.com\/([a-zA-Z0-9_.]+)/gi,
    /\[Instagram\]\((https?:\/\/[^\s\)]+instagram\.com[^\s\)]+)\)/gi,
    /instagram:\s*(https?:\/\/[^\s]+)/gi,
  ];

  for (const pattern of instagramPatterns) {
    const matches = readmeContent.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].startsWith('http')) {
        links.instagram = match[1];
      } else if (match[1]) {
        links.instagram = `https://www.instagram.com/${match[1]}`;
      }
      if (links.instagram) break;
    }
    if (links.instagram) break;
  }

  return links;
}
