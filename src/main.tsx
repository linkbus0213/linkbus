import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { CheckCircle2, ChevronRight, Menu, PhoneCall, Search, ShieldCheck, Smartphone, Sparkles, Star, X } from 'lucide-react'
import './style.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

type Carrier = 'SK' | 'KT' | 'LG' | '알뜰폰'
type JoinType = '번호이동' | '기기변경' | '신규가입'
type Phone = {
  id: string
  brand: 'Apple' | 'Samsung' | '기타'
  carrier: Carrier
  joinType: JoinType
  name: string
  storage: string
  color: string
  plan: string
  monthlyFee: number
  devicePrice: number
  support: number
  customerPrice: number | null
  badge: string
  stock: '상담가능' | '예약가능' | '재고확인' | '품절'
}

const phones: Phone[] = [
  { id: 'ip17-pro', brand: 'Apple', carrier: 'SK', joinType: '번호이동', name: 'iPhone 17 Pro', storage: '256GB', color: '내추럴', plan: '프리미엄 요금제 기준', monthlyFee: 99000, devicePrice: 1550000, support: 620000, customerPrice: 930000, badge: '인기', stock: '상담가능' },
  { id: 'ip17', brand: 'Apple', carrier: 'KT', joinType: '기기변경', name: 'iPhone 17', storage: '128GB', color: '블랙', plan: '베이직 요금제 상담', monthlyFee: 69000, devicePrice: 1250000, support: 420000, customerPrice: 830000, badge: '추천', stock: '재고확인' },
  { id: 's26-ultra', brand: 'Samsung', carrier: 'LG', joinType: '번호이동', name: 'Galaxy S26 Ultra', storage: '256GB', color: '티타늄', plan: '5G 프리미엄 기준', monthlyFee: 95000, devicePrice: 1690000, support: 760000, customerPrice: 930000, badge: '최신', stock: '상담가능' },
  { id: 's26', brand: 'Samsung', carrier: 'SK', joinType: '신규가입', name: 'Galaxy S26', storage: '256GB', color: '실버', plan: '상담 후 최적 요금제', monthlyFee: 79000, devicePrice: 1190000, support: 520000, customerPrice: 670000, badge: '실속', stock: '예약가능' },
  { id: 'a-series', brand: 'Samsung', carrier: '알뜰폰', joinType: '신규가입', name: 'Galaxy A 시리즈', storage: '128GB', color: '상담', plan: '알뜰폰 요금제', monthlyFee: 33000, devicePrice: 499000, support: 210000, customerPrice: 289000, badge: '알뜰', stock: '상담가능' },
  { id: 'kids', brand: '기타', carrier: 'KT', joinType: '신규가입', name: '키즈폰 추천 모델', storage: '64GB', color: '상담', plan: '자녀 안심 요금제', monthlyFee: 22000, devicePrice: 300000, support: 180000, customerPrice: 120000, badge: '키즈', stock: '재고확인' },
]

const carriers: Array<Carrier | '전체'> = ['전체', 'SK', 'KT', 'LG', '알뜰폰']
const joinTypes: Array<JoinType | '전체'> = ['전체', '번호이동', '기기변경', '신규가입']
const brands: Array<Phone['brand'] | '전체'> = ['전체', 'Apple', 'Samsung', '기타']

function money(value: number | null) {
  if (value === null) return '상담가'
  return `${value.toLocaleString()}원`
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [carrier, setCarrier] = useState<Carrier | '전체'>('전체')
  const [joinType, setJoinType] = useState<JoinType | '전체'>('전체')
  const [brand, setBrand] = useState<Phone['brand'] | '전체'>('전체')
  const [selected, setSelected] = useState<Phone | null>(null)

  const filtered = useMemo(() => phones.filter((phone) => {
    const haystack = [phone.name, phone.storage, phone.color, phone.plan, phone.badge, phone.carrier, phone.joinType, phone.brand].join(' ').toLowerCase()
    return (carrier === '전체' || phone.carrier === carrier)
      && (joinType === '전체' || phone.joinType === joinType)
      && (brand === '전체' || phone.brand === brand)
      && haystack.includes(query.toLowerCase())
  }), [query, carrier, joinType, brand])

  return <>
    <header className="site-header">
      <a className="logo" href="#top"><span>LINK</span>BUS</a>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="메뉴">{menuOpen ? <X/> : <Menu/>}</button>
      <nav className={menuOpen ? 'open' : ''}>
        <a href="#phones">가격보기</a>
        <a href="#guide">구매안내</a>
        <a href="#faq">FAQ</a>
        <a className="nav-cta" href="#consult">상담신청</a>
      </nav>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">ONLINE PHONE STORE</p>
          <h1>휴대폰 구매,<br/>조건 비교부터 상담까지 한 번에.</h1>
          <p className="hero-text">linkbus.kr 전용 휴대폰 판매 사이트 초안입니다. 고객이 가격을 보고, 조건을 비교하고, 상담 신청까지 자연스럽게 이어지도록 설계했습니다.</p>
          <div className="hero-actions">
            <a className="primary" href="#phones"><Smartphone size={19}/> 인기 상품 보기</a>
            <a className="secondary" href="#consult"><PhoneCall size={19}/> 무료 상담 신청</a>
          </div>
        </div>
        <aside className="hero-panel">
          <span className="live-badge"><Sparkles size={15}/> 오늘의 상담 포인트</span>
          <h2>요금제·통신사·가입유형에 따라 실제 구매가가 달라져요.</h2>
          <p>표시 금액은 예시 기준이며, 최종 조건은 상담 후 확정됩니다.</p>
          <div className="mini-stats">
            <div><b>통신사</b><strong>SK · KT · LG</strong></div>
            <div><b>가입유형</b><strong>번호이동 · 기변 · 신규</strong></div>
            <div><b>상담</b><strong>온라인 접수</strong></div>
          </div>
        </aside>
      </section>

      <section className="trust-row">
        <Trust icon={<CheckCircle2/>} title="조건 비교" desc="통신사별 조건을 한눈에 정리" />
        <Trust icon={<ShieldCheck/>} title="안전한 안내" desc="상담 후 최종 금액 확정" />
        <Trust icon={<Star/>} title="맞춤 추천" desc="사용 패턴에 맞는 모델/요금제" />
      </section>

      <section id="phones" className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">POPULAR</p>
            <h2>인기 판매 상품</h2>
            <p>나중에 관리자 페이지와 DB를 붙이면 이 상품 목록은 직접 수정할 수 있게 만들 예정입니다.</p>
          </div>
        </div>
        <label className="search-box"><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="아이폰, 갤럭시, 요금제 검색" /></label>
        <Filter title="브랜드" values={brands} current={brand} setCurrent={setBrand} />
        <Filter title="통신사" values={carriers} current={carrier} setCurrent={setCarrier} />
        <Filter title="가입유형" values={joinTypes} current={joinType} setCurrent={setJoinType} />
        <div className="phone-grid">
          {filtered.map((phone) => <PhoneCard key={phone.id} phone={phone} onSelect={() => setSelected(phone)} />)}
        </div>
        {!filtered.length && <p className="empty">조건에 맞는 상품이 없습니다. 검색어나 필터를 바꿔보세요.</p>}
      </section>

      <section id="guide" className="section guide">
        <article>
          <p className="eyebrow">HOW TO BUY</p>
          <h2>구매 진행 순서</h2>
          <ol>
            <li>원하는 모델과 통신사를 선택합니다.</li>
            <li>상담 신청으로 현재 조건과 재고를 확인합니다.</li>
            <li>최종 실구매가와 요금제를 안내받습니다.</li>
            <li>신청서 작성 후 개통을 진행합니다.</li>
          </ol>
        </article>
        <article id="consult" className="consult-card">
          <p className="eyebrow">CONSULT</p>
          <h2>상담 신청</h2>
          <ConsultForm selected={selected?.name || ''} />
        </article>
      </section>

      <section id="faq" className="section faq">
        <p className="eyebrow">FAQ</p>
        <h2>자주 묻는 질문</h2>
        <details open><summary>표시 가격 그대로 구매할 수 있나요?</summary><p>표시 금액은 예시 조건입니다. 통신사 정책, 요금제, 재고 상황에 따라 달라질 수 있어 상담 후 확정됩니다.</p></details>
        <details><summary>번호이동과 기기변경 차이가 뭔가요?</summary><p>번호이동은 통신사를 바꾸는 가입이고, 기기변경은 같은 통신사를 유지하며 단말기를 바꾸는 방식입니다.</p></details>
        <details><summary>온라인으로 바로 개통 가능한가요?</summary><p>1차 상담 접수 후 본인확인과 신청서 작성 절차를 거쳐 진행합니다.</p></details>
      </section>
    </main>

    {selected && <ProductModal phone={selected} onClose={() => setSelected(null)} />}

    <footer>
      <strong>LINKBUS</strong>
      <p>상호/사업자 정보/통신판매업 신고번호는 실제 사업자 가입 후 입력합니다.</p>
      <p>Copyright © linkbus.kr. All rights reserved.</p>
    </footer>
  </>
}

function Trust({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return <article>{icon}<h3>{title}</h3><p>{desc}</p></article>
}

function Filter<T extends string>({ title, values, current, setCurrent }: { title: string; values: readonly T[]; current: T; setCurrent: (v: T) => void }) {
  return <div className="filters"><b>{title}</b>{values.map((value) => <button key={value} className={current === value ? 'active' : ''} onClick={() => setCurrent(value)}>{value}</button>)}</div>
}

function PhoneCard({ phone, onSelect }: { phone: Phone; onSelect: () => void }) {
  return <article className="phone-card">
    <div className="badges"><span>{phone.carrier}</span><span>{phone.joinType}</span><b>{phone.badge}</b></div>
    <h3>{phone.name}</h3>
    <p>{phone.storage} · {phone.color}</p>
    <strong>{money(phone.customerPrice)}</strong>
    <small>월 요금 {money(phone.monthlyFee)} · 지원금 {money(phone.support)}</small>
    <em>{phone.stock}</em>
    <button onClick={onSelect}>자세히 보기 <ChevronRight size={16}/></button>
  </article>
}

function ProductModal({ phone, onClose }: { phone: Phone; onClose: () => void }) {
  return <div className="modal-backdrop" onClick={onClose}>
    <section className="product-modal" onClick={(e) => e.stopPropagation()}>
      <button className="close" onClick={onClose}><X/></button>
      <div className="badges"><span>{phone.carrier}</span><span>{phone.joinType}</span><b>{phone.badge}</b></div>
      <h2>{phone.name}</h2>
      <p className="modal-sub">{phone.storage} · {phone.color} · {phone.plan}</p>
      <div className="price-row"><span>예상 실구매가</span><strong>{money(phone.customerPrice)}</strong></div>
      <div className="detail-list">
        <div><span>출고가</span><b>{money(phone.devicePrice)}</b></div>
        <div><span>예상 지원금</span><b>{money(phone.support)}</b></div>
        <div><span>월 요금</span><b>{money(phone.monthlyFee)}</b></div>
        <div><span>재고상태</span><b>{phone.stock}</b></div>
      </div>
      <p className="notice">정확한 금액은 통신사 정책, 요금제, 부가 조건, 재고 상태 확인 후 확정됩니다.</p>
      <a className="primary full" href="#consult" onClick={onClose}>이 모델로 상담 신청</a>
    </section>
  </div>
}

function ConsultForm({ selected }: { selected: string }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [model, setModel] = useState(selected)
  const [joinType, setJoinType] = useState<JoinType>('번호이동')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  React.useEffect(() => {
    setModel(selected)
  }, [selected])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setMessage('')

    if (!supabase) {
      setStatus('error')
      setMessage('상담 저장 설정이 아직 연결되지 않았습니다. 화면과 기능 확인용 초안입니다.')
      return
    }

    const { error } = await supabase.from('consult_requests').insert({
      name,
      phone,
      desired_model: model || null,
      join_type: joinType,
      source: 'linkbus.kr',
      status: 'new',
    })

    if (error) {
      setStatus('error')
      setMessage('저장 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.')
      return
    }

    setStatus('success')
    setMessage('상담 신청이 접수되었습니다. 확인 후 연락드릴게요.')
    setName('')
    setPhone('')
    setModel('')
    setJoinType('번호이동')
  }

  return <form className="consult-form" onSubmit={submit}>
    <label>이름<input value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" required /></label>
    <label>연락처<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" required /></label>
    <label>희망 모델<input value={model} onChange={(e) => setModel(e.target.value)} placeholder="예: iPhone 17 Pro" /></label>
    <label>가입유형<select value={joinType} onChange={(e) => setJoinType(e.target.value as JoinType)}><option>번호이동</option><option>기기변경</option><option>신규가입</option></select></label>
    <label className="agree"><input type="checkbox" required /> 개인정보 수집·이용에 동의합니다.</label>
    {message && <p className={`form-message ${status}`}>{message}</p>}
    <button className="primary full" type="submit" disabled={status === 'sending'}>{status === 'sending' ? '접수 중...' : '상담 신청하기'}</button>
  </form>
}

createRoot(document.getElementById('root')!).render(<App />)
