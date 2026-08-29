export const FEEDERS = ['SNP.01', 'SNP.02', 'SNP.03', 'SNP.04', 'KRJ13', 'MJW 01'] as const;

export type Feeder = (typeof FEEDERS)[number];

export type Pelanggan = {
  id: string;
  idpel: string;
  nama: string;
  gardu: string;
  feeder: Feeder;
  tarif: string;
  daya: number;
  beban_siang: number;
  beban_malam: number;
  tgl_inspeksi: string;
  keterangan: string;
  created_at?: string;
  updated_at?: string;
};

export type PelangganDraft = Omit<Pelanggan, 'id' | 'created_at' | 'updated_at'>;

export type AppProfile = {
  id: string;
  username: string;
  fullname: string;
  role: 'Admin' | 'Staff';
};

export const EMPTY_DRAFT: PelangganDraft = {
  idpel: '',
  nama: '',
  gardu: '',
  feeder: 'SNP.01',
  tarif: 'I3',
  daya: 0,
  beban_siang: 0,
  beban_malam: 0,
  tgl_inspeksi: new Date().toISOString().slice(0, 10),
  keterangan: 'NYALA',
};

export const SEED_PELANGGAN: Pelanggan[] = [
  ['232111231688', 'PT PERTAMINA GAS', 'SBJ 227', 'SNP.01', 'B3', 2400000, 450, 520, '2026-01-05', 'NYALA'],
  ['232111299812', 'PT PERTAMINA EP', 'SBJ 301', 'SNP.01', 'I4', 3300000, 850, 900, '2026-01-07', 'NYALA'],
  ['232111488990', 'PT KAHURIPAN GEMILANG', 'SBJ 118', 'SNP.01', 'I3', 1650000, 380, 420, '2026-01-13', 'RUANGAN KUBIKEL BERDEBU'],
  ['232111655669', 'PT KUTAI PRIMA COAL', 'SBJ 160', 'SNP.01', 'I4', 3300000, 910, 980, '2026-01-16', 'NYALA'],
  ['232111100111', 'PT TAMBANG DAMAI SEJAHTERA', 'SBJ 101', 'SNP.01', 'I3', 1110000, 250, 290, '2026-01-17', 'NYALA'],
  ['232111245591', 'PT KUTAI TIMBER INDONESIA', 'SBJ 112', 'SNP.02', 'I3', 1110000, 300, 350, '2026-01-06', 'NYALA'],
  ['232111366120', 'PT SBJ MINING CONTRUCTION', 'SBJ 210', 'SNP.02', 'I3', 555000, 130, 160, '2026-01-10', 'NYALA'],
  ['232111511223', 'PT SUMBER DAYA KALTIM', 'SBJ 222', 'SNP.02', 'I4', 2400000, 600, 680, '2026-01-13', 'NYALA'],
  ['232111688998', 'PT EQUATORIAL ENERGY', 'SBJ 288', 'SNP.02', 'I3', 1650000, 420, 480, '2026-01-16', 'NYALA'],
  ['232111288443', 'CV BARA SAMBOJA MANDIRI', 'SBJ 188', 'SNP.03', 'I3', 825000, 210, 260, '2026-01-08', 'PARIT BERAIR'],
  ['232111401292', 'PT BORNEO MINERAL RESOURCES', 'SBJ 145', 'SNP.03', 'I3', 1110000, 280, 310, '2026-01-11', 'RELAY PERLU KALIBRASI'],
  ['232111566778', 'PT ETAM BARA ENERGINDO', 'SBJ 130', 'SNP.03', 'I3', 825000, 200, 240, '2026-01-14', 'NYALA'],
  ['232111722333', 'PT MAHAKAM BARA UTAMA', 'SBJ 172', 'SNP.03', 'I3', 1110000, 275, 310, '2026-01-17', 'NYALA'],
  ['232111744555', 'PT KELAN ENERGI LESTARI', 'SBJ 190', 'SNP.03', 'B3', 825000, 190, 220, '2026-01-17', 'NYALA'],
  ['232111272828', 'PT ALAM JAYA PERSADA', 'SBJ 251', 'SNP.04', 'I3', 555000, 120, 140, '2026-01-04', 'KUBIKEL PERLU PENGGANTIAN'],
  ['232111311009', 'PT MULTI HARAPAN UTAMA', 'SBJ 412', 'KRJ13', 'I3', 1110000, 310, 380, '2026-01-09', 'NYALA'],
  ['232111388901', 'PDAM TIRTA KARTANEGARA', 'SBJ 330', 'KRJ13', 'P2', 415000, 95, 110, '2026-01-11', 'NORMAL'],
  ['232111533445', 'PT SANGATTA UTAMA MINERAL', 'SBJ 401', 'KRJ13', 'I3', 1110000, 290, 330, '2026-01-14', 'NYALA'],
  ['232111355412', 'PT SAKA ENERGI INDONESIA', 'SBJ 105', 'MJW 01', 'B3', 1650000, 400, 450, '2026-01-10', 'NYALA'],
].map(([idpel, nama, gardu, feeder, tarif, daya, beban_siang, beban_malam, tgl_inspeksi, keterangan], index) => ({
  id: `demo-${index + 1}`,
  idpel: String(idpel),
  nama: String(nama),
  gardu: String(gardu),
  feeder: feeder as Feeder,
  tarif: String(tarif),
  daya: Number(daya),
  beban_siang: Number(beban_siang),
  beban_malam: Number(beban_malam),
  tgl_inspeksi: String(tgl_inspeksi),
  keterangan: String(keterangan),
}));

export function inspectionLevel(keterangan: string) {
  const normalized = keterangan.toUpperCase();
  if (normalized.includes('PENGGANTIAN')) return 'priority' as const;
  if (normalized.includes('PERLU') || normalized.includes('BERDEBU') || normalized.includes('BERAIR')) return 'watch' as const;
  return 'normal' as const;
}

export const formatNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export const formatDate = (value: string) => new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}).format(new Date(`${value}T00:00:00`));

export function makeInitials(fullname: string) {
  return fullname.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}
