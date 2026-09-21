const fs = require('fs');
const path = require('path');
const { ITEMS, buildPrompt } = require('./batch_china_cities');
const { regenerateOne, sleep } = require('./regenerate_target');

const CIRCULAR_IDS = [5, 6, 7, 9, 15, 17, 19, 29];

async function main() {
  const args = process.argv.slice(2);
  let targetIds = CIRCULAR_IDS;
  if (args.length > 0) {
    targetIds = args.map(Number).filter(n => !isNaN(n));
  }

  console.log(`=== Starting Batch Regeneration for China Cities (${targetIds.length} items) ===`);
  console.log(`Target IDs: ${targetIds.join(', ')}\n`);

  for (let i = 0; i < targetIds.length; i++) {
    const id = targetIds[i];
    const item = ITEMS.find(it => it.id === id);
    if (!item) {
      console.warn(`Item with ID ${id} not found!`);
      continue;
    }

    const task = {
      collection: 'china_cities',
      id: item.id,
      name: item.name,
      targetPng: `images/china_cities/${item.file}`,
      prompt: buildPrompt(item)
    };

    console.log(`\n[${i + 1}/${targetIds.length}] Processing ID ${id} (${item.city})...`);
    const success = await regenerateOne(task);
    if (!success) {
      console.error(`Failed ID ${id}, continuing to next...`);
    }

    if (i < targetIds.length - 1) {
      console.log('Cooldown 8s before next item...');
      await sleep(8000);
    }
  }

  console.log('\n=== Batch Regeneration Complete for China Cities! ===');
}

main().catch(err => {
  console.error('Error in batch regen:', err);
  process.exit(1);
});
