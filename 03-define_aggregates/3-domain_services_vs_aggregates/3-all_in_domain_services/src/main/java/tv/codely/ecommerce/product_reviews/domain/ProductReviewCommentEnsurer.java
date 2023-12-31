package tv.codely.ecommerce.product_reviews.domain;

public class ProductReviewCommentEnsurer {
    public static void ensure(String comment) {
        if (comment.length() > 500) {
            throw new ProductReviewCommentIsTooLong(comment);
        }
    }
}
