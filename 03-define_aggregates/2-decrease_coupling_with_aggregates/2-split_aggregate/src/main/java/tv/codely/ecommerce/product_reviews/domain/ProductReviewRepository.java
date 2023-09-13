package tv.codely.ecommerce.product_reviews.domain;

import java.util.List;

public interface ProductReviewRepository {
    void save(ProductReview review);

    List<ProductReview> searchAll();
}
