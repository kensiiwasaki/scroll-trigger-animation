# スクロールトリガーアニメーションライブラリ

スクロールトリガーアニメーションは、ユーザーがページをスクロールした際に、特定の要素がビューポート内に入った瞬間に自動でアニメーションを適用する TypeScript ライブラリです。

## 特徴

- **Intersection Observer API の活用**: スクロール位置を効率的に検知し、パフォーマンスに優れた実装
- **カスタマイズ可能なアニメーション**: CSS クラスやトランジションを組み合わせ、柔軟なアニメーションパターンを提供
- **シンプルな API**: 少ない設定で導入でき、既存の CSS フレームワークと連携しやすい

## インストール

```bash
# npmを使用する場合
npm install scroll-trigger-animation

# yarnを使用する場合
yarn add scroll-trigger-animation
```

## 基本的な使い方

```html
<!-- HTML -->
<div class="box" data-animation="fade-in">フェードイン</div>
<div class="box" data-animation="fade-in-up">下からフェードイン</div>
```

```javascript
// JavaScript
import ScrollTrigger, { Animations } from "scroll-trigger-animation";

// 基本的なアニメーションスタイルを適用
Animations.applyBaseStyles();

// 使用するアニメーションを登録
Animations.fadeIn();
Animations.fadeInUp();

// スクロールトリガーを初期化
const scrollTrigger = new ScrollTrigger({
  threshold: 0.2, // 要素が20%表示されたらアニメーション開始
  once: true, // 一度だけアニメーションを実行
});

// アニメーション要素を追加
document.querySelectorAll("[data-animation]").forEach((element) => {
  const animationType = element.getAttribute("data-animation");
  element.classList.add(animationType);
  scrollTrigger.add(element);
});
```

## 利用可能なアニメーション

ライブラリには以下のアニメーションが含まれています：

- `fadeIn()` - フェードイン
- `fadeInUp()` - 下からフェードイン
- `fadeInDown()` - 上からフェードイン
- `fadeInLeft()` - 左からフェードイン
- `fadeInRight()` - 右からフェードイン
- `zoomIn()` - ズームイン
- `zoomOut()` - ズームアウト
- `flip()` - フリップ
- `bounce()` - バウンス

## カスタムアニメーションの作成

独自のアニメーションを作成することも可能です：

```javascript
// カスタムアニメーションの作成
Animations.custom(
  "my-animation",
  `
    0% {
      opacity: 0;
      transform: rotate(45deg);
    }
    100% {
      opacity: 1;
      transform: rotate(0);
    }
  `,
  `
    opacity: 0;
    transform: rotate(45deg);
  `,
  { duration: 0.8, easing: "ease-out" }
);

// 使用方法
element.classList.add("my-animation");
scrollTrigger.add(element);
```

## オプション

`ScrollTrigger`コンストラクタには以下のオプションを指定できます：

```javascript
const scrollTrigger = new ScrollTrigger({
  // アニメーション実行時に追加するCSSクラス名
  animationClass: "scroll-animate",

  // アニメーション実行前に追加するCSSクラス名
  initialClass: "scroll-animate-init",

  // アニメーションの遅延時間（ミリ秒）
  delay: 0,

  // 要素がどれだけビューポートに入ったときにアニメーションを実行するか（0〜1）
  threshold: 0.1,

  // アニメーション実行後に監視を解除するかどうか
  once: true,

  // アニメーション実行前のコールバック関数
  onBeforeAnimate: (element) => {
    console.log("アニメーション開始前", element);
  },

  // アニメーション実行後のコールバック関数
  onAfterAnimate: (element) => {
    console.log("アニメーション完了", element);
  },
});
```

## メソッド

`ScrollTrigger`インスタンスには以下のメソッドがあります：

- `add(elements)` - 要素を監視対象に追加
- `remove(elements)` - 要素の監視を解除
- `destroy()` - すべての要素の監視を解除
- `refresh()` - 監視中の要素を再スキャン

## デモ

デモページを確認するには、リポジトリをクローンして以下のコマンドを実行してください：

```bash
# TypeScriptをコンパイル
npm run build

# デモページを開く
open demo/index.html
```

## ライセンス

MIT
