CREATE TABLE shop__users (
    id              UUID PRIMARY KEY,
    name            VARCHAR(255),
    profile_picture VARCHAR(255)
);

CREATE TABLE shop__products (
    id             UUID PRIMARY KEY,
    name           VARCHAR(255),
    price_amount   DECIMAL(10, 2),
    price_currency CHAR(3),
    image_urls     JSON
);

CREATE TABLE shop__product_reviews (
    id          UUID PRIMARY KEY,
    user_id     UUID REFERENCES shop__users(id),
    product_id  UUID REFERENCES shop__products(id),
    rating      FLOAT,
    comment     VARCHAR(500),
    is_featured BOOLEAN
);
