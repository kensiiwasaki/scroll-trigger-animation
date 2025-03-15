/**
 * ScrollTriggerクラスのテスト
 */

import ScrollTrigger from "../src/index";

// IntersectionObserverのモック
class MockIntersectionObserver {
  readonly root: Element | Document | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;

  callback: IntersectionObserverCallback;
  elements: Element[] = [];

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    this.callback = callback;
    this.root = options?.root || null;
    this.rootMargin = options?.rootMargin || "0px";
    this.thresholds = Array.isArray(options?.threshold)
      ? options.threshold
      : [options?.threshold || 0];
  }

  observe(element: Element): void {
    this.elements.push(element);
  }

  unobserve(element: Element): void {
    this.elements = this.elements.filter((el) => el !== element);
  }

  disconnect(): void {
    this.elements = [];
  }

  // テスト用にIntersectionを発火させるメソッド
  triggerIntersection(elements: Element[], isIntersecting: boolean): void {
    const entries: IntersectionObserverEntry[] = elements.map(
      (element) =>
        ({
          boundingClientRect: element.getBoundingClientRect(),
          intersectionRatio: isIntersecting ? 1 : 0,
          intersectionRect: isIntersecting
            ? element.getBoundingClientRect()
            : new DOMRect(),
          isIntersecting,
          rootBounds:
            this.root instanceof Element
              ? this.root.getBoundingClientRect()
              : null,
          target: element,
          time: Date.now(),
        } as IntersectionObserverEntry)
    );

    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

// グローバルにIntersectionObserverをモック
declare const global: {
  IntersectionObserver: typeof IntersectionObserver;
  [key: string]: any;
};
global.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;

describe("ScrollTrigger", () => {
  let scrollTrigger: ScrollTrigger;
  let mockObserver: MockIntersectionObserver;

  beforeEach(() => {
    // DOMをセットアップ
    document.body.innerHTML = `
      <div id="test-element-1" class="test-element">テスト要素1</div>
      <div id="test-element-2" class="test-element">テスト要素2</div>
    `;

    // ScrollTriggerインスタンスを作成
    scrollTrigger = new ScrollTrigger();

    // モックされたIntersectionObserverを取得
    mockObserver = (scrollTrigger as any).observer as MockIntersectionObserver;
  });

  afterEach(() => {
    // クリーンアップ
    document.body.innerHTML = "";
    scrollTrigger.destroy();
  });

  test("コンストラクタでデフォルトオプションが設定されること", () => {
    expect((scrollTrigger as any).options).toEqual(
      expect.objectContaining({
        animationClass: "scroll-animate",
        initialClass: "scroll-animate-init",
        delay: 0,
        threshold: 0.1,
        once: true,
      })
    );
  });

  test("add()メソッドで要素を監視対象に追加できること", () => {
    const element = document.getElementById("test-element-1");
    if (!element) throw new Error("テスト要素が見つかりません");

    scrollTrigger.add(element);

    // 要素が監視対象に追加されていることを確認
    expect(mockObserver.elements).toContain(element);

    // 初期クラスが追加されていることを確認
    expect(element.classList.contains("scroll-animate-init")).toBe(true);
  });

  test("add()メソッドでセレクタを使って要素を追加できること", () => {
    scrollTrigger.add(".test-element");

    // 2つの要素が監視対象に追加されていることを確認
    expect(mockObserver.elements.length).toBe(2);

    const element1 = document.getElementById("test-element-1");
    const element2 = document.getElementById("test-element-2");

    if (!element1 || !element2) throw new Error("テスト要素が見つかりません");

    expect(mockObserver.elements).toContain(element1);
    expect(mockObserver.elements).toContain(element2);
  });

  test("remove()メソッドで要素の監視を解除できること", () => {
    const element = document.getElementById("test-element-1");
    if (!element) throw new Error("テスト要素が見つかりません");

    scrollTrigger.add(element);
    expect(mockObserver.elements).toContain(element);

    scrollTrigger.remove(element);
    expect(mockObserver.elements).not.toContain(element);
  });

  test("destroy()メソッドですべての要素の監視を解除できること", () => {
    scrollTrigger.add(".test-element");
    expect(mockObserver.elements.length).toBe(2);

    scrollTrigger.destroy();
    expect(mockObserver.elements.length).toBe(0);
  });

  test("要素がビューポートに入ったときにアニメーションクラスが追加されること", () => {
    jest.useFakeTimers();

    const element = document.getElementById("test-element-1");
    if (!element) throw new Error("テスト要素が見つかりません");

    // コールバック関数をモック
    const onBeforeAnimate = jest.fn();
    const onAfterAnimate = jest.fn();

    scrollTrigger = new ScrollTrigger({
      onBeforeAnimate,
      onAfterAnimate,
    });

    mockObserver = (scrollTrigger as any).observer as MockIntersectionObserver;

    scrollTrigger.add(element);

    // 要素がビューポートに入ったことをシミュレート
    mockObserver.triggerIntersection([element], true);

    // onBeforeAnimateが呼ばれたことを確認
    expect(onBeforeAnimate).toHaveBeenCalledWith(element);

    // 遅延時間が0なので、すぐにアニメーションクラスが追加されるはず
    jest.runAllTimers();

    // 初期クラスが削除されていることを確認
    expect(element.classList.contains("scroll-animate-init")).toBe(false);

    // アニメーションクラスが追加されていることを確認
    expect(element.classList.contains("scroll-animate")).toBe(true);

    // onAfterAnimateが呼ばれたことを確認
    expect(onAfterAnimate).toHaveBeenCalledWith(element);

    jest.useRealTimers();
  });

  test("遅延時間を指定した場合、指定時間後にアニメーションクラスが追加されること", () => {
    jest.useFakeTimers();

    const element = document.getElementById("test-element-1");
    if (!element) throw new Error("テスト要素が見つかりません");

    scrollTrigger = new ScrollTrigger({
      delay: 500, // 500ミリ秒の遅延
    });

    mockObserver = (scrollTrigger as any).observer as MockIntersectionObserver;

    scrollTrigger.add(element);

    // 要素がビューポートに入ったことをシミュレート
    mockObserver.triggerIntersection([element], true);

    // 遅延時間前はアニメーションクラスが追加されていないことを確認
    expect(element.classList.contains("scroll-animate")).toBe(false);

    // 遅延時間の半分だけ進める
    jest.advanceTimersByTime(250);
    expect(element.classList.contains("scroll-animate")).toBe(false);

    // 残りの時間を進める
    jest.advanceTimersByTime(250);

    // アニメーションクラスが追加されていることを確認
    expect(element.classList.contains("scroll-animate")).toBe(true);

    jest.useRealTimers();
  });

  test("once: trueの場合、アニメーション後に要素の監視が解除されること", () => {
    jest.useFakeTimers();

    const element = document.getElementById("test-element-1");
    if (!element) throw new Error("テスト要素が見つかりません");

    scrollTrigger = new ScrollTrigger({
      once: true,
    });

    mockObserver = (scrollTrigger as any).observer as MockIntersectionObserver;

    scrollTrigger.add(element);

    // 要素がビューポートに入ったことをシミュレート
    mockObserver.triggerIntersection([element], true);

    // タイマーを進める
    jest.runAllTimers();

    // 要素の監視が解除されていることを確認
    expect(mockObserver.elements).not.toContain(element);

    jest.useRealTimers();
  });

  test("once: falseの場合、アニメーション後も要素の監視が継続されること", () => {
    jest.useFakeTimers();

    const element = document.getElementById("test-element-1");
    if (!element) throw new Error("テスト要素が見つかりません");

    scrollTrigger = new ScrollTrigger({
      once: false,
    });

    mockObserver = (scrollTrigger as any).observer as MockIntersectionObserver;

    scrollTrigger.add(element);

    // 要素がビューポートに入ったことをシミュレート
    mockObserver.triggerIntersection([element], true);

    // タイマーを進める
    jest.runAllTimers();

    // 要素の監視が継続されていることを確認
    expect(mockObserver.elements).toContain(element);

    jest.useRealTimers();
  });
});
