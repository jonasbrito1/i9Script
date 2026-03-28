-- Adicionar campo status aos cards do Kanban
-- O status será definido automaticamente baseado na coluna

ALTER TABLE kanban_cards
ADD COLUMN status ENUM('todo', 'in_progress', 'review', 'done', 'blocked') DEFAULT 'todo';

-- Atualizar status dos cards existentes baseado no nome da coluna
UPDATE kanban_cards kc
INNER JOIN kanban_columns col ON kc.column_id = col.id
SET kc.status = CASE
    WHEN LOWER(col.name) LIKE '%to do%' OR LOWER(col.name) LIKE '%todo%' OR LOWER(col.name) LIKE '%backlog%' THEN 'todo'
    WHEN LOWER(col.name) LIKE '%progress%' OR LOWER(col.name) LIKE '%doing%' OR LOWER(col.name) LIKE '%development%' THEN 'in_progress'
    WHEN LOWER(col.name) LIKE '%review%' OR LOWER(col.name) LIKE '%testing%' OR LOWER(col.name) LIKE '%qa%' THEN 'review'
    WHEN LOWER(col.name) LIKE '%done%' OR LOWER(col.name) LIKE '%complete%' OR LOWER(col.name) LIKE '%finished%' THEN 'done'
    WHEN LOWER(col.name) LIKE '%block%' OR LOWER(col.name) LIKE '%waiting%' THEN 'blocked'
    ELSE 'todo'
END;
