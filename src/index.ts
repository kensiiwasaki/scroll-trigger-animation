/**
 * ScrollTriggerAnimation
 * スクロール時に要素がビューポートに入ったときにアニメーションを実行するライブラリ
 */

export interface ScrollTriggerOptions {
  /** アニメーション実行時に追加するCSSクラス名 */
  animationClass?: string;
  /** アニメーション実行前に追加するCSSクラス名 */
  initialClass?: string;
  /** アニメーションの遅延時間（ミリ秒） */
  delay?: number;
  /** 要素がどれだけビューポートに入ったときにアニメーションを実行するか（0〜1） */
  threshold?: number;
  /** アニメーション実行後に監視を解除するかどうか */
  once?: boolean;
  /** アニメーション実行前のコールバック関数 */
  onBeforeAnimate?: (element: Element) => void;
  /** アニメーション実行後のコールバック関数 */
  onAfterAnimate?: (element: Element) => void;
}

export class ScrollTrigger {
  private options: ScrollTriggerOptions;
  private observer: IntersectionObserver | null = null;
  private elements: Map<Element, boolean> = new Map();

  /**
   * コンストラクタ
   * @param options スクロールトリガーのオプション
   */
  constructor(options: ScrollTriggerOptions = {}) {
    this.options = {
      animationClass: "scroll-animate",
      initialClass: "scroll-animate-init",
      delay: 0,
      threshold: 0.1,
      once: true,
      ...options,
    };

    this.init();
  }

  /**
   * 初期化処理
   */
  private init(): void {
    const observerOptions = {
      root: null, // ビューポートを基準にする
      rootMargin: "0px",
      threshold: this.options.threshold,
    };

    this.observer = new IntersectionObserver(
      this.handleIntersect.bind(this),
      observerOptions
    );
  }

  /**
   * 要素が交差したときの処理
   */
  private handleIntersect(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ): void {
    entries.forEach((entry) => {
      // 要素がビューポートに入った場合
      if (entry.isIntersecting) {
        const element = entry.target;

        // すでにアニメーション済みの要素はスキップ
        if (this.elements.get(element)) return;

        // アニメーション前のコールバックを実行
        if (this.options.onBeforeAnimate) {
          this.options.onBeforeAnimate(element);
        }

        // 遅延時間が設定されている場合は遅延実行
        setTimeout(() => {
          if (this.options.initialClass) {
            element.classList.remove(this.options.initialClass);
          }

          if (this.options.animationClass) {
            element.classList.add(this.options.animationClass);
          }

          // アニメーション後のコールバックを実行
          if (this.options.onAfterAnimate) {
            this.options.onAfterAnimate(element);
          }

          // 一度だけ実行する設定の場合は監視を解除
          if (this.options.once && this.observer) {
            this.observer.unobserve(element);
            this.elements.set(element, true);
          }
        }, this.options.delay || 0);
      }
    });
  }

  /**
   * 要素を監視対象に追加
   * @param elements 監視対象の要素またはセレクタ
   */
  public add(elements: string | Element | NodeList | Element[]): void {
    const targetElements: Element[] = [];

    if (typeof elements === "string") {
      // セレクタの場合は要素を取得
      document
        .querySelectorAll(elements)
        .forEach((el) => targetElements.push(el));
    } else if (elements instanceof Element) {
      // 単一要素の場合
      targetElements.push(elements);
    } else if (elements instanceof NodeList || Array.isArray(elements)) {
      // 複数要素の場合
      Array.from(elements).forEach((el) => {
        if (el instanceof Element) targetElements.push(el);
      });
    }

    // 各要素を監視対象に追加
    targetElements.forEach((element) => {
      if (!this.elements.has(element) && this.observer) {
        // 初期クラスを追加
        if (this.options.initialClass) {
          element.classList.add(this.options.initialClass);
        }

        this.observer.observe(element);
        this.elements.set(element, false);
      }
    });
  }

  /**
   * 要素の監視を解除
   * @param elements 監視解除する要素またはセレクタ
   */
  public remove(elements: string | Element | NodeList | Element[]): void {
    const targetElements: Element[] = [];

    if (typeof elements === "string") {
      document
        .querySelectorAll(elements)
        .forEach((el) => targetElements.push(el));
    } else if (elements instanceof Element) {
      targetElements.push(elements);
    } else if (elements instanceof NodeList || Array.isArray(elements)) {
      Array.from(elements).forEach((el) => {
        if (el instanceof Element) targetElements.push(el);
      });
    }

    targetElements.forEach((element) => {
      if (this.observer) {
        this.observer.unobserve(element);
        this.elements.delete(element);
      }
    });
  }

  /**
   * すべての要素の監視を解除
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.elements.clear();
      this.observer = null;
    }
  }

  /**
   * 監視中の要素を再スキャン
   */
  public refresh(): void {
    this.destroy();
    this.init();
  }
}

// アニメーションユーティリティをインポート
import { Animations, AnimationOptions } from "./animations";

// アニメーションユーティリティをエクスポート
export { Animations, AnimationOptions };

// デフォルトエクスポート
export default ScrollTrigger;
