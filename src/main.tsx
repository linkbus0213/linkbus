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


const BUSINESS_INFO = {
  name: '링크버스',
  representative: '김지민',
  businessNumber: '185-62-00901',
  mailOrderNumber: '제2026-용인수지-1907호',
  address: '경기도 용인시 수지구 수지로342번길 30, 현대프라자빌딩 502호 R24호 (풍덕천동)',
  businessType: '도매 및 소매업 · 전문, 과학 및 기술서비스업 · 서비스',
  businessItem: '휴대폰 · SNS마켓 · 광고 대행업 · 휴대폰AS',
  privacyManager: '김지민',
  email: 'linkbus0213@gmail.com',
  customerCenter: '010-5860-0090',
  hours: '평일 10:00 ~ 18:00 · 점심시간 12:00 ~ 13:00 · 토요일/일요일 휴무',
  ftcUrl: 'https://www.ftc.go.kr/bizCommPop.do?wrkr_no=1856200901',
}


type Brand = '애플' | '삼성' | '기타'
type Carrier = 'SK' | 'KT' | 'LG' | '알뜰폰'
type JoinType = '번호이동' | '기기변경' | '신규가입'
type ColorOption = { name: string; hex: string; image: string }
type CarrierKey = 'SKT' | 'KT' | 'LGU+'
type CarrierMoney = Partial<Record<CarrierKey, number | null>>
type RebateByCarrierJoin = Partial<Record<CarrierKey, Partial<Record<JoinType, number | null>>>>
type PlanRebateByCarrier = Partial<Record<CarrierKey, Record<string, Partial<Record<JoinType, number | null>>>>>
type PlanSupportByCarrier = Partial<Record<CarrierKey, Record<string, number | null>>>
type PlanSupportByCarrierJoin = Partial<Record<CarrierKey, Record<string, Partial<Record<JoinType, number | null>>>>>
type VisiblePlansByCarrier = Partial<Record<CarrierKey, string[]>>
type NewJoinVisibleByCarrier = Partial<Record<CarrierKey, boolean>>
type StorageOption = { label: string; price?: number | null; support?: number | null; rebate?: number | null; isVisible?: boolean; supportByCarrier?: CarrierMoney; rebateByCarrier?: CarrierMoney; rebateByCarrierJoin?: RebateByCarrierJoin; planRebateByCarrier?: PlanRebateByCarrier; visiblePlansByCarrier?: VisiblePlansByCarrier; planSupportByCarrier?: PlanSupportByCarrier; planSupportByCarrierJoin?: PlanSupportByCarrierJoin; newJoinVisibleByCarrier?: NewJoinVisibleByCarrier }
type Phone = {
  id: string; brand: Brand; series: string; carrier: Carrier; joinType: JoinType; name: string; subtitle: string; image: string
  price: number | null; rebate: number | null; monthly: number; support: number; badge: string; tag: string; isVisible?: boolean
  colors: ColorOption[]; storages: StorageOption[]
}
type ProductRow = {
  id: string; brand: Brand; series: string; carrier: Carrier; join_type: JoinType; name: string; subtitle: string | null; image_url: string | null
  sale_price: number | null; rebate: number | null; monthly_fee: number | null; support_amount: number | null; badge: string | null; tag: string | null
  is_visible: boolean; sort_order: number | null; color_options?: ColorOption[] | null; storage_options?: StorageOption[] | null
}

const officialImages = {
  iphonePro: 'https://www.apple.com/v/iphone-17-pro/f/images/meta/iphone-17-pro_overview__eumhhclcpuaa_og.png?202604301049',
  iphone: 'https://www.apple.com/v/iphone-17/f/images/meta/iphone-17_overview__cg0rlzmbhl7m_og.png?202604301049',
  galaxy: 'https://images.samsung.com/kdp/st/1/17875ef3-e132-4a7e-abfb-2622dd6c8a9c.jpg',
}
const defaultColors = (image: string): ColorOption[] => [{ name: '블랙', hex: '#1f2329', image }, { name: '화이트', hex: '#f2f2ee', image }, { name: '핑크', hex: '#f6d8dd', image }]
const storagePresets = ['128G', '256G', '512G', '1TB', '2TB']
const defaultStorages: StorageOption[] = [{ label: '256G', isVisible: true }]
const excelStorageData: Record<string, StorageOption[]> = {
  "iphone17pro": [
    {
      "label": "256G",
      "price": 1782000,
      "rebate": null,
      "support": null,
      "isVisible": true,
      "supportByCarrier": {
        "SKT": 450000,
        "KT": 450000,
        "LGU+": 550000
      },
      "rebateByCarrier": {},
      "rebateByCarrierJoin": {},
      "planRebateByCarrier": {},
      "planSupportByCarrier": {
        "SKT": {
          "5GX프리미엄": 450000,
          "5GX프라임플러스": 430000,
          "5GX프라임": 420000,
          "0청년109": 420000,
          "0청년99": 430000,
          "0청년89": 420000
        },
        "KT": {
          "초이스스페셜": 450000,
          "스페셜": 450000,
          "초이스베이직": 450000,
          "베이직": 400000
        },
        "LGU+": {
          "프리미어슈퍼": 550000,
          "프리미어플러스": 550000,
          "프리미어레귤러": 550000,
          "프리미어에센셜": 550000
        }
      },
      "visiblePlansByCarrier": {
        "SKT": [
          "5GX프리미엄",
          "5GX프라임플러스",
          "5GX프라임",
          "0청년109",
          "0청년99",
          "0청년89"
        ],
        "KT": [
          "초이스스페셜",
          "스페셜",
          "초이스베이직",
          "베이직"
        ],
        "LGU+": [
          "프리미어슈퍼",
          "프리미어플러스",
          "프리미어레귤러",
          "프리미어에센셜"
        ]
      },
      "newJoinVisibleByCarrier": {},
      "planSupportByCarrierJoin": {
        "LGU+": {
          "프리미어슈퍼": {
            "번호이동": 550000,
            "기기변경": 450000,
            "신규가입": 450000
          },
          "프리미어플러스": {
            "번호이동": 550000,
            "기기변경": 450000,
            "신규가입": 450000
          },
          "프리미어레귤러": {
            "번호이동": 550000,
            "기기변경": 450000,
            "신규가입": 450000
          },
          "프리미어에센셜": {
            "번호이동": 550000,
            "기기변경": 450000,
            "신규가입": 450000
          }
        }
      }
    },
    {
      "label": "512G",
      "price": 2090000,
      "rebate": null,
      "support": null,
      "isVisible": true,
      "supportByCarrier": {
        "SKT": 450000,
        "KT": 450000,
        "LGU+": 550000
      },
      "rebateByCarrier": {},
      "rebateByCarrierJoin": {},
      "planRebateByCarrier": {},
      "planSupportByCarrier": {
        "SKT": {
          "5GX프리미엄": 450000,
          "5GX프라임플러스": 430000,
          "5GX프라임": 420000,
          "0청년109": 420000,
          "0청년99": 430000,
          "0청년89": 420000
        },
        "KT": {
          "초이스스페셜": 450000,
          "스페셜": 450000,
          "초이스베이직": 450000,
          "베이직": 400000
        },
        "LGU+": {
          "프리미어슈퍼": 550000,
          "프리미어플러스": 550000,
          "프리미어레귤러": 550000,
          "프리미어에센셜": 550000
        }
      },
      "visiblePlansByCarrier": {
        "SKT": [
          "5GX프리미엄",
          "5GX프라임플러스",
          "5GX프라임",
          "0청년109",
          "0청년99",
          "0청년89"
        ],
        "KT": [
          "초이스스페셜",
          "스페셜",
          "초이스베이직",
          "베이직"
        ],
        "LGU+": [
          "프리미어슈퍼",
          "프리미어플러스",
          "프리미어레귤러",
          "프리미어에센셜"
        ]
      },
      "newJoinVisibleByCarrier": {},
      "planSupportByCarrierJoin": {
        "LGU+": {
          "프리미어슈퍼": {
            "번호이동": 550000,
            "기기변경": 450000,
            "신규가입": 450000
          },
          "프리미어플러스": {
            "번호이동": 550000,
            "기기변경": 450000,
            "신규가입": 450000
          },
          "프리미어레귤러": {
            "번호이동": 550000,
            "기기변경": 450000,
            "신규가입": 450000
          },
          "프리미어에센셜": {
            "번호이동": 550000,
            "기기변경": 450000,
            "신규가입": 450000
          }
        }
      }
    },
    {
      "label": "1TB",
      "price": 2387000,
      "rebate": null,
      "support": null,
      "isVisible": true,
      "supportByCarrier": {
        "SKT": 450000,
        "KT": 450000,
        "LGU+": 550000
      },
      "rebateByCarrier": {},
      "rebateByCarrierJoin": {},
      "planRebateByCarrier": {},
      "planSupportByCarrier": {
        "SKT": {
          "5GX프리미엄": 450000,
          "5GX프라임플러스": 430000,
          "5GX프라임": 420000,
          "0청년109": 420000,
          "0청년99": 430000,
          "0청년89": 420000
        },
        "KT": {
          "초이스스페셜": 450000,
          "스페셜": 450000,
          "초이스베이직": 450000,
          "베이직": 400000
        },
        "LGU+": {
          "프리미어슈퍼": 550000,
          "프리미어플러스": 550000,
          "프리미어레귤러": 550000,
          "프리미어에센셜": 550000
        }
      },
      "visiblePlansByCarrier": {
        "SKT": [
          "5GX프리미엄",
          "5GX프라임플러스",
          "5GX프라임",
          "0청년109",
          "0청년99",
          "0청년89"
        ],
        "KT": [
          "초이스스페셜",
          "스페셜",
          "초이스베이직",
          "베이직"
        ],
        "LGU+": [
          "프리미어슈퍼",
          "프리미어플러스",
          "프리미어레귤러",
          "프리미어에센셜"
        ]
      },
      "newJoinVisibleByCarrier": {},
      "planSupportByCarrierJoin": {
        "LGU+": {
          "프리미어슈퍼": {
            "번호이동": 550000,
            "기기변경": 450000,
            "신규가입": 450000
          },
          "프리미어플러스": {
            "번호이동": 550000,
            "기기변경": 450000,
            "신규가입": 450000
          },
          "프리미어레귤러": {
            "번호이동": 550000,
            "기기변경": 450000,
            "신규가입": 450000
          },
          "프리미어에센셜": {
            "번호이동": 550000,
            "기기변경": 450000,
            "신규가입": 450000
          }
        }
      }
    }
  ],
  "iphone17e": [
    {
      "label": "256G",
      "price": 990000,
      "isVisible": true,
      "supportByCarrier": {
        "SKT": 138000,
        "KT": 450000,
        "LGU+": 230000
      },
      "planSupportByCarrier": {
        "SKT": {
          "5GX프리미엄": 110000,
        },
        "KT": {
          "초이스스페셜": 450000,
          "초이스베이직": 450000,
          "베이직": 400000
        },
        "LGU+": {
          "프리미어슈퍼": 204000,
          "프리미어플러스": 186000,
        }
      },
      "visiblePlansByCarrier": {
        "SKT": [
          "5GX프리미엄",
        ],
        "KT": [
          "초이스스페셜",
          "초이스베이직",
          "베이직"
        ],
        "LGU+": [
          "프리미어슈퍼",
          "프리미어플러스",
        ]
      },
      "rebateByCarrierJoin": {}
    },
    {
      "label": "512G",
      "price": 1287000,
      "isVisible": true,
      "supportByCarrier": {
        "SKT": 138000,
        "KT": 450000,
        "LGU+": 230000
      },
      "planSupportByCarrier": {
        "SKT": {
          "5GX프리미엄": 110000,
        },
        "KT": {
          "초이스스페셜": 450000,
          "초이스베이직": 450000,
          "베이직": 400000
        },
        "LGU+": {
          "프리미어슈퍼": 204000,
          "프리미어플러스": 186000,
        }
      },
      "visiblePlansByCarrier": {
        "SKT": [
          "5GX프리미엄",
        ],
        "KT": [
          "초이스스페셜",
          "초이스베이직",
          "베이직"
        ],
        "LGU+": [
          "프리미어슈퍼",
          "프리미어플러스",
        ]
      },
      "rebateByCarrierJoin": {}
    }
  ],
  "iphone17pm": [
    {
      "label": "256G",
      "price": 1980000,
      "isVisible": true,
      "supportByCarrier": {
        "SKT": 260000,
        "KT": 250000,
        "LGU+": 230000
      },
      "planSupportByCarrier": {
        "SKT": {
          "5GX프리미엄": 150000,
        },
        "KT": {
          "초이스스페셜": 201000,
          "초이스베이직": 150000,
          "베이직": 147000
        },
        "LGU+": {
          "프리미어슈퍼": 204000,
          "프리미어플러스": 186000,
        }
      },
      "visiblePlansByCarrier": {
        "SKT": [
          "5GX프리미엄",
        ],
        "KT": [
          "초이스스페셜",
          "초이스베이직",
          "베이직"
        ],
        "LGU+": [
          "프리미어슈퍼",
          "프리미어플러스",
        ]
      },
      "rebateByCarrierJoin": {}
    },
    {
      "label": "512G",
      "price": 2288000,
      "isVisible": true,
      "supportByCarrier": {
        "SKT": 260000,
        "KT": 250000,
        "LGU+": 230000
      },
      "planSupportByCarrier": {
        "SKT": {
          "5GX프리미엄": 150000,
        },
        "KT": {
          "초이스스페셜": 201000,
          "초이스베이직": 150000,
          "베이직": 147000
        },
        "LGU+": {
          "프리미어슈퍼": 204000,
          "프리미어플러스": 186000,
        }
      },
      "visiblePlansByCarrier": {
        "SKT": [
          "5GX프리미엄",
        ],
        "KT": [
          "초이스스페셜",
          "초이스베이직",
          "베이직"
        ],
        "LGU+": [
          "프리미어슈퍼",
          "프리미어플러스",
        ]
      },
      "rebateByCarrierJoin": {}
    },
    {
      "label": "1TB",
      "price": 2585000,
      "isVisible": true,
      "supportByCarrier": {
        "SKT": 260000,
        "KT": 250000,
        "LGU+": 230000
      },
      "planSupportByCarrier": {
        "SKT": {
          "5GX프리미엄": 150000,
        },
        "KT": {
          "초이스스페셜": 201000,
          "초이스베이직": 150000,
          "베이직": 147000
        },
        "LGU+": {
          "프리미어슈퍼": 204000,
          "프리미어플러스": 186000,
        }
      },
      "visiblePlansByCarrier": {
        "SKT": [
          "5GX프리미엄",
        ],
        "KT": [
          "초이스스페셜",
          "초이스베이직",
          "베이직"
        ],
        "LGU+": [
          "프리미어슈퍼",
          "프리미어플러스",
        ]
      },
      "rebateByCarrierJoin": {}
    },
    {
      "label": "2TB",
      "price": 3190000,
      "isVisible": true,
      "supportByCarrier": {
        "SKT": 260000,
        "KT": 250000
      },
      "planSupportByCarrier": {
        "SKT": {
          "5GX프리미엄": 150000,
        },
        "KT": {
          "초이스스페셜": 201000,
          "초이스베이직": 150000,
          "베이직": 147000
        }
      },
      "visiblePlansByCarrier": {
        "SKT": [
          "5GX프리미엄",
        ],
        "KT": [
          "초이스스페셜",
          "초이스베이직",
          "베이직"
        ]
      },
      "rebateByCarrierJoin": {}
    }
  ],
  "s26ultra": [
    {
      "label": "256G",
      "price": 1797400,
      "isVisible": true,
      "supportByCarrier": {
        "SKT": 580000,
        "LGU+": 700000
      },
      "planSupportByCarrier": {
        "SKT": {
          "5GX프리미엄": 580000,
        },
        "LGU+": {
          "프리미어슈퍼": 700000,
          "프리미어플러스": 700000,
        }
      },
      "visiblePlansByCarrier": {
        "SKT": [
          "5GX프리미엄",
        ],
        "LGU+": [
          "프리미어슈퍼",
          "프리미어플러스",
        ]
      },
      "rebateByCarrierJoin": {}
    },
    {
      "label": "512G",
      "price": 2050400,
      "isVisible": true,
      "supportByCarrier": {
        "SKT": 580000,
        "LGU+": 700000
      },
      "planSupportByCarrier": {
        "SKT": {
          "5GX프리미엄": 580000,
        },
        "LGU+": {
          "프리미어슈퍼": 700000,
          "프리미어플러스": 700000,
        }
      },
      "visiblePlansByCarrier": {
        "SKT": [
          "5GX프리미엄",
        ],
        "LGU+": [
          "프리미어슈퍼",
          "프리미어플러스",
        ]
      },
      "rebateByCarrierJoin": {}
    },
    {
      "label": "1TB",
      "price": 2545400,
      "isVisible": true,
      "supportByCarrier": {
        "SKT": 580000,
        "LGU+": 700000
      },
      "planSupportByCarrier": {
        "SKT": {
          "5GX프리미엄": 580000,
        },
        "LGU+": {
          "프리미어슈퍼": 700000,
          "프리미어플러스": 700000,
        }
      },
      "visiblePlansByCarrier": {
        "SKT": [
          "5GX프리미엄",
        ],
        "LGU+": [
          "프리미어슈퍼",
          "프리미어플러스",
        ]
      },
      "rebateByCarrierJoin": {}
    }
  ]
}

type PlanOption = { carrier: CarrierKey; name: string; fee: number; data: string; voice: string; benefits: string[] }
const carrierPlans: PlanOption[] = [
  { carrier: 'SKT', name: '5GX프리미엄', fee: 109000, data: '완전 무제한', voice: '집/이동전화 무제한', benefits: ['프리미엄 5G 데이터', '멤버십 VIP', '스마트기기/데이터 쉐어링 할인'] },
  { carrier: 'SKT', name: '5GX프라임플러스', fee: 99000, data: '완전 무제한', voice: '집/이동전화 무제한', benefits: ['프라임급 5G 데이터', '콘텐츠/제휴 혜택', '스마트기기 할인'] },
  { carrier: 'SKT', name: '5GX프라임', fee: 89000, data: '완전 무제한', voice: '집/이동전화 무제한', benefits: ['대표 5G 무제한 요금제', '기본 부가통화 제공'] },
  { carrier: 'SKT', name: '0청년109', fee: 109000, data: '청년 전용 완전 무제한', voice: '집/이동전화 무제한', benefits: ['청년 전용 데이터/제휴 혜택', '멤버십/콘텐츠 혜택'] },
  { carrier: 'SKT', name: '0청년99', fee: 99000, data: '청년 전용 완전 무제한', voice: '집/이동전화 무제한', benefits: ['청년 전용 데이터 혜택', '콘텐츠/제휴 혜택'] },
  { carrier: 'SKT', name: '0청년89', fee: 89000, data: '청년 전용 무제한', voice: '집/이동전화 무제한', benefits: ['청년 전용 데이터 혜택', '기본 부가통화 제공'] },
  { carrier: 'KT', name: '초이스스페셜', fee: 110000, data: '완전 무제한', voice: '집/이동전화 무제한', benefits: ['초이스 콘텐츠 혜택', '멤버십 VIP', '스마트기기 할인'] },
  { carrier: 'KT', name: '스페셜', fee: 100000, data: '완전 무제한', voice: '집/이동전화 무제한', benefits: ['프리미엄 데이터', '멤버십/로밍 혜택'] },
  { carrier: 'KT', name: '초이스베이직', fee: 90000, data: '완전 무제한', voice: '집/이동전화 무제한', benefits: ['초이스 기본 혜택', '데이터 쉐어링 할인'] },
  { carrier: 'KT', name: '베이직', fee: 80000, data: '무제한', voice: '집/이동전화 무제한', benefits: ['기본 데이터 무제한', '멤버십 기본 혜택'] },
  { carrier: 'LGU+', name: '프리미어슈퍼', fee: 115000, data: '완전 무제한', voice: '집/이동전화 무제한', benefits: ['프리미어 미디어 혜택', '멤버십 VIP', '스마트기기 할인'] },
  { carrier: 'LGU+', name: '프리미어플러스', fee: 105000, data: '완전 무제한', voice: '집/이동전화 무제한', benefits: ['미디어/콘텐츠 혜택', '데이터 쉐어링 할인'] },
  { carrier: 'LGU+', name: '프리미어레귤러', fee: 95000, data: '완전 무제한', voice: '집/이동전화 무제한', benefits: ['프리미어 기본 혜택', '데이터 쉐어링 할인'] },
  { carrier: 'LGU+', name: '프리미어에센셜', fee: 85000, data: '대용량 5G 데이터', voice: '집/이동전화 무제한', benefits: ['실속형 프리미어 혜택', '기본 멤버십 혜택'] },
]
function normalizeCarrier(carrier: Carrier | string): CarrierKey { return carrier === 'SK' ? 'SKT' : carrier === 'LG' ? 'LGU+' : carrier === 'KT' ? 'KT' : 'SKT' }
const carrierKeys: CarrierKey[] = ['SKT', 'KT', 'LGU+']
const joinTypes: JoinType[] = ['번호이동', '기기변경', '신규가입']
const defaultPlanNames: Record<CarrierKey, string> = { SKT: '5GX프리미엄', KT: '초이스스페셜', 'LGU+': '프리미어슈퍼' }
function defaultPlanName(carrier: CarrierKey) { return defaultPlanNames[carrier] }
function carrierValue(values: CarrierMoney | undefined, carrier: CarrierKey, fallback?: number | null) { const value = values?.[carrier]; return value ?? fallback ?? 0 }
function supportValue(storage: StorageOption | undefined, carrier: CarrierKey, joinType: JoinType, fallback?: number | null, planName?: string) { return (planName ? storage?.planSupportByCarrierJoin?.[carrier]?.[planName]?.[joinType] : undefined) ?? (planName ? storage?.planSupportByCarrier?.[carrier]?.[planName] : undefined) ?? carrierValue(storage?.supportByCarrier, carrier, fallback) }
function rebateValue(storage: StorageOption | undefined, carrier: CarrierKey, joinType: JoinType, fallback?: number | null, planName?: string) { return (planName ? storage?.planRebateByCarrier?.[carrier]?.[planName]?.[joinType] : undefined) ?? storage?.rebateByCarrierJoin?.[carrier]?.[joinType] ?? storage?.rebateByCarrier?.[carrier] ?? storage?.rebate ?? fallback ?? 0 }
function visiblePlansForStorage(storage: StorageOption | undefined, carrier: CarrierKey) { const names = storage?.visiblePlansByCarrier?.[carrier]; const plans = carrierPlans.filter((p) => p.carrier === carrier); const isHighPriceModel = (storage?.price ?? 0) > 650000; return isHighPriceModel || !names?.length ? plans : plans.filter((p) => names.includes(p.name)) }
function customerPrincipal(price?: number | null, support?: number | null, rebate?: number | null) { return Math.max(0, (price ?? 0) - (support ?? 0) - (rebate ?? 0)) }
function roundToTen(value: number) { return Math.round(value / 10) * 10 }
function installmentPayment(principal: number, months = 24, annualRate = 0.059) {
  if (principal <= 0) return { principal: 0, monthly: 0, interest: 0, total: 0 }
  const r = annualRate / 12
  const monthly = roundToTen(principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1))
  const total = monthly * months
  return { principal, monthly, interest: Math.max(0, total - principal), total }
}
function currentMonthProrated(monthly: number, now = new Date()) {
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const remain = days - now.getDate() + 1
  return Math.round(monthly * remain / days)
}


const fallbackPhones: Phone[] = [
  { id: 'iphone-17e', brand: '애플', series: 'iPhone 17 시리즈', carrier: 'SK', joinType: '번호이동', name: '아이폰 17e', subtitle: '128GB · 빠른 상담 가능', image: officialImages.iphone, price: 190000, rebate: 0, monthly: 69000, support: 620000, badge: '인기', tag: 'APPLE', isVisible: true, colors: defaultColors(officialImages.iphone), storages: excelStorageData.iphone17e },
  { id: 'iphone-17-pro-max', brand: '애플', series: 'iPhone 17 시리즈', carrier: 'KT', joinType: '기기변경', name: '아이폰 17 프로맥스', subtitle: '256GB · 색상 상담', image: officialImages.iphonePro, price: 740000, rebate: 0, monthly: 99000, support: 760000, badge: '최신', tag: 'PRO', isVisible: true, colors: defaultColors(officialImages.iphonePro), storages: excelStorageData.iphone17pm },
  { id: 'galaxy-s26-ultra', brand: '삼성', series: 'Galaxy S26 시리즈', carrier: 'LG', joinType: '번호이동', name: '갤럭시 S26 울트라', subtitle: '256GB · 울트라 성능', image: officialImages.galaxy, price: 530000, rebate: 0, monthly: 95000, support: 880000, badge: '급상승', tag: 'SAMSUNG', isVisible: true, colors: defaultColors(officialImages.galaxy), storages: excelStorageData.s26ultra },
]
const brands: Array<Brand | '전체'> = ['전체', '애플', '삼성', '기타']
const appleSeries = ['iPhone 17 시리즈', 'iPhone 16 시리즈', 'iPhone 15 시리즈']
const samsungSeries = ['Galaxy S26 시리즈', 'Galaxy Z 시리즈', 'Galaxy A 시리즈']
const purchaseCautionText = "구매 전 반드시 확인 바랍니다!\n\n휴대폰 구매 시 주의사항 및 필독사항\n\n1.약정기간은 24개월 입니다. 약정 기간 내 해지 시 위약금 발생(추가지원금 환수) 일부 모델은 12개월.\n2.링크버스 쇼핑몰에서 제공하는 할인 및 추가지원금 할인은 당사 사정에 따라 변경될 수 있습니다.(변경시 필수 안내함)\n3.일부 요금제는 가입은 가능하나 링크버스 쇼핑몰에서 제공하는 할임 및 추가지원금 할인에서 제외될 수 있습니다.\n4.링크버스 쇼핑몰에서 제공하는 할인 및 추가지원금 할인금액은 개통 후 186일 이내(SK는 285일 이내)\n해지/정지(일시정지&해외정지)/명의변경/다른기기로의 기기변경(유심기변포함)/타통신사로의 이동/실사용 안함(186일.발신통화 월 5회 이상/총 통화시간 15분이상 사용조건) 발견시 링크버스가 제공한 할인 및 추가지원금 전액 반환.\n5.개통 당시 선택한 요금제 유지기간은 186일 이며 이후에 요금제 하향 가능합니다\n(5G단말 SK 42,000원 / KT&LG 47,000원 기본료까지만 가능.이보다 낮은 요금제 변경시 할인반환금 청구)\n(LTE단말 SK 20,000원 / KT 20,000원 / LG 26,400원 기본료까지만 가능. 이보다 낮은 요금제 변경시 할인반환금 청구)\n- 유지기간 이전 5G요금제<->LTE요금제 변경 불가.\n6.186일 이전 요금제 하향 및 해지시 링크버스 쇼핑몰에서 제공한 할인 및 추가지원금 & 통신사 공통지원금 및 추가지원금에 대한 할인반환금 청구됨.\n7.휴대폰은 실사용 목적에 따라 신청 및 개통해야 하므로 수령 및 개통 후 미사용/기타 불법적인 용도로 이용/기타 악의적인 목적으로 개통시 링크버스 쇼핑몰이 받게 되는 피해는 개통한 고객에게 피해보상 청구 소송이 진행됩니다.\n\n[가입불가 안내]\n\n통신사별/가입유형별 진행 불가인 경우\n\n1.현재 선불폰 이용 중인 경우 진행 불가.\n2.직전 개통일 186일 이내 개통 불가. 알뜰폰 사용시 별도 문의\n- 링크버스 개통 및 타 대리점 개통 동일 적용\n- [KT,LG기기변경] 직전 개통일 12개월 이내 진행 불가 (별도 안내시 추가금 발생 동의시 가능).\n3.요금 체납 및 미납이 있는 경우 진행 불가. -직접 통신사 고객센터(114)를 통해 수납 완료 후 진행 가능.\n4.개인신용상태에 따라 할부 회선 및 가입 회선, 할부 한도가 부족하거나 할부 자체가 불가능할 시 진행 불가. - 직접 서울보증보험 문의\n5.SK가입시 개통자와 동일 명의 SK 해지 이력이 30일 이내인 경우 진행 불가. 30일 이후 부터 진행 가능.\n\n[배송안내]\n\n배송은 로젠택배 배송만 가능. 오후6시 이전 신청시 당일 발송.(무료배송)\n(도착지역 택배 지점 및 배송기사님 상황에 따라 익일 배송이 안될수도 있습니다. 미배송시 송장 확인 후 지역 택배 지점으로 직접 문의)\n\n[개통안내]\n\n위약금 및 잔여할부금 확인 및 가입 불가 요금제\n1.기존 단말기의 위약금&잔여할부금 조회 불가 및 책임지지 않습니다. 각 통신사의 고객센터(114)로 직접 확인\n2.기존 통신사 위약금 발생시 익월 요금에 합산 청구됨\n3.기존 통신사 잔여할부금은 기존 통신사에서 지속 청구됨. 완납 요청은 기존 통신사 고객센터(114)로 직접 요청.\n4.월 중 요금제 변경시 초과요금(데이터&통화사용량 일할계산)이 발생될 수 있음.\n5.신규 가입이 불가능한 요금제 사용시 개통이 불가 하거나 변경 이후 원복 절대 불가능. 고객센터(114)로 직접 확인.\n\n통신사 이동 : \n1.통신사 이동 개통이 되면 기존 사용하던 통신사가 끊기게 되어 택배 선발송 후 개통 진행합니다 . 개통 전 미개봉 필수.\n(단, 통신사의 갑작스런 정책변동(가격변동)이 있을수 있기 때문에 선개통 될수 있습니다.)\n2.통신사의 사정으로 개통 지연이 발생할 수 있습니다.(최대 지연시 1달)\n\n신규가입 & 기기변경 :\n1.접수 당일 해피콜 및 온라인 공식 신청서 작성 및 선개통 후 발송 됩니다.\n2.기기변경 개통시 선개통으로 인해 기존 기기 사용 불가할수 있으므로 유심보호서비스 부가서비스 삭제 후 개통 됩니다. 수령 후 고객센터(114)를 통해 재가입 가능.\n\n부가서비스 및 보험 가입 안내\n1. 부가서비스는 개통 후 고객센터(114) 또는 직영대리점에서 별도 가입(요청 주셔도 가입 불가)\n2. 보험 가입은 개통일부터 30~60일이내 가입 가능하며 고객센터(114)또는 직영대리점에서 별도 가입(요청 주셔도 가입 불가)\n\n유심 안내\n1.기기변경시 - 기존 유심 재사용\n2.신규가입&통신사이동시 - USIM구매(7,700원) 또는 e-SIM다운로드(2,750원)\n\n결합 및 복지할인\n1. 개통 후 직접 고객센터(114) 또는 직영대리점에서 별도 가입\n2. 기기변경시 기존 결합(가족결합,유무선결합,무무선결합등) 유지 , 복지할인 유지\n(가입 상태는 유지되나 요금제 변경 및 회선 변경시 할인율 또는 할인액 변경될 수 있음 고객센터(114)로 직접 확인)\n\n\n[취소 및 반품 안내]\n\n1. 단말기 박스 개봉시 (개통전이라도) 교환 / 반품 절대 불가 합니다\n2. 개통 불가 사유가 뒤늦게 발견되어 개통이 안되는 경우 개봉하셨다면 출고가 일시 납부\n3. 미개봉&미개통시만 교환 및 반품 가능합니다. (단순 변심 반품 시 회수 배송비 발생. 고객 부담)\n4. 단말기 불량시 제조사 서비스센터에서 발급한 착하불량증 첨부시 개통&개봉이어도 개통취소 및 새제품으로 교환 가능합니다 (애플제품은 애플서비스센터에서 교환만 가능)\n- 삼성(교환 및 반품)\n개통일 포함 14일 이내 삼성서비스센터에서 발급된 착하불량증(불량확인증)  첨부시 취소 및 새제품 교환 가능\n- 애플(교환)\n개통일 포함 30일 이내 애플서비스센터에서 단말기 불량의 경우 새 단말기로 교환 가능\n개통일 포함 30일 이후 애플서비스센터의 자체 규정에 따라 교환 또는 수리 가능\n5. 통화 품질 불량으로 인한 취소시 고객 직접 요청으로 통신사 규정대로 점검 후 통화품질 이상 확인시 처리 가능."
const tips = ['아이폰17 / 갤럭시 S26 울트라 휴대폰 “0원폰”의 진실', '26년 5월 SK텔레콤 라이트 할부 카드 이벤트 안내', '휴대폰 신청시 주의해야 할 점 feat. 부가서비스', '휴대폰 개통시 주의해야 할 점 feat. 제휴카드', 'KT 총액 결합할인 제도 쉽게 알아보기']

function money(value: number | null | undefined) { return value == null ? '상담가' : `${value.toLocaleString()}원` }
function safeFileName(name: string) { return name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').toLowerCase() || 'image' }
function cleanColors(colors?: ColorOption[] | null, image = officialImages.iphone) { return colors?.length ? colors.filter(c => c.name).map(c => ({ name: c.name, hex: c.hex || '#dddddd', image: c.image || image })) : defaultColors(image) }
function cleanStorages(storages?: StorageOption[] | null) { return storages?.length ? storages.filter(s => s.label).map(s => ({ label: s.label, price: s.price ?? null, support: s.support ?? null, rebate: s.rebate ?? null, isVisible: s.isVisible ?? true, supportByCarrier: s.supportByCarrier || {}, rebateByCarrier: s.rebateByCarrier || {}, rebateByCarrierJoin: s.rebateByCarrierJoin || {}, planRebateByCarrier: s.planRebateByCarrier || {}, visiblePlansByCarrier: s.visiblePlansByCarrier || {}, planSupportByCarrier: s.planSupportByCarrier || {}, planSupportByCarrierJoin: s.planSupportByCarrierJoin || {}, newJoinVisibleByCarrier: s.newJoinVisibleByCarrier || {} })) : defaultStorages }
function visibleStorages(phone: Phone) { const list = phone.storages.filter((s) => s.isVisible !== false); return list.length ? list : phone.storages.slice(0, 1) }
function rowToPhone(row: ProductRow): Phone { const image = row.image_url || officialImages.iphone; const normalizedName = row.name.replace(/\s/g, ''); const importedStorages = normalizedName.includes('아이폰17프로') && !normalizedName.includes('맥스') ? excelStorageData.iphone17pro : undefined; const rowStorages = cleanStorages(row.storage_options); const hasPrices = rowStorages.some((s) => s.price || Object.keys(s.supportByCarrier || {}).length || Object.keys(s.planSupportByCarrier || {}).length); return { id: row.id, brand: row.brand, series: row.series, carrier: row.carrier, joinType: row.join_type, name: row.name, subtitle: row.subtitle || '', image, price: row.sale_price, rebate: row.rebate, monthly: row.monthly_fee || 0, support: row.support_amount || 0, badge: row.badge || '추천', tag: row.tag || row.brand, isVisible: row.is_visible, colors: cleanColors(row.color_options, image), storages: importedStorages && !hasPrices ? importedStorages : rowStorages } }
function phoneToRow(phone: Phone) { return { brand: phone.brand, series: phone.series, carrier: phone.carrier, join_type: phone.joinType, name: phone.name, subtitle: phone.subtitle, image_url: phone.image, sale_price: phone.price, rebate: phone.rebate, monthly_fee: phone.monthly, support_amount: phone.support, badge: phone.badge, tag: phone.tag, is_visible: phone.isVisible ?? true, color_options: phone.colors, storage_options: phone.storages } }


function IctCertBadge() { return <a className="ict-cert-badge" href="https://ictmarket.or.kr:8443/precon/pop_CertIcon.do?PRECON_REQ_ID=PRE0000191674" target="_blank" rel="noreferrer"><img src="https://ictmarket.or.kr:8443/getCertIcon.do?cert_icon=KP25022507346Q002" alt="ICTMARKET 사전승낙 인증마크"/></a> }

function HeaderNav({ simple = false }: { simple?: boolean }) { const ticker = ['LINKBUS 휴대폰 구매 상담 OPEN', '전 통신사 조건 비교', '최저가 상담 신청 가능', '안전한 개통 절차 안내']; return <header className="topbar"><div className="notice-ticker"><div className="ticker-track">{[...ticker, ...ticker].map((text, i) => <span key={`${text}-${i}`}>{text}</span>)}</div></div><div className="top-inner"><a className="brand-logo" href="/"><span>LINK</span>BUS</a></div><nav className="menu-line"><a href="/#popular">상품목록</a><a href="/#consult">상담신청</a>{simple ? <a href="/">홈으로</a> : <><a href="/business-info">사업자정보</a><a href="/terms">이용약관</a><a href="/privacy">개인정보처리방침</a><a href="/refund">교환/반품/환불</a></>}</nav></header> }
type StorePage = 'home' | 'apple' | 'samsung' | 'sim' | 'used' | 'reviews' | 'customer'
const mainNavItems: Array<{ page: StorePage; label: string; href: string }> = [
  { page: 'apple', label: '애플', href: '/apple' },
  { page: 'samsung', label: '삼성', href: '/samsung' },
  { page: 'sim', label: '유심만개통', href: '/sim-only' },
  { page: 'used', label: '중고폰판매', href: '/used-phone' },
  { page: 'reviews', label: '리얼후기', href: '/reviews' },
  { page: 'customer', label: '고객센터', href: '/customer-center' },
]
function MainHeader({ active = 'home' }: { active?: StorePage }) { return <header className="topbar"><div className="notice-ticker"><div className="ticker-track">{['LINKBUS 휴대폰 구매 상담 OPEN', '전 통신사 조건 비교', '최대할인구매 상품 확인', '안전한 개통 절차 안내', 'LINKBUS 휴대폰 구매 상담 OPEN', '전 통신사 조건 비교', '최대할인구매 상품 확인', '안전한 개통 절차 안내'].map((text, i) => <span key={`${text}-${i}`}>{text}</span>)}</div></div><div className="top-inner"><a className="brand-logo" href="/"><span>LINK</span>BUS</a></div><nav className="menu-line">{mainNavItems.map((item) => <a key={item.href} className={active === item.page ? 'active' : ''} href={item.href}>{item.label}</a>)}</nav></header> }

function SiteFooter() { return <footer className="footer"><div className="footer-call"><h4>구매 문의 관련 상담</h4><strong>카카오톡 상담 / 전화 상담 준비중</strong><p>{BUSINESS_INFO.hours}</p><p>고객센터: {BUSINESS_INFO.customerCenter}</p></div><div className="footer-business"><b>LINKBUS</b><p><span>상호: {BUSINESS_INFO.name}</span><span>대표자: {BUSINESS_INFO.representative}</span><span>사업자등록번호: {BUSINESS_INFO.businessNumber}</span><span>통신판매업신고번호: {BUSINESS_INFO.mailOrderNumber}</span><span>주소: {BUSINESS_INFO.address}</span><span>고객센터: {BUSINESS_INFO.customerCenter}</span><span>이메일: {BUSINESS_INFO.email}</span><span>개인정보보호책임자: {BUSINESS_INFO.privacyManager}</span></p><div className="footer-links"><a href={BUSINESS_INFO.ftcUrl} target="_blank" rel="noreferrer">공정위 사업자정보확인</a><a href="/terms">이용약관</a><a href="/privacy">개인정보처리방침</a><a href="/refund">교환/반품/환불</a></div><IctCertBadge /></div></footer> }
function LegalPage({ kind }: { kind: 'terms' | 'privacy' | 'refund' | 'business' }) {
  const title = kind === 'terms' ? '이용약관' : kind === 'privacy' ? '개인정보처리방침' : kind === 'refund' ? '교환·반품·환불 안내' : '사업자정보'
  return <><HeaderNav /><main className="legal-page"><section className="legal-card"><p className="legal-eyebrow">LINKBUS</p><h1>{title}</h1>{kind === 'business' && <BusinessInfoContent />}{kind === 'terms' && <TermsContent />}{kind === 'privacy' && <PrivacyContent />}{kind === 'refund' && <RefundContent />}</section></main><SiteFooter /></>
}
function BusinessInfoContent() { return <div className="legal-content"><h2>사업자 정보</h2><dl className="business-dl"><dt>상호</dt><dd>{BUSINESS_INFO.name}</dd><dt>대표자</dt><dd>{BUSINESS_INFO.representative}</dd><dt>사업자등록번호</dt><dd>{BUSINESS_INFO.businessNumber}</dd><dt>통신판매업신고번호</dt><dd>{BUSINESS_INFO.mailOrderNumber}</dd><dt>사업장 소재지</dt><dd>{BUSINESS_INFO.address}</dd><dt>업태</dt><dd>{BUSINESS_INFO.businessType}</dd><dt>종목</dt><dd>{BUSINESS_INFO.businessItem}</dd><dt>고객센터/연락처</dt><dd>{BUSINESS_INFO.customerCenter}</dd><dt>영업시간</dt><dd>{BUSINESS_INFO.hours}</dd><dt>이메일</dt><dd>{BUSINESS_INFO.email}</dd><dt>개인정보보호책임자</dt><dd>{BUSINESS_INFO.privacyManager}</dd></dl><p className="legal-note">사업자 정보는 사업자등록증 및 통신판매업신고증 기준으로 표시합니다.</p><p><a className="legal-button" href={BUSINESS_INFO.ftcUrl} target="_blank" rel="noreferrer">공정거래위원회 사업자정보 확인</a></p><IctCertBadge /></div> }
function TermsContent() { return <div className="legal-content"><h2>제1조 목적</h2><p>본 약관은 {BUSINESS_INFO.name}가 운영하는 LINKBUS 웹사이트에서 제공하는 휴대폰 단말기, 통신상품 정보, 상담 신청, 구매·개통 안내, 회원 서비스, 후기/게시판 서비스 이용에 관한 권리·의무 및 책임사항을 정합니다.</p><h2>제2조 정의</h2><ul><li>“사이트”란 LINKBUS가 재화 또는 용역 정보를 제공하고 상담·구매 신청을 받을 수 있도록 운영하는 웹사이트를 말합니다.</li><li>“이용자”란 사이트에 접속하여 서비스를 이용하는 회원 및 비회원을 말합니다.</li><li>“회원”이란 사이트에 회원가입을 완료하고 로그인 기반 서비스를 이용하는 자를 말합니다.</li><li>“비회원”이란 회원가입 없이 상담 신청 또는 상품 정보를 이용하는 자를 말합니다.</li><li>“상품”이란 휴대폰 단말기, 통신 요금제, 부가서비스, 액세서리 등 사이트에서 안내하는 재화 또는 용역을 말합니다.</li></ul><h2>제3조 약관의 게시 및 변경</h2><p>LINKBUS는 약관, 상호, 대표자, 사업자등록번호, 통신판매업신고번호, 연락처, 개인정보처리방침 등을 이용자가 확인할 수 있도록 사이트에 게시합니다. 약관 변경 시 적용일자와 변경 사유를 공지하며, 이용자에게 불리한 변경은 최소 30일 전부터 공지합니다.</p><h2>제4조 서비스의 제공</h2><ul><li>휴대폰 단말기 및 통신상품 정보 제공</li><li>요금제, 가입유형, 지원금, 할부 조건 안내</li><li>상담 신청 접수 및 개통 절차 안내</li><li>회원가입, 로그인, 마이페이지, 후기/게시판 서비스</li><li>기타 LINKBUS가 정하는 서비스</li></ul><h2>제5조 서비스의 변경 및 중단</h2><p>상품 재고, 통신사 정책, 제조사 사양, 시스템 점검, 장애, 천재지변 등 사유가 발생하면 서비스 내용이 변경되거나 일시 중단될 수 있습니다. 이용자의 거래에 중대한 영향을 주는 변경은 가능한 방법으로 안내합니다.</p><h2>제6조 회원가입</h2><p>이용자는 사이트가 정한 가입 양식에 정보를 입력하고 약관 및 개인정보처리방침에 동의해 회원가입을 신청합니다. 허위 정보, 타인 정보 도용, 이전 이용 제한 이력, 기술상 등록이 어려운 경우 회원가입이 제한됩니다.</p><h2>제7조 회원 탈퇴 및 이용 제한</h2><p>회원은 언제든지 탈퇴를 요청할 수 있습니다. 허위 정보 등록, 타인 정보 도용, 대금 미지급, 서비스 방해, 불법 개통 시도, 부정 후기 작성, 법령 또는 약관 위반이 확인되면 LINKBUS는 회원 자격을 제한·정지·상실시킬 수 있습니다.</p><h2>제8조 회원 ID 및 비밀번호 관리</h2><p>회원 ID와 비밀번호 관리 책임은 회원에게 있습니다. 회원은 계정을 제3자에게 양도하거나 공유할 수 없으며, 도용 또는 무단 사용을 알게 된 경우 즉시 LINKBUS에 알려야 합니다.</p><h2>제9조 구매 및 상담 신청</h2><p>이용자는 상품 선택, 가입유형 선택, 연락처 입력, 약관 및 구매 조건 확인, 상담 신청 또는 구매 신청 절차를 통해 구매 의사를 표시합니다. LINKBUS는 신청 내용을 확인하기 위해 해피콜, 본인확인, 추가 서류 또는 공식 통신사 신청서 작성을 요청할 수 있습니다.</p><h2>제10조 계약의 성립</h2><p>상품 구매 또는 개통 계약은 상담 신청만으로 성립하지 않습니다. 재고, 가입 조건, 본인확인, 통신사 심사, 요금제와 약정 조건 확인, 최종 구매 의사 확인이 완료되고 LINKBUS 또는 통신사가 승낙한 때 성립합니다.</p><h2>제11조 가격·지원금·요금제 안내</h2><p>사이트의 가격은 출고가, 공시지원금, 추가지원금, 요금제, 약정기간, 할부기간, 가입유형, 통신사 정책을 기준으로 안내됩니다. 통신사 정책과 재고는 수시로 변경되며, 개통 전 변경 사항이 발생하면 최종 조건을 다시 안내합니다.</p><h2>제12조 지급 방법</h2><p>상품 대금, 할부금, 배송비, 유심비, 부가 비용 등은 사이트 또는 상담 과정에서 안내한 결제수단으로 지급합니다. 결제수단은 계좌이체, 카드 결제, 무통장입금, 통신요금 합산 청구 등 제공 가능한 방식으로 운영됩니다.</p><h2>제13조 배송 및 상품 공급</h2><p>배송 방식, 배송비, 배송 예정일은 상품 및 상담 과정에서 안내합니다. 도서산간 지역, 택배사 사정, 재고 이동, 본인확인 지연, 통신사 심사 지연이 있으면 배송 또는 개통 일정이 변경됩니다.</p><h2>제14조 청약철회·교환·반품·환불</h2><p>청약철회, 교환, 반품, 환불은 전자상거래 관련 법령, 통신사 개통 정책, 제조사 불량 판정 기준, 상품 상세 안내 및 <a href="/refund">교환·반품·환불 안내</a>에 따릅니다. 단말기 박스 개봉, 개통 완료, 구성품 훼손, 고객 과실 파손 등 제한 사유가 있으면 교환·반품·환불은 불가합니다.</p><h2>제15조 휴대폰 개통 관련 유의사항</h2><ul><li>개통 가능 여부는 통신사 심사, 회선 상태, 미납 여부, 명의 상태, 번호이동 제한 여부에 따라 달라집니다.</li><li>명의도용, 허위 신청, 대리 신청, 불법 보조금 요구, 비정상 사용 목적 신청은 금지됩니다.</li><li>약정, 위약금, 선택약정, 공시지원금, 할부원금, 월 납부액은 개통 전 이용자가 반드시 확인해야 합니다.</li></ul><h2>제16조 후기 및 게시물</h2><p>회원은 사이트에 후기, 문의, 댓글, 이미지 등 게시물을 작성할 수 있습니다. 허위 후기, 광고성 게시물, 욕설, 명예훼손, 개인정보 노출, 불법 정보, 타인의 권리 침해 게시물은 사전 통보 없이 숨김 또는 삭제될 수 있습니다. 이용자가 작성한 게시물의 책임은 작성자에게 있습니다.</p><h2>제17조 이용자의 의무</h2><p>이용자는 정확한 정보를 제공해야 하며, 타인 정보 도용, 허위 신청, 서비스 방해, 부정 접속, 자동화 프로그램 사용, 저작권 침해, 영업 방해, 공서양속에 반하는 행위를 해서는 안 됩니다.</p><h2>제18조 개인정보 보호</h2><p>LINKBUS는 서비스 제공에 필요한 범위에서 개인정보를 처리하며, 구체적인 사항은 <a href="/privacy">개인정보처리방침</a>에 따릅니다.</p><h2>제19조 지식재산권</h2><p>사이트의 디자인, 문구, 이미지, 상품 데이터, 배너, 로고, 소스코드 등 지식재산권은 LINKBUS 또는 정당한 권리자에게 있습니다. 무단 복제, 배포, 크롤링, 상업적 이용은 금지됩니다.</p><h2>제20조 책임의 제한</h2><p>LINKBUS는 통신사 정책 변경, 제조사 사양 변경, 이용자의 귀책사유, 천재지변, 통신 장애, 제3자 서비스 장애로 발생한 손해에 대해 관련 법령상 책임 범위를 초과하여 책임지지 않습니다.</p><h2>제21조 분쟁 해결 및 관할</h2><p>LINKBUS는 이용자의 정당한 의견과 불만을 신속히 처리합니다. 분쟁이 해결되지 않는 경우 관련 법령 및 소비자분쟁해결기준에 따르며, 소송은 민사소송법상 관할 법원에 제기합니다.</p><p className="legal-note">시행일: 2026년 5월 20일</p></div> }
function PrivacyContent() { return <div className="legal-content"><h2>1. 개인정보 처리 목적</h2><p>LINKBUS는 회원가입·로그인, 상담 신청, 휴대폰 구매 및 개통 절차 안내, 상품 후기 작성·관리, 고객 문의 응대, 부정 이용 방지, 분쟁 대응을 위해 개인정보를 처리합니다.</p><h2>2. 수집하는 개인정보 항목</h2><ul><li>회원가입/로그인: 이름, 아이디, 비밀번호, 휴대전화번호, 이메일, 본인확인 정보, 서비스 이용 기록</li><li>상담 신청: 이름, 연락처, 희망 모델, 가입유형, 상담 내용</li><li>구매·개통 진행: 주소, 배송 정보, 통신사 신청서 작성 및 본인확인에 필요한 정보. 해당 정보는 공식 신청 절차에서 별도 안내 및 동의를 받습니다.</li><li>후기·게시판 이용: 작성자 정보, 게시글·댓글 내용, 첨부 이미지, 작성일시</li><li>자동 수집 항목: 접속 로그, 쿠키, 접속 IP, 기기·브라우저 정보, 부정 이용 기록</li></ul><h2>3. 개인정보 수집 방법</h2><p>홈페이지 회원가입, 로그인, 상담 신청서, 게시판/후기 작성, 전화 상담, 카카오톡 등 상담 채널, 이벤트 응모, 배송 요청 및 서비스 이용 과정에서 개인정보를 수집합니다.</p><h2>4. 개인정보의 이용 목적</h2><ul><li>회원 관리: 본인 확인, 로그인, 회원 식별, 가입 의사 확인, 부정 이용 방지, 고지사항 전달</li><li>서비스 제공: 상담 접수, 상품 안내, 구매 조건 확인, 개통 절차 안내, 배송 및 고객 응대</li><li>후기/게시판 운영: 후기 등록, 노출, 수정·삭제 요청 처리, 부정 게시물 관리</li><li>분쟁 대응: 민원 처리, 거래 기록 확인, 법령상 의무 이행</li><li>마케팅/통계: 이벤트 안내, 서비스 이용 통계 분석. 마케팅 정보 수신은 별도 동의한 경우에만 진행합니다.</li></ul><h2>5. 보유 및 이용 기간</h2><p>회원 정보는 회원 탈퇴 시까지 보관하고, 상담 신청 정보는 상담 완료 후 3년간 보관합니다. 단, 관계 법령에 따라 보존해야 하는 정보는 아래 기간 동안 보관합니다.</p><ul><li>계약 또는 청약철회 등에 관한 기록: 5년</li><li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li><li>소비자 불만 또는 분쟁 처리에 관한 기록: 3년</li><li>접속 로그 기록: 3개월</li></ul><h2>6. 개인정보의 제3자 제공</h2><p>LINKBUS는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만 통신사 개통 신청, 본인확인, 배송 등 서비스 이행에 필요한 경우 이용자에게 제공받는 자, 제공 목적, 제공 항목, 보유 기간을 안내하고 동의를 받은 뒤 제공합니다. 법령에 따른 요청이 있는 경우에는 관련 법령 범위 안에서 제공합니다.</p><h2>7. 개인정보 처리 위탁</h2><p>서비스 운영을 위해 호스팅/데이터 저장, 본인확인, 알림 발송, 결제, 배송, 고객상담 도구 등 업무를 위탁할 수 있습니다. 위탁이 발생하면 수탁자와 업무 내용을 공개하고, 수탁자가 개인정보를 안전하게 처리하도록 관리합니다.</p><h2>8. 파기 절차 및 방법</h2><p>보유기간 경과 또는 처리 목적 달성 시 개인정보는 지체 없이 파기합니다. 전자적 파일은 복구 불가능한 방법으로 삭제하고, 출력물은 분쇄 또는 파쇄합니다.</p><h2>9. 이용자 및 법정대리인의 권리</h2><p>이용자는 개인정보 열람, 정정, 삭제, 처리정지, 동의 철회, 회원 탈퇴를 요청할 수 있습니다. 요청은 고객센터 또는 개인정보보호책임자 연락처로 접수합니다.</p><h2>10. 쿠키의 설치·운영 및 거부</h2><p>사이트는 로그인 유지, 이용 편의 제공, 접속 통계 분석을 위해 쿠키를 사용할 수 있습니다. 이용자는 브라우저 설정에서 쿠키 저장을 거부할 수 있으며, 거부 시 로그인 등 일부 기능 이용이 제한됩니다.</p><h2>11. 안전성 확보 조치</h2><p>LINKBUS는 접근 권한 관리, 개인정보 취급자 최소화, 암호화 통신, 보안 프로그램 및 내부 관리 기준 등 개인정보 보호 조치를 시행합니다.</p><h2>12. 개인정보보호책임자</h2><dl className="business-dl compact"><dt>책임자</dt><dd>{BUSINESS_INFO.privacyManager}</dd><dt>이메일</dt><dd>{BUSINESS_INFO.email}</dd><dt>고객센터/연락처</dt><dd>{BUSINESS_INFO.customerCenter}</dd></dl><h2>13. 개인정보 침해 신고</h2><ul><li>개인정보침해신고센터: privacy.kisa.or.kr / 국번없이 118</li><li>개인정보분쟁조정위원회: kopico.go.kr / 1833-6972</li><li>경찰청 사이버범죄 신고시스템: ecrm.police.go.kr / 국번없이 182</li></ul><p className="legal-note">시행일: 2026년 5월 20일</p></div> }
function RefundContent() { return <div className="legal-content"><h2>교환·반품·환불 기본 원칙</h2><p>휴대폰 단말기는 통신 개통 여부와 박스 개봉 여부에 따라 교환·반품·환불 기준이 명확히 달라집니다. 아래 기준은 구매 전 반드시 확인해야 하며, 기준에 해당하지 않는 교환·반품·환불은 불가합니다.</p><h2>단순 변심</h2><ul><li>단말기 박스가 개봉된 경우 단순 변심 교환·반품·환불은 불가합니다.</li><li>단말기가 개통된 경우 단순 변심 교환·반품·환불은 불가합니다.</li><li>미개봉·미개통 상태에서만 단순 변심 반품 접수가 가능하며, 왕복 배송비는 고객 부담입니다.</li></ul><h2>박스 개봉 및 구성품 훼손</h2><ul><li>박스 개봉, 보호필름 제거, 구성품 사용, 구성품 누락, 포장 훼손이 있으면 교환·반품·환불은 불가합니다.</li><li>개통 불가 사유가 발생하더라도 고객이 먼저 박스를 개봉한 경우 단순 반품은 불가하며, 발생 비용은 고객 부담입니다.</li></ul><h2>개통 완료 후 취소</h2><ul><li>개통 완료 후 고객 변심에 의한 개통 취소는 불가합니다.</li><li>요금제, 약정기간, 할부기간, 지원금 조건을 확인한 뒤 개통한 경우 해당 조건 변경 또는 취소는 불가합니다.</li><li>명의도용, 허위 신청, 부정 개통 등 불법 또는 비정상 신청은 즉시 취소되며, 발생 비용과 법적 책임은 신청자에게 있습니다.</li></ul><h2>단말기 불량</h2><ul><li>단말기 불량 교환은 제조사 서비스센터의 불량 확인서 또는 교품증이 있어야만 접수됩니다.</li><li>제조사 불량 판정이 없는 경우 불량 사유 교환·반품·환불은 불가합니다.</li><li>불량 판정 가능 기간과 처리 방식은 제조사 기준을 따릅니다.</li></ul><h2>통화품질 불량</h2><ul><li>통화품질 사유의 개통 취소는 통신사 품질 점검 결과 취소 대상이라고 판정된 경우에만 처리됩니다.</li><li>통신사 품질 점검 결과 이상 없음으로 판정되면 통화품질 사유 취소는 불가합니다.</li></ul><h2>배송</h2><ul><li>배송 중 파손은 수령 즉시 사진을 남기고 당일 고객센터로 접수해야 합니다.</li><li>수령 후 고객 과실로 발생한 파손, 침수, 분실은 교환·반품·환불 대상이 아닙니다.</li></ul><p className="legal-note">상품별 상세 조건, 통신사 정책, 제조사 기준이 있는 경우 해당 기준이 우선 적용됩니다.</p></div> }

function App() { const path = location.pathname; if (path.startsWith('/admin')) return <AdminApp />; if (path.startsWith('/product/')) return <ProductPage />; if (path === '/terms') return <LegalPage kind="terms" />; if (path === '/privacy') return <LegalPage kind="privacy" />; if (path === '/refund') return <LegalPage kind="refund" />; if (path === '/business-info') return <LegalPage kind="business" />; if (path === '/apple') return <Storefront page="apple" />; if (path === '/samsung') return <Storefront page="samsung" />; if (path === '/sim-only') return <Storefront page="sim" />; if (path === '/used-phone') return <Storefront page="used" />; if (path === '/reviews') return <Storefront page="reviews" />; if (path === '/customer-center') return <Storefront page="customer" />; return <Storefront /> }

function Storefront({ page = 'home' }: { page?: StorePage }) {
  const [phones, setPhones] = useState<Phone[]>(fallbackPhones)
  const initialBrand: Brand | '전체' = page === 'apple' ? '애플' : page === 'samsung' ? '삼성' : '전체'
  const [brand, setBrand] = useState<Brand | '전체'>(initialBrand)
  const [series, setSeries] = useState('iPhone 17 시리즈')
  React.useEffect(() => { if (!supabase) return; supabase.from('sale_products').select('*').eq('is_visible', true).order('sort_order', { ascending: true }).then(({ data }) => { if (data?.length) setPhones((data as ProductRow[]).map(rowToPhone)) }) }, [])
  const seriesList = brand === '삼성' ? samsungSeries : appleSeries
  const filtered = useMemo(() => phones.filter((phone) => { const pageBrand = page === 'apple' ? '애플' : page === 'samsung' ? '삼성' : null; const brandOk = pageBrand ? phone.brand === pageBrand : (brand === '전체' || phone.brand === brand); const seriesOk = pageBrand ? true : (brand === '전체' || phone.series === series); const simOk = page === 'sim' ? (phone.carrier === '알뜰폰' || phone.tag?.includes('유심') || phone.subtitle?.includes('유심')) : true; return brandOk && seriesOk && simOk }), [phones, brand, series, page])
  function chooseBrand(next: Brand | '전체') { setBrand(next); setSeries(next === '삼성' ? samsungSeries[0] : appleSeries[0]) }
  return <>
    <MainHeader active={page} />
    <main id="top">
      <section className="hero-slider main-image-hero"><a className="main-banner-image" href="#popular" aria-label="LINKBUS 메인 배너"><img src="/images/linkbus-main-banner.png" alt="LINKBUS 메인 배너" /></a><div className="brand-shortcut-row"><a className="brand-shortcut apple" href="/apple"><span>APPLE</span><b>애플 제품 바로가기</b><img src={officialImages.iphonePro} alt="애플 제품" /></a><a className="brand-shortcut samsung" href="/samsung"><span>SAMSUNG</span><b>삼성 제품 바로가기</b><img src={officialImages.galaxy} alt="삼성 제품" /></a></div></section>
      {page === 'reviews' ? <ReviewsPage /> : page === 'customer' ? <CustomerCenterPage /> : page === 'used' ? <UsedPhonePage /> : <section id="popular" className="popular-section new-phone-section"><div className="section-title"><h2>{page === 'apple' ? '애플 최대할인구매' : page === 'samsung' ? '삼성 최대할인구매' : page === 'sim' ? '유심만개통' : '최대할인구매'}</h2></div>{page === 'home' && <div className="brand-tabs">{brands.map((item) => <button key={item} className={brand === item ? 'active' : ''} onClick={() => chooseBrand(item)}>{item === '애플' ? '애플 | APPLE' : item === '삼성' ? '삼성 | SAMSUNG' : item}</button>)}</div>}{page === 'home' && brand !== '전체' && <div className="series-tabs">{seriesList.map((item) => <button key={item} className={series === item ? 'active' : ''} onClick={() => setSeries(item)}>{item}</button>)}</div>}<div className="phone-strip new-phone-grid">{filtered.map((phone) => <ProductTile key={phone.id} phone={phone} />)}{!filtered.length && <p className="empty">등록된 상품이 없습니다. 상담으로 조건을 확인해 주세요.</p>}</div>{page === 'sim' && <InfoGuide title="유심만개통 안내" items={['사용 중인 단말기는 그대로 두고 유심/요금제만 개통 상담을 진행합니다.', '통신사, 요금제, 번호이동/신규가입 가능 여부를 확인한 뒤 안내합니다.', '상담 신청 또는 고객센터로 연락 주시면 가능한 조건을 확인해드립니다.']} />}</section>}
    </main><SiteFooter /></>
}

function ReviewsPage() { return <section className="info-page"><div className="section-title"><h2>리얼후기</h2><p>LINKBUS 이용 고객의 실제 후기를 확인하는 공간입니다.</p></div><div className="review-only-grid"><article><b>등록된 후기가 없습니다.</b><p>구매 후기가 등록되면 이 페이지에서 상품별 후기를 보여드릴게요.</p></article><article><b>후기 작성 안내</b><p>회원가입/로그인 후 구매 고객이 직접 후기를 남길 수 있도록 준비 중입니다.</p></article></div></section> }
function CustomerCenterPage() { return <section className="info-page"><div className="section-title"><h2>고객센터</h2><p>상담 가능 시간과 문의 방법을 안내드립니다.</p></div><div className="customer-center-card"><h3>LINKBUS 고객센터</h3><strong>{BUSINESS_INFO.customerCenter}</strong><p>{BUSINESS_INFO.hours}</p><ul><li>휴대폰 구매 조건 상담</li><li>개통 절차 및 배송 안내</li><li>교환·반품·환불 기준 안내</li><li>상품 후기/문의 처리</li></ul><a className="legal-button" href={kakaoHref('LINKBUS 고객센터 문의')}>카카오톡 상담하기</a></div></section> }
function UsedPhonePage() { return <section className="info-page"><div className="section-title"><h2>중고폰판매</h2><p>사용하던 휴대폰 판매 상담을 준비 중입니다.</p></div><div className="customer-center-card"><h3>중고폰 판매 상담</h3><p>모델명, 용량, 색상, 외관 상태, 배터리 상태, 구성품 여부를 확인한 뒤 매입 가능 여부와 예상 금액을 안내합니다.</p><ul><li>정상해지/분실·도난 여부 확인 필요</li><li>액정 파손, 침수, 기능 이상 여부 확인</li><li>상태 확인 후 최종 금액 확정</li></ul><a className="legal-button" href={kakaoHref('중고폰 판매 상담')}>중고폰 판매 상담하기</a></div></section> }
function InfoGuide({ title, items }: { title: string; items: string[] }) { return <div className="info-guide"><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul><a className="legal-button" href={kakaoHref(title)}>상담하기</a></div> }

function ProductTile({ phone }: { phone: Phone }) {
  const storage = visibleStorages(phone)[0]
  const carrier = normalizeCarrier(phone.carrier)
  const releasePrice = storage?.price ?? phone.price ?? 0
  const support = carrierValue(storage?.supportByCarrier, carrier, storage?.support ?? phone.support)
  const rebate = rebateValue(storage, carrier, phone.joinType, phone.rebate)
  const currentPrice = customerPrincipal(releasePrice, support, rebate)
  const discount = Math.max(0, releasePrice - currentPrice)
  return <button className="product-tile new-phone-tile" onClick={() => { location.href = `/product/${phone.id}` }}><span className="ribbon">{phone.badge}</span><figure><img src={phone.colors[0]?.image || phone.image} alt={phone.name}/></figure><b>{phone.name}</b><small>{phone.brand} · {phone.series}</small><div className="tile-price-box"><span>출고가 <del>{money(releasePrice)}</del></span><span>할인 {money(discount)}</span><strong>현재가격 {money(currentPrice)}</strong></div></button>
}

function ProductPage() {
  const productId = decodeURIComponent(location.pathname.split('/product/')[1] || '')
  const [phone, setPhone] = useState<Phone | null>(null)
  const [loading, setLoading] = useState(true)
  React.useEffect(() => {
    const fallback = fallbackPhones.find((item) => item.id === productId)
    if (!supabase) { setPhone(fallback || null); setLoading(false); return }
    supabase.from('sale_products').select('*').eq('id', productId).maybeSingle().then(({ data }) => {
      setPhone(data ? rowToPhone(data as ProductRow) : fallback || null)
      setLoading(false)
    })
  }, [productId])
  return <><HeaderNav simple /><main className="product-detail-page">{loading ? <p className="empty">상품 정보를 불러오는 중입니다.</p> : phone ? <ProductDetail phone={phone} /> : <section className="popular-section"><p className="empty">상품을 찾을 수 없습니다.</p><a className="outline page-back" href="/">목록으로 돌아가기</a></section>}</main><SiteFooter /></>
}

function AdminApp() { const [sessionEmail, setSessionEmail] = useState<string | null>(null); React.useEffect(() => { supabase?.auth.getUser().then(({ data }) => setSessionEmail(data.user?.email || null)) }, []); if (!supabase) return <AdminShell><p>Supabase 설정이 필요합니다.</p></AdminShell>; if (sessionEmail !== ADMIN_EMAIL) return <AdminLogin onLogin={setSessionEmail} />; return <AdminPanel onLogout={async () => { await supabase.auth.signOut(); setSessionEmail(null) }} /> }
function AdminShell({ children }: { children: React.ReactNode }) { return <main className="admin-page"><a className="brand-logo" href="/"><span>LINK</span>BUS</a>{children}</main> }
function AdminLogin({ onLogin }: { onLogin: (email: string) => void }) { const [username, setUsername] = useState('linkbus0213'), [password, setPassword] = useState(''), [message, setMessage] = useState(''); const email = username.includes('@') ? username : `${username}@gmail.com`; async function login(e: React.FormEvent) { e.preventDefault(); setMessage(''); if (email !== ADMIN_EMAIL) { setMessage('관리자 아이디는 linkbus0213 입니다.'); return } const { data, error } = await supabase!.auth.signInWithPassword({ email, password }); if (error) { setMessage('로그인 실패: 비밀번호를 확인해 주세요.'); return } onLogin(data.user.email || '') } return <AdminShell><section className="admin-card login-card"><h1>관리자 로그인</h1><p>아이디는 메일주소 없이 입력하세요. 예: <b>linkbus0213</b></p><form onSubmit={login} className="admin-login-form"><label>아이디<input value={username} onChange={(e) => setUsername(e.target.value.trim())} /></label><label>비밀번호<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>{message && <p className="form-message error">{message}</p>}<button className="admin-primary">로그인</button></form></section></AdminShell> }

const blankPhone: Phone = { id: '', brand: '애플', series: 'iPhone 17 시리즈', carrier: 'SK', joinType: '번호이동', name: '', subtitle: '', image: officialImages.iphone, price: null, rebate: null, monthly: 0, support: 0, badge: '추천', tag: 'APPLE', isVisible: true, colors: [{ name: '블랙', hex: '#1f2329', image: officialImages.iphone }], storages: defaultStorages }
function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [products, setProducts] = useState<Phone[]>([]), [editing, setEditing] = useState<Phone>(blankPhone), [conditionEditing, setConditionEditing] = useState<Phone | null>(null), [message, setMessage] = useState(''), [uploading, setUploading] = useState(false)
  const load = React.useCallback(async () => { const { data, error } = await supabase!.from('sale_products').select('*').order('sort_order', { ascending: true }); if (!error) setProducts(((data || []) as ProductRow[]).map(rowToPhone)) }, [])
  React.useEffect(() => { load() }, [load])
  async function uploadImage(file: File, colorIndex?: number) { setUploading(true); setMessage('이미지 업로드 중...'); const path = `products/${Date.now()}-${safeFileName(file.name)}`; const { error } = await supabase!.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, file, { cacheControl: '3600' }); if (error) { setMessage(`이미지 업로드 실패: ${error.message}`); setUploading(false); return } const { data } = supabase!.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path); if (typeof colorIndex === 'number') setEditing(cur => ({ ...cur, image: colorIndex === 0 ? data.publicUrl : cur.image, colors: cur.colors.map((c, i) => i === colorIndex ? { ...c, image: data.publicUrl } : c) })); else setEditing(cur => ({ ...cur, image: data.publicUrl, colors: cur.colors.length ? cur.colors.map((c, i) => i === 0 ? { ...c, image: data.publicUrl } : c) : [{ name: '기본', hex: '#dddddd', image: data.publicUrl }] })); setMessage('이미지 업로드 완료. 저장 버튼을 누르면 모델에 반영됩니다.'); setUploading(false) }
  async function saveModel(e: React.FormEvent) { e.preventDefault(); setMessage(''); const result = editing.id ? await supabase!.from('sale_products').update(phoneToRow(editing)).eq('id', editing.id) : await supabase!.from('sale_products').insert(phoneToRow(editing)); if (result.error) { setMessage(`모델 저장 실패: ${result.error.message}`); return } setMessage('모델 저장 완료'); setEditing(blankPhone); load() }
  async function saveConditions() { if (!conditionEditing?.id) return; setMessage(''); const result = await supabase!.from('sale_products').update(phoneToRow(conditionEditing)).eq('id', conditionEditing.id); if (result.error) { setMessage(`조건 저장 실패: ${result.error.message}`); return } setMessage('판매조건/리베이트 저장 완료'); setConditionEditing(null); load() }
  const editModel = (p: Phone) => { setEditing(p); setConditionEditing(null); setMessage('모델 기본정보를 수정합니다.') }
  const editConditions = (p: Phone) => { setConditionEditing(p); setEditing(blankPhone); setMessage('선택한 모델의 출고가/지원금/리베이트 조건을 입력합니다.') }
  return <AdminShell><div className="admin-head"><div><h1>상품 관리자</h1><p>모델 등록은 기본정보만 입력하고, 출고가·공통지원금·리베이트는 등록된 모델을 선택해서 따로 입력합니다.</p></div><button onClick={onLogout}>로그아웃</button></div><section className="admin-grid separated-admin-grid"><form className="admin-card product-form model-form" onSubmit={saveModel}><div className="admin-card-title"><span>{editing.id ? '모델 기본정보 수정' : '모델 등록'}</span><small>모델명, 제조사, 이미지, 색상만 먼저 등록하세요.</small></div><AdminInput label="모델명" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} required /><AdminInput label="설명" value={editing.subtitle} onChange={(v) => setEditing({ ...editing, subtitle: v })} /><label>제조사<select value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value as Brand, series: e.target.value === '삼성' ? samsungSeries[0] : e.target.value === '애플' ? appleSeries[0] : editing.series })}><option>애플</option><option>삼성</option><option>기타</option></select></label><AdminInput label="시리즈" value={editing.series} onChange={(v) => setEditing({ ...editing, series: v })} /><AdminInput label="배지" value={editing.badge} onChange={(v) => setEditing({ ...editing, badge: v })} /><AdminInput label="태그" value={editing.tag} onChange={(v) => setEditing({ ...editing, tag: v })} /><ImageUploader image={editing.image} uploading={uploading} onUpload={(file) => uploadImage(file)} /><ColorEditor colors={editing.colors} uploading={uploading} onChange={(colors) => setEditing({ ...editing, colors })} onUpload={uploadImage} /><label className="admin-check"><input type="checkbox" checked={editing.isVisible} onChange={(e) => setEditing({ ...editing, isVisible: e.target.checked })} /> 고객 화면에 노출</label>{message && !conditionEditing && <p className="form-message success">{message}</p>}<button className="admin-primary">모델 저장</button><button type="button" onClick={() => setEditing(blankPhone)}>새 모델 입력</button></form><section className="admin-card condition-card"><div className="admin-card-title"><span>판매조건 · 리베이트 입력</span><small>오른쪽 상품 목록에서 “조건입력”을 누른 뒤 입력하세요.</small></div>{conditionEditing ? <div className="condition-editor"><div className="condition-selected"><img src={conditionEditing.colors[0]?.image || conditionEditing.image} alt=""/><div><b>{conditionEditing.name}</b><small>{conditionEditing.brand} · {conditionEditing.series}</small></div></div><p className="formula-note">출고가, 공통지원금, 요금제 노출, 요금제별 리베이트는 이 영역에서만 관리합니다.</p><StorageEditor storages={conditionEditing.storages} onChange={(storages) => setConditionEditing({ ...conditionEditing, storages })} />{message && <p className="form-message success">{message}</p>}<div className="condition-actions"><button className="admin-primary" type="button" onClick={saveConditions}>조건 저장</button><button type="button" onClick={() => setConditionEditing(null)}>닫기</button></div></div> : <div className="empty-condition"><b>아직 선택된 모델이 없습니다.</b><p>모델을 먼저 등록한 다음, 상품 목록에서 조건입력을 눌러 출고가/지원금/리베이트를 입력하세요.</p></div>}</section><section className="admin-card product-list-card"><h2>상품 목록</h2><div className="admin-list">{products.map((p) => <div className="admin-product-row" key={p.id}><button type="button" className="admin-product-main" onClick={() => editModel(p)}><img src={p.colors[0]?.image || p.image} alt=""/><span><b>{p.name}</b><small>{p.brand} · {p.series} · 색상 {p.colors.length}개 · 용량 {p.storages.length}개</small></span>{!p.isVisible && <i>숨김</i>}</button><div className="admin-product-actions"><button type="button" onClick={() => editModel(p)}>모델수정</button><button type="button" className="admin-primary small" onClick={() => editConditions(p)}>조건입력</button></div></div>)}</div></section></section></AdminShell>
}
function ImageUploader({ image, uploading, onUpload }: { image: string; uploading: boolean; onUpload: (file: File) => void }) { return <label className="image-upload-field">대표 이미지 업로드<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) onUpload(file) }} /><span>{uploading ? '업로드 중...' : '이미지 파일 선택'}</span>{image && <img src={image} alt="업로드된 상품 이미지 미리보기" />}</label> }
function ColorEditor({ colors, uploading, onChange, onUpload }: { colors: ColorOption[]; uploading: boolean; onChange: (v: ColorOption[]) => void; onUpload: (file: File, index: number) => void }) { return <div className="option-editor"><div className="option-title"><b>모델 색상</b><button type="button" onClick={() => onChange([...colors, { name: '새 색상', hex: '#dddddd', image: colors[0]?.image || officialImages.iphone }])}>색상 추가</button></div>{colors.map((c, i) => <div className="color-edit-row" key={i}><input value={c.name} onChange={(e) => onChange(colors.map((x, n) => n === i ? { ...x, name: e.target.value } : x))} placeholder="색상명"/><input type="color" value={c.hex || '#dddddd'} onChange={(e) => onChange(colors.map((x, n) => n === i ? { ...x, hex: e.target.value } : x))}/><label className="mini-upload">이미지<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) onUpload(file, i) }} /></label>{c.image && <img src={c.image} alt=""/>}<button type="button" onClick={() => onChange(colors.filter((_, n) => n !== i))}>삭제</button></div>)}</div> }
function StorageEditor({ storages, onChange }: { storages: StorageOption[]; onChange: (v: StorageOption[]) => void }) {
  const setStorage = (index: number, patch: Partial<StorageOption>) => onChange(storages.map((x, n) => n === index ? { ...x, ...patch } : x))
  const togglePreset = (label: string) => {
    if (storages.some((s) => s.label === label)) { onChange(storages.filter((s) => s.label !== label)); return }
    onChange([...storages, { label, isVisible: true, supportByCarrier: {}, rebateByCarrierJoin: {} }])
  }
  const setCarrierMoney = (index: number, field: 'supportByCarrier' | 'rebateByCarrier', carrier: CarrierKey, value: number | null) => {
    const current = storages[index]?.[field] || {}
    setStorage(index, { [field]: { ...current, [carrier]: value } } as Partial<StorageOption>)
  }
  const setJoinRebate = (index: number, carrier: CarrierKey, joinType: JoinType, value: number | null) => {
    const all = storages[index]?.rebateByCarrierJoin || {}
    const carrierRows = all[carrier] || {}
    setStorage(index, { rebateByCarrierJoin: { ...all, [carrier]: { ...carrierRows, [joinType]: value } } })
  }
  const setPlanVisible = (index: number, carrier: CarrierKey, planName: string, checked: boolean) => {
    const all = storages[index]?.visiblePlansByCarrier || {}
    const carrierPlanNames = carrierPlans.filter((p) => p.carrier === carrier).map((p) => p.name)
    const current = all[carrier] || carrierPlanNames
    const next = checked ? Array.from(new Set([...current, planName])) : current.filter((name) => name !== planName)
    setStorage(index, { visiblePlansByCarrier: { ...all, [carrier]: next } })
  }
  const setNewJoinVisible = (index: number, carrier: CarrierKey, checked: boolean) => {
    const all = storages[index]?.newJoinVisibleByCarrier || {}
    setStorage(index, { newJoinVisibleByCarrier: { ...all, [carrier]: checked } })
  }
  const setPlanSupport = (index: number, carrier: CarrierKey, planName: string, value: number | null) => {
    const all = storages[index]?.planSupportByCarrier || {}
    const carrierRows = all[carrier] || {}
    setStorage(index, { planSupportByCarrier: { ...all, [carrier]: { ...carrierRows, [planName]: value } } })
  }
  const setPlanJoinRebate = (index: number, carrier: CarrierKey, planName: string, joinType: JoinType, value: number | null) => {
    const all = storages[index]?.planRebateByCarrier || {}
    const carrierRows = all[carrier] || {}
    const planRows = carrierRows[planName] || {}
    setStorage(index, { planRebateByCarrier: { ...all, [carrier]: { ...carrierRows, [planName]: { ...planRows, [joinType]: value } } } })
  }
  return <div className="option-editor"><div className="option-title storage-title"><b>저장공간 · 공통지원금 · 요금제별 리베이트/노출</b><div className="storage-presets">{storagePresets.map((label) => { const active = storages.some((s) => s.label === label); return <button key={label} type="button" className={active ? 'active' : ''} onClick={() => togglePreset(label)}>{label}</button> })}</div></div><p className="formula-note">저장공간 버튼을 누르면 상세 입력창이 열리고, 다시 누르면 사라집니다. 고객노출이 켜진 용량만 고객 웹페이지에 표시됩니다.</p>{storages.map((s, i) => {
    const sampleCarrier = 'SKT' as CarrierKey
    const sampleJoin = '번호이동' as JoinType
    const samplePrincipal = customerPrincipal(s.price, carrierValue(s.supportByCarrier, sampleCarrier, s.support), rebateValue(s, sampleCarrier, sampleJoin, s.rebate))
    return <div className="storage-edit-card" key={i}><div className="storage-edit-row"><input value={s.label} onChange={(e) => setStorage(i, { label: e.target.value })} placeholder="256G"/><input type="number" value={s.price ?? ''} onChange={(e) => setStorage(i, { price: e.target.value === '' ? null : Number(e.target.value) })} placeholder="출고가"/><input type="number" value={s.support ?? ''} onChange={(e) => setStorage(i, { support: e.target.value === '' ? null : Number(e.target.value) })} placeholder="기본 공통지원금"/><input type="number" value={s.rebate ?? ''} onChange={(e) => setStorage(i, { rebate: e.target.value === '' ? null : Number(e.target.value) })} placeholder="기본 리베이트"/><label className="storage-visible"><input type="checkbox" checked={s.isVisible !== false} onChange={(e) => setStorage(i, { isVisible: e.target.checked })}/> 고객노출</label><button type="button" onClick={() => onChange(storages.filter((_, n) => n !== i))}>삭제</button></div><div className="carrier-support-grid join-rebate-grid">{carrierKeys.map((carrier) => { const plans = carrierPlans.filter((p) => p.carrier === carrier); const visibleNames = s.visiblePlansByCarrier?.[carrier] || plans.map((p) => p.name); return <div key={carrier}><b>{carrier}</b><input type="number" value={s.supportByCarrier?.[carrier] ?? ''} onChange={(e) => setCarrierMoney(i, 'supportByCarrier', carrier, e.target.value === '' ? null : Number(e.target.value))} placeholder="공통지원금"/><label className="new-join-visible"><input type="checkbox" checked={s.newJoinVisibleByCarrier?.[carrier] === true} onChange={(e) => setNewJoinVisible(i, carrier, e.target.checked)}/> 신규가입 고객노출</label><div className="plan-admin-list">{plans.map((plan) => { const checked = visibleNames.includes(plan.name); return <div className="plan-admin-row" key={plan.name}><label className="plan-visible"><input type="checkbox" checked={checked} onChange={(e) => setPlanVisible(i, carrier, plan.name, e.target.checked)}/><span>{plan.name}</span><em>{money(plan.fee)}</em></label><input className="plan-support-input" type="number" value={s.planSupportByCarrier?.[carrier]?.[plan.name] ?? ''} onChange={(e) => setPlanSupport(i, carrier, plan.name, e.target.value === '' ? null : Number(e.target.value))} placeholder="요금제 공통지원금"/><div className="join-rebate-fields">{joinTypes.map((type) => <label key={type}>{type}<input type="number" value={s.planRebateByCarrier?.[carrier]?.[plan.name]?.[type] ?? ''} onChange={(e) => setPlanJoinRebate(i, carrier, plan.name, type, e.target.value === '' ? null : Number(e.target.value))} placeholder="요금제 리베이트"/></label>)}</div></div> })}</div><small>선택 요금제는 고객 화면에 표시됩니다.</small></div> })}</div><p className="formula-note">계산식: 출고가 - 공통지원금 - 가입유형별 리베이트 = 고객구매가격(할부원금). 예: SKT 번호이동 기준 {money(samplePrincipal)}</p></div> })}</div>
}
function AdminInput({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) { return <label>{label}<input value={value} onChange={(e) => onChange(e.target.value)} required={required} /></label> }
function AdminNumber({ label, value, onChange }: { label: string; value: number | null; onChange: (v: number | null) => void }) { return <label>{label}<input type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} /></label> }
function Benefit({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <article>{icon}<h3>{title}</h3><p>{text}</p></article> }
function kakaoHref(model: string) { if (!kakaoChannelUrl) return '/#consult'; const sep = kakaoChannelUrl.includes('?') ? '&' : '?'; return `${kakaoChannelUrl}${sep}text=${encodeURIComponent(`${model} 상담하고 싶어요`)}` }

function HighlightText({ text }: { text: string }) {
  const keywords = [
    '약정기간은 24개월 입니다.',
    '해지 시 위약금 발생',
    '링크버스가 제공한 할인 및 추가지원금 전액 반환',
    '링크버스가 제공한 할인 및 추가지원금 전액반환',
    '이보다 낮은 요금제 변경시 할인반환금 청구',
    '위약금&잔여할부금 조회 불가 및 책임지지 않습니다.',
    '개통 전 미개봉 필수',
    '단말기 박스 개봉시 (개통전이라도) 교환 / 반품 절대 불가 합니다',
    '단말기 박스 개봉시(개통전이라도) 교환/반품 절대 불가합니다',
    '미개봉&미개통시만 교환 및 반품 가능합니다.',
    '미개봉&미개통시에만 교환 및 반품 가능합니다',
  ]
  const pattern = new RegExp(`(${keywords.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g')
  return <>{text.split(pattern).map((part, index) => keywords.includes(part) ? <mark key={index}>{part}</mark> : <React.Fragment key={index}>{part}</React.Fragment>)}</>
}
const cautionSections = [
  { title: '공통 안내', items: [
    '[조건 변경] 휴대폰 구매 조건, 출고가, 공통지원금, 추가지원금은 통신사 정책과 링크버스 판매 정책에 따라 개통 전까지 변경될 수 있습니다. 변경 시 개통 전 반드시 안내합니다.',
    '[할인 적용 기준] 링크버스에서 안내하는 할인 및 추가지원금은 개통 조건, 요금제, 가입유형, 유지기간을 전제로 적용됩니다.',
    '[할인 제외] 일부 요금제는 가입은 가능하더라도 링크버스 할인 및 추가지원금 적용 대상에서 제외됩니다.',
    '[실사용 원칙] 휴대폰은 실사용 목적에 따라 신청 및 개통해야 합니다. 수령 및 개통 후 미사용, 불법 목적, 악의적 목적의 개통이 확인되면 링크버스가 제공한 할인 및 추가지원금 전액 반환 및 손해배상 청구 대상입니다.',
    '[부정 개통 금지] 명의도용, 허위 신청, 대리 신청, 부정 개통, 개통 사기 의심 건은 접수 또는 개통이 불가하며 확인 즉시 취소됩니다.',
    '[미성년자 구매] 미성년자는 직접 구매 신청이 불가하며, 법정대리인만 신청 가능합니다. 단, 법정대리인 동의 없이 체결한 계약은 미성년자 본인 또는 법정대리인이 취소할 수 있습니다.',
  ] },
  { title: '지원금 안내', items: [
    '[약정기간] 약정기간은 기본 24개월입니다. 일부 모델 또는 통신사 정책에 따라 12개월 약정 조건이 별도 적용될 수 있습니다.',
    '[지원금 반환] 개통 후 186일 이내(SK 일부 기준은 285일 이내) 해지, 정지, 일시정지, 해외정지, 명의변경, 다른 기기로 기기변경, 유심기변, 타 통신사 이동, 실사용 조건 미충족이 발생하면 링크버스가 제공한 할인 및 추가지원금 전액 반환 대상입니다.',
    '[실사용 조건] 실사용 조건은 개통 후 186일 동안 발신통화 월 5회 이상, 월 통화시간 15분 이상 사용 조건을 기준으로 확인합니다.',
    '[할인반환금] 186일 이전 요금제 하향, 해지, 정지, 명의변경, 번호이동, 유심기변 등 약정 위반 사유가 발생하면 링크버스 추가지원금과 통신사 공통지원금/추가지원금에 대한 할인반환금이 청구됩니다.',
    '[정책 변동] 공통지원금과 추가지원금은 통신사 및 판매 정책에 따라 수시로 변경됩니다. 정책 변경 전 안내받은 금액은 개통 완료 전까지 확정 금액이 아닙니다.',
    '[적용 기준] 지원금 적용 여부는 가입유형, 통신사, 요금제, 재고, 고객 회선 상태에 따라 달라집니다.',
  ] },
  { title: '선택약정 요금할인 안내', items: [
    '[할인 방식] 선택약정은 요금제 기본료의 25%를 할인받는 방식이며, 공통지원금 할인과 중복 적용되지 않습니다.',
    '[비교 기준] 공통지원금 할인과 선택약정 요금할인 중 어느 방식이 유리한지는 단말기 가격, 요금제, 약정기간, 통신사 정책에 따라 달라집니다.',
    '[할인 금액] 선택약정 할인 금액은 선택한 요금제 월정액 기준으로 산정되며, 요금제 변경 시 할인 금액도 변경됩니다.',
    '[위약금] 선택약정 약정기간 중 해지, 번호이동, 명의변경, 약정 승계 불가 사유가 발생하면 통신사 기준에 따라 할인반환금이 청구됩니다.',
    '[직접 확인] 선택약정 유지기간 및 위약금은 통신사 고객센터 114 또는 공식 신청서에서 반드시 직접 확인해야 합니다.',
  ] },
  { title: '요금제/개통 안내', items: [
    '[위약금/잔여할부금] 기존 단말기의 위약금 및 잔여할부금은 고객이 각 통신사 고객센터 114로 직접 조회해야 합니다. 링크버스는 위약금·잔여할부금 조회가 불가하며, 미확인으로 발생한 비용에 대해 책임지지 않습니다.',
    '[위약금/잔여할부금] 기존 통신사 위약금은 익월 요금에 합산 청구되며, 잔여할부금은 기존 통신사에서 계속 청구됩니다. 완납 요청은 기존 통신사 고객센터로 직접 요청해야 합니다.',
    '[가입 불가] 현재 선불폰 이용 중인 경우 진행이 불가합니다.',
    '[가입 불가] 직전 개통일 186일 이내에는 개통이 불가합니다. 알뜰폰 사용자는 별도 확인이 필요합니다.',
    '[가입 불가] KT/LG 기기변경은 직전 개통일 12개월 이내 진행이 불가합니다. 별도 안내된 경우 추가금 발생 동의 후 진행될 수 있습니다.',
    '[가입 불가] 요금 체납 및 미납이 있는 경우 개통이 불가합니다. 통신사 고객센터 114를 통해 수납 완료 후 진행해야 합니다.',
    '[가입 불가] 개인 신용상태에 따라 할부 회선, 가입 회선, 할부 한도가 부족하거나 할부 자체가 불가하면 개통이 불가합니다. 할부 한도는 서울보증보험을 통해 직접 확인해야 합니다.',
    '[가입 불가] SK 가입 시 개통자와 동일 명의의 SK 해지 이력이 30일 이내에 있으면 진행이 불가하며, 30일 이후부터 진행 가능합니다.',
    '[요금제 유지] 개통 당시 선택한 요금제 유지기간은 186일입니다. 유지기간 이전에는 요금제 하향이 불가합니다.',
    '[요금제 유지] 유지기간 이전에는 5G 요금제와 LTE 요금제 간 변경이 불가합니다.',
    '[유심기변 제한] 개통 후 186일 이내에는 유심기변이 불가합니다. 유심기변 적발 시 링크버스 할인 및 추가지원금 전액 반환 대상입니다.',
    '[요금제 하향] 유지기간 이후 요금제 하향은 통신사별 기준 이하로 변경할 수 없습니다. 5G 단말은 SK 42,000원, KT/LG 47,000원 기본료까지만 가능하며, LTE 단말은 SK 20,000원, KT 20,000원, LG 26,400원 기본료까지만 가능합니다.',
    '[요금제 하향] 위 기준보다 낮은 요금제로 변경하면 할인반환금이 청구됩니다.',
    '[요금제 변경] 월 중 요금제 변경 시 데이터 및 통화 사용량에 따라 일할 계산 초과요금이 발생할 수 있습니다.',
    '[요금제 변경] 신규 가입이 불가능한 요금제를 사용 중인 경우 개통이 불가하거나 변경 이후 원복이 불가합니다. 고객센터 114로 직접 확인해야 합니다.',
    '[개통 방식] 번호이동은 개통 시 기존 사용 통신사가 끊기므로 택배 선발송 후 개통을 진행합니다. 개통 전 단말기 박스 미개봉은 필수입니다.',
    '[개통 방식] 신규가입 및 기기변경은 접수 당일 해피콜, 온라인 공식 신청서 작성, 선개통 후 발송 순서로 진행됩니다.',
    '[개통 방식] 기기변경 선개통 시 기존 기기 사용이 중단될 수 있으며, 유심보호서비스 부가서비스 삭제 후 개통됩니다. 수령 후 고객센터 114를 통해 재가입할 수 있습니다.',
    '[개통 지연] 통신사 정책 변동 또는 심사 지연으로 개통이 지연될 수 있으며, 최대 지연 시 1개월 이상 소요될 수 있습니다.',
  ] },
  { title: '배송/수령 안내', items: [
    '[배송사] 배송은 로젠택배 기준으로 진행하며, 오후 6시 이전 신청 건은 당일 발송을 원칙으로 합니다.',
    '[배송 지연] 도착 지역 택배 지점, 배송기사님 상황, 통신사 심사, 재고 이동에 따라 익일 배송이 불가할 수 있습니다.',
    '[배송 문의] 미배송 또는 배송 지연 시 송장 확인 후 지역 택배 지점으로 직접 문의해야 합니다.',
    '[번호이동 선발송] 번호이동 선발송 건은 개통 전까지 단말기 박스를 반드시 미개봉 상태로 보관해야 합니다.',
    '[파손 접수] 택배 수령 시 외부 박스 파손이 확인되면 즉시 사진을 남기고 당일 고객센터로 접수해야 합니다.',
    '[비대면 수령] 본인 직접 수령 외 비대면 수령을 선택하는 경우 분실 방지를 위해 배송 내역을 반드시 확인해야 합니다.',
  ] },
  { title: '유심/부가서비스 안내', items: [
    '[기기변경 유심] 기기변경은 기존 유심 재사용을 원칙으로 합니다.',
    '[신규/번호이동 유심] 신규가입 및 통신사 이동은 USIM 구매 7,700원 또는 eSIM 다운로드 2,750원 비용이 발생합니다.',
    '[부가서비스] 부가서비스는 개통 후 고객센터 114 또는 통신사 직영대리점에서 별도 가입해야 하며, 링크버스에 요청해도 가입 처리는 불가합니다.',
    '[휴대폰 보험] 휴대폰 보험은 개통일부터 30~60일 이내 가입 가능하며, 고객센터 114 또는 통신사 직영대리점에서 직접 가입해야 합니다.',
    '[결합/복지할인] 결합할인, 복지할인, 가족결합, 유무선결합 등은 개통 후 고객센터 114 또는 통신사 직영대리점에서 직접 가입해야 합니다.',
    '[할인 변경 가능성] 기기변경 시 기존 결합 및 복지할인은 유지되지만, 요금제 변경 또는 회선 변경에 따라 할인율 또는 할인액이 변경될 수 있습니다. 고객센터 114로 직접 확인해야 합니다.',
  ] },
  { title: '교환/환불 안내', items: ['개통 또는 박스 개봉 이후에는 고객 단순변심에 의한 청약철회·교환·반품·환불이 불가합니다.', '단말기 수령 기간과 관계 없이 개통하거나 개봉한 이후에는 단말기에 대한 청약철회가 불가합니다.', '휴대폰 수령 후 포장박스 개봉, 구성품 사용·누락, 상품 훼손, 고객 부주의로 인한 파손·침수·분실이 있으면 교환·반품·환불이 불가합니다.', '교환·반품 접수 시 단말기 박스, 구성품, 사은품 등 수령한 모든 구성품을 함께 반납해야 합니다. 구성품이 누락되면 처리가 불가하거나 비용이 청구됩니다.', '제품 하자로 교환·반품을 요청하는 경우 제조사 서비스센터의 불량판정서, 교품증, 통화품질확인서 등 공식 판정 서류가 필요합니다.', '[삼성/기타 제조사] 개통일 포함 14일 이내 제조사 불량판정서 또는 통화품질확인서가 있어야 교환·반품 접수가 가능합니다.', '[삼성/기타 제조사] 개통일 포함 14일 이후 기기 불량은 제조사 AS센터를 통한 수리 또는 제조사 기준에 따른 조치만 가능합니다.', '[애플 교환] 개통일 포함 D+30일 이내 Apple 공인서비스센터 판단 기준에 따라 새 제품 교환이 가능합니다.', '[애플 교환] 개통일 포함 D+30일 이후에는 Apple 공인서비스센터 기준에 따라 서비스 제품 교환 또는 부분 수리만 가능하며 새 제품 교환은 불가합니다.', '[애플 반품] 개통일 포함 D+9일 이내 단말기 불량 건에 한해 Apple 공인서비스센터의 작업인가서 등 공식 확인 서류가 있어야 반품 접수가 가능합니다.', 'Apple 제품의 기능·외관 결함 여부와 AS 가능 여부는 Apple 공인서비스센터 판단 기준을 따릅니다.', '제품 불량으로 반품하는 경우 구글락, 아이클라우드락, 화면잠금, 나의 iPhone 찾기 등 계정 잠금을 반드시 해제해야 합니다. 잠금이 해제되지 않으면 반품 처리가 불가합니다.', '최초 구매 시 별도 판매조건, 사전 고지, 상품 상세 안내에 동의한 경우 해당 조건이 우선 적용됩니다.'] },
]
function NoticeItem({ text }: { text: string }) {
  const match = text.match(/^\[([^\]]+)\]\s*(.*)$/)
  return <li>{match ? <><em>{match[1]}</em><span><HighlightText text={match[2]} /></span></> : <HighlightText text={text} />}</li>
}
function CautionText({ text: _text }: { text: string }) {
  const [active, setActive] = useState(0)
  const section = cautionSections[active]
  const isExchange = section.title === '교환/환불 안내'
  const exchangeIntro = section.items.slice(0, 5)
  const exchangeTail = section.items.slice(10)
  return <div className="notice-clean notice-split"><div className="notice-clean-head"><div><h3>유의사항</h3><p>구매 전 꼭 확인해야 하는 내용을 항목별로 정리했습니다.</p></div><span>LINKBUS 안내</span></div><div className="notice-split-body"><aside className="notice-side-tabs">{cautionSections.map((item, index) => <button type="button" key={item.title} className={active === index ? 'active' : ''} onClick={() => setActive(index)}><b>{item.title}</b><small>{index + 1}</small></button>)}</aside><article className="notice-clean-panel"><h4>{section.title}</h4>{isExchange ? <><ul>{exchangeIntro.map((item) => <NoticeItem key={item} text={item} />)}</ul><div className="exchange-rule-boxes"><section><h5>삼성/기타 제조사</h5><dl><dt>교환·반품 처리기간</dt><dd>개통일 포함 14일 이내</dd><dt>필수 서류</dt><dd>제조사 불량판정서 또는 통화품질확인서</dd><dt>개통일 포함 14일 이후</dt><dd>제조사 AS센터 기준에 따른 수리 또는 조치만 가능</dd></dl></section><section><h5>애플</h5><dl><dt>교환</dt><dd>D+30일 이내 Apple 공인서비스센터에서 새 제품 교환 가능<br/>D+30일 이후 서비스 제품 교환 또는 부분 수리만 가능</dd><dt>반품</dt><dd>D+9일 이내 단말기 불량 건에 한해 Apple 공인서비스센터 작업인가서 등 공식 확인 서류 필요</dd></dl></section></div><ul>{exchangeTail.map((item) => <NoticeItem key={item} text={item} />)}</ul></> : <ul>{section.items.map((item) => <NoticeItem key={item} text={item} />)}</ul>}</article></div></div>
}

function ProductDetail({ phone }: { phone: Phone }) {
  const defaultCarrier = normalizeCarrier(phone.carrier)
  const [colorIndex, setColorIndex] = useState(0), [storageIndex, setStorageIndex] = useState(0), [targetCarrier, setTargetCarrier] = useState<CarrierKey>(defaultCarrier), [currentCarrier, setCurrentCarrier] = useState<CarrierKey | '알뜰폰' | '신규가입'>('KT')
  const [planName, setPlanName] = useState(defaultPlanName(defaultCarrier)), [planOpen, setPlanOpen] = useState(false), [imageCompact, setImageCompact] = useState(false), [discountMode, setDiscountMode] = useState<'support' | 'plan'>('support'), [contractMonths, setContractMonths] = useState<12 | 24>(24)
  const [aiOpen, setAiOpen] = useState(false), [aiBudget, setAiBudget] = useState(120000), [aiUnlimited, setAiUnlimited] = useState(true)
  React.useEffect(() => { const onScroll = () => setImageCompact(window.scrollY > 90); onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll) }, [])
  const color = phone.colors[colorIndex] || phone.colors[0]
  const displayStorages = visibleStorages(phone)
  const storage = displayStorages[storageIndex] || displayStorages[0]
  const selectedImage = color?.image || phone.image
  const activePlans = visiblePlansForStorage(storage, targetCarrier)
  const defaultPlan = activePlans.find((p) => p.name === defaultPlanName(targetCarrier)) || activePlans[0] || carrierPlans.find((p) => p.carrier === targetCarrier) || carrierPlans[0]
  const plan = activePlans.find((p) => p.name === planName) || defaultPlan
  const devicePrice = storage?.price ?? phone.price ?? 0
  const joinType: JoinType = currentCarrier === '신규가입' ? '신규가입' : currentCarrier === targetCarrier ? '기기변경' : '번호이동'
  const support = supportValue(storage, targetCarrier, joinType, storage?.support ?? phone.support, plan.name)
  const rebate = rebateValue(storage, targetCarrier, joinType, phone.rebate, plan.name)
  const supportPrincipal = customerPrincipal(devicePrice, support, rebate)
  const supportInstallment = installmentPayment(supportPrincipal)
  const supportMonthlyBill = supportInstallment.monthly + plan.fee
  const planDiscountFee = Math.round(plan.fee * 0.75)
  const planDiscountAmount = plan.fee - planDiscountFee
  const planDiscountPrincipal = customerPrincipal(devicePrice, 0, 0)
  const planDiscountInstallment = installmentPayment(planDiscountPrincipal)
  const planDiscountMonthlyBill = planDiscountInstallment.monthly + planDiscountFee
  const discountDiff = Math.abs(supportMonthlyBill - planDiscountMonthlyBill)
  const cheaperMode = supportMonthlyBill <= planDiscountMonthlyBill ? 'support' : 'plan'
  const principal = discountMode === 'support' ? supportPrincipal : planDiscountPrincipal
  const installment = discountMode === 'support' ? supportInstallment : planDiscountInstallment
  const monthlyBill = discountMode === 'support' ? supportMonthlyBill : planDiscountMonthlyBill
  const activePlanFee = discountMode === 'support' ? plan.fee : planDiscountFee
  const thisMonthDevice = currentMonthProrated(installment.monthly)
  const thisMonthPlan = currentMonthProrated(activePlanFee)
  function changeCarrier(next: CarrierKey) { setTargetCarrier(next); setPlanName(defaultPlanName(next)); setPlanOpen(false) }
  const logoLabel = (carrier: CarrierKey | '알뜰폰' | '신규가입') => carrier === 'SKT' ? 'SK' : carrier === 'LGU+' ? 'LG' : carrier
  const newJoinCarriers = carrierKeys.filter((carrier) => storage?.newJoinVisibleByCarrier?.[carrier] === true)
  const currentCarrierOptions: Array<CarrierKey | '알뜰폰' | '신규가입'> = ['SKT', 'KT', 'LGU+', '알뜰폰', ...(newJoinCarriers.length ? ['신규가입' as const] : [])]
  const targetCarrierOptions = currentCarrier === '신규가입' ? newJoinCarriers : carrierKeys
  React.useEffect(() => { if (currentCarrier === '신규가입' && newJoinCarriers.length && !newJoinCarriers.includes(targetCarrier)) changeCarrier(newJoinCarriers[0]) }, [currentCarrier, storageIndex])
  const aiCandidates = displayStorages.flatMap((item) => carrierKeys.flatMap((carrier) => visiblePlansForStorage(item, carrier).filter((p) => !aiUnlimited || /무제한|완전/.test(p.data)).map((p) => { const type: JoinType = currentCarrier === '신규가입' ? '신규가입' : currentCarrier === carrier ? '기기변경' : '번호이동'; const itemPrice = item.price ?? phone.price ?? 0; const itemSupport = supportValue(item, carrier, type, item.support ?? phone.support, p.name); const itemRebate = rebateValue(item, carrier, type, phone.rebate, p.name); const itemPrincipal = customerPrincipal(itemPrice, itemSupport, itemRebate); const itemInstallment = installmentPayment(itemPrincipal); return { storage: item, carrier, plan: p, joinType: type, principal: itemPrincipal, installment: itemInstallment, monthly: itemInstallment.monthly + p.fee, support: itemSupport, rebate: itemRebate } })))
  const aiRecommendation = [...aiCandidates].sort((a, b) => Math.abs(a.monthly - aiBudget) - Math.abs(b.monthly - aiBudget) || a.monthly - b.monthly)[0]
  return <><div className={`sticky-quote-bar ${imageCompact ? 'show' : ''}`}><div><b>{phone.name} {storage?.label || ''}</b><span>{logoLabel(targetCarrier)} · {joinType} · {plan.name} · {discountMode === 'support' ? '공통지원금' : `요금할인 ${contractMonths}개월`}</span></div><div><strong>{money(monthlyBill)}</strong><a href={kakaoHref(phone.name)}>신청하기</a></div></div><section className={`detail-modal phonesawa-like detail-page-card ${imageCompact ? 'image-compact' : ''}`}><a className="close" href="/" aria-label="목록으로 돌아가기"><X/></a><div className="detail-left"><div className="detail-phone-title"><h2>{phone.name}</h2><p>{storage?.label || ''} · {color?.name || '기본색상'} · {phone.subtitle}</p></div><div className="modal-media"><img key={selectedImage} src={selectedImage} alt={`${phone.name} ${color?.name || ''}`}/></div><div className="bill-card"><span>월별 청구금액</span><strong>{money(monthlyBill)}</strong><small>└ 단말 할부금 {money(installment.monthly)}<br/>└ 요금제 {money(activePlanFee)}</small></div><div className="cost-grid"><div><b>휴대폰 할부금</b><strong>{money(installment.monthly)}</strong><small>고객구매가격/할부원금 {money(principal)}<br/>할부수수료 {money(installment.interest)}<br/>원리금균등 연 5.9% · 24개월</small></div><div><b>당월 예상금액</b><strong>{money(thisMonthDevice + thisMonthPlan)}</strong><small>단말 {money(thisMonthDevice)} + 요금 {money(thisMonthPlan)}<br/>오늘 기준 남은 일수 일할 계산</small></div></div></div><div className="detail-right"><div className="top-price"><span>월</span><strong>{money(monthlyBill)}</strong></div><div className="option-block"><h3>색상</h3><div className="color-choice-row">{phone.colors.map((c, i) => <button type="button" key={`${c.name}-${i}`} className={i === colorIndex ? 'active' : ''} onClick={() => setColorIndex(i)}><i style={{ background: c.hex }} />{c.name}</button>)}</div></div><div className="option-block"><h3>용량</h3><div className="storage-choice-row">{displayStorages.map((s, i) => <button key={`${s.label}-${i}`} className={i === storageIndex ? 'active' : ''} onClick={() => setStorageIndex(i)}>{s.label}</button>)}</div><div className="support-line"><span>출고가 : {money(devicePrice)}</span><span>공통지원금 : {discountMode === 'support' ? money(support) : '0원'}</span><span>추가지원금 : {discountMode === 'support' ? money(rebate) : '0원'}</span><span>요금할인 : {discountMode === 'plan' ? `${contractMonths}개월 · 월 ${money(planDiscountAmount)}` : '미적용'}</span><span>고객구매가격 : {money(principal)}</span></div></div><div className="carrier-box logo-carrier-box"><div><b>사용중인통신사</b><div className="carrier-logo-row">{currentCarrierOptions.map((carrier) => <button key={carrier} className={currentCarrier === carrier ? 'active' : ''} onClick={() => setCurrentCarrier(carrier)}><span>{logoLabel(carrier)}</span></button>)}</div></div><div><b>사용하실통신사</b><div className="carrier-logo-row">{targetCarrierOptions.map((carrier) => <button key={carrier} className={targetCarrier === carrier ? 'active' : ''} onClick={() => changeCarrier(carrier)}><span>{logoLabel(carrier)}</span></button>)}</div></div></div><div className="plan-row plan-picker plan-change-row"><b>요금제</b><div className="selected-plan"><strong>{plan.name}</strong><span>{money(plan.fee)}</span></div><button type="button" className="plan-change-button" onClick={() => setPlanOpen(!planOpen)}>{planOpen ? '닫기' : '변경'}</button>{planOpen && <select value={plan.name} onChange={(e) => setPlanName(e.target.value)}>{activePlans.map((p) => <option key={p.name}>{p.name}</option>)}</select>}<small>{plan.data} · {plan.voice}</small></div><div className="benefit-condition-grid"><div className="benefit-box"><b>요금제 혜택</b>{plan.benefits.map((benefit) => <span key={benefit}>□ {benefit}</span>)}</div><div className="condition-zero-box"><div className="condition-zero-head"><span>조건제로</span><b>추가 조건 없음</b></div><div className="zero-condition-list"><div><i>🚫</i><span>부가서비스 조건</span><strong>없음</strong></div><div><i>💳</i><span>카드 발급 조건</span><strong>없음</strong></div><div><i>📱</i><span>비싼 요금제 필수</span><strong>없음</strong></div><div><i>📦</i><span>기기 반납 조건</span><strong>없음</strong></div></div><p>선택한 요금제와 가입유형 기준으로만 견적을 안내합니다.</p></div></div><div className="discount-compare-box"><div className="discount-head"><b>할인 방식 선택</b><span>공통지원금 vs 요금할인(선택약정)</span></div><div className="discount-mode-grid"><button type="button" className={discountMode === 'support' ? 'active' : ''} onClick={() => setDiscountMode('support')}><b>공통지원금 할인</b><span>월 {money(supportMonthlyBill)}</span><small>단말 할인 {money(support + rebate)}</small></button><button type="button" className={discountMode === 'plan' ? 'active' : ''} onClick={() => setDiscountMode('plan')}><b>요금할인 25%</b><span>월 {money(planDiscountMonthlyBill)}</span><small>기본료 월 {money(planDiscountAmount)} 할인</small></button></div><div className="contract-row"><span>요금할인 약정기간</span><button type="button" className={contractMonths === 12 ? 'active' : ''} onClick={() => setContractMonths(12)}>12개월</button><button type="button" className={contractMonths === 24 ? 'active' : ''} onClick={() => setContractMonths(24)}>24개월</button></div><p className="discount-diff"><b>{cheaperMode === 'support' ? '공통지원금 할인' : '요금할인 25%'}</b>이 월 {money(discountDiff)} 더 저렴합니다.</p></div><div className="ai-quote-box"><div className="ai-quote-head"><div><b>AI 맞춤 견적</b><small>예산과 데이터 성향에 맞춰 최적 조건을 계산해요.</small></div><button type="button" onClick={() => setAiOpen(!aiOpen)}>{aiOpen ? '접기' : 'AI 추천받기'}</button></div>{aiOpen && <div className="ai-quote-body"><label>월 예산<input type="number" value={aiBudget} onChange={(e) => setAiBudget(Number(e.target.value || 0))}/></label><label className="ai-check"><input type="checkbox" checked={aiUnlimited} onChange={(e) => setAiUnlimited(e.target.checked)}/> 무제한/대용량 요금제 우선</label>{aiRecommendation && <div className="ai-result"><span>추천 조합</span><strong>{logoLabel(aiRecommendation.carrier)} · {aiRecommendation.plan.name} · {aiRecommendation.storage.label}</strong><p>예상 월 청구금액 {money(aiRecommendation.monthly)} / 고객구매가격 {money(aiRecommendation.principal)}</p><small>공통지원금 {money(aiRecommendation.support)} + 추가지원금 {money(aiRecommendation.rebate)} 기준으로 계산했어요.</small><button type="button" onClick={() => { const idx = displayStorages.findIndex((item) => item.label === aiRecommendation.storage.label); if (idx >= 0) setStorageIndex(idx); changeCarrier(aiRecommendation.carrier); setPlanName(aiRecommendation.plan.name); setPlanOpen(false); }}>이 조건으로 보기</button></div>}</div>}</div><div className="modal-actions"><a className="kakao-talk" href={kakaoHref(phone.name)}><MessageCircle size={19}/> 카카오톡 상담하기</a><a className="outline" href={kakaoHref(phone.name)}>신청하기</a></div></div><div className="detail-board-section"><section className="product-board-card"><div className="board-title"><div><h3>상품 후기</h3><p>구매 후기를 확인해보세요.</p></div><strong>총 0개</strong></div><div className="empty-board"><b>등록된 후기가 없습니다.</b><span>첫 구매 후기가 등록되면 이곳에 표시됩니다.</span></div></section><section className="product-board-card"><div className="board-title"><div><h3>상품 문의</h3><p>궁금한 점을 문의해주세요.</p></div><strong>총 0개</strong></div><div className="board-tabs"><button className="active" type="button">전체</button><button type="button">상태문의</button><button type="button">재고문의</button><button type="button">요금문의</button></div><div className="empty-board"><b>등록된 문의가 없습니다.</b><span>카카오톡 상담하기 또는 신청하기로 문의를 남겨주세요.</span></div></section><section className="phone-caution-card"><CautionText text={purchaseCautionText} /></section></div></section></>
}
function ConsultForm({ selected }: { selected: string }) { const [name, setName] = useState(''), [phone, setPhone] = useState(''), [model, setModel] = useState(selected), [joinType, setJoinType] = useState<JoinType>('번호이동'), [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle'), [message, setMessage] = useState(''); React.useEffect(() => setModel(selected), [selected]); async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setStatus('sending'); setMessage(''); if (!supabase) { setStatus('error'); setMessage('상담 저장 설정이 아직 연결되지 않았습니다.'); return } const { error } = await supabase.from('consult_requests').insert({ name, phone, desired_model: model || null, join_type: joinType, source: 'linkbus.kr', status: 'new' }); if (error) { setStatus('error'); setMessage('저장 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.'); return } setStatus('success'); setMessage('상담 신청이 접수되었습니다. 확인 후 연락드릴게요.'); setName(''); setPhone(''); setModel(''); setJoinType('번호이동') } return <form className="consult-form" onSubmit={submit}><div className="form-title"><Store/><div><p>무료 상담 신청</p><h2>현재 조건과 재고를 확인해드려요</h2></div></div><label>이름<input value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" required /></label><label>연락처<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" required /></label><label>희망 모델<input value={model} onChange={(e) => setModel(e.target.value)} placeholder="예: 아이폰 17 프로" /></label><label>가입유형<select value={joinType} onChange={(e) => setJoinType(e.target.value as JoinType)}><option>번호이동</option><option>기기변경</option><option>신규가입</option></select></label><label className="agree"><input type="checkbox" required /> <span><a href="/privacy" target="_blank" rel="noreferrer">개인정보 수집·이용</a> 및 <a href="/terms" target="_blank" rel="noreferrer">이용약관</a>에 동의합니다.</span></label>{message && <p className={`form-message ${status}`}>{message}</p>}<button className="submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? '접수 중...' : '상담 신청하기'}</button></form> }
createRoot(document.getElementById('root')!).render(<App />)
