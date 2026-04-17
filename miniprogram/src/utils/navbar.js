/**
 * 获取导航栏信息，适配小程序胶囊按钮和 H5
 * 返回 { top, height }：
 *   top = 标题行顶部距离屏幕顶部的距离（px）
 *   height = 标题行高度（px），与胶囊按钮对齐
 */
export function getNavBarInfo() {
  let top = 0;
  let height = 44;

  try {
    const sysInfo = uni.getSystemInfoSync();
    const statusBarHeight = sysInfo.statusBarHeight || 0;

    // 尝试获取胶囊按钮信息（仅小程序有此 API）
    if (typeof uni.getMenuButtonBoundingClientRect === 'function') {
      const menuBtn = uni.getMenuButtonBoundingClientRect();
      if (menuBtn && menuBtn.top > 0) {
        top = menuBtn.top;
        height = menuBtn.height;
        return { top, height };
      }
    }

    // H5 或获取胶囊失败的兜底
    top = statusBarHeight;
    height = 44;
  } catch (e) {}

  return { top, height };
}
