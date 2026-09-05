const BrandSettings = require('./settings.model');

const getSettings = async () => {
  return await BrandSettings.getSettings();
};

const updateSettings = async (updateData) => {
  return await BrandSettings.updateSettings(updateData);
};

module.exports = {
  getSettings,
  updateSettings,
};
