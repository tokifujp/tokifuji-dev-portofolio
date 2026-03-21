import type { ServiceItem, WorkItem } from '@/types/terminal'

export const PROFILE = {
  name: 'Motoki Tokifuji',
  handle: 'tokifuji',
  role: 'Web Developer / Freelancer',
  bio: 'ウェブ開発を中心とした個人事業主。\nNext.js / TypeScript を得意とし、\nスタートアップから中小企業まで幅広く対応。',
  location: 'Japan',
  links: {
    github: 'https://github.com/tokifujp',
    site:   'https://tokifuji.dev',
  },
  skills: [
    'Next.js', 'React', 'TypeScript', 'Node.js',
    'PostgreSQL', 'Docker', 'Vercel', 'AWS',
  ],
}

export const SERVICES: ServiceItem[] = [
  {
    name: 'ウェブサイト制作',
    description: 'コーポレートサイト・LP・ポートフォリオなど\nデザインから実装・公開まで一貫対応。',
    price: '15万円〜',
  },
  {
    name: 'ウェブアプリ開発',
    description: '管理画面・予約システム・SaaSなど\nNext.js / TypeScript でのフルスタック開発。',
    price: '30万円〜',
  },
  {
    name: 'API・バックエンド開発',
    description: 'REST API設計・データベース設計・\nサーバーレス関数など。',
    price: '20万円〜',
  },
  {
    name: '保守・運用サポート',
    description: '既存サイトの機能追加・パフォーマンス改善・\n技術的なご相談も承ります。',
    price: '月5万円〜',
  },
]

export const WORKS: WorkItem[] = [
  {
    title: 'Call Data Bank 計測タグ診断ツール',
    description: 'ウェブページに設置された計測タグの\n設置状況を自動診断するツール。\nPuppeteerによるヘッドレスブラウザ解析。',
    url: 'https://tag.tokifuji.dev',
    tags: ['Next.js', 'TypeScript', 'Puppeteer', 'Docker'],
    year: 2024,
  },
  {
    title: 'devtools-registry',
    description: '開発ツールのレジストリサイト。',
    tags: ['Next.js', 'TypeScript'],
    year: 2024,
  },
]

export const CONTACT = {
  github:   'github.com/tokifujp',
  note:     '通常2営業日以内にご返信いたします。\nお仕事のご依頼・ご相談はお気軽にどうぞ。',
}

export const TERMS = {
  title: '利用規約',
  updatedAt: '2026-03-21',
  sections: [
    {
      heading: '1. 適用範囲',
      body: '本規約は、tokifuji.dev（以下「本サイト」）の問い合わせフォームを利用する際に適用されます。',
    },
    {
      heading: '2. 利用目的',
      body: 'お問い合わせフォームから送信された情報（氏名・メールアドレス・メッセージ）は、ご返信および業務上の連絡のみに使用します。',
    },
    {
      heading: '3. 禁止事項',
      body: '虚偽の情報入力、スパム・迷惑行為、その他公序良俗に反する利用を禁止します。',
    },
    {
      heading: '4. 免責',
      body: '本サイトの情報は現状のまま提供され、内容の正確性・完全性を保証するものではありません。',
    },
    {
      heading: '5. 変更',
      body: '本規約は予告なく変更することがあります。変更後も本サイトを利用した場合は、変更後の規約に同意したものとみなします。',
    },
  ],
}

export const PRIVACY = {
  title: 'プライバシーポリシー',
  updatedAt: '2026-03-21',
  sections: [
    {
      heading: '1. 取得する情報',
      body: 'お問い合わせ時に入力された氏名・メールアドレス・メッセージを取得します。',
    },
    {
      heading: '2. 利用目的',
      body: '取得した個人情報は、お問い合わせへのご返信および業務上の連絡にのみ使用します。それ以外の目的では使用しません。',
    },
    {
      heading: '3. 第三者提供',
      body: '法令に基づく場合を除き、取得した個人情報を第三者へ提供・開示することはありません。',
    },
    {
      heading: '4. 管理',
      body: '個人情報への不正アクセス・漏洩・紛失を防止するため、適切な安全管理措置を講じます。',
    },
    {
      heading: '5. お問い合わせ',
      body: '個人情報の開示・訂正・削除に関するご要望は /contact よりご連絡ください。',
    },
  ],
}
