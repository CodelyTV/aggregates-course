package tv.codely.ecommerce.product.domain;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Product {
    private final ProductId id;
    private final ProductName name;
    private final ProductPrice price;
    private final List<ProductReview> reviews;

    public Product(String id, String name, String price, List<Map<String, String>> reviews) {
        this.id = new ProductId(id);
        this.name = new ProductName(name);
        this.price = new ProductPrice(price);
        this.reviews = reviews.stream().map(ProductReview::fromPrimitives).collect(Collectors.toList());
    }

    public void addReview(String id, String userId, Integer rating, String comment) {
        this.reviews.add(new ProductReview(id, userId, rating, comment));
    }
}
