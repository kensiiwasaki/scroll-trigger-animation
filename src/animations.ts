/**
 * アニメーションユーティリティ
 * よく使われるアニメーションパターンを提供するユーティリティクラス
 */

export interface AnimationOptions {
  /** アニメーションの持続時間（秒） */
  duration?: number;
  /** アニメーションの遅延時間（秒） */
  delay?: number;
  /** アニメーションのイージング関数 */
  easing?: string;
  /** アニメーションの繰り返し回数 */
  iterations?: number;
  /** アニメーションの方向 */
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
  /** アニメーション終了時の状態 */
  fillMode?: "none" | "forwards" | "backwards" | "both";
}

export class Animations {
  /**
   * デフォルトのアニメーションオプション
   */
  private static defaultOptions: AnimationOptions = {
    duration: 0.6,
    delay: 0,
    easing: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
    iterations: 1,
    direction: "normal",
    fillMode: "forwards",
  };

  /**
   * CSSスタイルを生成
   */
  private static generateCSS(selector: string, styles: string): string {
    return `${selector} { ${styles} }`;
  }

  /**
   * アニメーションのキーフレームを生成
   */
  private static generateKeyframes(name: string, keyframes: string): string {
    return `@keyframes ${name} { ${keyframes} }`;
  }

  /**
   * アニメーションプロパティを生成
   */
  private static generateAnimationProperty(options: AnimationOptions): string {
    const opts = { ...this.defaultOptions, ...options };
    return `animation: ${opts.duration}s ${opts.easing} ${opts.delay}s ${opts.iterations} ${opts.direction} ${opts.fillMode}`;
  }

  /**
   * スタイルシートにスタイルを追加
   */
  private static addStyleToDocument(css: string): void {
    // すでに同じIDのスタイル要素があれば削除
    const existingStyle = document.getElementById("scroll-trigger-animations");
    if (existingStyle) {
      existingStyle.remove();
    }

    // 新しいスタイル要素を作成
    const style = document.createElement("style");
    style.id = "scroll-trigger-animations";
    style.textContent = css;
    document.head.appendChild(style);
  }

  /**
   * 基本的なアニメーションスタイルを適用
   */
  public static applyBaseStyles(
    initialClass: string = "scroll-animate-init",
    animationClass: string = "scroll-animate"
  ): void {
    const css = `
      .${initialClass} {
        opacity: 0;
        will-change: transform, opacity;
        transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1.0), opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1.0);
      }
      .${animationClass} {
        opacity: 1;
        transform: none !important;
      }
    `;
    this.addStyleToDocument(css);
  }

  /**
   * フェードインアニメーション
   */
  public static fadeIn(options: AnimationOptions = {}): string {
    const name = "scroll-fade-in";
    const keyframes = `
      0% { opacity: 0; }
      100% { opacity: 1; }
    `;
    const animationProperty = this.generateAnimationProperty(options);
    const css = `
      ${this.generateKeyframes(name, keyframes)}
      .scroll-animate-init.fade-in {
        opacity: 0;
      }
      .scroll-animate.fade-in {
        ${animationProperty};
        animation-name: ${name};
      }
    `;
    this.addStyleToDocument(css);
    return "fade-in";
  }

  /**
   * 上からフェードインするアニメーション
   */
  public static fadeInDown(
    distance: string = "30px",
    options: AnimationOptions = {}
  ): string {
    const name = "scroll-fade-in-down";
    const keyframes = `
      0% {
        opacity: 0;
        transform: translate3d(0, -${distance}, 0);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    `;
    const animationProperty = this.generateAnimationProperty(options);
    const css = `
      ${this.generateKeyframes(name, keyframes)}
      .scroll-animate-init.fade-in-down {
        opacity: 0;
        transform: translate3d(0, -${distance}, 0);
      }
      .scroll-animate.fade-in-down {
        ${animationProperty};
        animation-name: ${name};
      }
    `;
    this.addStyleToDocument(css);
    return "fade-in-down";
  }

  /**
   * 下からフェードインするアニメーション
   */
  public static fadeInUp(
    distance: string = "30px",
    options: AnimationOptions = {}
  ): string {
    const name = "scroll-fade-in-up";
    const keyframes = `
      0% {
        opacity: 0;
        transform: translate3d(0, ${distance}, 0);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    `;
    const animationProperty = this.generateAnimationProperty(options);
    const css = `
      ${this.generateKeyframes(name, keyframes)}
      .scroll-animate-init.fade-in-up {
        opacity: 0;
        transform: translate3d(0, ${distance}, 0);
      }
      .scroll-animate.fade-in-up {
        ${animationProperty};
        animation-name: ${name};
      }
    `;
    this.addStyleToDocument(css);
    return "fade-in-up";
  }

  /**
   * 左からフェードインするアニメーション
   */
  public static fadeInLeft(
    distance: string = "30px",
    options: AnimationOptions = {}
  ): string {
    const name = "scroll-fade-in-left";
    const keyframes = `
      0% {
        opacity: 0;
        transform: translate3d(-${distance}, 0, 0);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    `;
    const animationProperty = this.generateAnimationProperty(options);
    const css = `
      ${this.generateKeyframes(name, keyframes)}
      .scroll-animate-init.fade-in-left {
        opacity: 0;
        transform: translate3d(-${distance}, 0, 0);
      }
      .scroll-animate.fade-in-left {
        ${animationProperty};
        animation-name: ${name};
      }
    `;
    this.addStyleToDocument(css);
    return "fade-in-left";
  }

  /**
   * 右からフェードインするアニメーション
   */
  public static fadeInRight(
    distance: string = "30px",
    options: AnimationOptions = {}
  ): string {
    const name = "scroll-fade-in-right";
    const keyframes = `
      0% {
        opacity: 0;
        transform: translate3d(${distance}, 0, 0);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    `;
    const animationProperty = this.generateAnimationProperty(options);
    const css = `
      ${this.generateKeyframes(name, keyframes)}
      .scroll-animate-init.fade-in-right {
        opacity: 0;
        transform: translate3d(${distance}, 0, 0);
      }
      .scroll-animate.fade-in-right {
        ${animationProperty};
        animation-name: ${name};
      }
    `;
    this.addStyleToDocument(css);
    return "fade-in-right";
  }

  /**
   * ズームインアニメーション
   */
  public static zoomIn(
    scale: number = 0.8,
    options: AnimationOptions = {}
  ): string {
    const name = "scroll-zoom-in";
    const keyframes = `
      0% {
        opacity: 0;
        transform: scale(${scale});
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    `;
    const animationProperty = this.generateAnimationProperty(options);
    const css = `
      ${this.generateKeyframes(name, keyframes)}
      .scroll-animate-init.zoom-in {
        opacity: 0;
        transform: scale(${scale});
      }
      .scroll-animate.zoom-in {
        ${animationProperty};
        animation-name: ${name};
      }
    `;
    this.addStyleToDocument(css);
    return "zoom-in";
  }

  /**
   * ズームアウトアニメーション
   */
  public static zoomOut(
    scale: number = 1.2,
    options: AnimationOptions = {}
  ): string {
    const name = "scroll-zoom-out";
    const keyframes = `
      0% {
        opacity: 0;
        transform: scale(${scale});
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    `;
    const animationProperty = this.generateAnimationProperty(options);
    const css = `
      ${this.generateKeyframes(name, keyframes)}
      .scroll-animate-init.zoom-out {
        opacity: 0;
        transform: scale(${scale});
      }
      .scroll-animate.zoom-out {
        ${animationProperty};
        animation-name: ${name};
      }
    `;
    this.addStyleToDocument(css);
    return "zoom-out";
  }

  /**
   * フリップアニメーション
   */
  public static flip(options: AnimationOptions = {}): string {
    const name = "scroll-flip";
    const keyframes = `
      0% {
        opacity: 0;
        transform: perspective(400px) rotateY(90deg);
      }
      100% {
        opacity: 1;
        transform: perspective(400px) rotateY(0deg);
      }
    `;
    const animationProperty = this.generateAnimationProperty(options);
    const css = `
      ${this.generateKeyframes(name, keyframes)}
      .scroll-animate-init.flip {
        opacity: 0;
        transform: perspective(400px) rotateY(90deg);
      }
      .scroll-animate.flip {
        ${animationProperty};
        animation-name: ${name};
      }
    `;
    this.addStyleToDocument(css);
    return "flip";
  }

  /**
   * バウンスアニメーション
   */
  public static bounce(options: AnimationOptions = {}): string {
    const name = "scroll-bounce";
    const keyframes = `
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-30px);
      }
      60% {
        transform: translateY(-15px);
      }
    `;
    const animationProperty = this.generateAnimationProperty(options);
    const css = `
      ${this.generateKeyframes(name, keyframes)}
      .scroll-animate-init.bounce {
        opacity: 0;
      }
      .scroll-animate.bounce {
        opacity: 1;
        ${animationProperty};
        animation-name: ${name};
      }
    `;
    this.addStyleToDocument(css);
    return "bounce";
  }

  /**
   * カスタムアニメーションを作成
   */
  public static custom(
    className: string,
    keyframes: string,
    initialStyles: string,
    options: AnimationOptions = {}
  ): string {
    const name = `scroll-${className}`;
    const animationProperty = this.generateAnimationProperty(options);
    const css = `
      ${this.generateKeyframes(name, keyframes)}
      .scroll-animate-init.${className} {
        ${initialStyles}
      }
      .scroll-animate.${className} {
        ${animationProperty};
        animation-name: ${name};
      }
    `;
    this.addStyleToDocument(css);
    return className;
  }
}
