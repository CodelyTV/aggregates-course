package tv.codely.ecommerce.product_reviews.domain;

public class ProductReviewRatingEnsurer {
    public static void ensure(Integer rating) {
        if (rating < 0 || rating > 5) {
            throw new ProductReviewRatingNotValid(rating);
        }
    }
}
