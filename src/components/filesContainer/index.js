import {get} from 'underscore';


import AppButton from '../subcomponents/appButton';
import FileComponent from '../subcomponents/file';

const innerHTML = `
  <div class="files-container">
  </div>
`;

const COMPONENT_NAME = 'files-container';

class FilesContainer extends HTMLElement {
  constructor() {
    super();
  }


  connectedCallback() {
    this.innerHTML = innerHTML;
    this.containerElement = this.querySelector('.files-container');
    this.renderFilesByOrder();
    this.events = [
      {
        target: this.containerElement,
        event: 'movedEvent',
        callback: (e) => {
          e.preventDefault();
          this.reorderFiles(e.detail.index, e.detail.horisontalCenter);
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

  reorderFiles(movedComponentIndex, movedHorisontalCenter) {
    const fileComponents = this.containerElement
        .querySelectorAll(FileComponent);
    const componentsCenters = Array.from(fileComponents)
        .map((fileComponent, idx) => ({
          index: idx,
          center: idx == movedComponentIndex
            // eslint-disable-next-line operator-linebreak
            ? movedHorisontalCenter
            // eslint-disable-next-line operator-linebreak
            : this.getElementHorisontalCenter(fileComponent),
        }));

    const oldOrdersFiles = Array.from(get(window, 'fileStorage', []));
    componentsCenters
        .sort((a, b) => a.center - b.center)
        .forEach((compenentCenter, index) => {
          window.fileStorage[index] = oldOrdersFiles[compenentCenter.index];
        });
    this.renderFilesByOrder();
  }

  getElementHorisontalCenter(fileComponent) {
    const {width, x} = fileComponent.getBoundingClientRect();
    return x + width / 2;
  }

  renderFilesByOrder() {
    const files = get(window, 'fileStorage', []);
    this.containerElement.innerHTML = '';
    files.forEach((_, index) => {
      this.containerElement.innerHTML += `
        <${FileComponent} fileIndex="${index}"></${FileComponent}>
      `;
    });
  }
}

window.customElements.define(COMPONENT_NAME, FilesContainer);

export default COMPONENT_NAME;
