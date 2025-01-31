const _ = require("lodash/fp");

const isScalar = (attribute) =>
  _.has("type", attribute) &&
  !["component", "dynamiczone"].includes(attribute.type);

const toOmit = ["_id", "__v", "createdAt", "updatedAt"];

function transformEntry(entry, model) {
  // transform attributes
  const res = {};

  Object.keys(entry).forEach((key) => {
    const attribute = model.attributes[key];

    if (toOmit.includes(key)) {
      return;
    }

    if (!attribute) {
      return;
    }

    if (
      key === "createdAt" &&
      (model.options.timestamps === true ||
        _.isUndefined(model.options.timestamps) ||
        model.options.timestamps[0] === "created_at")
    ) {
      res.created_at = entry.createdAt;
    }

    if (
      key === "updatedAt" &&
      (model.options.timestamps === true ||
        _.isUndefined(model.options.timestamps) ||
        model.options.timestamps[0] === "updated_at")
    ) {
      res.updated_at = entry.updatedAt;
    }

    if (isScalar(attribute)) {
      if (attribute.type === "json") {
        res[key] = JSON.stringify(entry[key]);
        return;
      }

      res[key] = entry[key];
    }
  });

  return res;
}

module.exports = {
  transformEntry,
};
