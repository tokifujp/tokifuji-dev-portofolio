# tokifuji.dev

個人事業（ウェブ開発）のポートフォリオサイト。
CUI（ターミナル）風UIで、来訪者がコマンドを入力してコンテンツをナビゲートする体験を提供する。

## 特徴

- **CUI 風インターフェース** — Claude Code ライクな操作感
- **コマンドナビゲーション** — `/help` でコマンド一覧、Tab 補完・コマンド履歴対応
- **インタラクティブ問い合わせフォーム** — `/contact` でコンソール対話形式の入力
- **Discord 通知** — フォーム送信を Discord Webhook で受信
- **ASCII アートバナー** — 起動時・`/clear` 時に表示（`public/banner.txt` から読み込み）
- **GitHub ピン留めリポジトリ自動取得** — `/works` に GraphQL API 経由で反映（1 時間 ISR キャッシュ）

---

## 利用可能コマンド

| コマンド | 説明 | エイリアス |
|---|---|---|
| `/help` | コマンド一覧を表示 | `help`, `h`, `?` |
| `/about` | 自己紹介・プロフィール | `about`, `who`, `whoami` |
| `/services` | 提供サービス一覧 | `services`, `svc`, `service` |
| `/works` | 制作実績・ポートフォリオ | `works`, `portfolio`, `work` |
| `/contact` | お問い合わせフォーム | `contact`, `email` |
| `/terms` | 利用規約 | `terms`, `tos` |
| `/privacy` | プライバシーポリシー | `privacy`, `pp` |
| `/clear` | 画面をクリア | `clear`, `cls` |

---

## 技術スタック

- **Next.js 15** (App Router) + TypeScript
- **CSS Modules**（外部 CSS ライブラリなし）
- **IBM Plex Mono** フォント
- カラーパレット: `#0a0c10`（背景）、`#00e5a0`（緑アクセント）、`#c9d1d9`（テキスト）

---

## プロジェクト構成

```
portfolio/
├── public/
│   ├── favicon.ico          # ロゴから生成した透過 ICO (16/32/48px)
│   ├── logo.png             # 元ロゴ画像
│   └── banner.txt           # 起動時の ASCII アートバナー
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx       # メタデータ（AdSense タグ含む）
│   │   ├── page.tsx         # banner.txt を読み込み Terminal に渡す
│   │   └── api/contact/     # Discord Webhook POST エンドポイント
│   ├── components/
│   │   ├── Terminal/
│   │   │   ├── Terminal.tsx
│   │   │   ├── BootSequence.tsx
│   │   │   ├── OutputHistory.tsx
│   │   │   ├── InputLine.tsx
│   │   │   └── MobileHints.tsx
│   │   └── outputs/
│   │       ├── HelpOutput.tsx
│   │       ├── AboutOutput.tsx
│   │       ├── ServicesOutput.tsx
│   │       ├── WorksOutput.tsx
│   │       ├── ContactOutput.tsx
│   │       ├── TermsOutput.tsx
│   │       └── PrivacyOutput.tsx
│   ├── hooks/
│   │   ├── useTerminal.ts   # useReducer ベースのコア状態管理
│   │   ├── useTypewriter.ts
│   │   └── useCommandHistory.ts
│   ├── lib/
│   │   ├── commands.ts      # コマンド登録・エイリアス解決
│   │   ├── content.ts       # ポートフォリオコンテンツデータ（/works フォールバック含む）
│   │   └── github.ts        # GitHub GraphQL API (pinnedItems) フェッチ
│   └── types/
│       └── terminal.ts
```

---

## `/contact` フォームの動作

```
name?
Elon Musk > Motoki Tokifuji

email?
hello@example.com > hello@tokifuji.dev

message?
ウェブサイト制作の依頼をしたい... > ...

利用規約とプライバシーポリシーに同意しますか？ (/terms, /privacy で確認できます)
同意しますか？ (y/N)
N > y

✓ Message sent.
```

- `y` で同意 → Discord Webhook に POST して通知
- `n` または空 Enter（デフォルト N）→ キャンセル、POST なし

---

## 環境変数

`.env.example` をコピーして `.env` を作成:

```bash
cp .env.example .env
```

| 変数名 | 必須 | 説明 |
|---|---|---|
| `DISCORD_WEBHOOK_URL` | ✅ | Discord チャンネルの Webhook URL |
| `GOOGLE_ADSENSE_ACCOUNT` | — | AdSense アカウント ID（未設定時はメタタグ非出力）|
| `GITHUB_TOKEN` | — | GitHub Personal Access Token（Classic・スコープ不要）<br>未設定時は `content.ts` の静的データにフォールバック |

### GitHub Token の作成

GitHub → Settings → Developer settings → Personal access tokens → **Tokens (classic)**
スコープは何も選択せず Generate → `GITHUB_TOKEN` に貼り付け

---

## 開発

```bash
npm install
npm run dev
# http://localhost:3000
```

---

## Docker デプロイ

```bash
# ビルド & 起動
docker compose up --build -d

# http://localhost:3001
```

- `.env` の内容は `env_file` でコンテナに自動注入
- Next.js standalone ビルド（`output: 'standalone'`）

---

## favicon 生成

`public/logo.png`（288×288px）から ImageMagick で生成:

```bash
magick public/logo.png \
  -fuzz 5% -transparent white \
  -trim +repage \
  -gravity center -background none -extent '%[fx:w>h?w:h]x%[fx:w>h?w:h]' \
  \( -clone 0 -resize 16x16 \) \
  \( -clone 0 -resize 32x32 \) \
  \( -clone 0 -resize 48x48 \) \
  -delete 0 \
  public/favicon.ico
```
