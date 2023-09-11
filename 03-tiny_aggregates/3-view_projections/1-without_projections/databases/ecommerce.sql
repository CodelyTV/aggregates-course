CREATE TABLE users (
    id   UUID PRIMARY KEY,
    name VARCHAR(255)z
);

CREATE TABLE products (
    id             UUID PRIMARY KEY,
    name           VARCHAR(255),
    price_amount   DECIMAL(10, 2),
    price_currency CHAR(3),
    image_urls     JSON,
    video_urls     JSON
);

CREATE TABLE categories (
    id   UUID PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE sellers (
    id   UUID PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE tags (
    id   UUID PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE product_categories (
    product_id  UUID,
    category_id UUID,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE product_sellers (
    product_id UUID,
    seller_id  UUID,
    PRIMARY KEY (product_id, seller_id),
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (seller_id) REFERENCES sellers (id)
);

CREATE TABLE product_tags (
    product_id UUID,
    tag_id     UUID,
    PRIMARY KEY (product_id, tag_id),
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (tag_id) REFERENCES tags (id)
);

-- Default categories, tags and sellers
INSERT INTO categories (id, name)
VALUES ('e8d5b24f-43dd-4a05-bd58-e3b5f96af22e', 'Electrónica'),
       ('a1b2c3d4-e5f6-47a8-b9c0-d123e456f789', 'Ropa'),
       ('f1e2d3c4-b5a6-79a8-12b0-c123d456e789', 'Juguetes'),
       ('123e4567-e89b-12d3-a456-426614174000', 'Libros'),
       ('b5a4d3c2-e1f2-57a8-91b0-c123d456e789', 'Deportes');

INSERT INTO sellers (id, name)
VALUES ('a36947dc-4029-40dd-b670-33a5379859e2', 'TechStore'),
       ('62ecb31a-4eda-4610-a05c-17d190287ccd', 'FashionHub'),
       ('7283011b-0b3b-47a8-b736-bdeb934b2685', 'ToyWorld'),
       ('9a26803b-7c48-42f5-ac21-04eb5457d417', 'BookNest'),
       ('6d6cef17-c64b-4662-a31b-c0d333d0cbe9', 'SportyGoods');

INSERT INTO tags (id, name)
VALUES ('cac2273c-5e15-4c81-b8a7-f17eaae3118a', 'Nuevo'),
       ('33ba7463-45c1-405a-be89-19edf4ceeff5', 'Venta'),
       ('cbfcb9ab-5f85-4818-9a56-803d05e6e289', 'Popular'),
       ('df143101-51b7-4e46-a0cd-417481d8260b', 'Edición Limitada'),
       ('61405981-24bd-4714-8843-13db8d8c0e2c', 'Exclusivo');
