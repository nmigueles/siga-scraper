import * as dotenv from 'dotenv';
import sigaScraper from '..';

dotenv.config();

const { SIGA_USER, SIGA_PASS } = process.env;

describe('Basic', () => {
  xtest('Login w/ valid creds', async done => {
    if (!SIGA_USER || !SIGA_PASS)
      throw new Error('Missing credentials in enviroment.');
    try {
      await sigaScraper.start();
      await sigaScraper.login(SIGA_USER, SIGA_PASS);

      const tareas = [sigaScraper.scrapeCursada()];
      const [scrapeCursadaResponse] = await Promise.all(tareas);
      console.log(scrapeCursadaResponse);
      expect(scrapeCursadaResponse instanceof Array).toBeTruthy();
      done();
    } catch (error) {
      console.log(error);
      done.fail(error);
    }

    await sigaScraper.stop();
  }, 30000);

  test('Login and scraping academic history', async done => {
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
