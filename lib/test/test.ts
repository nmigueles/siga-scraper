import * as dotenv from 'dotenv';
import sigaScraper from '..';

dotenv.config();

const { SIGA_USER, SIGA_PASS } = process.env;

describe('Basic', () => {
  test('Login and scraping cursada', async (done) => {
    if (!SIGA_USER || !SIGA_PASS)
      throw new Error('Missing credentials in enviroment.');
    try {
      await sigaScraper.start();
      await sigaScraper.login(SIGA_USER, SIGA_PASS);

      const scrapeResponse = await sigaScraper.scrapeCursadaBasic();
      console.log(scrapeResponse);
      expect(scrapeResponse instanceof Array).toBeTruthy();
      done();
    } catch (error) {
      console.log(error);
      done.fail(error);
    }

    await sigaScraper.stop();
  }, 60000);

  xtest('Login and scraping academic history', async (done) => {
    try {
      await sigaScraper.start();
      await sigaScraper.login(SIGA_USER!, SIGA_PASS!);

      const scrapeResponse = await sigaScraper.scrapeHistorialConsolidado();
      console.log(scrapeResponse);
      expect(scrapeResponse instanceof Array).toBeTruthy();
      done();
    } catch (error) {
      console.log(error);
      done.fail(error);
    }

    await sigaScraper.stop();
  }, 30000);
});
