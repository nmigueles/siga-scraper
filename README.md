# SIGA Scraper

Herramienta para extraer información del SIGA FRBA de la UTN.

## Métodos

- [Scrape Cursada](https://github.com/NicoMigueles/siga-scraper#scrape-cursada)
- [Scrape Historial Consolidado](https://github.com/NicoMigueles/siga-scraper#scrape-historial-consolidado)

## Ejemplos

### Ejecutar un solo método

```typescript
import sigaScraper from 'siga-scraper';

await sigaScraper.start(); // Inicia el cluster de navegadores que realizan el scrape.
await sigaScraper.login(SIGA_USER, SIGA_PASS); // Logea y guarda la session en el cluster.

const response = await sigaScraper.scrapeCursada(); // Ejecuta cualquier tarea, en este caso devuelve información de la cursada actual.

console.log(response); // => [ {...}, {...} ]
```

### Ejecutar varios métodos

```typescript
import sigaScraper from 'siga-scraper';

await sigaScraper.start(); // Inicia el cluster de navegadores que realizan el scrape.
await sigaScraper.login(SIGA_USER, SIGA_PASS); // Logea y guarda la session en el cluster.
const tareas = [
  sigaScraper.scrapeCursada(),
  sigaScraper.scrapeHistorialConsolidado(),
];
const [responseScrapeCursada, responseScrapeHistCons] = await Promise.all(
  tareas,
);

console.log(responseScrapeCursada); // => [ {...}, {...} ]
console.log(responseScrapeHistCons); // => [ {...}, {...} ]
```

### Scrape Cursada

```typescript
scrapeCursada() : Promise<Curso[]>,
```

Returns:
`Curso[]`

```typescript
// Response Curso example.
[
  {
    courseId: string, // Id del curso interno del SIGA
    curso: string, // Código del curso, ejemplo: K1021
    nombre: string, // Nombre del curso
    color: string, // Color del curso
    notas: [
      {
        instancia: string, // Instancia de evaluación
        calificacion: number, // Nota numerica. 0 .. 10, el 0 representa el ausente.
      },
    ],
    dia: number, // Representación numérica de la semana, zero-indexed.
    hora: string, // Hora de la clase.
    horaT: string, // Hora de finalización de la clase.
    turno: Turno, // Turno del curso. enum('Mañana', 'Tarde', 'Noche')
    aula: string, // Aula del curso.
    sede: string, // Sede en la que se dicta el curso.
  },
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
[
  {
    tipo: 'Cursada' | 'Final',
    estado: 'Aprob' | null,
    plan: string, // Nombre del plan, ejemplo O95A (civil) o K08 (sistemas).
    courseId: string, // Id del curso interno del SIGA
    nombre: string, // Nombre del curso
    year: number, // Año de la cursada
    periodo: string, // Identificador del periodo
    fecha: string | null, // DD/MM/AAAA
    acta:
      {
        sede: string,
        libre: string,
        folio: number,
        nota: number | null,
      } | null,
  },
];
```

# License

- [MIT License.](https://github.com/nicomigueles/siga-scraper/blob/master/license)
