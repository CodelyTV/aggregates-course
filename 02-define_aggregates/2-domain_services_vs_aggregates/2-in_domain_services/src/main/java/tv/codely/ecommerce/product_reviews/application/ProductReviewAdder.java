package tv.codely.ecommerce.product_reviews.application;

import tv.codely.ecommerce.product_reviews.domain.ProductReview;
import tv.codely.ecommerce.product_reviews.domain.ProductReviewCommentIsTooLong;
import tv.codely.ecommerce.product_reviews.domain.ProductReviewRatingNotValid;
import tv.codely.ecommerce.product_reviews.domain.ProductReviewRepository;
import tv.codely.ecommerce.products.application.ProductFinder;

record ProductReviewAdder(ProductReviewRepository repository, ProductFinder finder) {
    public void add(String id, String productId, String userId, Integer rating, String comment) {
        ensureRatingIsValid(rating);
        ensureCommentIsValid(comment);

        ensureProductExist(productId);

        var review = ProductReview.create(id, productId, userId, rating, comment);

        this.repository.save(review);
    }

    private void ensureCommentIsValid(String comment) {
        if (comment.length() > 500) {
            throw new ProductReviewCommentIsTooLong(comment);
        }
    }

    private void ensureRatingIsValid(Integer rating) {
        if (rating < 0 || rating > 5) {
            throw new ProductReviewRatingNotValid(rating);
        }
    }

    private void ensureProductExist(String productId) {
        this.finder.find(productId);
    }
}
