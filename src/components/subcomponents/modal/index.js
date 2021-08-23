import replaceTemplate from '../../../utils/replaceTemplate';


const innerHTML = `
<div class="modal">
  <div class="modal__backface"></div>
  <div class="modal__content modal-content">
    <div class="modal-content__header">
      <button class="modal__close"></button>
      <h2 class="modal-content__title">
        {{title}}
      </h2>
    </div>
    <div class="modal-content__body">
      {{body}}
    </div>
  </div>
</div>
`;

const COMPONENT_NAME = 'modal-window';

class FileLoader extends HTMLElement {
  constructor() {
    super();
    this.closeEvent = new CustomEvent('onClose', {
      bubbles: true,
    });
  }

  replceTemplateContent() {
    const templates = {};
    Array.from(this.querySelectorAll('template'))
        .forEach((template) => {
          const type = template.getAttribute('type');
          templates[type] = template.cloneNode(true).innerHTML;
        });
    return replaceTemplate(innerHTML, templates);
  }
  connectedCallback() {
    //
    this.innerHTML = this.replceTemplateContent();
    this.events = [
      {
        target: this.querySelector('.modal__close'),
        event: 'click',
        callback: (e) => {
          e.preventDefault();
          this.dispatchEvent(this.closeEvent);
        },
      },
      {
        target: this.querySelector('.modal__backface'),
        event: 'click',
        callback: (e) => {
          e.preventDefault();
          this.dispatchEvent(this.closeEvent);
        },
      },
    ];

    this.attachEvents();
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

window.customElements.define(COMPONENT_NAME, FileLoader);

export default COMPONENT_NAME;
