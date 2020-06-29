import * as dotenv from 'dotenv';
import sigaScraper from '..';

dotenv.config();

const { SIGA_USER, SIGA_PASS } = process.env;

describe('Scrape Cursada', () => {
  test('Deberia devolver un array de con informacion acerca asignaturas.', async (done) => {
    try {
      await sigaScraper.start();

      const expected = [
        {
          courseId: '950703',
          curso: 'Z2004',
          nombre: 'Análisis Matemático II',
          aula: '115',
          sede: 'Campus',
          color: '#7A94CF',
          turno: 'Mañana',
          dia: 3,
          hora: '8:30',
          horaT: '12:30',
        },
        {
          courseId: '950606',
          curso: 'Z2003',
          nombre: 'Física II',
          aula: '102',
          sede: 'Campus',
          color: '#AF9772',
          turno: 'Mañana',
          dia: 3,
          hora: '8:30',
          horaT: '12:30',
        },
      ];
      const scrapeResponse = await sigaScraper.scrapeCursada();
      // console.log(JSON.stringify(scrapeResponse, null, 2));

      expect(scrapeResponse instanceof Array).toBeTruthy();
      expect(scrapeResponse).toEqual(expected);

      done();
    } catch (error) {
      console.log(error);
      done.fail(error);
    }

    await sigaScraper.stop();
  }, 60000);
});

describe('Scrape Notas', () => {
  test('Deberia devolver un array de asignaturas con sus notas.', async (done) => {
    try {
      await sigaScraper.start();

      const expected = [
        {
          name: 'Análisis Matemático II',
          notas: [
            {
              instancia: 'PP',
              calificacion: 8,
            },
            {
              instancia: 'SP',
              calificacion: 8,
            },
          ],
        },
        {
          name: 'Física II',
          notas: [
            {
              instancia: 'PP',
              calificacion: 4,
            },
            {
              instancia: 'PRPP',
              calificacion: 8,
            },
            {
              instancia: 'SP',
              calificacion: 8,
            },
          ],
        },
      ];
      const scrapeResponse = await sigaScraper.scrapeNotas();
      // console.log(JSON.stringify(scrapeResponse, null, 2));

      expect(scrapeResponse instanceof Array).toBeTruthy();
      expect(scrapeResponse).toEqual(expected);
      done();
    } catch (error) {
      console.log(error);
      done.fail(error);
    } finally {
      await sigaScraper.stop();
    }
  }, 60000);
});
