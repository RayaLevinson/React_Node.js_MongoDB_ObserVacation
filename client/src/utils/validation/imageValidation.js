import {
  FILE_EXT_REGEX,
  CHOOSE_FILE,
  MAX_FILE_UPLOAD_SIZE_IN_BYTES,
} from './constants';

// Image validation
export const isImageValid = (inputValues, errors) => {
  const { fileName, image } = inputValues;
  if (!fileName || fileName === CHOOSE_FILE) {
    errors.push(' Please add a fileName');
    return false;
  }

  return isFileTypeValid(fileName, errors) && isFileSizeValid(image, errors);
}

// Check file name extension
const isFileTypeValid = (fileName, errors) => {
  if (!FILE_EXT_REGEX.test(fileName.toLowerCase())) {
    const fileExt = fileName.substring(fileName.lastIndexOf('.') + 1);
    errors.push(`Please use .jpeg, .jpg, .png, .gif files only. File type ${fileExt} is not an acceptable image type.`);
    return false;
  }
  return true;
}

// Check file size
const isFileSizeValid = (image, errors) => {
  if (image.size > MAX_FILE_UPLOAD_SIZE_IN_BYTES) {
    const message = `Please upload an image up to ${MAX_FILE_UPLOAD_SIZE_IN_BYTES} bytes.`;

    errors.push(message);
    return false;
  }
  return true;
}
