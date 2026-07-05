import * as cheerio from 'cheerio';
import fs from 'fs';

const URL = 'https://www.game.guide/grow-a-garden-2-value-list';

// Maps the site's item name -> your app's internal item ID
const NAME_TO_ID = {
  // Pets (base/normal form only — see note at the bottom about variants)
  'Turtle': 'p_turtle', 'Ice Serpent': 'p_iceserpent', 'Unicorn': 'p_unicorn',
  'Robin': 'p_robin', 'Bear': 'p_bear', 'Golden Dragonfly': 'p_dragonfly',
  'Bunny': 'p_bunny', 'Owl': 'p_owl', 'Deer': 'p_deer', 'Bee': 'p_bee',
  'Raccoon': 'p_raccoon', 'Monkey': 'p_monkey', 'Frog': 'p_frog',

  // Seeds
  'Ghost Pepper': 's_ghostpepper', 'Poison Ivy': 's_poisonivy', "Dragon's Breath": 's_dragonsbreath',
  'Moon Bloom': 's_moonbloom', 'Venom Spitter': 's_venomspitter', 'Glow Mushroom': 's_glowmushroom',
  'Poison Apple': 's_poisonapple', 'Pomegranate': 's_pomegranate', 'Sunflower': 's_sunflower',
  'Venus Fly Trap': 's_venusflytrap', 'Horned Melon': 's_hornedmelon', 'Hypno Bloom': 's_hypnobloom',
  'Cherry': 's_cherry', 'Baby Cactus': 's_babycactus', 'Acorn': 's_acorn',
  'Dragon Fruit': 's_dragonfruit', 'Mango': 's_mango', 'Coconut': 's_coconut',
  'Grape': 's_grape', 'Pineapple': 's_pineapple', 'Banana': 's_banana',
  'Cactus': 's_cactus', 'Mushroom': 's_mushroom', 'Green Bean': 's_greenbean',
  'Corn': 's_corn', 'Bamboo': 's_bamboo', 'Apple': 's_apple',
  'Tomato': 's_tomato', 'Tulip': 's_tulip', 'Blueberry': 's_blueberry',
  'Strawberry': 's_strawberry', 'Carrot': 's_carrot',
  'Rainbow Seed': 's_rainbowseed', 'Gold Seed': 's_goldseed', 

  // Gear
  'Player Magnet': 'g_playermagnet', 'Wheelbarrow': 'g_wheelbarrow', 'Rare Sprinkler': 'g_sprinkler_r',
  'Super Sprinkler': 'g_sprinkler_s', 'Trowel': 'g_trowel', 'Flashbang': 'g_flashbang',
  'Super Watering Can': 'g_wateringcan_s', 'Shrink Mushroom': 'g_shrinkmushroom', 'Lantern': 'g_lantern',
  'Megaphone': 'g_megaphone', 'Supersize Mushroom': 'g_supersizemushroom', 'Jump Mushroom': 'g_jumpmushroom',
  'Uncommon Sprinkler': 'g_sprinkler_u', 'Speed Mushroom': 'g_speedmushroom', 'Sign': 'g_sign',
  'Legendary Sprinkler': 'g_sprinkler_l', 'Common Sprinkler': 'g_sprinkler_c', 'Common Watering Can': 'g_wateringcan_c',

  function parseValue(text) {
  const m = text.match(/([\d,.]+)\s*(K)?/i);
  if (!m) return null;
  let n = parseFloat(m[1].replace(/,/g, ''));
  if (m[2]) n *= 1000;
  return Math.round(n);
}async function scrape() {
  const res = await fetch(URL, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const $ = cheerio.load(html);

  const results = {};

  // ⚠️ THIS SELECTOR IS A STARTING GUESS — see "Finding the real selector" below
  $('.value-row, .item-row, tr, li').each((i, el) => {
    const rowText = $(el).text().trim();
    if (!rowText) return;

    // skip Big/Mega/Rainbow variant rows for now — base items only
    if (/^(Big|Mega|Rainbow)\s/.test(rowText)) return;

    for (const [siteName, appId] of Object.entries(NAME_TO_ID)) {
      if (rowText.startsWith(siteName)) {
        const value = parseValue(rowText.slice(siteName.length));
        if (value !== null) results[appId] = value;
        break;
      }
    }
  });

  fs.writeFileSync('values.json', JSON.stringify({
    updated: new Date().toISOString(),
    values: results
  }, null, 2));

  console.log(`Wrote ${Object.keys(results).length} values.`);
}

scrape();

  'Gnome': 'g_gnome', 'Invisibility Mushroom': 'g_invismushroom', 'Teleporter': 'g_teleporter',
  'Strawberry Sniper': 'g_strawberrysniper',
};node scrape.js

