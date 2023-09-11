package tv.codely.ecommerce.product.domain;

import tv.codely.ecommerce.user.domain.UserId;

import java.util.Map;

public class ProductReview {
    private final ProductReviewId id;
    private final UserId userId;
    private final ProductReviewRating rating;
    private final ProductReviewComment comment;

    public ProductReview(String id, String userId, Integer rating, String comment) {
        this.id = new ProductReviewId(id);
        this.userId = new UserId(userId);
        this.rating = new ProductReviewRating(rating);
        this.comment = new ProductReviewComment(comment);
    }

    public static ProductReview create(String id, String userId, Integer rating, String comment) {
        var review = new ProductReview(id, userId, rating, comment);

        // review.record(new ProductReviewCreatedDomainEvent(id, userId, rating, comment));

        return review;
    }

    public static ProductReview fromPrimitives(Map<String, String> primitives) {
        return new ProductReview(
            primitives.get("id"),
            primitives.get("userId"),
            Integer.valueOf(primitives.get("rating")),
            primitives.get("comment")
        );
    }
}
