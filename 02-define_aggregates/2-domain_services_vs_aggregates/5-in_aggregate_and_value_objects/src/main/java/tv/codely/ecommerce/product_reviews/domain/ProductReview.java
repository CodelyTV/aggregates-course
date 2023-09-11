package tv.codely.ecommerce.product_reviews.domain;

import tv.codely.ecommerce.products.domain.ProductId;
import tv.codely.ecommerce.users.domain.UserId;

public class ProductReview {
    private final ProductReviewId id;
    private final ProductId productId;
    private final UserId userId;
    private final ProductReviewRating rating;
    private final ProductReviewComment comment;

    public ProductReview(String id, String productId, String userId, Integer rating, String comment) {
        this.id = new ProductReviewId(id);
        this.productId = new ProductId(productId);
        this.userId = new UserId(userId);
        this.rating = new ProductReviewRating(rating);
        this.comment = new ProductReviewComment(comment);
    }

    public static ProductReview create(String id, String productId, String userId, Integer rating, String comment) {
        var review = new ProductReview(id, productId, userId, rating, comment);

        // review.record(new ProductReviewCreatedDomainEvent(id, userId, rating, comment));

        return review;
    }
}
