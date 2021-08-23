const replaceTemplate = (markup, template) => markup
    .replace(/\{\{(.*?)\}\}/g, (_, target) => template[target] || '');

export default replaceTemplate;
