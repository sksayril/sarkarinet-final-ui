export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior
  });
};

export const scrollToTopInstant = () => {
  scrollToTop('auto');
}; 