-- Deploy edibles:product_SQL_functions to pg

BEGIN;

CREATE FUNCTION new_product(json) RETURNS int AS $$
    INSERT INTO "product" (
        code, 
        name, 
        url_picture, 
        quantity,
        expiration_date
    ) VALUES (
        COALESCE(($1->>'code')::int, NULL),
        $1->>'name',
        COALESCE($1->>'url_picture', NULL),
        ($1->>'quantity')::int,
        ($1->>'expirationDate')::date
    ) RETURNING id;
$$ LANGUAGE SQL STRICT;

CREATE FUNCTION new_stock_has_product(json) RETURNS void AS $$
    INSERT INTO "stock_has_product" (
        stock_id, 
        product_id
    ) VALUES (
        ($1->>'stockId')::int,
        ($1->>'productId')::int
    );
$$ LANGUAGE SQL STRICT;

CREATE FUNCTION update_product(json) RETURNS text AS $$
    UPDATE "product" SET 
        name=$1->>'name',
        quantity=($1->>'quantity')::int,
        expiration_date=($1->>'expirationDate')::date
        WHERE product.id=($1->>'id')::int;
    UPDATE "stock_has_product" SET
        stock_id=($1->>'stockId')::int
        WHERE product_id=($1->>'id')::int
        RETURNING (SELECT name FROM product WHERE id=($1->>'id')::int);
$$ LANGUAGE SQL STRICT;

COMMIT;
