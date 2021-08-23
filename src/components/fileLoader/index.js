import AppButton from '../subcomponents/appButton';


const innerHTML = `
  <form class="add-files-form">
    <app-button type="primary" 
                tag="label" 
                noClick 
                customClasses="add-files-form__btn"
    >
      Add file
      <input id="files-input" type="file" name="file" multiple hidden>
    </app-button>
  </form>
`;

const COMPONENT_NAME = 'file-loader';

class FileLoader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = innerHTML;
    this.events = [
      {
        target: this.querySelector('#files-input'),
        event: 'change',
        callback: (e) => {
          e.preventDefault();
          this.dispatchEvent(new CustomEvent('onFileLoaded', {
            bubbles: true,
            detail: e.target.files,
          }));
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
