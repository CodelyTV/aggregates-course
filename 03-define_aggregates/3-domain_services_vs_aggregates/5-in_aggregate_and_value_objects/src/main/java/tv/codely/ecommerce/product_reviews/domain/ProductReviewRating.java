package tv.codely.ecommerce.product_reviews.domain;

public record ProductReviewRating(Integer value) {
    public ProductReviewRating {
        if (value < 0 || value > 5) {
            throw new ProductReviewRatingNotValid(value);
        }
    }
}
