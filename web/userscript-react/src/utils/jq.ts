export function isElementInViewport($element: JQuery<HTMLElement>) {
    if (!$element.length) {
        return false; // 元素不存在
    }

    const rect = $element[0].getBoundingClientRect();
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= windowHeight //&&        rect.right <= windowWidth
    );
}