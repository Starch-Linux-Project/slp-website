/* Keep two complete articles visible, including when text wraps on smaller screens. */
document.querySelectorAll('.wiki-category ul[tabindex]').forEach(list => {
  const first = list.children[0];
  const second = list.children[1];
  const resizeList = () => {
    const height = second.getBoundingClientRect().bottom - first.getBoundingClientRect().top;
    list.style.maxHeight = `${height}px`;
  };

  resizeList();
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(resizeList);
    observer.observe(first);
    observer.observe(second);
  } else {
    window.addEventListener('resize', resizeList);
  }
});
