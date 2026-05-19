import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { ChevronRight, Headphones, MessageCircle, PlayCircle, Search, ShieldCheck, Star, Store, X } from 'lucide-react'
import './style.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const kakaoChannelUrl = (import.meta.env.VITE_KAKAO_CHANNEL_URL as string | undefined) || ''
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null
const ADMIN_EMAIL = 'linkbus0213@gmail.com'
const PRODUCT_IMAGE_BUCKET = 'product-images'

type Brand = '애플' | '삼성' | '기타'
type Carrier = 'SK' | 'KT' | 'LG' | '알뜰폰'
type JoinType = '번호이동' | '기기변경' | '신규가입'
type Phone = {
  id: string
  brand: Brand
  series: string
  carrier: Carrier
  joinType: JoinType
  name: string
  subtitle: string
  image: string
  price: number | null
  rebate: number | null
  monthly: number
  support: number
  badge: string
  tag: string
  isVisible?: boolean
}

type ProductRow = {
  id: string
  brand: Brand
  series: string
  carrier: Carrier
  join_type: JoinType
  name: string
  subtitle: string | null
  image_url: string | null
  sale_price: number | null
  rebate: number | null
  monthly_fee: number | null
  support_amount: number | null
  badge: string | null
  tag: string | null
  is_visible: boolean
  sort_order: number | null
}

const officialImages = {
  iphonePro: 'https://www.apple.com/v/iphone-17-pro/f/images/meta/iphone-17-pro_overview__eumhhclcpuaa_og.png?202604301049',
  iphone: 'https://www.apple.com/v/iphone-17/f/images/meta/iphone-17_overview__cg0rlzmbhl7m_og.png?202604301049',
  galaxy: 'https://images.samsung.com/kdp/st/1/17875ef3-e132-4a7e-abfb-2622dd6c8a9c.jpg',
}

const fallbackPhones: Phone[] = [
  { id: 'iphone-17e', brand: '애플', series: 'iPhone 17 시리즈', carrier: 'SK', joinType: '번호이동', name: '아이폰 17e', subtitle: '128GB · 빠른 상담 가능', image: officialImages.iphone, price: 190000, rebate: 0, monthly: 69000, support: 620000, badge: '인기', tag: 'APPLE', isVisible: true },
  { id: 'iphone-17-pro-max', brand: '애플', series: 'iPhone 17 시리즈', carrier: 'KT', joinType: '기기변경', name: '아이폰 17 프로맥스', subtitle: '256GB · 색상 상담', image: officialImages.iphonePro, price: 740000, rebate: 0, monthly: 99000, support: 760000, badge: '최신', tag: 'PRO', isVisible: true },
  { id: 'iphone-17-pro', brand: '애플', series: 'iPhone 17 시리즈', carrier: 'LG', joinType: '번호이동', name: '아이폰 17 프로', subtitle: '256GB · 재고 확인', image: officialImages.iphonePro, price: 620000, rebate: 0, monthly: 95000, support: 680000, badge: '추천', tag: 'HOT', isVisible: true },
  { id: 'iphone-17', brand: '애플', series: 'iPhone 17 시리즈', carrier: 'SK', joinType: '신규가입', name: '아이폰 17', subtitle: '128GB · 입문 추천', image: officialImages.iphone, price: 420000, rebate: 0, monthly: 79000, support: 520000, badge: '실속', tag: 'BASIC', isVisible: true },
  { id: 'galaxy-s26-ultra', brand: '삼성', series: 'Galaxy S26 시리즈', carrier: 'LG', joinType: '번호이동', name: '갤럭시 S26 울트라', subtitle: '256GB · 울트라 성능', image: officialImages.galaxy, price: 530000, rebate: 0, monthly: 95000, support: 880000, badge: '급상승', tag: 'SAMSUNG', isVisible: true },
  { id: 'galaxy-s26', brand: '삼성', series: 'Galaxy S26 시리즈', carrier: 'KT', joinType: '기기변경', name: '갤럭시 S26', subtitle: '256GB · 합리적 선택', image: officialImages.galaxy, price: 170000, rebate: 0, monthly: 79000, support: 720000, badge: '특가', tag: 'VALUE', isVisible: true },
]

const brands: Array<Brand | '전체'> = ['전체', '애플', '삼성', '기타']
const appleSeries = ['iPhone 17 시리즈', 'iPhone 16 시리즈', 'iPhone 15 시리즈']
const samsungSeries = ['Galaxy S26 시리즈', 'Galaxy Z 시리즈', 'Galaxy A 시리즈']
const tips = ['아이폰17 / 갤럭시 S26 울트라 휴대폰 “0원폰”의 진실', '26년 5월 SK텔레콤 라이트 할부 카드 이벤트 안내', '휴대폰 신청시 주의해야 할 점 feat. 부가서비스', '휴대폰 개통시 주의해야 할 점 feat. 제휴카드', 'KT 총액 결합할인 제도 쉽게 알아보기']

function money(value: number | null | undefined) { return value == null ? '상담가' : `${value.toLocaleString()}원` }
function rowToPhone(row: ProductRow): Phone { return { id: row.id, brand: row.brand, series: row.series, carrier: row.carrier, joinType: row.join_type, name: row.name, subtitle: row.subtitle || '', image: row.image_url || officialImages.iphone, price: row.sale_price, rebate: row.rebate, monthly: row.monthly_fee || 0, support: row.support_amount || 0, badge: row.badge || '추천', tag: row.tag || row.brand, isVisible: row.is_visible } }
function phoneToRow(phone: Phone) { return { brand: phone.brand, series: phone.series, carrier: phone.carrier, join_type: phone.joinType, name: phone.name, subtitle: phone.subtitle, image_url: phone.image, sale_price: phone.price, rebate: phone.rebate, monthly_fee: phone.monthly, support_amount: phone.support, badge: phone.badge, tag: phone.tag, is_visible: phone.isVisible ?? true } }
function safeFileName(name: string) { return name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').toLowerCase() || 'image' }

function App() {
  if (location.pathname.startsWith('/admin')) return <AdminApp />
  return <Storefront />
}

function Storefront() {
  const [phones, setPhones] = useState<Phone[]>(fallbackPhones)
  const [brand, setBrand] = useState<Brand | '전체'>('애플')
  const [series, setSeries] = useState('iPhone 17 시리즈')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Phone | null>(null)

  React.useEffect(() => {
    if (!supabase) return
    supabase.from('sale_products').select('*').eq('is_visible', true).order('sort_order', { ascending: true }).then(({ data }) => {
      if (data?.length) setPhones((data as ProductRow[]).map(rowToPhone))
    })
  }, [])

  const seriesList = brand === '삼성' ? samsungSeries : appleSeries
  const filtered = useMemo(() => phones.filter((phone) => {
    const matchBrand = brand === '전체' || phone.brand === brand
    const matchSeries = brand === '전체' || phone.series === series
    const haystack = `${phone.name} ${phone.subtitle} ${phone.carrier} ${phone.joinType} ${phone.brand}`.toLowerCase()
    return matchBrand && matchSeries && haystack.includes(query.toLowerCase())
  }), [phones, brand, series, query])

  function chooseBrand(next: Brand | '전체') { setBrand(next); setSeries(next === '삼성' ? samsungSeries[0] : appleSeries[0]) }

  return <>
    <header className="topbar"><div className="top-inner"><a className="brand-logo" href="#top"><span>LINK</span>BUS</a></div><nav className="menu-line">{['애플', '삼성', '기타', '유심전용', '인터넷/IPTV', '리뷰', '질문답변', '이벤트', '고객센터'].map((item) => <a key={item} href={item === '애플' || item === '삼성' ? '#popular' : '#consult'}>{item}</a>)}</nav></header>
    <main id="top">
      <section className="hero-slider"><article className="hero-banner dark"><div><p>사전예약 · 특별혜택</p><h1>아이폰 17 Pro<br/>지금 조건 비교</h1><a href="#popular">모델 보러가기 <ChevronRight size={18}/></a></div><img src={officialImages.iphonePro} alt="아이폰 17 프로" /></article><article className="hero-banner light"><div><p>전 통신사 견적 비교</p><h1>갤럭시 S26<br/>최저 조건 상담</h1><a href="#popular">혜택 확인하기 <ChevronRight size={18}/></a></div><img src={officialImages.galaxy} alt="갤럭시 S26" /></article></section>
      <section id="popular" className="popular-section"><div className="section-title"><h2>인기 급상승 상품</h2><p>모델을 누르면 상세 조건과 카카오톡 상담 버튼을 확인할 수 있어요.</p></div><div className="brand-tabs">{brands.map((item) => <button key={item} className={brand === item ? 'active' : ''} onClick={() => chooseBrand(item)}>{item === '애플' ? '애플 | APPLE' : item === '삼성' ? '삼성 | SAMSUNG' : item}</button>)}</div>{brand !== '전체' && <div className="series-tabs">{seriesList.map((item) => <button key={item} className={series === item ? 'active' : ''} onClick={() => setSeries(item)}>{item}</button>)}</div>}<label className="search-pill"><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="모델명, 통신사, 가입유형 검색" /></label><div className="phone-strip">{filtered.map((phone) => <button className="product-tile" key={phone.id} onClick={() => setSelected(phone)}><span className="ribbon">{phone.badge}</span><figure><img src={phone.image} alt={phone.name}/></figure><b>{phone.name}</b><small>{phone.subtitle}</small><strong>{money(phone.price)}</strong></button>)}{!filtered.length && <p className="empty">조건에 맞는 상품이 없습니다.</p>}</div></section>
      <section className="consult-cta"><div><p>최저가 보장 · 숨은 조건 없음</p><h3>어떤 폰이 나에게 맞을지 모르겠다면?</h3></div><div><a href="#popular">기기 비교하기</a><a className="kakao" href="#consult"><MessageCircle size={18}/> 무료 상담 신청</a></div></section>
      <section className="content-grid"><article className="curation"><div className="block-head"><h2>놓치면 아까운 꿀팁! 링크버스 큐레이션</h2><a href="#consult">더보기 <ChevronRight size={16}/></a></div><div className="tip-list">{tips.map((tip) => <a key={tip} href="#consult"><span>핫이슈</span>{tip}<ChevronRight size={16}/></a>)}</div></article><article className="phone-tube"><h2>휴대폰의 모든 것을 한눈에 보다. 링크튜브</h2><div className="video-row">{['갤럭시 S26 실사용 후기', '통신사 혜택 비교', '아이폰 17 구매 가이드'].map((title, i) => <div className="video-card" key={title}><div className={`thumb t${i}`}><PlayCircle/></div><b>{title}</b></div>)}</div></article></section>
      <section id="consult" className="consult-area"><div className="benefits"><Benefit icon={<Star/>} title="최저가 보장" text="전 통신사 조건을 비교해 합리적인 가격을 안내합니다." /><Benefit icon={<ShieldCheck/>} title="안전한 구매" text="상담 후 조건을 확정하고 신청 절차를 안내합니다." /><Benefit icon={<Headphones/>} title="전문 상담" text="기기·요금제·가입유형을 맞춤 추천합니다." /></div><ConsultForm selected={selected?.name || ''} /></section>
    </main>
    <footer className="footer"><div className="footer-call"><h4>구매 문의 관련 상담</h4><strong>카카오톡 상담 / 전화 상담 준비중</strong><p>평일 10:00 ~ 18:00 · 토요일 10:00 ~ 15:00</p></div><div><b>LINKBUS</b><p>상호/사업자 정보/통신판매업 신고번호는 실제 사업자 가입 후 입력합니다.</p></div></footer>
    {selected && <ProductModal phone={selected} onClose={() => setSelected(null)} />}
  </>
}

function AdminApp() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)
  React.useEffect(() => { supabase?.auth.getUser().then(({ data }) => setSessionEmail(data.user?.email || null)) }, [])
  if (!supabase) return <AdminShell><p>Supabase 설정이 필요합니다.</p></AdminShell>
  if (sessionEmail !== ADMIN_EMAIL) return <AdminLogin onLogin={setSessionEmail} />
  return <AdminPanel onLogout={async () => { await supabase.auth.signOut(); setSessionEmail(null) }} />
}

function AdminShell({ children }: { children: React.ReactNode }) { return <main className="admin-page"><a className="brand-logo" href="/"><span>LINK</span>BUS</a>{children}</main> }

function AdminLogin({ onLogin }: { onLogin: (email: string) => void }) {
  const [username, setUsername] = useState('linkbus0213')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const email = username.includes('@') ? username : `${username}@gmail.com`
  async function login(e: React.FormEvent) {
    e.preventDefault(); setMessage('')
    if (email !== ADMIN_EMAIL) { setMessage('관리자 아이디는 linkbus0213 입니다.'); return }
    const { data, error } = await supabase!.auth.signInWithPassword({ email, password })
    if (error) { setMessage('로그인 실패: 비밀번호를 확인해 주세요. 처음이면 Supabase에서 관리자 사용자를 먼저 만들어야 합니다.'); return }
    onLogin(data.user.email || '')
  }
  return <AdminShell><section className="admin-card login-card"><h1>관리자 로그인</h1><p>아이디는 메일주소 없이 입력하세요. 예: <b>linkbus0213</b></p><form onSubmit={login} className="admin-login-form"><label>아이디<input value={username} onChange={(e) => setUsername(e.target.value.trim())} /></label><label>비밀번호<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>{message && <p className="form-message error">{message}</p>}<button className="admin-primary">로그인</button></form></section></AdminShell>
}

const blankPhone: Phone = { id: '', brand: '애플', series: 'iPhone 17 시리즈', carrier: 'SK', joinType: '번호이동', name: '', subtitle: '', image: officialImages.iphone, price: null, rebate: null, monthly: 0, support: 0, badge: '추천', tag: 'APPLE', isVisible: true }

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [products, setProducts] = useState<Phone[]>([])
  const [editing, setEditing] = useState<Phone>(blankPhone)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const load = React.useCallback(async () => { const { data, error } = await supabase!.from('sale_products').select('*').order('sort_order', { ascending: true }); if (!error) setProducts(((data || []) as ProductRow[]).map(rowToPhone)) }, [])
  React.useEffect(() => { load() }, [load])
  async function uploadImage(file: File) {
    setUploading(true); setMessage('이미지 업로드 중...')
    const path = `products/${Date.now()}-${safeFileName(file.name)}`
    const { error } = await supabase!.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, file, { cacheControl: '3600' })
    if (error) { setMessage(`이미지 업로드 실패: ${error.message}`); setUploading(false); return }
    const { data } = supabase!.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path)
    setEditing((current) => ({ ...current, image: data.publicUrl }))
    setMessage('이미지 업로드 완료. 저장 버튼을 누르면 상품에 반영됩니다.')
    setUploading(false)
  }
  async function save(e: React.FormEvent) {
    e.preventDefault(); setMessage('')
    const payload = phoneToRow(editing)
    const result = editing.id ? await supabase!.from('sale_products').update(payload).eq('id', editing.id) : await supabase!.from('sale_products').insert(payload)
    if (result.error) { setMessage(`저장 실패: ${result.error.message}`); return }
    setMessage('저장 완료'); setEditing(blankPhone); load()
  }
  return <AdminShell><div className="admin-head"><div><h1>상품 관리자</h1><p>모델, 판매금액, 리베이트, 지원금, 노출 여부를 수정할 수 있어요.</p></div><button onClick={onLogout}>로그아웃</button></div><section className="admin-grid"><form className="admin-card product-form" onSubmit={save}><h2>{editing.id ? '상품 수정' : '상품 등록'}</h2><AdminInput label="모델명" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} required /><AdminInput label="설명" value={editing.subtitle} onChange={(v) => setEditing({ ...editing, subtitle: v })} /><label>제조사<select value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value as Brand })}><option>애플</option><option>삼성</option><option>기타</option></select></label><AdminInput label="시리즈" value={editing.series} onChange={(v) => setEditing({ ...editing, series: v })} /><label>통신사<select value={editing.carrier} onChange={(e) => setEditing({ ...editing, carrier: e.target.value as Carrier })}><option>SK</option><option>KT</option><option>LG</option><option>알뜰폰</option></select></label><label>가입유형<select value={editing.joinType} onChange={(e) => setEditing({ ...editing, joinType: e.target.value as JoinType })}><option>번호이동</option><option>기기변경</option><option>신규가입</option></select></label><AdminNumber label="판매금액" value={editing.price} onChange={(v) => setEditing({ ...editing, price: v })} /><AdminNumber label="리베이트" value={editing.rebate} onChange={(v) => setEditing({ ...editing, rebate: v })} /><AdminNumber label="월 요금" value={editing.monthly} onChange={(v) => setEditing({ ...editing, monthly: v || 0 })} /><AdminNumber label="지원금" value={editing.support} onChange={(v) => setEditing({ ...editing, support: v || 0 })} /><AdminInput label="배지" value={editing.badge} onChange={(v) => setEditing({ ...editing, badge: v })} /><AdminInput label="태그" value={editing.tag} onChange={(v) => setEditing({ ...editing, tag: v })} /><ImageUploader image={editing.image} uploading={uploading} onUpload={uploadImage} /><label className="admin-check"><input type="checkbox" checked={editing.isVisible} onChange={(e) => setEditing({ ...editing, isVisible: e.target.checked })} /> 고객 화면에 노출</label>{message && <p className="form-message success">{message}</p>}<button className="admin-primary">저장</button><button type="button" onClick={() => setEditing(blankPhone)}>새 상품 입력</button></form><section className="admin-card"><h2>상품 목록</h2><div className="admin-list">{products.map((p) => <button key={p.id} onClick={() => setEditing(p)}><img src={p.image} alt=""/><span><b>{p.name}</b><small>{p.brand} · {p.carrier} · {p.joinType}</small></span><strong>{money(p.price)}</strong><em>{p.rebate ? `리베이트 ${money(p.rebate)}` : '리베이트 없음'}</em>{!p.isVisible && <i>숨김</i>}</button>)}</div></section></section></AdminShell>
}


function ImageUploader({ image, uploading, onUpload }: { image: string; uploading: boolean; onUpload: (file: File) => void }) {
  return <label className="image-upload-field">상품 이미지 업로드<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) onUpload(file) }} /><span>{uploading ? '업로드 중...' : '이미지 파일 선택'}</span>{image && <img src={image} alt="업로드된 상품 이미지 미리보기" />}</label>
}
function AdminInput({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) { return <label>{label}<input value={value} onChange={(e) => onChange(e.target.value)} required={required} /></label> }
function AdminNumber({ label, value, onChange }: { label: string; value: number | null; onChange: (v: number | null) => void }) { return <label>{label}<input type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} /></label> }
function Benefit({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <article>{icon}<h3>{title}</h3><p>{text}</p></article> }
function kakaoHref(model: string) { if (!kakaoChannelUrl) return '#consult'; const sep = kakaoChannelUrl.includes('?') ? '&' : '?'; return `${kakaoChannelUrl}${sep}text=${encodeURIComponent(`${model} 상담하고 싶어요`)}` }
function ProductModal({ phone, onClose }: { phone: Phone; onClose: () => void }) { return <div className="modal-backdrop" onClick={onClose}><section className="detail-modal" onClick={(e) => e.stopPropagation()}><button className="close" onClick={onClose}><X/></button><div className="modal-media"><img src={phone.image} alt={phone.name}/></div><div className="modal-copy"><span className="tag">{phone.tag}</span><h2>{phone.name}</h2><p>{phone.subtitle}</p><div className="price-box"><span>예상 구매가</span><strong>{money(phone.price)}</strong></div><ul><li><span>통신사</span><b>{phone.carrier}</b></li><li><span>가입유형</span><b>{phone.joinType}</b></li><li><span>월 요금</span><b>{money(phone.monthly)}</b></li><li><span>예상 지원금</span><b>{money(phone.support)}</b></li>{phone.rebate ? <li><span>리베이트</span><b>{money(phone.rebate)}</b></li> : null}</ul><p className="notice">표시 금액은 예시 조건입니다. 최종 조건은 정책·재고·요금제 확인 후 확정됩니다.</p><div className="modal-actions"><a className="kakao-talk" href={kakaoHref(phone.name)} onClick={() => !kakaoChannelUrl && setTimeout(() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' }), 0)}><MessageCircle size={19}/> 카카오톡 상담하기</a><a className="outline" href="#consult" onClick={onClose}>상담 신청서 작성</a></div></div></section></div> }
function ConsultForm({ selected }: { selected: string }) {
  const [name, setName] = useState(''), [phone, setPhone] = useState(''), [model, setModel] = useState(selected), [joinType, setJoinType] = useState<JoinType>('번호이동'), [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle'), [message, setMessage] = useState('')
  React.useEffect(() => setModel(selected), [selected])
  async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setStatus('sending'); setMessage(''); if (!supabase) { setStatus('error'); setMessage('상담 저장 설정이 아직 연결되지 않았습니다.'); return } const { error } = await supabase.from('consult_requests').insert({ name, phone, desired_model: model || null, join_type: joinType, source: 'linkbus.kr', status: 'new' }); if (error) { setStatus('error'); setMessage('저장 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.'); return } setStatus('success'); setMessage('상담 신청이 접수되었습니다. 확인 후 연락드릴게요.'); setName(''); setPhone(''); setModel(''); setJoinType('번호이동') }
  return <form className="consult-form" onSubmit={submit}><div className="form-title"><Store/><div><p>무료 상담 신청</p><h2>현재 조건과 재고를 확인해드려요</h2></div></div><label>이름<input value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" required /></label><label>연락처<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" required /></label><label>희망 모델<input value={model} onChange={(e) => setModel(e.target.value)} placeholder="예: 아이폰 17 프로" /></label><label>가입유형<select value={joinType} onChange={(e) => setJoinType(e.target.value as JoinType)}><option>번호이동</option><option>기기변경</option><option>신규가입</option></select></label><label className="agree"><input type="checkbox" required /> 개인정보 수집·이용에 동의합니다.</label>{message && <p className={`form-message ${status}`}>{message}</p>}<button className="submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? '접수 중...' : '상담 신청하기'}</button></form>
}

createRoot(document.getElementById('root')!).render(<App />)
