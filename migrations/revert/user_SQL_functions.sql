-- Revert edibles:user_SQL_functions from pg

BEGIN;

DROP FUNCTION update_user(json);
DROP FUNCTION new_user(json);

COMMIT;
