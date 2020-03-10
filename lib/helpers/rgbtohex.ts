export default function RGBToHex(rgb: string) {
  // thanks https://css-tricks.com/converting-color-spaces-in-javascript/
  let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
  const rgbs: string[] = rgb
    .substr(4)
    .split(')')[0]
    .split(sep);

  let r = (+rgbs[0]).toString(16);
  let g = (+rgbs[1]).toString(16);
  let b = (+rgbs[2]).toString(16);

  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;

  return ('#' + r + g + b).toUpperCase();
}
