package tv.codely.ecommerce.product_reviews.application;

import tv.codely.ecommerce.product_reviews.domain.ProductReview;
import tv.codely.ecommerce.product_reviews.domain.ProductReviewEnsurer;
import tv.codely.ecommerce.product_reviews.domain.ProductReviewRepository;
import tv.codely.ecommerce.products.application.ProductFinder;

record ProductReviewAdder(ProductReviewRepository repository, ProductFinder finder) {
    public void add(String id, String productId, String userId, Integer rating, String comment) {
        ProductReviewEnsurer.ensure(rating, comment, finder, productId);

        var review = ProductReview.create(id, productId, userId, rating, comment);

        this.repository.save(review);
    }
}
