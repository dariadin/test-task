import ModalWindow from '../subcomponents/modal';
import AppButton from '../subcomponents/appButton';

import KEY_CODES from '../../utils/key-codes.js';


const innerHTML = `
  <${ModalWindow}>
    <template type="title">Error</template>
    <template type="body">
      <div class="error">
        <span class="error__message">
          Please add not less than 2 and not more than 5 files.
        </span>
        <${AppButton} type="secondary" customClasses="error__btn">
          OK
        </${AppButton}>
      <div>
    </template>
  </${ModalWindow}>
`;

const COMPONENT_NAME = 'modal-error-window';

class FileLoader extends HTMLElement {
  constructor() {
    super();
    this.closeEvent = new CustomEvent('onClose', {
      bubbles: true,
    });
  }

  connectedCallback() {
    this.innerHTML = innerHTML;
    this.events = [
      {
        target: this.querySelector(ModalWindow),
        event: 'click',
        callback: (e) => {
          e.preventDefault();
          this.dispatchEvent(this.closeEvent);
        },
      },
      {
        target: this.querySelector(AppButton),
        event: 'click',
        callback: (e) => {
          e.preventDefault();
          this.dispatchEvent(this.closeEvent);
        },
      },
      {
        target: document,
        event: 'keyup',
        callback: (e) => {
          e.preventDefault();

          if (e.keyCode === KEY_CODES.ENTER || e.keyCode === KEY_CODES.ESC) {
            this.dispatchEvent(this.closeEvent);
          }
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
