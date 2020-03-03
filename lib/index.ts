import { Cluster } from 'puppeteer-cluster';

import errors from './constants/errors';

class sigaScraper {
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
    const loginURL = 'http://siga.frba.utn.edu.ar/try/sinap.do'; // 'http://localhost:8080/'

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

  static async scrapeHistorialConsolidado() {
    if (!this.isLogged) throw new Error(errors.needToBeLogedErrorMessage);

    const historialConsolidadoPageUrl =
      'http://siga.frba.utn.edu.ar/alu/hist.do';

    return await this.cluster.execute(async ({ page }: { page: any }) => {
      await page.goto(historialConsolidadoPageUrl);

      const subjects = await page.evaluate(
        () =>
          [
            ...document.querySelectorAll(
              'body > div.std-desktop > div.std-desktop-desktop > form > div > div > table > tbody > tr',
            ),
          ]
            .map(e => {
              const row: string[] = [];
              [...(e as HTMLElement).querySelectorAll('td')].forEach(b =>
                row.push(b.innerText),
              );
              return row;
            })
            .slice(2), // get rid of the header of the table.
      );
      return subjects;
    });
  }

  static async scrapeCursada() {
    if (!this.isLogged) throw new Error(errors.needToBeLogedErrorMessage);

    const cursadaPageUrl = 'http://siga.frba.utn.edu.ar/alu/horarios.do'; // 'https://www.luismigueles.com.ar/test/siga/';

    return await this.cluster.execute(async ({ page }: { page: any }) => {
      await page.goto(cursadaPageUrl);

      const subjects = await page.evaluate(() =>
        [
          ...document.querySelectorAll(
            'tbody > tr > td > span:nth-child(1) > a',
          ),
        ].map((e, i) => {
          const name = `${
            (e as HTMLElement).onclick!.toString().split(`'`)[5]
          }`;
          const selector = `tbody > tr:nth-child(${2 * i +
            3}) > td > span:nth-child(2) > a`;
          return { name, selector };
        }),
      );

      const response = [];
      // Por cada asignatura, buscar las notas.
      for await (const subject of subjects) {
        const { name, selector } = subject;

        await Promise.all([page.click(selector), page.waitForNavigation()]);
        /**
         * Extrae las notas de la asignatura en cuestión.
         * @returns {Object} notas
         */
        const notas = await page.evaluate(() => {
          const notasSpans = [...document.querySelectorAll('span.a-2')];
          if (notasSpans) {
            const res: {
              [key: string]: number;
            } = {};
            const parciales = ['PP', 'PRPP', 'SRPP', 'SP', 'PRSP', 'SRSP'];
            parciales.forEach((instancia, i) => {
              const nota = notasSpans
                .slice(i * 11, (i + 1) * 11)
                .filter(n => n.children[0].classList.contains('bold'));
              if (nota.length > 0) {
                res[instancia] =
                  Number((nota[0] as HTMLElement).innerText.trim()) || 0;
              }
            });

            return res;
          }
          return {};
        });

        // Volver a cursada
        await Promise.all([
          page.goto(cursadaPageUrl, {
            waitUntil: 'load',
            timeout: 0,
          }),
          page.waitForNavigation({
            waitUntil: 'load',
            timeout: 0,
          }),
        ]);

        response.push({ name, notas });
      }
      return response;
    });
  }
}

export default sigaScraper;
