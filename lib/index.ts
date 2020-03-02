import { Cluster } from 'puppeteer-cluster';

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

        const success: boolean =
          (await page.$('div.content > div.alert.alert-danger')) === null;
        return success;
      },
    );
    if (!success) throw new Error('Las credenciales de logeo son invalidas.');
    this.isLogged = true;
  }

  static async scrapeCursada() {
    if (!this.isLogged)
      throw new Error('Necesitas estar logeado para ejecutar esta función.');

    const cursadaURL = 'http://siga.frba.utn.edu.ar/alu/horarios.do'; // 'https://www.luismigueles.com.ar/test/siga/';

    return await this.cluster.execute(async ({ page }: { page: any }) => {
      await page.goto(cursadaURL);
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
          page.goto(cursadaURL, {
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
