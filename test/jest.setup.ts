import { rm } from 'fs/promises';
import { join } from 'path';
import { User } from '../src/modules/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

global.beforeEach(async () => {
  try {
    // await rm(join(__dirname, '..', 'car-pricing-test.sqlite'));
    // const userRepository = getRepositoryToken(User);
  } catch (error) {
    console.log('File does not exist');
  }
});
