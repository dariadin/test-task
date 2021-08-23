import {get} from 'underscore';
import {DEFAULT_FILE_THUMB, MAX_FILE_SIZE} from '../constants';

export const getFileSize = (file, withoutPostfix) => {
  const sizeInBytes = get(file, 'size', 0);
  if (!sizeInBytes) {
    return sizeInBytes;
  }

  return withoutPostfix ?
      (sizeInBytes / (1024*1024)).toFixed(2) :
      (sizeInBytes / (1024*1024)).toFixed(2) + 'mb';
};

export const getFileName = (file) => get(file, 'name', '');

export const getFileThumb = (file) => {
  const reader = new FileReader();

  const hasCorrectSize = getFileSize(file, true) <= MAX_FILE_SIZE;
  const hasCorrectType = (/image/).test(file.type);

  return new Promise((resolve) => {
    if (hasCorrectType && hasCorrectSize) {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => {
        resolve(DEFAULT_FILE_THUMB);
      };
      reader.readAsDataURL(file);
    } else {
      resolve(DEFAULT_FILE_THUMB);
    }
  });
};
