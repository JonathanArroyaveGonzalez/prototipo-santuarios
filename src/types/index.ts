export type Victima = {
  id: number;
  nombres: string;
  apellidos: string;
  fecha_nacimiento?: Date | null;
  fecha_desaparicion: Date;
  edad_desaparicion?: number | null;
  departamento: string;
  municipio: string;
  estado_busqueda: string;
  usuario_id: number;
};

export type Lugar = {
  id: number;
  nombre: string;
  tipo: "punto_desaparicion" | "encuentro" | "homenaje";
  latitud: number;
  longitud: number;
};

export type Medio = {
  id: number;
  tipo: "imagen" | "video" | "audio" | "documento";
  url: string;
  nombre_archivo: string;
  usuario_id: number;
};

export type Testimonio = {
  id: number;
  tipo: "audio" | "video" | "texto";
  autor_nombre: string;
  autor_rol?: string | null;
  victima_id: number;
  lugar_id: number;
  medio_id: number;
  victimas: {
    id: number;
    nombres: string;
    apellidos: string;
  };
  medios: {
    id: number;
    tipo: string;
    url: string;
  };
  lugares: {
    id: number;
    nombre: string;
    tipo: string;
  };
};
