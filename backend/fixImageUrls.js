
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('./src/models/Property');
const connectDB = require('./src/config/db');

dotenv.config({ path: './.env' });

connectDB();

const fixImageUrls = async () => {
  try {
    const properties = await Property.find();
    let updatedCount = 0;

    for (const property of properties) {
      let needsUpdate = false;
      const fixedImages = property.images
        .map(url => {
          if (!url || typeof url !== 'string' || url.includes('undefined')) {
            needsUpdate = true;
            return null; // Mark for removal
          }
          
          let correctedUrl = url.replace(/\/g, '/');

          if (!correctedUrl.startsWith('http') && !correctedUrl.startsWith('/uploads/')) {
            needsUpdate = true;
            if (correctedUrl.startsWith('uploads/')) {
              correctedUrl = `/${correctedUrl}`;
            } else {
              correctedUrl = `/uploads/${correctedUrl}`;
            }
          }
          
          if(url !== correctedUrl) {
            needsUpdate = true;
          }

          return correctedUrl;
        })
        .filter(url => url !== null);

      if (needsUpdate) {
        property.images = fixedImages;
        await property.save();
        updatedCount++;
        console.log(`Updated property: ${property.name}`);
      }
    }

    console.log(`Finished processing properties. ${updatedCount} properties were updated.`);
    mongoose.disconnect();
  } catch (error) {
    console.error('Error fixing image URLs:', error);
    mongoose.disconnect();
  }
};

fixImageUrls();
