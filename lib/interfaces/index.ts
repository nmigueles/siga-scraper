export interface Course {
  courseId: string;
  curso: string;
  nombre: string;
  color: string;
  dia: number | number[];
  hora: string | string[];
  horaT: string | string[];
  turno: string;
  aula: string;
  sede: string;
}

export interface Nota {
  instancia: string; // Instancia de evaluación
  calificacion: number; // Nota numerica. 0 .. 10, el 0 representa el ausente.
}
export interface Notas {
  courseId: string;
  name: string;
  notas: Nota[];
}

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
  fecha: string | null; // DD/MM/AAAA
  acta: Acta | null;
}
