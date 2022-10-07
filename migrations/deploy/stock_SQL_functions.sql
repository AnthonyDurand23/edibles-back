-- Deploy edibles:stock_SQL_functions to pg

BEGIN;

CREATE FUNCTION new_stock(json) RETURNS void AS $$
    INSERT INTO "stock" (
        name, 
        user_id
    ) VALUES (
        $1->>'name',
        ($1->>'userId')::int
    );
$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_stock(json) RETURNS text AS $$
    UPDATE "stock" SET 
        name=$1->>'name'
    WHERE id=($1->>'id')::int AND user_id=($1->>'userId')::int
    RETURNING name
$$ LANGUAGE SQL STRICT;

COMMIT;
