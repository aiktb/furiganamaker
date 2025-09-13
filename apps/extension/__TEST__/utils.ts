export function cleanRubyHtml(html: string): string {
  // Remove all class attributes
  let result = html.replace(/\s*class\s*=\s*(['"])[^'"]*\1/g, "");
  // Remove all <rp>...</rp> tags
  result = result.replace(/<rp>.*?<\/rp>/g, "");
  return result;
}
