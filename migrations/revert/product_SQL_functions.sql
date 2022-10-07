-- Revert edibles:product_SQL_functions from pg

BEGIN;

DROP FUNCTION update_product(json);
DROP FUNCTION new_stock_has_product(json);
DROP FUNCTION new_product(json);

COMMIT;
