# SIGA Scraper

Herramienta para extraer información del SIGA FRBA de la UTN.

## Funcionalidades

### Scrape Cursada

```js
// example here.
```

Time average: X ms.

Response:
`Curso[]`

```js
// Response example.
[
  {
    courseId: string, // SIGA Internal id.
    curso: string, // Class code, example K1021.
    nombre: string, // Nombre del curso.
    color: string, // Color del curso.
    notas: [
      {
        instancia: string, // Instancia de evaluación
        calificacion: number, // Nota numerica. 0 .. 10, el 0 representa el ausente.
      },
    ],
    dia: 0..7, // Representación numérica de la semana, zero-indexed.
    hora: string, // Hora de la clase.
    horaT: string, // Hora de finalización de la clase.
    turno: Turno, // Turno del curso.
    aula: string, // Aula del curso.
    sede: string, // Sede en la que se dicta el curso.
  },
];
```

# License

- [MIT License.](https://github.com/nicomigueles/siga-scraper/blob/master/license)
