const path = require('path');
const { FILE_EXT_REGEX } = require ('./constants');

const isFileTypeValid = (file, errors) => {
  // Check the extensions
  const extName = FILE_EXT_REGEX.test(path.extname(file.originalname).toLowerCase());
  // Check the mime. FileType like jpg is included in mimetype: 'image/jpg'
  const mimetype = FILE_EXT_REGEX.test(file.mimetype);

  if(extName && mimetype) {
    return true;
  } else {
      const shortTypeOfFile = file.mimetype.substring(file.mimetype.indexOf('/') + 1);
      errors.push(`Please use .jpeg, .jpg, .png, .gif files only. File type ${shortTypeOfFile} is not an acceptable image type.`);
      return false;
  }
}

const isImageValid = (file, errors) => {
  return isFileTypeValid(file, errors);
}

module.exports = {  
  isImageValid
}