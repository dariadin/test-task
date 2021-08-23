const getColorBySelector = (selector) =>
  getComputedStyle(document.documentElement)
      .getPropertyValue(selector);

const setColor = (cssVariable, color) =>
  document.documentElement.style
      .setProperty(cssVariable, color);

const setColorScheme = (isAlternativeScheme) => {
  const colorSelectorPrefix = isAlternativeScheme ? 'alternative' : 'default';
  const bgColorSelector = `--${colorSelectorPrefix}-bg-color`;
  const borderColorSelector = `--${colorSelectorPrefix}-border-color`;
  const bgColor = getColorBySelector(bgColorSelector);
  const borderColor = getColorBySelector(borderColorSelector);

  setColor('--bg-color', bgColor);
  setColor('--border-color', borderColor);
};


export default setColorScheme;
