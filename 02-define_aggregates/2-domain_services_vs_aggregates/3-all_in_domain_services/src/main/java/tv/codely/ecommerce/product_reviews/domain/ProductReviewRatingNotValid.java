package tv.codely.ecommerce.product_reviews.domain;

public class ProductReviewRatingNotValid extends RuntimeException {
    public ProductReviewRatingNotValid(Integer rating) {
        super("The review rating <" + rating + "> is not valid. It must be between 0 and 10");
    }
}
