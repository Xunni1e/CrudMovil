const ObjectId = require("mongoose").Types.ObjectId;

// Validator function para ver si es un MongoBDId
function isValidObjectId(id) {
    if (ObjectId.isValid(id)) {
      if (String(new ObjectId(id)) === id) return true;
      return false;
    }
    return false;
  }

  
  module.exports = {
    isValidObjectId,
  };
