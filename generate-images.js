#!/usr/bin/env node
/**
 * CARWO GOBSAN Image Generator
 * Generates stunning hero and category images using aisonnet API
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_BASE = 'newapi.aisonnet.org';
const API_KEY = 'sk-VHuUke4ZhND9QwxNNbtwk9zFsVR5pPQ5ThOTQNj4AAm7lOhK';
const MODEL = 'gemini-2.5-flash-image';

// CARWO GOBSAN brand colors: Red #E60000, Black #111111, White #F9F9F9
const images = [
  // Hero Slides
  {
    name: 'hero-slide-1-kitchenware',
    path: 'public/images/new-hero/hero-slide-1-kitchenware.png',
    prompt: 'Premium kitchen essentials hero banner for e-commerce website, modern Somali home, elegant stainless steel pots and cookware displayed on dark marble countertop, professional studio lighting, dramatic shadows, red accent lighting, black background, high-end minimalist aesthetic, photorealistic, commercial photography style, wide angle composition'
  },
  {
    name: 'hero-slide-2-appliances',
    path: 'public/images/new-hero/hero-slide-2-appliances.png',
    prompt: 'Modern home appliances hero banner, sleek blender, rice cooker, electric kettle arrangement on contemporary kitchen counter, dramatic product photography, dark background with red glow accents, premium lifestyle setting, professional lighting, clean minimalist composition, black theme, photorealistic'
  },
  {
    name: 'hero-slide-3-tableware',
    path: 'public/images/new-hero/hero-slide-3-tableware.png',
    prompt: 'Elegant tableware collection hero banner, fine ceramic dinner plates and bowls with gold rim details, arranged on dark wooden table, sophisticated dining setting, professional product photography, dramatic lighting with red accent glow, black background, premium luxury aesthetic, photorealistic'
  },
  // Category Images
  {
    name: 'category-cookware',
    path: 'public/images/new-categories/category-cookware.png',
    prompt: 'Cookware category image for e-commerce, premium stainless steel pots and pans, non-stick frying pans, pressure cookers arranged beautifully, dark background with red accent lighting, professional product photography, high-end kitchenware, photorealistic'
  },
  {
    name: 'category-small-appliances',
    path: 'public/images/new-categories/category-small-appliances.png',
    prompt: 'Small appliances category image for e-commerce, electric kettle, blender, toaster, rice cooker arranged on modern kitchen counter, dark background with red accent lighting, professional product photography, sleek modern design, photorealistic'
  },
  {
    name: 'category-tableware',
    path: 'public/images/new-categories/category-tableware.png',
    prompt: 'Tableware category image for e-commerce, elegant ceramic dinner plates, bowls, cups and cutlery set, arranged on dark wooden table with linen napkin, professional product photography, dark background with red accent lighting, photorealistic'
  },
  {
    name: 'category-electronics',
    path: 'public/images/new-categories/category-electronics.png',
    prompt: 'Electronics category image for e-commerce, modern TV, bluetooth speaker, headphones arranged on dark surface, professional product photography, dark background with red LED accent lighting, sleek tech aesthetic, photorealistic'
  },
  {
    name: 'category-home-appliances',
    path: 'public/images/new-categories/category-home-appliances.png',
    prompt: 'Home appliances category image for e-commerce, modern refrigerator, washing machine, air fryer, arranged in clean setting, professional product photography, dark background with red accent lighting, premium home goods, photorealistic'
  },
  {
    name: 'category-phones-tablets',
    path: 'public/images/new-categories/category-phones-tablets.png',
    prompt: 'Phones and tablets category image for e-commerce, modern smartphone and tablet devices displayed on dark surface, professional product photography, dark background with red accent lighting, sleek tech aesthetic, photorealistic'
  },
  // Featured Banner
  {
    name: 'featured-collection-banner',
    path: 'public/images/new-featured/featured-collection-banner.png',
    prompt: 'Modern kitchen essentials collection banner, premium cookware and appliances arranged in elegant composition, dark background with red accent lighting, professional product photography, high-end e-commerce banner style, photorealistic'
  }
];

function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    const client = url.startsWith('https') ? https : require('http');
    
    client.get(url, { timeout: 60000 }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Follow redirect
        return downloadImage(res.headers.location, outputPath).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    }).on('timeout', () => {
      fs.unlink(outputPath, () => {});
      reject(new Error('Timeout'));
    });
  });
}

function generateImage(prompt, outputPath) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: `Generate image: ${prompt}` }],
      max_tokens: 4000
    });

    const options = {
      hostname: API_BASE,
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 120000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            reject(new Error(json.error.message || 'API error'));
            return;
          }
          
          const content = json.choices?.[0]?.message?.content || '';
          // Extract image URLs - look for markdown image syntax or direct URLs
          const mdMatch = content.match(/!\[.*?\]\((https:\/\/[^\s\)]+)\)/g);
          const urlMatch = content.match(/https:\/\/[^\s\)]+/g);
          
          let imageUrl = null;
          if (mdMatch && mdMatch.length > 0) {
            const match = mdMatch[0].match(/\((https:\/\/[^\s\)]+)\)/);
            imageUrl = match ? match[1] : null;
          } else if (urlMatch && urlMatch.length > 0) {
            imageUrl = urlMatch[0];
          }
          
          if (!imageUrl) {
            console.log('Response content:', content.substring(0, 500));
            reject(new Error('No image URLs found'));
            return;
          }

          console.log(`  Found image URL: ${imageUrl.substring(0, 80)}...`);
          downloadImage(imageUrl, outputPath).then(resolve).catch(reject);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('CARWO GOBSAN Image Generator');
  console.log('============================');
  console.log(`Generating ${images.length} images...\n`);

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    console.log(`[${i + 1}/${images.length}] Generating: ${img.name}`);
    
    try {
      await generateImage(img.prompt, img.path);
      console.log(`  SUCCESS: ${img.path}`);
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
    }
    
    // Small delay between requests
    if (i < images.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
