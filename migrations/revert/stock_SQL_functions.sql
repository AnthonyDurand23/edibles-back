-- Revert edibles:stock_SQL_functions from pg

BEGIN;

DROP FUNCTION update_stock(json);
DROP FUNCTION new_stock(json);

COMMIT;
