# SIGA Scraper

[![Latest Stable Version](https://img.shields.io/npm/v/siga-scraper.svg)](https://www.npmjs.com/package/siga-scraper)

Tool to retrieve information from the SIGA FRBA UTN website.

## Support

[![Invitame un café en cafecito.app](https://cdn.cafecito.app/imgs/buttons/button_5.svg)](https://cafecito.app/nicomigueles)

## Instalation

`npm i siga-scraper`

## Methods

- [Scrape Cursada](https://github.com/NicoMigueles/siga-scraper#scrape-cursada)
- [Scrape Notas](https://github.com/NicoMigueles/siga-scraper#scrape-notas)

### Scrape Cursada

```typescript
Method scrapeCursada : Promise<Course[]>,
```

Returns:
`Course[]`

```typescript
// Response example.
[
  {
    courseId: string, // Id del curso interno del SIGA
    curso: string, // Código del curso, ejemplo: K1021
    nombre: string, // Nombre del curso
    color: string, // Color del curso
    dia: number, // Representación numérica de la semana.
    hora: string, // Hora de la clase.
    horaT: string, // Hora de finalización de la clase.
    turno: string, // 'Mañana' | 'Tarde' | 'Noche'
    aula: string, // Aula del curso.
    sede: string, // Sede en la que se dicta el curso.
  },
];
```

### Scrape Notas

```typescript
Method scrapeNotas : Promise<Notas[]>,
```

Returns:
`Notas[]`

```typescript
// Response example.
[
  courseId: string, // Id del curso interno del SIGA
  name: string, // 'Análisis Matemático I'
  notas: [
    {
      instancia: string, // Instancia de evaluación
      calificacion: number, // Nota, 0..10, el 0 representa el ausente.
    }
  ],
];
```

## Examples

### QuickStart

```typescript
import sigaScraper from 'siga-scraper';

async function main() {
  await sigaScraper.start();
  await sigaScraper.login(SIGA_USER, SIGA_PASS);

  const response = await sigaScraper.scrapeCursada();

  console.log(response);
  /*
  [{
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
  }, ...]
  */
  await sigaScraper.stop();
}

main();
```

### Running tasks simultaneously

```typescript
import sigaScraper from 'siga-scraper';

async function main() {
  await sigaScraper.start();
  await sigaScraper.login(SIGA_USER, SIGA_PASS);
  const tasksPromises = [
    sigaScraper.scrapeNotas(),
    sigaScraper.scrapeCursada(),
  ];
  const [responseNotas, responseCursada] = await Promise.all(tasksPromises);

  console.log(responseNotas); // => [ {...}, {...} ]
  console.log(responseCursada); // => [ {...}, {...} ]

  await sigaScraper.stop();
}

main();
```

# License

- [MIT License.](https://github.com/nicomigueles/siga-scraper/blob/master/license)
