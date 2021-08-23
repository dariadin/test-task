import {get, throttle} from 'underscore';
import {DEFAULT_FILE_THUMB} from '../../../constants';
import {
  getFileSize,
  getFileName,
  getFileThumb,
} from '../../../utils/file';
import replaceTemplate from '../../../utils/replaceTemplate';

const innerHTML = `
  <div class="file">
    <div class="file__icon" style="background-image:url('{{fileThumb}}')"></div>
    <span class="file__name">{{fileName}}</span>
    <div class="file__size">{{fileSize}}</div>
  </div>
`;

const COMPONENT_NAME = 'files-component';
const DRAG_CLASS_NAME = 'file_drag';

const setElementPosition = (element, x, y) => {
  element.style.left = x ? x + 'px' : null;
  element.style.top = y ? y+ 'px': null;
};

const handlePanStart = (e, originalElement) => {
  originalElement.classList.add(DRAG_CLASS_NAME);
};

const handlePanEnd = (e, originalElement, ctx) => {
  setElementPosition(originalElement);
  originalElement.classList.remove(DRAG_CLASS_NAME);
  const movedEvent = new CustomEvent('movedEvent', {
    bubbles: true,
    detail: {
      index: ctx.getAttribute('fileIndex'),
      horisontalCenter: e.center.x,
    },
  });
  ctx.dispatchEvent(movedEvent);
};

const handlePanMove = (e, originalElement) => {
  setElementPosition(originalElement, e.deltaX, e.deltaY);
};
class FilesContainer extends HTMLElement {
  constructor() {
    super();
    this.data;
  }

  connectedCallback() {
    this.data = get(window, ['fileStorage', this.getAttribute('fileIndex')]);
    if (!this.data) {
      this.innerHTML = '<b></b>';
      return;
    }
    this.innerHTML = this.getMarkup();

    this.attachEvents();
  }

  getMarkup() {
    const file = this.data;
    const templates = {
      fileName: getFileName(file),
      fileSize: getFileSize(file),
      fileThumb: DEFAULT_FILE_THUMB,
    };

    getFileThumb(file).then((img) => {
      const imgContainer = this.querySelector('.file__icon');
      imgContainer.style.backgroundImage = `url(${img})`;
    });

    return replaceTemplate(innerHTML, templates);
  }

  attachEvents() {
    const element = this.querySelector('.file');
    const draggbleEllement = new Hammer(element);
    const carriedMoveHandeler = (e) => handlePanMove(e, element);
    const throttledPanMove = throttle(carriedMoveHandeler, 50);
    draggbleEllement.on('panstart', (e) => handlePanStart(e, element));
    draggbleEllement.on('panend', (e) => handlePanEnd(e, element, this));
    draggbleEllement.on('panmove', (e) => throttledPanMove(e, element));
  }
}

window.customElements.define(COMPONENT_NAME, FilesContainer);

export default COMPONENT_NAME;
