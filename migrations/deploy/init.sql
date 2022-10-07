-- Deploy edibles:init to pg

BEGIN;

CREATE TABLE "user" (
     "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     "email" TEXT NOT NULL UNIQUE,
     "password" TEXT NOT NULL,
     "firstname" TEXT NOT NULL,
     "lastname" TEXT NOT NULL,
     "expiration_date_notification" BOOLEAN NOT NULL DEFAULT true,
     "default_stock" TEXT NOT NULL DEFAULT 'Maison'
);

CREATE TABLE "stock"( 
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL,
    "user_id" INTEGER REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE "product"(
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "code" TEXT UNIQUE,
    "name" TEXT NOT NULL,
    "url_picture" TEXT,
    "quantity" INTEGER NOT NULL,
    "expiration_date" DATE NOT NULL DEFAULT CURRENT_DATE + interval '1 year'
);

CREATE TABLE "stock_has_product"(
    "stock_id" INTEGER NOT NULL REFERENCES "stock"("id") ON DELETE CASCADE,
    "product_id" INTEGER NOT NULL REFERENCES "product"("id") ON DELETE CASCADE,
    "insertion_date" DATE NOT NULL DEFAULT CURRENT_DATE 
);

COMMIT;
