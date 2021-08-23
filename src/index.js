import './styles/common.scss';
import './components/fileLoader/styles.scss';
import './components/errorModal/styles.scss';
import './components/filesContainer/styles.scss';

import './components/subcomponents/appButton/styles.scss';
import './components/subcomponents/modal/styles.scss';
import './components/subcomponents/file/styles.scss';

import fileLoaderForm from './components/fileLoader';
import errModalWindow from './components/errorModal';
import filesContainer from './components/filesContainer';

import {MAX_FILES_QUANTITY, MIN_FILES_QUANTITY} from './constants';
import StateMachine from './utils/state-machine';
import Validator from './utils/validator';
import {
  maxLengthStrategy,
  minLengthStrategy,
} from './utils/validator/strategies';
import setColorScheme from './utils/set-color-scheme';

let rootNode;

const validator = new Validator([
  (value) => maxLengthStrategy(value, MAX_FILES_QUANTITY),
  (value) => minLengthStrategy(value, MIN_FILES_QUANTITY),
]);

const APP_STATES = {
  init: {
    init() {
      setColorScheme();
      rootNode = document.getElementById('root-app');
      this.dispatch(
          'clearRoot',
          {
            nextState: 'init',
            nextMethod: 'initFileLoader',
          },
      );
    },

    clearRoot({nextState, args = [], nextMethod} = {}) {
      rootNode.innerHTML = '';
      if (nextState && nextMethod) {
        this.setState(nextState);
        this.dispatch(nextMethod, ...args);
      }
    },

    initFileLoader() {
      const fileLoader = document.createElement(fileLoaderForm);
      const onFileLoaded = (event) => {
        fileLoader.removeEventListener('onFileLoaded', onFileLoaded);
        this.dispatch('clearRoot', {
          nextState: 'loadFiles',
          nextMethod: 'validateFiles',
          args: [event.detail],
        });
      };
      rootNode.appendChild(fileLoader);

      fileLoader.addEventListener('onFileLoaded', onFileLoaded);
    },
  },
  loadFiles: {
    validateFiles(fileList) {
      const errors = validator.validate(fileList);
      this.setState('init');
      if (errors.length) {
        errors.forEach(console.error);
        this.dispatch('clearRoot', {
          nextState: 'loadFiles',
          nextMethod: 'requestValidationFix',
          args: [],
        });
        return;
      }
      this.dispatch('clearRoot', {
        nextState: 'loadFiles',
        nextMethod: 'showFiles',
        args: Array.from(fileList),
      });
    },

    requestValidationFix() {
      const modalWindowElement = document.createElement(errModalWindow);
      const onClose = () => {
        modalWindowElement.removeEventListener('onClose', onClose);
        this.setState('init');
        this.dispatch('clearRoot', {
          nextState: 'init',
          nextMethod: 'initFileLoader',
        });
      };

      modalWindowElement.addEventListener('onClose', onClose);
      rootNode.appendChild(modalWindowElement);
    },

    showFiles(...files) {
      /*
        hack, because we can't pass the file through the attribute
      */
      window.fileStorage = files;
      setColorScheme(true);
      const filesContainerElement = document.createElement(filesContainer);
      rootNode.appendChild(filesContainerElement);
    },
  },
};
const appState = new StateMachine(APP_STATES, 'init');

window.onload = () => appState.dispatch('init');
