const COMPONENT_NAME = 'app-button';

const TYPE_LIST = new Set(['primary', 'secondary']);


class AppButton extends HTMLElement {
  constructor() {
    super();
    this.baseClassName = COMPONENT_NAME;
    this.events = [];
    this.clickEvent = new CustomEvent('onClick', {
      bubbles: true,
    });
  }

  connectedCallback() {
    let classList = [this.baseClassName];
    this.content = this.innerHTML;
    const type = this.getAttribute('type');
    const tag = this.getAttribute('tag') || 'button';
    const customClasses = this.getAttribute('customClasses');
    if (TYPE_LIST.has(type)) {
      classList.push(`${this.baseClassName}_${type}`);
    }

    if (typeof customClasses === 'string') {
      classList = [...classList, ...customClasses.split(' ')];
    }

    const attributes = [`class="${classList.join(' ')}"`];

    if (tag === 'a') {
      attributes.push(`href="${this.getAttribute('href')}"`);
    }


    this.innerHTML = `
            <${tag} ${attributes.join(' ')}> ${this.content}</${tag}>
        `;

    if (typeof this.getAttribute('noClick') !== 'string') {
      this.events = [
        {
          target: this.querySelector(tag),
          event: 'click',
          callback: (e) => {
            e.preventDefault();
            this.dispatchEvent(this.clickEvent);
          },
        },
      ];
    }

    this.events
        .forEach(({target, event, callback}) => {
          target.addEventListener(event, callback);
        });
  }

  attachEvents() {
    this.events
        .forEach(({target, event, callback}) => {
          target.addEventListener(event, callback);
        });
  }

  disconnectedCallback() {
    this.events
        .forEach(({target, event, callback}) => {
          target.removeEventListener(event, callback);
        });
  }
}

window.customElements.define(COMPONENT_NAME, AppButton);

export default COMPONENT_NAME;
