import { Cluster } from 'puppeteer-cluster';

import errors from './constants/errors';

import rgbtohex from './helpers/rgbtohex';
import decomposeDate from './helpers/decomposeDate';

import { Course, Nota, Notas, RowEntry, Acta, ActaFinal } from './interfaces';

const isTest: boolean = process.env.NODE_ENV === 'test';

export = class sigaScraper {
  private static cluster: Cluster;
  private static isLogged: boolean = false;

  static async start() {
    this.cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 4,
      puppeteerOptions: {
        headless: false,
      },
    });
  }

  static async stop() {
    await this.cluster.idle();
    await this.cluster.close();
  }

  static async login(username: string, password: string) {
    const loginURL = 'http://siga.frba.utn.edu.ar/try/sinap.do';

    const success: boolean = await this.cluster.execute(
      async ({ page }: { page: any }) => {
        await page.goto(loginURL);
        await page.type('#username', username);
        await page.type('#password', password);
        await page.click('#regularsubmit');
        await page.waitForNavigation({ waitUntil: 'load', timeout: 0 });
        const errorHandlerHTMLSelector = 'div.content > div.alert.alert-danger';
        const success: boolean =
          (await page.$(errorHandlerHTMLSelector)) === null;
        return success;
      },
    );
    if (!success) throw new Error(errors.invalidCredentialsErrorMessage);
    this.isLogged = true;
  }

  static async scrapeHistorialConsolidado(): Promise<RowEntry[]> {
    if (!this.isLogged && !isTest)
      throw new Error(errors.loginRequiredErrorMessage);

    const historialConsolidadoPageUrl =
      'http://siga.frba.utn.edu.ar/alu/hist.do';
    const testUrl = 'https://mock-siga-scraper.netlify.app/histcon.html';

    return await this.cluster.execute(async ({ page }: { page: any }) => {
      await page.goto(isTest ? testUrl : historialConsolidadoPageUrl);

      const rows: RowEntry[] = await page.evaluate(
        () =>
          [
            ...document.querySelectorAll(
              'body > div.std-desktop > div.std-desktop-desktop > form > div > div > table > tbody > tr',
            ),
          ]
            .map((e) => {
              const [
                tipo,
                estado,
                plan,
                courseId,
                nombre,
                year,
                periodo,
                fecha,
                sede,
                libro,
                folio,
                nota,
              ] = [...(e as HTMLElement).querySelectorAll('td')].map(
                (b) => b.innerText,
              );
              let acta: Acta | null;
              if (libro == 'sin firma / promovido' || !libro) {
                acta = null;
              } else {
                acta = {
                  sede,
                  libro,
                  folio: folio,
                  nota: nota ? Number(nota) : undefined,
                };
              }
              return {
                tipo,
                estado,
                plan,
                courseId,
                nombre,
                year: Number(year),
                periodo,
                fecha,
                acta,
              };
            })
            .slice(2), // get rid of the header of the table.
      );

      return rows;
    });
  }

  static async scrapeCursada(): Promise<Course[]> {
    if (!this.isLogged && !isTest)
      throw new Error(errors.loginRequiredErrorMessage);

    const cursadaPageUrl = 'http://siga.frba.utn.edu.ar/alu/horarios.do';
    const testUrl = 'https://mock-siga-scraper.netlify.app';

    return await this.cluster.execute(async ({ page }: { page: any }) => {
      await page.goto(isTest ? testUrl : cursadaPageUrl);
      const response: Course[] = [];
      const courses = await page.evaluate(() =>
        [
          ...document.querySelectorAll(
            'div.std-desktop-desktop > form > div > div:nth-child(4) > table > tbody > tr',
          ),
        ]
          .filter((a, i) => i % 2)
          .map((a) => [
            ...(a as HTMLElement).innerText!.trim().split('\t'),
            (a.children[6] as HTMLElement).style.backgroundColor,
          ]),
      );
      for (const [
        curso,
        courseId,
        nombre,
        sedeUppercased,
        aula,
        fecha,
        color,
      ] of courses) {
        // si la asignatura se cursa dos días hay que tener en cuenta ambos.
        const fechas: string[] = fecha.split(' ');

        const dias: number[] = [];
        const horas: string[] = [];
        const horasT: string[] = [];

        let turno: string = '';

        fechas.forEach((f) => {
          const { day, start, finish, shift } = decomposeDate(f);
          dias.push(day);
          horas.push(start);
          horasT.push(finish);
          turno = shift;
        });
        const sede =
          sedeUppercased.charAt(0) + sedeUppercased.slice(1).toLowerCase();
        const course: Course = {
          courseId,
          curso,
          nombre,
          aula,
          sede,
          turno,
          color: rgbtohex(color),
          dia: dias,
          hora: horas,
          horaT: horasT,
        };
        response.push(course);
      }

      return response;
    });
  }

  static async scrapeNotas(): Promise<Notas[]> {
    if (!this.isLogged && !isTest)
      throw new Error(errors.loginRequiredErrorMessage);

    const cursadaPageUrl = 'http://siga.frba.utn.edu.ar/alu/horarios.do';
    const testUrl = 'https://mock-siga-scraper.netlify.app';

    return await this.cluster.execute(async ({ page }: { page: any }) => {
      await page.goto(isTest ? testUrl : cursadaPageUrl);

      const subjects = await page.evaluate(() =>
        [
          ...document.querySelectorAll(
            'tbody > tr > td > span:nth-child(1) > a',
          ),
        ].map((e, i) => {
          const onclickData = (e as HTMLElement).onclick!.toString().split(`'`);
          const courseId = onclickData[3];
          const name = onclickData[5];
          const selector = `tbody > tr:nth-child(${
            2 * i + 3
          }) > td > span:nth-child(2) > a`;
          return { courseId, name, selector };
        }),
      );

      const response = [];
      // Por cada asignatura, buscar las notas.
      for await (const subject of subjects) {
        const { courseId, name, selector } = subject;

        await Promise.all([page.click(selector), page.waitForNavigation()]);

        const notas: Nota[] = await page.evaluate(() => {
          const notasSpans = [...document.querySelectorAll('span.a-2')];
          if (notasSpans) {
            const parciales = ['PP', 'PRPP', 'SRPP', 'SP', 'PRSP', 'SRSP'];
            let res: Nota[] = [];
            parciales.forEach((instancia, i) => {
              const nota = notasSpans
                .slice(i * 11, (i + 1) * 11)
                .filter((n) => n.children[0].classList.contains('bold'));
              if (nota.length > 0) {
                res.push({
                  instancia,
                  calificacion:
                    Number((nota[0] as HTMLElement).innerText.trim()) || 0,
                });
              }
            });

            return res;
          }
          return {};
        });

        // Volver a cursada
        await Promise.all([
          page.goto(isTest ? testUrl : cursadaPageUrl, {
            waitUntil: 'load',
            timeout: 0,
          }),
          page.waitForNavigation({
            waitUntil: 'load',
            timeout: 0,
          }),
        ]);

        response.push({ courseId, name, notas });
      }
      return response;
    });
  }

  static async scrapeActaDeFinales(): Promise<ActaFinal[]> {
    if (!this.isLogged && !isTest)
      throw new Error(errors.loginRequiredErrorMessage);

    const historialConsolidadoPageUrl =
      'http://siga.frba.utn.edu.ar/alu/acfin.do';
    const testUrl = 'https://mock-siga-scraper.netlify.app/acfin.html';

    return await this.cluster.execute(async ({ page }: { page: any }) => {
      await page.goto(isTest ? testUrl : historialConsolidadoPageUrl);

      const rows: ActaFinal[] = await page.evaluate(
        () =>
          [
            ...document.querySelectorAll(
              'body > div.std-desktop > div.std-desktop-desktop > form > div > div:nth-child(3) > div > table > tbody > tr',
            ),
          ]
            .map((e) => {
              const [fecha, courseId, nombre, libro, folio, nota] = [
                ...(e as HTMLElement).querySelectorAll('td'),
              ].map((b) => b.innerText);
              return {
                fecha,
                courseId,
                nombre,
                libro,
                folio,
                nota: Number(nota) || 0,
              };
            })
            .slice(1), // get rid of the header of the table.;,
      );

      return rows;
    });
  }
};
