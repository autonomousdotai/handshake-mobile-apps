
const isExtension = () => {
  return window.self !== window.top;
};

export { isExtension };
