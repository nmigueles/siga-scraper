# SIGA Scraper

[![Latest Stable Version](https://img.shields.io/npm/v/siga-scraper.svg)](https://www.npmjs.com/package/siga-scraper)

Tool for retrieving information from the SIGA FRBA UTN website.

## Support

[![Invitame un café en cafecito.app](https://cdn.cafecito.app/imgs/buttons/button_5.svg)](https://cafecito.app/nicomigueles)

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
    notas: [
      {
        instancia: string, // Instancia de evaluación
        calificacion: number, // Nota, 0..10, el 0 representa el ausente.
      },
    ],
    dia: number, // Representación numérica de la semana.
    hora: string, // Hora de la clase.
    horaT: string, // Hora de finalización de la clase.
    turno: Turno, // enum('Mañana', 'Tarde', 'Noche')
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
  name: 'Análisis Matemático I',
  [{
    instancia: string,
    calificacion: number,
  }],
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

  await sigaScraper.stop();
}

main();
```

### Running tasks simultaneously

```typescript
import sigaScraper from 'siga-scraper';

async function main() {
  await sigaScraper.start(); // Inicia el cluster de navegadores que realizan el scrape.
  await sigaScraper.login(SIGA_USER, SIGA_PASS); // Logea y guarda la session en el cluster.
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
