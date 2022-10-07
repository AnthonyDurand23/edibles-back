-- Deploy edibles:subscription_view to pg

BEGIN;

CREATE VIEW count_peremption_product_by_endpoint AS
SELECT COUNT(product.*), subscription.endpoint, subscription.keys_auth, subscription.keys_p256dh
FROM product
JOIN stock_has_product ON product.id = stock_has_product.product_id
JOIN stock ON stock_has_product.stock_id = stock.id
JOIN subscription ON stock.user_id = subscription.user_id
JOIN "user" ON stock.user_id = "user".id
WHERE EXTRACT(epoch FROM -age(expiration_date))/3600 <= '48' AND "user".expiration_date_notification = 'true'
GROUP BY subscription.endpoint, subscription.keys_auth, subscription.keys_p256dh;

COMMIT
