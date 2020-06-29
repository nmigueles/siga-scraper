import sigaScraper from '..';
import { RowEntry } from '../interfaces';

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
          dia: [3],
          hora: ['8:30'],
          horaT: ['12:30'],
        },
        {
          courseId: '950606',
          curso: 'Z2003',
          nombre: 'Física II',
          aula: '102',
          sede: 'Campus',
          color: '#AF9772',
          turno: 'Mañana',
          dia: [3],
          hora: ['8:30'],
          horaT: ['12:30'],
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
          courseId: '950703',
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
          courseId: '950606',
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

describe('Scrape Historial Consolidado', () => {
  test('Deberia devolver un array de las filas del historial consolidado.', async (done) => {
    try {
      await sigaScraper.start();
      const expected: RowEntry[] = [
        {
          tipo: 'Cursada',
          estado: 'Aprob',
          plan: 'K08',
          courseId: '950701',
          nombre: 'Álgebra y Geometría Analítica',
          year: 2018,
          periodo: 'K08 Anual',
          fecha: '29/11/2018',
          acta: {
            sede: 'FRBA',
            libro: 'XVIII070',
            folio: '135',
          },
        },
        {
          tipo: 'Final',
          estado: 'Aprob',
          plan: 'K08',
          courseId: '950701',
          nombre: 'Álgebra y Geometría Analítica',
          year: 2018,
          periodo: 'K08 Anual',
          fecha: '29/11/2018',
          acta: {
            sede: 'FRBA',
            libro: 'PR045',
            folio: '180',
            nota: 8,
          },
        },
        {
          tipo: 'Cursada',
          estado: '',
          plan: 'K08',
          courseId: '951601',
          nombre: 'Sistemas de Representación',
          year: 2018,
          periodo: 'K08 Anual',
          fecha: '',
          acta: null,
        },
        {
          tipo: 'Cursada',
          estado: 'Aprob',
          plan: 'K08',
          courseId: '951601',
          nombre: 'Sistemas de Representación',
          year: 2018,
          periodo: 'K08 Anual',
          fecha: '29/11/2018',
          acta: null,
        },
        {
          tipo: 'Final',
          estado: 'Aprob',
          plan: 'K08',
          courseId: '951601',
          nombre: 'Sistemas de Representación',
          year: 2018,
          periodo: 'K08 Sin Cursar',
          fecha: '29/11/2018',
          acta: {
            sede: 'FRBA',
            libro: 'PR046',
            folio: '68',
            nota: 9,
          },
        },
      ];
      const scrapeResponse: RowEntry[] = await sigaScraper.scrapeHistorialConsolidado();

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
