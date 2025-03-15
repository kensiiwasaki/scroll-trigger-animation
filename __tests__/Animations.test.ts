/**
 * Animationsクラスのテスト
 */

import { Animations } from "../src/animations";

describe("Animations", () => {
  beforeEach(() => {
    // テスト前に既存のスタイル要素を削除
    const existingStyle = document.getElementById("scroll-trigger-animations");
    if (existingStyle) {
      existingStyle.remove();
    }

    // DOMをセットアップ
    document.body.innerHTML = `
      <div id="test-element" class="test-element">テスト要素</div>
    `;
  });

  afterEach(() => {
    // クリーンアップ
    document.body.innerHTML = "";
  });

  test("applyBaseStylesメソッドが基本的なスタイルを適用すること", () => {
    Animations.applyBaseStyles();

    // スタイル要素が作成されていることを確認
    const styleElement = document.getElementById("scroll-trigger-animations");
    expect(styleElement).not.toBeNull();

    // スタイルの内容を確認
    if (styleElement) {
      expect(styleElement.textContent).toContain(".scroll-animate-init");
      expect(styleElement.textContent).toContain(".scroll-animate");
      expect(styleElement.textContent).toContain("opacity: 0");
      expect(styleElement.textContent).toContain("opacity: 1");
    }
  });

  test("fadeInメソッドがフェードインアニメーションを適用すること", () => {
    const className = Animations.fadeIn();

    // 返されたクラス名を確認
    expect(className).toBe("fade-in");

    // スタイル要素が作成されていることを確認
    const styleElement = document.getElementById("scroll-trigger-animations");
    expect(styleElement).not.toBeNull();

    // スタイルの内容を確認
    if (styleElement) {
      expect(styleElement.textContent).toContain("@keyframes scroll-fade-in");
      expect(styleElement.textContent).toContain("0% { opacity: 0; }");
      expect(styleElement.textContent).toContain("100% { opacity: 1; }");
    }
  });

  test("fadeInUpメソッドが下からフェードインするアニメーションを適用すること", () => {
    const className = Animations.fadeInUp("50px");

    // 返されたクラス名を確認
    expect(className).toBe("fade-in-up");

    // スタイル要素が作成されていることを確認
    const styleElement = document.getElementById("scroll-trigger-animations");
    expect(styleElement).not.toBeNull();

    // スタイルの内容を確認
    if (styleElement) {
      expect(styleElement.textContent).toContain(
        "@keyframes scroll-fade-in-up"
      );
      expect(styleElement.textContent).toContain(
        "transform: translate3d(0, 50px, 0)"
      );
      expect(styleElement.textContent).toContain(
        "transform: translate3d(0, 0, 0)"
      );
    }
  });

  test("zoomInメソッドがズームインアニメーションを適用すること", () => {
    const className = Animations.zoomIn(0.5);

    // 返されたクラス名を確認
    expect(className).toBe("zoom-in");

    // スタイル要素が作成されていることを確認
    const styleElement = document.getElementById("scroll-trigger-animations");
    expect(styleElement).not.toBeNull();

    // スタイルの内容を確認
    if (styleElement) {
      expect(styleElement.textContent).toContain("@keyframes scroll-zoom-in");
      expect(styleElement.textContent).toContain("transform: scale(0.5)");
      expect(styleElement.textContent).toContain("transform: scale(1)");
    }
  });

  test("customメソッドでカスタムアニメーションを作成できること", () => {
    const className = Animations.custom(
      "custom-animation",
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

    // 返されたクラス名を確認
    expect(className).toBe("custom-animation");

    // スタイル要素が作成されていることを確認
    const styleElement = document.getElementById("scroll-trigger-animations");
    expect(styleElement).not.toBeNull();

    // スタイルの内容を確認
    if (styleElement) {
      expect(styleElement.textContent).toContain(
        "@keyframes scroll-custom-animation"
      );
      expect(styleElement.textContent).toContain("transform: rotate(45deg)");
      expect(styleElement.textContent).toContain("transform: rotate(0)");
      expect(styleElement.textContent).toContain("0.8s ease-out");
    }
  });

  test("複数のアニメーションを登録した場合、最後のアニメーションのスタイルが適用されること", () => {
    Animations.fadeIn();
    Animations.fadeInUp();

    // スタイル要素が1つだけ作成されていることを確認
    const styleElements = document.querySelectorAll(
      "#scroll-trigger-animations"
    );
    expect(styleElements.length).toBe(1);

    // 両方のアニメーションのスタイルが含まれていることを確認
    const styleElement = document.getElementById("scroll-trigger-animations");
    if (styleElement) {
      expect(styleElement.textContent).toContain(
        "@keyframes scroll-fade-in-up"
      );
      // fadeInのスタイルは上書きされているはず
      expect(styleElement.textContent).not.toContain(
        "@keyframes scroll-fade-in"
      );
    }
  });
});
