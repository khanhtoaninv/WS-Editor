// ZIP tối giản (chỉ "store", không nén) cho gói .wsp: đủ để đóng / mở gói, không thêm thư viện.
// Ghi: tên UTF-8 (cờ 0x0800), ngày cố định (gói cùng nội dung = cùng byte). Đọc: từ chối nén, tên lạ ("..", "/" đầu, "\").

export type Files = Record<string, Uint8Array>;

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
export function crc32(b: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const enc = new TextEncoder(), dec = new TextDecoder('utf-8', { fatal: true });
export const utf8 = (s: string) => enc.encode(s);
export const fromUtf8 = (b: Uint8Array) => dec.decode(b);

const DOS_TIME = 0, DOS_DATE = (2026 - 1980) << 9 | 1 << 5 | 1;   // 01/01/2026 00:00

export function safeName(n: string): boolean {
  return !!n && n.length < 256 && !n.startsWith('/') && !n.includes('\\') && !n.includes('\0') && !n.split('/').some(p => p === '..' || p === '.' || p === '');
}

export function zip(files: Files): Uint8Array {
  const names = Object.keys(files).sort(), parts: Uint8Array[] = [], cen: Uint8Array[] = [];
  let off = 0;
  for (const n of names) {
    if (!safeName(n)) throw new Error(`tên file không hợp lệ: ${n}`);
    const nb = utf8(n), d = files[n], crc = crc32(d);
    const h = new Uint8Array(30 + nb.length), v = new DataView(h.buffer);
    v.setUint32(0, 0x04034b50, true); v.setUint16(4, 20, true); v.setUint16(6, 0x0800, true); v.setUint16(8, 0, true);
    v.setUint16(10, DOS_TIME, true); v.setUint16(12, DOS_DATE, true); v.setUint32(14, crc, true);
    v.setUint32(18, d.length, true); v.setUint32(22, d.length, true); v.setUint16(26, nb.length, true); v.setUint16(28, 0, true);
    h.set(nb, 30);
    const c = new Uint8Array(46 + nb.length), w = new DataView(c.buffer);
    w.setUint32(0, 0x02014b50, true); w.setUint16(4, 20, true); w.setUint16(6, 20, true); w.setUint16(8, 0x0800, true); w.setUint16(10, 0, true);
    w.setUint16(12, DOS_TIME, true); w.setUint16(14, DOS_DATE, true); w.setUint32(16, crc, true);
    w.setUint32(20, d.length, true); w.setUint32(24, d.length, true); w.setUint16(28, nb.length, true);
    w.setUint32(42, off, true); c.set(nb, 46);
    parts.push(h, d); cen.push(c); off += h.length + d.length;
  }
  const cs = cen.reduce((a, b) => a + b.length, 0), e = new Uint8Array(22), x = new DataView(e.buffer);
  x.setUint32(0, 0x06054b50, true); x.setUint16(8, names.length, true); x.setUint16(10, names.length, true);
  x.setUint32(12, cs, true); x.setUint32(16, off, true);
  return concat([...parts, ...cen, e]);
}

export function unzip(b: Uint8Array): Files {
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  let e = -1;
  for (let i = b.length - 22; i >= Math.max(0, b.length - 22 - 65535); i--) if (v.getUint32(i, true) === 0x06054b50) { e = i; break; }
  if (e < 0) throw new Error('không phải file ZIP');
  const n = v.getUint16(e + 10, true), out: Files = {};
  let p = v.getUint32(e + 16, true);
  for (let k = 0; k < n; k++) {
    if (p + 46 > b.length || v.getUint32(p, true) !== 0x02014b50) throw new Error('ZIP hỏng (mục lục)');
    const meth = v.getUint16(p + 10, true), crc = v.getUint32(p + 16, true), size = v.getUint32(p + 20, true);
    const nl = v.getUint16(p + 28, true), xl = v.getUint16(p + 30, true), cl = v.getUint16(p + 32, true), lo = v.getUint32(p + 42, true);
    const name = fromUtf8(b.subarray(p + 46, p + 46 + nl));
    if (meth !== 0) throw new Error(`file nén không hỗ trợ: ${name}`);
    if (!safeName(name)) throw new Error(`tên file không an toàn: ${name}`);
    if (name in out) throw new Error(`file trùng tên: ${name}`);
    if (lo + 30 > b.length || v.getUint32(lo, true) !== 0x04034b50) throw new Error(`ZIP hỏng (${name})`);
    const ln = v.getUint16(lo + 26, true), st = lo + 30 + ln + v.getUint16(lo + 28, true);
    // đầu mục cục bộ phải trùng mục lục (sửa một byte ở bất kỳ đâu cũng bị phát hiện)
    if (ln !== nl || b.subarray(lo + 30, lo + 30 + ln).some((x, i) => x !== b[p + 46 + i]) || v.getUint16(lo + 8, true) !== 0
      || v.getUint32(lo + 14, true) !== crc || v.getUint32(lo + 18, true) !== size || v.getUint32(lo + 22, true) !== size) throw new Error(`ZIP hỏng (đầu mục ${name})`);
    if (st + size > b.length) throw new Error(`ZIP hỏng (${name} bị cắt)`);
    const d = b.slice(st, st + size);
    if (crc32(d) !== crc) throw new Error(`ZIP hỏng (${name} sai CRC)`);
    out[name] = d; p += 46 + nl + xl + cl;
  }
  return out;
}

export function concat(a: Uint8Array[]): Uint8Array {
  const r = new Uint8Array(a.reduce((s, x) => s + x.length, 0));
  let o = 0; for (const x of a) { r.set(x, o); o += x.length; }
  return r;
}
