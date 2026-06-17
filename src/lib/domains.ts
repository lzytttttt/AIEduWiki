const DOMAINS = ['theory', 'technology', 'products', 'insights'] as const
export type Domain = (typeof DOMAINS)[number]

/** Domain display names (Chinese). */
export const DOMAIN_DISPLAY: Record<Domain, string> = {
  theory: '学习理论',
  technology: '技术方法',
  products: '产品与公司',
  insights: '争议与趋势',
}

/** Domain descriptions for SEO and index pages. */
export const DOMAIN_DESCRIPTIONS: Record<Domain, string> = {
  theory: '知识追踪、学习科学、教学智能体等核心理论',
  technology: 'NLP、强化学习、多模态等技术在教育中的应用',
  products: 'Khan Academy、松鼠 AI、好未来等产品与机构',
  insights: 'AI 替代教师、教育公平、年度趋势等深度分析',
}

/** Return all valid domain slugs. */
export function getDomains(): Domain[] {
  return [...DOMAINS]
}
