package tv.codely.ecommerce.product_reviews.domain;

public record ProductReviewComment(String value) {
    public ProductReviewComment {
        if (value.length() > 500) {
            throw new ProductReviewCommentIsTooLong(value);
        }
    }
}
