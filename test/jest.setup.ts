import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'car-pricing-test.sqlite'));
  } catch (error) {
    console.log('File does not exist');
  }
});
