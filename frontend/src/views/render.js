function replaceColorTags(text) {
  const regex = /<color=#[0-9A-Fa-f]{6,8}>(.*?)<\/color>/g;
  const result = text.replace(regex, (match, nickname, offset, string) => {
    const color = match.match(/#[0-9A-Fa-f]{6,8}/)[0];
    return `<span style="color: ${color};">${nickname}</span>`;
  });
  return result;
}

function replaceRubyTags(text) {
  const regex = /\{RUBY#\[([^\]]+)\]([^\}]+)\}/g;
  const result = text.replace(regex, '<span class="ruby"><div class="height"></div><span>$2</span></span>');
  return result;
}

export function replaceBrTags(text) {
  return text.replace(/\\n/g, "<br>");
}

export function renderMessage(text) {
  if (!text) return "";
  return replaceColorTags(replaceRubyTags(replaceBrTags(text)));
}
