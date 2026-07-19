-- =============================================
-- TABLA: Reportes Ciudadanos
-- =============================================

-- 1. Extension PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Crear tabla (IF NOT EXISTS para evitar errores)
CREATE TABLE IF NOT EXISTS public.reportes_ciudadanos (
    id                BIGSERIAL PRIMARY KEY,
    nombre            TEXT NOT NULL,
    telefono          TEXT,
    categoria         TEXT NOT NULL
                      CHECK (categoria IN (
                          'Bache', 'Alumbrado', 'Basura', 'Inundacion',
                          'Via en mal estado', 'Arbol caido', 'Contaminacion',
                          'Animales sueltos', 'Otros'
                      )),
    descripcion       TEXT NOT NULL,
    direccion         TEXT,
    barrio_parroquia  TEXT,
    lat               DOUBLE PRECISION NOT NULL CHECK (lat BETWEEN -90 AND 90),
    lon               DOUBLE PRECISION NOT NULL CHECK (lon BETWEEN -180 AND 180),
    geom              GEOMETRY(Point, 4326) NOT NULL,
    estado            TEXT NOT NULL DEFAULT 'Pendiente'
                      CHECK (estado IN ('Pendiente', 'En revision', 'Resuelto', 'Rechazado')),
    foto_url          TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 3. Indices
CREATE INDEX IF NOT EXISTS idx_reportes_geom      ON public.reportes_ciudadanos USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_reportes_estado    ON public.reportes_ciudadanos (estado);
CREATE INDEX IF NOT EXISTS idx_reportes_categoria ON public.reportes_ciudadanos (categoria);
CREATE INDEX IF NOT EXISTS idx_reportes_fecha     ON public.reportes_ciudadanos (created_at DESC);

-- 4. Funcion trigger: genera geom desde lat/lon
CREATE OR REPLACE FUNCTION public.fn_reportes_geom()
RETURNS TRIGGER AS $$
BEGIN
    NEW.geom := ST_SetSRID(ST_MakePoint(NEW.lon, NEW.lat), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger geom
DROP TRIGGER IF EXISTS trg_reportes_geom ON public.reportes_ciudadanos;
CREATE TRIGGER trg_reportes_geom
    BEFORE INSERT OR UPDATE OF lat, lon
    ON public.reportes_ciudadanos
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_reportes_geom();

-- 6. Funcion trigger: actualiza updated_at
CREATE OR REPLACE FUNCTION public.fn_reportes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_reportes_updated_at ON public.reportes_ciudadanos;
CREATE TRIGGER trg_reportes_updated_at
    BEFORE UPDATE ON public.reportes_ciudadanos
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_reportes_updated_at();

-- 7. RLS
ALTER TABLE public.reportes_ciudadanos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reportes_select_public" ON public.reportes_ciudadanos;
CREATE POLICY "reportes_select_public"
    ON public.reportes_ciudadanos FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "reportes_insert_public" ON public.reportes_ciudadanos;
CREATE POLICY "reportes_insert_public"
    ON public.reportes_ciudadanos FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "reportes_update_auth" ON public.reportes_ciudadanos;
CREATE POLICY "reportes_update_auth"
    ON public.reportes_ciudadanos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 8. Datos de ejemplo
INSERT INTO public.reportes_ciudadanos
    (nombre, telefono, categoria, descripcion, direccion, barrio_parroquia, lat, lon)
VALUES
    ('Juan Perez',   '0991234567', 'Bache',
     'Bache de approx. 2 metros frente al colegio San Martin',
     'Av. 6 de Diciembre y Calle Loja', 'Macas', -3.2154, -78.0987),
    ('Maria Lopez',  '0987654321', 'Alumbrado',
     'Poste de luz danado sin funcionar desde hace 3 dias',
     'Calle Bolivar y Sucre', 'Macas', -3.2201, -78.0912),
    ('Carlos Mena',  '0912345678', 'Basura',
     'Acumulacion de basura en esquina sin servicio de recoleccion',
     'Av. Amazonas y Calle 10 de Agosto', 'San Juan Bosco', -3.1845, -78.1534);
