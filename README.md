# SIGA Scraper

Herramienta para extraer información del SIGA FRBA de la UTN.

## Funcionalidades

- [Scrape Cursada](https://github.com/NicoMigueles/siga-scraper#scrape-cursada)

### Scrape Cursada

```js
// example code implementation.
```

Returns:
`Curso[]`

```js
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

# License

- [MIT License.](https://github.com/nicomigueles/siga-scraper/blob/master/license)
