
export type KV = {
  [key: string]: any;
};

export function unique<T extends any>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function make_link(s: string): string {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  return s.replace(urlRegex, (url) => {
    // Ensure 'www' links have a protocol so they actually work
    const href = url.startsWith('http') ? url : `https://${url}`;

    return `<a href="${href}" target="_blank">Link</a>`;
  });

}