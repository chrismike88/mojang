'use client';

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bolt,
  Cable,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Database,
  Edit3,
  FileSpreadsheet,
  FileText,
  Gauge,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Moon,
  Plus,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  UserRound,
  UsersRound,
  X,
  Zap,
} from 'lucide-react';
import {
  type CSSProperties,
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  EMPTY_DRAFT,
  FEEDERS,
  SEED_PELANGGAN,
  type AppProfile,
  type Feeder,
  type Pelanggan,
  type PelangganDraft,
  formatDate,
  formatNumber,
  inspectionLevel,
  makeInitials,
} from '@/lib/data';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type View = 'dashboard' | 'pelanggan' | 'inspeksi' | 'laporan';
type Toast = { message: string; tone: 'success' | 'error' } | null;

const nav: Array<{ id: View; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', label: 'Ikhtisar', icon: LayoutDashboard },
  { id: 'pelanggan', label: 'Pelanggan TM', icon: UsersRound },
  { id: 'inspeksi', label: 'Inspeksi gardu', icon: ClipboardCheck },
  { id: 'laporan', label: 'Laporan', icon: FileText },
];

const pageCopy: Record<View, { eyebrow: string; title: string; accent: string; description: string }> = {
  dashboard: {
    eyebrow: 'Distribution intelligence',
    title: 'Selamat datang,',
    accent: 'Tim Samboja.',
    description: 'Pantau kesehatan jaringan dan beban pelanggan tegangan menengah secara real-time.',
  },
  pelanggan: {
    eyebrow: 'Customer operations',
    title: 'Database',
    accent: 'Pelanggan TM.',
    description: 'Kelola data pelanggan, daya terpasang, gardu, dan beban setiap penyulang.',
  },
  inspeksi: {
    eyebrow: 'Asset care',
    title: 'Kesehatan',
    accent: 'Gardu & Kubikel.',
    description: 'Prioritaskan tindak lanjut berdasarkan hasil inspeksi terbaru di lapangan.',
  },
  laporan: {
    eyebrow: 'Operational reporting',
    title: 'Rekap',
    accent: 'Kinerja Jaringan.',
    description: 'Ringkasan siap cetak untuk pelaporan pelanggan dan beban ULP Samboja.',
  },
};

function IsoIcon({ children, tone = 'violet', small = false }: { children: ReactNode; tone?: string; small?: boolean }) {
  return (
    <span className={`iso-icon iso-${tone} ${small ? 'iso-small' : ''}`}>
      <span>{children}</span>
    </span>
  );
}

function statusLabel(keterangan: string) {
  const level = inspectionLevel(keterangan);
  if (level === 'priority') return 'Prioritas';
  if (level === 'watch') return 'Perhatian';
  return 'Normal';
}

function MetricCard({
  label,
  value,
  suffix,
  helper,
  helperStrong,
  tone,
  icon,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  helper: string;
  helperStrong: string;
  tone: string;
  icon: ReactNode;
}) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <div className="metric-copy">
        <span>{label}</span>
        <strong>{value} {suffix && <em>{suffix}</em>}</strong>
        <small><b>{helperStrong}</b> {helper}</small>
      </div>
      <IsoIcon tone={tone}>{icon}</IsoIcon>
    </article>
  );
}

function AppLoader() {
  return (
    <main className="loading-screen">
      <IsoIcon tone="amber"><Bolt size={28} /></IsoIcon>
      <div><LoaderCircle className="spin" size={18} /><span>Menyiapkan workspace MOJANG</span></div>
    </main>
  );
}

function LoginPage({ onLogin, loading, error }: { onLogin: (username: string, password: string) => Promise<void>; loading: boolean; error: string }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void onLogin(username, password);
  };

  return (
    <main className="auth-shell">
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />
      <section className="auth-story">
        <div className="auth-brand">
          <IsoIcon tone="amber"><Bolt size={24} strokeWidth={2.7} /></IsoIcon>
          <div><strong>MOJANG</strong><span>ULP Samboja</span></div>
        </div>
        <div className="auth-copy">
          <span className="auth-kicker"><Sparkles size={14} /> Distribution intelligence</span>
          <h1>Satu kendali.<br /><span>Seluruh jaringan.</span></h1>
          <p>Monitoring pelanggan JTM, kesehatan gardu, dan beban penyulang dalam satu ruang kerja yang aman.</p>
        </div>
        <div className="auth-network" aria-hidden="true">
          <div className="network-tile tile-one"><Cable /></div>
          <div className="network-line line-one" />
          <div className="network-tile tile-two"><Zap /></div>
          <div className="network-line line-two" />
          <div className="network-tile tile-three"><BarChart3 /></div>
          <i /><i /><i /><i />
        </div>
        <div className="auth-trust"><ShieldCheck size={17} /><span>Data terenkripsi dan terlindungi oleh Supabase Auth</span></div>
      </section>

      <section className="auth-panel">
        <form className="login-card" onSubmit={submit}>
          <span className="login-icon"><UserRound size={22} /></span>
          <h2>Masuk ke workspace</h2>
          <p>Gunakan akun operasional ULP Samboja.</p>
          <label>
            <span>Username</span>
            <div className="field-control"><UserRound size={17} /><input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" placeholder="admin atau staff" required /></div>
          </label>
          <label>
            <span>Password</span>
            <div className="field-control"><ShieldCheck size={17} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Masukkan password" required /></div>
          </label>
          {error && <div className="auth-error"><AlertTriangle size={15} />{error}</div>}
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="spin" size={18} /> : <ArrowRight size={18} />}
            {loading ? 'Mengautentikasi...' : 'Masuk aplikasi'}
          </button>
          <small>Dengan masuk, aktivitas perubahan data akan tercatat dalam audit log.</small>
        </form>
      </section>
    </main>
  );
}

function Dashboard({ data }: { data: Pelanggan[] }) {
  const feederStats = useMemo(() => FEEDERS.map((name) => {
    const rows = data.filter((item) => item.feeder === name);
    return {
      name,
      count: rows.length,
      day: rows.reduce((sum, item) => sum + Number(item.beban_siang), 0),
      night: rows.reduce((sum, item) => sum + Number(item.beban_malam), 0),
      power: rows.reduce((sum, item) => sum + Number(item.daya), 0),
    };
  }), [data]);
  const power = data.reduce((sum, item) => sum + Number(item.daya), 0) / 1000;
  const dayLoad = data.reduce((sum, item) => sum + Number(item.beban_siang), 0);
  const nightLoad = data.reduce((sum, item) => sum + Number(item.beban_malam), 0);
  const issues = data.filter((item) => inspectionLevel(item.keterangan) !== 'normal');
  const normal = data.length - issues.length;
  const watch = data.filter((item) => inspectionLevel(item.keterangan) === 'watch').length;
  const priority = data.filter((item) => inspectionLevel(item.keterangan) === 'priority').length;
  const reliability = data.length ? Math.round((normal / data.length) * 100) : 0;
  const utilization = power ? Math.round((nightLoad / power) * 1000) / 10 : 0;
  const maxLoad = Math.max(1, ...feederStats.flatMap((item) => [item.day, item.night]));
  const yTop = Math.ceil(maxLoad / 500) * 500;

  return (
    <div className="view-enter">
      <div className="metric-grid">
        <MetricCard label="Total pelanggan TM" value={data.length} helper="database terverifikasi" helperStrong="19 baris" tone="violet" icon={<UsersRound size={25} />} />
        <MetricCard label="Penyulang aktif" value={FEEDERS.filter((feeder) => data.some((item) => item.feeder === feeder)).length} helper="dalam operasi" helperStrong="100%" tone="mint" icon={<Cable size={25} />} />
        <MetricCard label="Daya terpasang" value={formatNumber(power)} suffix="kVA" helper="utilisasi beban malam" helperStrong={`${utilization}%`} tone="amber" icon={<Zap size={25} />} />
        <MetricCard label="Perlu perhatian" value={issues.length} helper={`${new Set(issues.map((item) => item.gardu)).size} gardu perlu tindak lanjut`} helperStrong={`${priority} prioritas`} tone="coral" icon={<Activity size={25} />} />
      </div>

      <div className="content-grid">
        <article className="panel load-panel">
          <div className="panel-head">
            <div><span className="panel-kicker">Load intelligence</span><h2>Beban siang & malam</h2></div>
            <div className="legend"><span><i className="dot dot-day" /> Siang · {formatNumber(dayLoad)} kVA</span><span><i className="dot dot-night" /> Malam · {formatNumber(nightLoad)} kVA</span></div>
          </div>
          <div className="bar-chart" role="img" aria-label="Grafik beban per penyulang">
            <div className="y-axis"><span>{formatNumber(yTop)}</span><span>{formatNumber(yTop * .75)}</span><span>{formatNumber(yTop * .5)}</span><span>{formatNumber(yTop * .25)}</span><span>0</span></div>
            <div className="bar-stage">
              {feederStats.map((feeder, index) => (
                <div className="bar-group" key={feeder.name} style={{ '--delay': `${index * 80}ms` } as CSSProperties}>
                  <div className="bars">
                    <i title={`${feeder.name} siang: ${formatNumber(feeder.day)} kVA`} className="bar bar-day" style={{ height: `${Math.max(2, (feeder.day / yTop) * 100)}%` }} />
                    <i title={`${feeder.name} malam: ${formatNumber(feeder.night)} kVA`} className="bar bar-night" style={{ height: `${Math.max(2, (feeder.night / yTop) * 100)}%` }} />
                  </div>
                  <span>{feeder.name}</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel health-panel">
          <div className="panel-head">
            <div><span className="panel-kicker">Network health</span><h2>Kondisi inspeksi</h2></div>
            <span className="sync-badge"><span /> Live</span>
          </div>
          <div className="health-visual">
            <div className="donut" style={{ '--normal': `${reliability * 3.6}deg`, '--watch': `${(reliability + (watch / Math.max(1, data.length)) * 100) * 3.6}deg` } as CSSProperties}><div><strong>{reliability}%</strong><span>Normal</span></div></div>
            <div className="health-list">
              <div><span><i className="health-dot ok" /> Normal / nyala</span><b>{normal}</b></div>
              <div><span><i className="health-dot watch" /> Perhatian</span><b>{watch}</b></div>
              <div><span><i className="health-dot risk" /> Prioritas</span><b>{priority}</b></div>
            </div>
          </div>
          <div className="insight-strip"><Gauge size={19} /><div><strong>Keandalan {reliability >= 80 ? 'stabil' : 'perlu penguatan'}</strong><span>{normal} titik beroperasi normal</span></div><BarChart3 size={18} /></div>
        </article>
      </div>

      <article className="panel feeder-panel">
        <div className="panel-head">
          <div><span className="panel-kicker">Feeder pulse</span><h2>Snapshot per penyulang</h2></div>
          <span className="updated-label">Berdasarkan {data.length} pelanggan</span>
        </div>
        <div className="feeder-grid">
          {feederStats.map((feeder, index) => (
            <div className="feeder-card" key={feeder.name}>
              <IsoIcon tone={['violet', 'mint', 'amber', 'coral', 'blue', 'teal'][index]} small><Bolt size={17} /></IsoIcon>
              <div><strong>{feeder.name}</strong><span>{feeder.count} pelanggan</span></div>
              <div className="feeder-load"><b>{formatNumber(feeder.night)}</b><span>kVA malam</span></div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  return (
    <div className="pagination" aria-label="Paginasi">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Halaman sebelumnya"><ChevronLeft size={16} /></button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => <button key={item} className={page === item ? 'active' : ''} onClick={() => onChange(item)}>{item}</button>)}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages} aria-label="Halaman berikutnya"><ChevronRight size={16} /></button>
    </div>
  );
}

function PelangganView({
  data,
  search,
  role,
  onEdit,
  onDelete,
}: {
  data: Pelanggan[];
  search: string;
  role: AppProfile['role'];
  onEdit: (item: Pelanggan) => void;
  onDelete: (item: Pelanggan) => void;
}) {
  const [feeder, setFeeder] = useState<string>('Semua');
  const [page, setPage] = useState(1);
  const pageSize = 7;
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return data.filter((item) => {
      const matchesFeeder = feeder === 'Semua' || item.feeder === feeder;
      const matchesSearch = !query || [item.idpel, item.nama, item.gardu, item.tarif].some((value) => value.toLowerCase().includes(query));
      return matchesFeeder && matchesSearch;
    });
  }, [data, feeder, search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => setPage(1), [feeder, search]);

  return (
    <div className="view-enter">
      <div className="mini-stat-grid">
        {FEEDERS.map((name, index) => {
          const count = data.filter((item) => item.feeder === name).length;
          return (
            <button key={name} className={`mini-stat ${feeder === name ? 'active' : ''}`} onClick={() => setFeeder(feeder === name ? 'Semua' : name)}>
              <IsoIcon tone={['violet', 'mint', 'amber', 'coral', 'blue', 'teal'][index]} small><Cable size={16} /></IsoIcon>
              <div><span>{name}</span><strong>{count}</strong><small>pelanggan</small></div>
            </button>
          );
        })}
      </div>

      <article className="panel data-panel">
        <div className="panel-head data-panel-head">
          <div><span className="panel-kicker">Master database</span><h2>Data pelanggan tegangan menengah</h2><p>{filtered.length} data ditemukan · klik kartu penyulang untuk memfilter</p></div>
          <div className="filter-control">
            <Cable size={16} />
            <select value={feeder} onChange={(event) => setFeeder(event.target.value)} aria-label="Filter penyulang">
              <option>Semua</option>{FEEDERS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Pelanggan</th><th>Gardu / Feeder</th><th>Tarif & daya</th><th>Beban kVA</th><th>Inspeksi</th><th aria-label="Aksi" /></tr></thead>
            <tbody>
              {visible.map((item) => {
                const level = inspectionLevel(item.keterangan);
                return (
                  <tr key={item.id}>
                    <td><div className="customer-cell"><span>{makeInitials(item.nama)}</span><div><strong>{item.nama}</strong><small>{item.idpel}</small></div></div></td>
                    <td><strong className="cell-primary">{item.gardu}</strong><span className="feeder-pill">{item.feeder}</span></td>
                    <td><strong className="cell-primary">{item.tarif}</strong><small className="cell-secondary">{formatNumber(item.daya / 1000)} kVA</small></td>
                    <td><div className="dual-load"><span><Sun size={13} />{formatNumber(item.beban_siang)}</span><span><Moon size={13} />{formatNumber(item.beban_malam)}</span></div></td>
                    <td><span className={`status-pill ${level}`}><i />{statusLabel(item.keterangan)}</span><small className="cell-secondary">{formatDate(item.tgl_inspeksi)}</small></td>
                    <td><div className="row-actions"><button aria-label={`Edit ${item.nama}`} onClick={() => onEdit(item)}><Edit3 size={15} /></button>{role === 'Admin' && <button className="danger" aria-label={`Hapus ${item.nama}`} onClick={() => onDelete(item)}><Trash2 size={15} /></button>}</div></td>
                  </tr>
                );
              })}
              {!visible.length && <tr><td colSpan={6}><div className="empty-state"><Search size={23} /><strong>Data tidak ditemukan</strong><span>Coba kata kunci atau penyulang lain.</span></div></td></tr>}
            </tbody>
          </table>
        </div>
        <div className="table-footer"><span>Menampilkan {visible.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filtered.length)} dari {filtered.length}</span><Pagination page={safePage} totalPages={totalPages} onChange={setPage} /></div>
      </article>
    </div>
  );
}

function InspeksiView({ data, search }: { data: Pelanggan[]; search: string }) {
  const [feeder, setFeeder] = useState<string>('Semua');
  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return [...data].filter((item) => (feeder === 'Semua' || item.feeder === feeder) && (!query || [item.nama, item.gardu, item.keterangan].some((value) => value.toLowerCase().includes(query)))).sort((a, b) => b.tgl_inspeksi.localeCompare(a.tgl_inspeksi));
  }, [data, feeder, search]);
  const normal = data.filter((item) => inspectionLevel(item.keterangan) === 'normal').length;
  const watch = data.filter((item) => inspectionLevel(item.keterangan) === 'watch').length;
  const priority = data.filter((item) => inspectionLevel(item.keterangan) === 'priority').length;

  return (
    <div className="view-enter">
      <div className="inspection-summary">
        <article className="inspection-hero">
          <div><span className="panel-kicker">Inspection score</span><strong>{Math.round((normal / Math.max(1, data.length)) * 100)}</strong><em>/100</em><p>Kesehatan jaringan secara keseluruhan</p></div>
          <div className="score-orbit"><ClipboardCheck /><i /><i /><i /></div>
        </article>
        <article className="condition-card normal"><IsoIcon tone="mint"><Check size={24} /></IsoIcon><div><strong>{normal}</strong><span>Normal / nyala</span><small>Operasi stabil</small></div></article>
        <article className="condition-card watch"><IsoIcon tone="amber"><Activity size={24} /></IsoIcon><div><strong>{watch}</strong><span>Perhatian</span><small>Jadwalkan tindak lanjut</small></div></article>
        <article className="condition-card priority"><IsoIcon tone="coral"><AlertTriangle size={24} /></IsoIcon><div><strong>{priority}</strong><span>Prioritas</span><small>Perlu tindakan segera</small></div></article>
      </div>

      <article className="panel inspection-panel">
        <div className="panel-head data-panel-head">
          <div><span className="panel-kicker">Inspection log</span><h2>Riwayat gardu & kubikel</h2><p>Hasil inspeksi terakhir yang diambil dari database pelanggan.</p></div>
          <div className="filter-control"><Cable size={16} /><select value={feeder} onChange={(event) => setFeeder(event.target.value)}><option>Semua</option>{FEEDERS.map((item) => <option key={item}>{item}</option>)}</select></div>
        </div>
        <div className="inspection-list">
          {filtered.map((item) => {
            const level = inspectionLevel(item.keterangan);
            return (
              <article key={item.id} className="inspection-row">
                <div className={`inspection-marker ${level}`}><ClipboardCheck size={17} /></div>
                <div className="inspection-date"><strong>{formatDate(item.tgl_inspeksi)}</strong><span>{item.feeder}</span></div>
                <div className="inspection-asset"><strong>{item.gardu}</strong><span>{item.nama}</span></div>
                <div className="inspection-note"><span className={`status-pill ${level}`}><i />{statusLabel(item.keterangan)}</span><p>{item.keterangan}</p></div>
                <button aria-label="Detail inspeksi"><ArrowUpRight size={17} /></button>
              </article>
            );
          })}
          {!filtered.length && <div className="empty-state"><ClipboardCheck size={23} /><strong>Tidak ada hasil inspeksi</strong><span>Ubah filter atau kata kunci pencarian.</span></div>}
        </div>
      </article>
    </div>
  );
}

function escapeXml(value: string | number) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function exportExcel(data: Pelanggan[]) {
  const headers = ['IDPEL', 'Nama Pelanggan', 'Gardu', 'Feeder', 'Tarif', 'Daya (VA)', 'Beban Siang (kVA)', 'Beban Malam (kVA)', 'Tanggal Inspeksi', 'Keterangan'];
  const rows = data.map((item) => [item.idpel, item.nama, item.gardu, item.feeder, item.tarif, item.daya, item.beban_siang, item.beban_malam, item.tgl_inspeksi, item.keterangan]);
  const spreadsheetRows = [headers, ...rows].map((row) => `<Row>${row.map((cell) => `<Cell><Data ss:Type="${typeof cell === 'number' ? 'Number' : 'String'}">${escapeXml(cell)}</Data></Cell>`).join('')}</Row>`).join('');
  const xml = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Pelanggan TM"><Table>${spreadsheetRows}</Table></Worksheet></Workbook>`;
  const url = URL.createObjectURL(new Blob([xml], { type: 'application/vnd.ms-excel' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `MOJANG_Rekap_${new Date().toISOString().slice(0, 10)}.xls`;
  link.click();
  URL.revokeObjectURL(url);
}

function LaporanView({ data }: { data: Pelanggan[] }) {
  const stats = FEEDERS.map((name) => {
    const rows = data.filter((item) => item.feeder === name);
    return {
      name,
      count: rows.length,
      power: rows.reduce((sum, item) => sum + item.daya, 0) / 1000,
      day: rows.reduce((sum, item) => sum + Number(item.beban_siang), 0),
      night: rows.reduce((sum, item) => sum + Number(item.beban_malam), 0),
    };
  });
  const power = stats.reduce((sum, item) => sum + item.power, 0);
  const day = stats.reduce((sum, item) => sum + item.day, 0);
  const night = stats.reduce((sum, item) => sum + item.night, 0);

  return (
    <div className="view-enter report-view">
      <div className="report-actions no-print">
        <div><span className="panel-kicker">Ready to share</span><strong>Laporan operasional siap diekspor</strong><p>Pilih format yang dibutuhkan untuk kebutuhan briefing atau arsip.</p></div>
        <div><button className="secondary-button" onClick={() => exportExcel(data)}><FileSpreadsheet size={17} /> Download Excel</button><button className="primary-button" onClick={() => window.print()}><Printer size={17} /> Simpan PDF</button></div>
      </div>

      <article className="report-sheet" id="report-sheet">
        <header className="report-header">
          <div className="report-brand"><span><Bolt size={23} /></span><div><strong>MOJANG</strong><small>Monitoring JTM ULP Samboja</small></div></div>
          <div><span>REKAPITULASI OPERASIONAL</span><strong>{new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date())}</strong></div>
        </header>
        <div className="report-title"><span>PT PLN (PERSERO) · ULP SAMBOJA</span><h2>Monitoring Pelanggan JTM & Beban Penyulang</h2><p>Ringkasan data pelanggan tegangan menengah berdasarkan database MOJANG.</p></div>
        <div className="report-metrics">
          <div><span>Total pelanggan</span><strong>{data.length}</strong><small>pelanggan TM</small></div>
          <div><span>Daya terpasang</span><strong>{formatNumber(power)}</strong><small>kVA</small></div>
          <div><span>Beban siang</span><strong>{formatNumber(day)}</strong><small>kVA</small></div>
          <div><span>Beban malam</span><strong>{formatNumber(night)}</strong><small>kVA</small></div>
        </div>
        <section className="report-section">
          <div className="report-section-head"><div><span>01</span><h3>Rekap per penyulang</h3></div><small>{FEEDERS.length} penyulang aktif</small></div>
          <div className="table-wrap report-table"><table><thead><tr><th>Penyulang</th><th>Pelanggan</th><th>Daya terpasang</th><th>Beban siang</th><th>Beban malam</th><th>Utilisasi malam</th></tr></thead><tbody>{stats.map((item) => <tr key={item.name}><td><strong className="cell-primary">{item.name}</strong></td><td>{item.count}</td><td>{formatNumber(item.power)} kVA</td><td>{formatNumber(item.day)} kVA</td><td>{formatNumber(item.night)} kVA</td><td><span className="utilization"><i style={{ width: `${Math.min(100, (item.night / Math.max(1, item.power)) * 100)}%` }} /></span>{Math.round((item.night / Math.max(1, item.power)) * 100)}%</td></tr>)}</tbody></table></div>
        </section>
        <section className="report-section compact-report-data">
          <div className="report-section-head"><div><span>02</span><h3>Daftar pelanggan TM</h3></div><small>{data.length} baris tervalidasi</small></div>
          <div className="table-wrap report-table"><table><thead><tr><th>IDPEL</th><th>Nama</th><th>Gardu</th><th>Feeder</th><th>Daya</th><th>Status</th></tr></thead><tbody>{data.map((item) => <tr key={item.id}><td>{item.idpel}</td><td>{item.nama}</td><td>{item.gardu}</td><td>{item.feeder}</td><td>{formatNumber(item.daya / 1000)} kVA</td><td>{statusLabel(item.keterangan)}</td></tr>)}</tbody></table></div>
        </section>
        <footer className="report-footer"><span>Dokumen dihasilkan oleh MOJANG · ULP Samboja</span><span>Data real-time dari Supabase</span></footer>
      </article>
    </div>
  );
}

function PelangganModal({ item, saving, onClose, onSave }: { item: Pelanggan | null; saving: boolean; onClose: () => void; onSave: (draft: PelangganDraft, id?: string) => Promise<void> }) {
  const [draft, setDraft] = useState<PelangganDraft>(() => item ? {
    idpel: item.idpel,
    nama: item.nama,
    gardu: item.gardu,
    feeder: item.feeder,
    tarif: item.tarif,
    daya: item.daya,
    beban_siang: item.beban_siang,
    beban_malam: item.beban_malam,
    tgl_inspeksi: item.tgl_inspeksi,
    keterangan: item.keterangan,
  } : { ...EMPTY_DRAFT });
  const update = <K extends keyof PelangganDraft>(key: K, value: PelangganDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    void onSave(draft, item?.id);
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header><div><span className="modal-icon"><Database size={19} /></span><div><span className="panel-kicker">Customer database</span><h2 id="modal-title">{item ? 'Edit pelanggan TM' : 'Tambah pelanggan TM'}</h2></div></div><button onClick={onClose} aria-label="Tutup"><X size={19} /></button></header>
        <form onSubmit={submit}>
          <div className="form-grid">
            <label><span>IDPEL</span><input value={draft.idpel} onChange={(event) => update('idpel', event.target.value)} inputMode="numeric" required /></label>
            <label className="wide"><span>Nama pelanggan</span><input value={draft.nama} onChange={(event) => update('nama', event.target.value)} required /></label>
            <label><span>Gardu</span><input value={draft.gardu} onChange={(event) => update('gardu', event.target.value)} required /></label>
            <label><span>Penyulang</span><select value={draft.feeder} onChange={(event) => update('feeder', event.target.value as Feeder)}>{FEEDERS.map((feeder) => <option key={feeder}>{feeder}</option>)}</select></label>
            <label><span>Tarif</span><input value={draft.tarif} onChange={(event) => update('tarif', event.target.value.toUpperCase())} required /></label>
            <label><span>Daya terpasang (VA)</span><input type="number" min="0" value={draft.daya} onChange={(event) => update('daya', Number(event.target.value))} required /></label>
            <label><span>Beban siang (kVA)</span><input type="number" min="0" step="0.01" value={draft.beban_siang} onChange={(event) => update('beban_siang', Number(event.target.value))} required /></label>
            <label><span>Beban malam (kVA)</span><input type="number" min="0" step="0.01" value={draft.beban_malam} onChange={(event) => update('beban_malam', Number(event.target.value))} required /></label>
            <label><span>Tanggal inspeksi</span><input type="date" value={draft.tgl_inspeksi} onChange={(event) => update('tgl_inspeksi', event.target.value)} required /></label>
            <label className="full"><span>Keterangan kondisi</span><textarea value={draft.keterangan} onChange={(event) => update('keterangan', event.target.value.toUpperCase())} rows={3} required /></label>
          </div>
          <footer><button type="button" className="secondary-button" onClick={onClose}>Batal</button><button className="primary-button" type="submit" disabled={saving}>{saving ? <LoaderCircle className="spin" size={17} /> : <Check size={17} />}{saving ? 'Menyimpan...' : 'Simpan data'}</button></footer>
        </form>
      </section>
    </div>
  );
}

function DeleteModal({ item, deleting, onClose, onConfirm }: { item: Pelanggan; deleting: boolean; onClose: () => void; onConfirm: () => Promise<void> }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="confirm-card" role="alertdialog" aria-modal="true">
        <span className="confirm-icon"><Trash2 size={23} /></span><h2>Hapus data pelanggan?</h2><p><strong>{item.nama}</strong> ({item.idpel}) akan dihapus dari database. Aktivitas ini tetap tercatat pada audit log.</p>
        <div><button className="secondary-button" onClick={onClose}>Batal</button><button className="danger-button" disabled={deleting} onClick={() => void onConfirm()}>{deleting ? <LoaderCircle className="spin" size={16} /> : <Trash2 size={16} />}{deleting ? 'Menghapus...' : 'Hapus permanen'}</button></div>
      </section>
    </div>
  );
}

export default function Home() {
  const [ready, setReady] = useState(!isSupabaseConfigured);
  const [profile, setProfile] = useState<AppProfile | null>(() => !isSupabaseConfigured ? { id: 'demo-user', username: 'admin', fullname: 'Administrator Samboja', role: 'Admin' } : null);
  const [data, setData] = useState<Pelanggan[]>(() => !isSupabaseConfigured ? SEED_PELANGGAN : []);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [dataLoading, setDataLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Pelanggan | null | undefined>(undefined);
  const [deleteItem, setDeleteItem] = useState<Pelanggan | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = useCallback((message: string, tone: 'success' | 'error') => {
    setToast({ message, tone });
  }, []);

  const loadData = useCallback(async (silent = false) => {
    if (!supabase) return;
    if (!silent) setDataLoading(true);
    const { data: records, error } = await supabase.from('pelanggan').select('*').order('nama');
    if (error) {
      showToast(`Gagal memuat data: ${error.message}`, 'error');
    } else {
      setData((records ?? []) as Pelanggan[]);
    }
    if (!silent) setDataLoading(false);
  }, [showToast]);

  const bootUser = useCallback(async (user: { id: string; email?: string; user_metadata?: Record<string, string> }) => {
    if (!supabase) return;
    const { data: record } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    const metadata = user.user_metadata ?? {};
    setProfile(record ? record as AppProfile : {
      id: user.id,
      username: metadata.username ?? user.email?.split('@')[0] ?? 'staff',
      fullname: metadata.fullname ?? 'Staff ULP Samboja',
      role: metadata.role === 'Admin' ? 'Admin' : 'Staff',
    });
    await loadData();
  }, [loadData]);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    void supabase.auth.getSession().then(async ({ data: sessionData }) => {
      if (!active) return;
      if (sessionData.session?.user) await bootUser(sessionData.session.user);
      if (active) setReady(true);
    });
    return () => { active = false; };
  }, [bootUser]);

  useEffect(() => {
    if (!supabase || !profile) return;
    const client = supabase;
    const channel = client.channel('mojang-pelanggan-live').on('postgres_changes', { event: '*', schema: 'public', table: 'pelanggan' }, () => { void loadData(true); }).subscribe();
    return () => { void client.removeChannel(channel); };
  }, [loadData, profile]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const login = async (username: string, password: string) => {
    if (!supabase) return;
    setAuthLoading(true);
    setAuthError('');
    const email = username.includes('@') ? username.trim().toLowerCase() : `${username.trim().toLowerCase()}@mojang.local`;
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !authData.user) {
      setAuthError(error?.message === 'Invalid login credentials' ? 'Username atau password tidak sesuai.' : (error?.message ?? 'Login gagal. Silakan coba lagi.'));
    } else {
      await bootUser(authData.user);
    }
    setAuthLoading(false);
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setProfile(null);
    setData([]);
    setActiveView('dashboard');
  };

  const savePelanggan = async (draft: PelangganDraft, id?: string) => {
    setSaving(true);
    const normalized = { ...draft, idpel: draft.idpel.trim(), nama: draft.nama.trim().toUpperCase(), gardu: draft.gardu.trim().toUpperCase(), tarif: draft.tarif.trim().toUpperCase(), keterangan: draft.keterangan.trim().toUpperCase() };
    if (supabase) {
      const query = id ? supabase.from('pelanggan').update(normalized).eq('id', id) : supabase.from('pelanggan').insert(normalized);
      const { error } = await query;
      if (error) {
        showToast(error.code === '23505' ? 'IDPEL sudah digunakan pelanggan lain.' : error.message, 'error');
        setSaving(false);
        return;
      }
      await loadData(true);
    } else if (id) {
      setData((current) => current.map((item) => item.id === id ? { ...item, ...normalized } : item));
    } else {
      setData((current) => [...current, { ...normalized, id: `demo-${Date.now()}` }]);
    }
    setEditingItem(undefined);
    setSaving(false);
    showToast(id ? 'Data pelanggan berhasil diperbarui.' : 'Pelanggan baru berhasil ditambahkan.', 'success');
  };

  const deletePelanggan = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    if (supabase) {
      const { error } = await supabase.from('pelanggan').delete().eq('id', deleteItem.id);
      if (error) {
        showToast(error.message, 'error');
        setDeleting(false);
        return;
      }
      await loadData(true);
    } else {
      setData((current) => current.filter((item) => item.id !== deleteItem.id));
    }
    setDeleteItem(null);
    setDeleting(false);
    showToast('Data pelanggan berhasil dihapus.', 'success');
  };

  if (!ready) return <AppLoader />;
  if (!profile) return <LoginPage onLogin={login} loading={authLoading} error={authError} />;

  const copy = pageCopy[activeView];

  return (
    <main className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand-lockup">
          <IsoIcon tone="amber"><Bolt size={22} strokeWidth={2.6} /></IsoIcon>
          <div><strong>MOJANG</strong><span>ULP Samboja</span></div>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Tutup navigasi"><X size={18} /></button>
        </div>
        <div className="nav-label">Workspace</div>
        <nav aria-label="Navigasi utama">
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-item ${activeView === id ? 'active' : ''}`} type="button" onClick={() => { setActiveView(id); setSidebarOpen(false); }}>
              <Icon size={19} /><span>{label}</span>{activeView === id && <span className="nav-spark" />}
            </button>
          ))}
        </nav>
        <div className="system-card"><span className="system-pulse" /><div><strong>System online</strong><small>{isSupabaseConfigured ? 'Tersambung ke Supabase Realtime' : 'Mode preview · database lokal'}</small></div></div>
        <div className="profile-chip">
          <span className="avatar">{makeInitials(profile.fullname)}</span>
          <div><strong>{profile.fullname}</strong><small>{profile.role}</small></div>
          <button onClick={() => void logout()} aria-label="Keluar"><LogOut size={17} /></button>
        </div>
      </aside>
      {sidebarOpen && <button className="sidebar-scrim" aria-label="Tutup navigasi" onClick={() => setSidebarOpen(false)} />}

      <section className="workspace">
        <div className="ambient ambient-one" /><div className="ambient ambient-two" />
        <header className="topbar">
          <button className="menu-button" onClick={() => setSidebarOpen(true)} aria-label="Buka navigasi"><Menu size={20} /></button>
          <div className="page-copy">
            <div className="eyebrow"><Sparkles size={14} /> {copy.eyebrow}</div>
            <h1>{copy.title} <span>{copy.accent}</span></h1>
            <p>{copy.description}</p>
          </div>
          <div className="top-actions">
            <label className="search-box"><Search size={18} /><input aria-label="Cari data" placeholder="Cari pelanggan, gardu..." value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} /><kbd>⌘ K</kbd></label>
            <button className="icon-button" aria-label="Notifikasi"><Bell size={20} /><span /></button>
            <button className="primary-button" onClick={() => setEditingItem(null)}><Plus size={18} /> Pelanggan baru</button>
          </div>
        </header>

        {dataLoading ? <div className="content-loader"><LoaderCircle className="spin" /><span>Menyinkronkan database...</span></div> : (
          <>
            {activeView === 'dashboard' && <Dashboard data={data} />}
            {activeView === 'pelanggan' && <PelangganView data={data} search={globalSearch} role={profile.role} onEdit={(item) => setEditingItem(item)} onDelete={setDeleteItem} />}
            {activeView === 'inspeksi' && <InspeksiView data={data} search={globalSearch} />}
            {activeView === 'laporan' && <LaporanView data={data} />}
          </>
        )}
      </section>

      {editingItem !== undefined && <PelangganModal key={editingItem?.id ?? 'new'} item={editingItem} saving={saving} onClose={() => setEditingItem(undefined)} onSave={savePelanggan} />}
      {deleteItem && <DeleteModal item={deleteItem} deleting={deleting} onClose={() => setDeleteItem(null)} onConfirm={deletePelanggan} />}
      {toast && <div className={`toast ${toast.tone}`}>{toast.tone === 'success' ? <Check size={17} /> : <AlertTriangle size={17} />}<span>{toast.message}</span><button onClick={() => setToast(null)}><X size={15} /></button></div>}
      {!isSupabaseConfigured && <div className="demo-badge"><Database size={13} /> Preview lokal</div>}
    </main>
  );
}
