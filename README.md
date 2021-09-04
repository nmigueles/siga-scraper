Archived bc UTN now uses SIU Guaraní.

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
- [Scrape Historial Consolidado](https://github.com/NicoMigueles/siga-scraper#scrape-historial-consolidado)

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
    dia: number[], // Representación numérica del día de la semana.
    hora: string[], // Hora de la clase.
    horaT: string[], // Hora de finalización de la clase.
    turno: string, // 'Mañana' | 'Tarde' | 'Noche'
    aula: string, // Aula del curso.
    sede: string, // Sede en la que se dicta el curso.
  },
];
```

> PD: El día y las horas son arrays ya que en el caso de que una asignatura se curse más de un día, se alinean los indices de los 3 arrays.

> El día empieza en 1 => Lunes, hasta el 6 => Sabado, se excluye el Domingo.

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

### Scrape Historial Consolidado

```typescript
scrapeHistorialConsolidado() : Promise<RowEntry[]>,
```

Returns:
`RowEntry[]`

```typescript
// Response RowEntry example.

export interface Acta {
  sede: string;
  libro: string;
  folio: string;
  nota?: number;
}

export interface RowEntry {
  tipo: string; // 'Cursada' | 'Final';
  estado: string;
  plan: string; // Nombre del plan, ejemplo O95A (civil) o K08 (sistemas).
  courseId: string; // Id del curso interno del SIGA
  nombre: string; // Nombre del curso
  year: number; // Año de la cursada
  periodo: string; // Identificador del periodo
  fecha: string; // DD/MM/AAAA
  acta: Acta | null;
}
/*
{
  "tipo": "Final",
  "estado": "Aprob",
  "plan": "K08",
  "courseId": "950701",
  "nombre": "Álgebra y Geometría Analítica",
  "year": 2018,
  "periodo": "K08 Anual",
  "fecha": "29/11/2018",
  "acta": {
    "sede": "FRBA",
    "libro": "PR045",
    "folio": "180",
    "nota": 8
  }
}
*/
```

### Scrape Actas de Final

```typescript
scrapeActaDeFinales() : Promise<ActaFinal[]>,
```

Returns:
`ActaFinal[]`

```typescript
// Response example.

export interface ActaFinal {
  fecha: string;
  courseId: string;
  nombre: string;
  libro: string;
  folio: string;
  nota: number;
}

/*
  {
    "fecha": "01/01/2020",
    "courseId": "000000",
    "nombre": "Asignatura 1",
    "libro": "AA001",
    "folio": "33",
    "nota": "10"
  },
*/
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
    dia: [3],
    hora: ['8:30'],
    horaT: ['12:30'],
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

# Contribute

Pull request are open and welcome.

# License

- [MIT License.](https://github.com/nicomigueles/siga-scraper/blob/master/LICENSE)
