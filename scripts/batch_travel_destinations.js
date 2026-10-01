const fs = require('fs');
const path = require('path');

const PROMPTS_FILE = path.resolve(__dirname, '../prompts_travel_destinations.json');
const TRAVEL_DESTINATIONS_LIST = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf-8'));

module.exports = {
  TRAVEL_DESTINATIONS_LIST
};
