-- Habilitar RLS en las tablas
ALTER TABLE wods ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla 'wods' (Entrenamientos)
-- Cualquiera puede ver los WODs
CREATE POLICY "WODs son visibles para todos" 
ON wods FOR SELECT 
USING (true);

-- Solo usuarios autenticados pueden crear/editar WODs
CREATE POLICY "Usuarios autenticados pueden crear WODs" 
ON wods FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar WODs" 
ON wods FOR UPDATE 
TO authenticated 
USING (true);

-- Políticas para la tabla 'results' (Resultados/Leaderboard)
-- Cualquiera puede ver los resultados (para el Leaderboard)
CREATE POLICY "Resultados son visibles para todos" 
ON results FOR SELECT 
USING (true);

-- Solo el dueño del resultado puede insertarlo (validando su ID)
CREATE POLICY "Atletas pueden insertar sus propios resultados" 
ON results FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = athlete_id);

-- Solo el dueño puede editar o borrar su propio resultado
CREATE POLICY "Atletas pueden actualizar sus propios resultados" 
ON results FOR UPDATE 
TO authenticated 
USING (auth.uid() = athlete_id)
WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Atletas pueden borrar sus propios resultados" 
ON results FOR DELETE 
TO authenticated 
USING (auth.uid() = athlete_id);
