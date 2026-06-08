export function cleanLocationText(location: string): string {
  return location
    .replaceAll("点击查看地图", "")
    .replaceAll("查看地图", "")
    .replaceAll("地图", "")
    .replace(/\s+/g, " ")
    .trim();
}
