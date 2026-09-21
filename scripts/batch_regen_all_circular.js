const fs = require('fs');
const path = require('path');
const { regenerateOne, sleep } = require('./regenerate_target');

const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to load items from data.js
function getCollectionItems(collectionKey) {
  const dataPath = path.resolve(__dirname, '../data.js');
  delete require.cache[dataPath];
  global.window = {};
  require(dataPath);
  return window.COLLECTIONS[collectionKey].items;
}

const TASKS = {
  marine: [1, 3, 7, 18],
  games: [16, 20, 21],
  atmosphere: [1, 2, 3, 6, 8, 9, 12, 20],
  scenic_spots: [2, 4, 16, 25, 27, 28, 38, 48, 50],
  poetry: [4, 6, 15, 21, 22, 23, 24, 28, 30, 42, 43, 46, 48]
};

async function runCollection(collectionKey, specificIds = null) {
  const allItems = getCollectionItems(collectionKey);
  const targetIds = specificIds || TASKS[collectionKey];

  console.log(`\n======================================================`);
  console.log(`>>> Starting [${collectionKey}] batch (${targetIds.length} items)`);
  console.log(`Target IDs: ${targetIds.join(', ')}`);
  console.log(`======================================================\n`);

  for (let i = 0; i < targetIds.length; i++) {
    const id = targetIds[i];
    const item = allItems.find(x => x.id === id);
    if (!item) {
      console.warn(`Item ${id} not found in collection ${collectionKey}`);
      continue;
    }

    const task = {
      collection: collectionKey,
      id: item.id,
      name: item.name,
      targetPng: item.output,
      prompt: item.prompt
    };

    console.log(`[${i + 1}/${targetIds.length}] Regenerating ${collectionKey} #${id} (${item.name})...`);
    const success = await regenerateOne(task);
    if (!success) {
      console.error(`Failed ${collectionKey} #${id}`);
    }

    if (i < targetIds.length - 1) {
      console.log('Cooldown 8s before next item...');
      await sleep(8000);
    }
  }

  console.log(`\n>>> Finished [${collectionKey}] batch!\n`);
}

async function main() {
  const args = process.argv.slice(2);
  // Usage: node scripts/batch_regen_all_circular.js [collection] [ids...]
  if (args.length > 0) {
    const coll = args[0];
    const ids = args.slice(1).map(Number).filter(n => !isNaN(n));
    await runCollection(coll, ids.length > 0 ? ids : null);
  } else {
    // Run all sequentially
    for (const coll of Object.keys(TASKS)) {
      await runCollection(coll);
      console.log(`Waiting 15s between collections...`);
      await sleep(15000);
    }
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Batch runner error:', err);
    process.exit(1);
  });
}

module.exports = { getCollectionItems, runCollection, TASKS };
