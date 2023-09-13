package tv.codely.ecommerce.product_reviews.application;

import tv.codely.ecommerce.product_reviews.domain.ProductReview;
import tv.codely.ecommerce.product_reviews.domain.ProductReviewCommentEnsurer;
import tv.codely.ecommerce.product_reviews.domain.ProductReviewRatingEnsurer;
import tv.codely.ecommerce.product_reviews.domain.ProductReviewRepository;
import tv.codely.ecommerce.products.application.ProductFinder;

record ProductReviewAdder(ProductReviewRepository repository, ProductFinder finder) {
    public void add(String id, String productId, String userId, Integer rating, String comment) {
        ProductReviewRatingEnsurer.ensure(rating);
        ProductReviewCommentEnsurer.ensure(comment);

        ensureProductExist(productId);

        var review = ProductReview.create(id, productId, userId, rating, comment);

        this.repository.save(review);
    }

    private void ensureProductExist(String productId) {
        this.finder.find(productId);
    }
}
