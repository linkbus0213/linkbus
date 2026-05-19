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
const tips = ['아이폰17 / 갤럭시 S26 울트라 휴대폰 “0원폰”의 진실', '26년 5월 SK텔레콤 라이트 할부 카드 이벤트 안내', '휴대폰 신청시 주의해야 할 점 feat. 부가서비스', '휴대폰 개통시 주의해야 할 점 feat. 제휴카드', 'KT 총액 결합할인 제도 쉽게 알아보기']

function money(value: number | null | undefined) { return value == null ? '상담가' : `${value.toLocaleString()}원` }
function safeFileName(name: string) { return name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').toLowerCase() || 'image' }
function cleanColors(colors?: ColorOption[] | null, image = officialImages.iphone) { return colors?.length ? colors.filter(c => c.name).map(c => ({ name: c.name, hex: c.hex || '#dddddd', image: c.image || image })) : defaultColors(image) }
function cleanStorages(storages?: StorageOption[] | null) { return storages?.length ? storages.filter(s => s.label).map(s => ({ label: s.label, price: s.price ?? null, support: s.support ?? null, rebate: s.rebate ?? null, isVisible: s.isVisible ?? true, supportByCarrier: s.supportByCarrier || {}, rebateByCarrier: s.rebateByCarrier || {}, rebateByCarrierJoin: s.rebateByCarrierJoin || {}, planRebateByCarrier: s.planRebateByCarrier || {}, visiblePlansByCarrier: s.visiblePlansByCarrier || {}, planSupportByCarrier: s.planSupportByCarrier || {}, planSupportByCarrierJoin: s.planSupportByCarrierJoin || {}, newJoinVisibleByCarrier: s.newJoinVisibleByCarrier || {} })) : defaultStorages }
function visibleStorages(phone: Phone) { const list = phone.storages.filter((s) => s.isVisible !== false); return list.length ? list : phone.storages.slice(0, 1) }
function rowToPhone(row: ProductRow): Phone { const image = row.image_url || officialImages.iphone; const normalizedName = row.name.replace(/\s/g, ''); const importedStorages = normalizedName.includes('아이폰17프로') && !normalizedName.includes('맥스') ? excelStorageData.iphone17pro : undefined; const rowStorages = cleanStorages(row.storage_options); const hasPrices = rowStorages.some((s) => s.price || Object.keys(s.supportByCarrier || {}).length || Object.keys(s.planSupportByCarrier || {}).length); return { id: row.id, brand: row.brand, series: row.series, carrier: row.carrier, joinType: row.join_type, name: row.name, subtitle: row.subtitle || '', image, price: row.sale_price, rebate: row.rebate, monthly: row.monthly_fee || 0, support: row.support_amount || 0, badge: row.badge || '추천', tag: row.tag || row.brand, isVisible: row.is_visible, colors: cleanColors(row.color_options, image), storages: importedStorages && !hasPrices ? importedStorages : rowStorages } }
function phoneToRow(phone: Phone) { return { brand: phone.brand, series: phone.series, carrier: phone.carrier, join_type: phone.joinType, name: phone.name, subtitle: phone.subtitle, image_url: phone.image, sale_price: phone.price, rebate: phone.rebate, monthly_fee: phone.monthly, support_amount: phone.support, badge: phone.badge, tag: phone.tag, is_visible: phone.isVisible ?? true, color_options: phone.colors, storage_options: phone.storages } }


function IctCertBadge() { return <a className="ict-cert-badge" href="https://ictmarket.or.kr:8443/precon/pop_CertIcon.do?PRECON_REQ_ID=PRE0000191674" target="_blank" rel="noreferrer"><img src="https://ictmarket.or.kr:8443/getCertIcon.do?cert_icon=KP25022507346Q002" alt="ICTMARKET 사전승낙 인증마크"/></a> }

function App() { if (location.pathname.startsWith('/admin')) return <AdminApp />; if (location.pathname.startsWith('/product/')) return <ProductPage />; return <Storefront /> }

function Storefront() {
  const [phones, setPhones] = useState<Phone[]>(fallbackPhones)
  const [brand, setBrand] = useState<Brand | '전체'>('애플')
  const [series, setSeries] = useState('iPhone 17 시리즈')
  const [query, setQuery] = useState('')
  React.useEffect(() => { if (!supabase) return; supabase.from('sale_products').select('*').eq('is_visible', true).order('sort_order', { ascending: true }).then(({ data }) => { if (data?.length) setPhones((data as ProductRow[]).map(rowToPhone)) }) }, [])
  const seriesList = brand === '삼성' ? samsungSeries : appleSeries
  const filtered = useMemo(() => phones.filter((phone) => (brand === '전체' || phone.brand === brand) && (brand === '전체' || phone.series === series) && `${phone.name} ${phone.subtitle} ${phone.carrier} ${phone.joinType} ${phone.brand}`.toLowerCase().includes(query.toLowerCase())), [phones, brand, series, query])
  function chooseBrand(next: Brand | '전체') { setBrand(next); setSeries(next === '삼성' ? samsungSeries[0] : appleSeries[0]) }
  return <>
    <header className="topbar"><div className="top-inner"><a className="brand-logo" href="#top"><span>LINK</span>BUS</a></div><nav className="menu-line">{['애플', '삼성', '기타', '유심전용', '인터넷/IPTV', '리뷰', '질문답변', '이벤트', '고객센터'].map((item) => <a key={item} href={item === '애플' || item === '삼성' ? '#popular' : '#consult'}>{item}</a>)}</nav></header>
    <main id="top">
      <section className="hero-slider"><article className="hero-banner dark"><div><p>사전예약 · 특별혜택</p><h1>아이폰 17 Pro<br/>지금 조건 비교</h1><a href="#popular">모델 보러가기 <ChevronRight size={18}/></a></div><img src={officialImages.iphonePro} alt="아이폰 17 프로" /></article><article className="hero-banner light"><div><p>전 통신사 견적 비교</p><h1>갤럭시 S26<br/>최저 조건 상담</h1><a href="#popular">혜택 확인하기 <ChevronRight size={18}/></a></div><img src={officialImages.galaxy} alt="갤럭시 S26" /></article></section>
      <section id="popular" className="popular-section"><div className="section-title"><h2>인기 급상승 상품</h2><p>모델을 누르면 색상·용량·상세 조건을 확인할 수 있어요.</p></div><div className="brand-tabs">{brands.map((item) => <button key={item} className={brand === item ? 'active' : ''} onClick={() => chooseBrand(item)}>{item === '애플' ? '애플 | APPLE' : item === '삼성' ? '삼성 | SAMSUNG' : item}</button>)}</div>{brand !== '전체' && <div className="series-tabs">{seriesList.map((item) => <button key={item} className={series === item ? 'active' : ''} onClick={() => setSeries(item)}>{item}</button>)}</div>}<label className="search-pill"><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="모델명, 통신사, 가입유형 검색" /></label><div className="phone-strip">{filtered.map((phone) => <button className="product-tile" key={phone.id} onClick={() => { location.href = `/product/${phone.id}` }}><span className="ribbon">{phone.badge}</span><figure><img src={phone.colors[0]?.image || phone.image} alt={phone.name}/></figure><b>{phone.name}</b><small>{phone.subtitle}</small><strong>{money(customerPrincipal(visibleStorages(phone)[0]?.price ?? phone.price, carrierValue(visibleStorages(phone)[0]?.supportByCarrier, normalizeCarrier(phone.carrier), visibleStorages(phone)[0]?.support ?? phone.support), rebateValue(visibleStorages(phone)[0], normalizeCarrier(phone.carrier), phone.joinType, phone.rebate)))}</strong></button>)}{!filtered.length && <p className="empty">조건에 맞는 상품이 없습니다.</p>}</div></section>
      <section className="consult-cta"><div><p>최저가 보장 · 숨은 조건 없음</p><h3>어떤 폰이 나에게 맞을지 모르겠다면?</h3></div><div><a href="#popular">기기 비교하기</a><a className="kakao" href="#consult"><MessageCircle size={18}/> 무료 상담 신청</a></div></section>
      <section className="content-grid"><article className="curation"><div className="block-head"><h2>놓치면 아까운 꿀팁! 링크버스 큐레이션</h2><a href="#consult">더보기 <ChevronRight size={16}/></a></div><div className="tip-list">{tips.map((tip) => <a key={tip} href="#consult"><span>핫이슈</span>{tip}<ChevronRight size={16}/></a>)}</div></article><article className="phone-tube"><h2>휴대폰의 모든 것을 한눈에 보다. 링크튜브</h2><div className="video-row">{['갤럭시 S26 실사용 후기', '통신사 혜택 비교', '아이폰 17 구매 가이드'].map((title, i) => <div className="video-card" key={title}><div className={`thumb t${i}`}><PlayCircle/></div><b>{title}</b></div>)}</div></article></section>
      <section id="consult" className="consult-area"><div className="benefits"><Benefit icon={<Star/>} title="최저가 보장" text="전 통신사 조건을 비교해 합리적인 가격을 안내합니다." /><Benefit icon={<ShieldCheck/>} title="안전한 구매" text="상담 후 조건을 확정하고 신청 절차를 안내합니다." /><Benefit icon={<Headphones/>} title="전문 상담" text="기기·요금제·가입유형을 맞춤 추천합니다." /></div><ConsultForm selected="" /></section>
    </main><footer className="footer"><div className="footer-call"><h4>구매 문의 관련 상담</h4><strong>카카오톡 상담 / 전화 상담 준비중</strong><p>평일 10:00 ~ 18:00 · 토요일 10:00 ~ 15:00</p></div><div><b>LINKBUS</b><p>상호/사업자 정보/통신판매업 신고번호는 실제 사업자 가입 후 입력합니다.</p><IctCertBadge /></div></footer></>
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
  return <><header className="topbar"><div className="top-inner"><a className="brand-logo" href="/"><span>LINK</span>BUS</a></div><nav className="menu-line"><a href="/#popular">상품목록</a><a href="/#consult">상담신청</a><a href="/">홈으로</a></nav></header><main className="product-detail-page">{loading ? <p className="empty">상품 정보를 불러오는 중입니다.</p> : phone ? <ProductDetail phone={phone} /> : <section className="popular-section"><p className="empty">상품을 찾을 수 없습니다.</p><a className="outline page-back" href="/">목록으로 돌아가기</a></section>}</main></>
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
function ProductDetail({ phone }: { phone: Phone }) {
  const defaultCarrier = normalizeCarrier(phone.carrier)
  const [colorIndex, setColorIndex] = useState(0), [storageIndex, setStorageIndex] = useState(0), [targetCarrier, setTargetCarrier] = useState<CarrierKey>(defaultCarrier), [currentCarrier, setCurrentCarrier] = useState<CarrierKey | '알뜰폰' | '신규가입'>('KT')
  const [planName, setPlanName] = useState(defaultPlanName(defaultCarrier)), [planOpen, setPlanOpen] = useState(false), [imageCompact, setImageCompact] = useState(false)
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
  const principal = customerPrincipal(devicePrice, support, rebate)
  const installment = installmentPayment(principal)
  const monthlyBill = installment.monthly + plan.fee
  const thisMonthDevice = currentMonthProrated(installment.monthly)
  const thisMonthPlan = currentMonthProrated(plan.fee)
  function changeCarrier(next: CarrierKey) { setTargetCarrier(next); setPlanName(defaultPlanName(next)); setPlanOpen(false) }
  const logoLabel = (carrier: CarrierKey | '알뜰폰' | '신규가입') => carrier === 'SKT' ? 'SK' : carrier === 'LGU+' ? 'LG' : carrier
  const newJoinCarriers = carrierKeys.filter((carrier) => storage?.newJoinVisibleByCarrier?.[carrier] === true)
  const currentCarrierOptions: Array<CarrierKey | '알뜰폰' | '신규가입'> = ['SKT', 'KT', 'LGU+', '알뜰폰', ...(newJoinCarriers.length ? ['신규가입' as const] : [])]
  const targetCarrierOptions = currentCarrier === '신규가입' ? newJoinCarriers : carrierKeys
  React.useEffect(() => { if (currentCarrier === '신규가입' && newJoinCarriers.length && !newJoinCarriers.includes(targetCarrier)) changeCarrier(newJoinCarriers[0]) }, [currentCarrier, storageIndex])
  return <section className={`detail-modal phonesawa-like detail-page-card ${imageCompact ? 'image-compact' : ''}`}><a className="close" href="/" aria-label="목록으로 돌아가기"><X/></a><div className="detail-left"><div className="detail-phone-title"><h2>{phone.name}</h2><p>{storage?.label || ''} · {color?.name || '기본색상'} · {phone.subtitle}</p></div><div className="modal-media"><img key={selectedImage} src={selectedImage} alt={`${phone.name} ${color?.name || ''}`}/></div><div className="bill-card"><span>월별 청구금액</span><strong>{money(monthlyBill)}</strong><small>└ 단말 할부금 {money(installment.monthly)}<br/>└ 요금제 {money(plan.fee)}</small></div><div className="cost-grid"><div><b>휴대폰 할부금</b><strong>{money(installment.monthly)}</strong><small>고객구매가격/할부원금 {money(principal)}<br/>할부수수료 {money(installment.interest)}<br/>원리금균등 연 5.9% · 24개월</small></div><div><b>당월 예상금액</b><strong>{money(thisMonthDevice + thisMonthPlan)}</strong><small>단말 {money(thisMonthDevice)} + 요금 {money(thisMonthPlan)}<br/>오늘 기준 남은 일수 일할 계산</small></div></div></div><div className="detail-right"><div className="top-price"><span>월</span><strong>{money(monthlyBill)}</strong></div><div className="option-block"><h3>색상</h3><div className="color-choice-row">{phone.colors.map((c, i) => <button type="button" key={`${c.name}-${i}`} className={i === colorIndex ? 'active' : ''} onClick={() => setColorIndex(i)}><i style={{ background: c.hex }} />{c.name}</button>)}</div></div><div className="option-block"><h3>용량</h3><div className="storage-choice-row">{displayStorages.map((s, i) => <button key={`${s.label}-${i}`} className={i === storageIndex ? 'active' : ''} onClick={() => setStorageIndex(i)}>{s.label}</button>)}</div><div className="support-line"><span>출고가 : {money(devicePrice)}</span><span>공통지원금 : {money(support)}</span><span>추가지원금 : {money(rebate)}</span><span>고객구매가격 : {money(principal)}</span></div></div><div className="carrier-box logo-carrier-box"><div><b>사용중인통신사</b><div className="carrier-logo-row">{currentCarrierOptions.map((carrier) => <button key={carrier} className={currentCarrier === carrier ? 'active' : ''} onClick={() => setCurrentCarrier(carrier)}><span>{logoLabel(carrier)}</span></button>)}</div></div><div><b>사용하실통신사</b><div className="carrier-logo-row">{targetCarrierOptions.map((carrier) => <button key={carrier} className={targetCarrier === carrier ? 'active' : ''} onClick={() => changeCarrier(carrier)}><span>{logoLabel(carrier)}</span></button>)}</div></div></div><div className="plan-row plan-picker plan-change-row"><b>요금제</b><div className="selected-plan"><strong>{plan.name}</strong><span>{money(plan.fee)}</span></div><button type="button" className="plan-change-button" onClick={() => setPlanOpen(!planOpen)}>{planOpen ? '닫기' : '변경'}</button>{planOpen && <select value={plan.name} onChange={(e) => setPlanName(e.target.value)}>{activePlans.map((p) => <option key={p.name}>{p.name}</option>)}</select>}<small>{plan.data} · {plan.voice}</small></div><div className="benefit-box"><b>요금제 혜택</b>{plan.benefits.map((benefit) => <span key={benefit}>□ {benefit}</span>)}</div><div className="modal-actions"><a className="kakao-talk" href={kakaoHref(phone.name)}><MessageCircle size={19}/> 카카오톡 상담하기</a><a className="outline" href="/#consult">신청하기</a></div></div></section>
}
function ConsultForm({ selected }: { selected: string }) { const [name, setName] = useState(''), [phone, setPhone] = useState(''), [model, setModel] = useState(selected), [joinType, setJoinType] = useState<JoinType>('번호이동'), [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle'), [message, setMessage] = useState(''); React.useEffect(() => setModel(selected), [selected]); async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setStatus('sending'); setMessage(''); if (!supabase) { setStatus('error'); setMessage('상담 저장 설정이 아직 연결되지 않았습니다.'); return } const { error } = await supabase.from('consult_requests').insert({ name, phone, desired_model: model || null, join_type: joinType, source: 'linkbus.kr', status: 'new' }); if (error) { setStatus('error'); setMessage('저장 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.'); return } setStatus('success'); setMessage('상담 신청이 접수되었습니다. 확인 후 연락드릴게요.'); setName(''); setPhone(''); setModel(''); setJoinType('번호이동') } return <form className="consult-form" onSubmit={submit}><div className="form-title"><Store/><div><p>무료 상담 신청</p><h2>현재 조건과 재고를 확인해드려요</h2></div></div><label>이름<input value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" required /></label><label>연락처<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" required /></label><label>희망 모델<input value={model} onChange={(e) => setModel(e.target.value)} placeholder="예: 아이폰 17 프로" /></label><label>가입유형<select value={joinType} onChange={(e) => setJoinType(e.target.value as JoinType)}><option>번호이동</option><option>기기변경</option><option>신규가입</option></select></label><label className="agree"><input type="checkbox" required /> 개인정보 수집·이용에 동의합니다.</label>{message && <p className={`form-message ${status}`}>{message}</p>}<button className="submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? '접수 중...' : '상담 신청하기'}</button></form> }
createRoot(document.getElementById('root')!).render(<App />)
