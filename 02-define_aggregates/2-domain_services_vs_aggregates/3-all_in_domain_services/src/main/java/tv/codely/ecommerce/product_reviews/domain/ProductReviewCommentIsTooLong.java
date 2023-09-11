package tv.codely.ecommerce.product_reviews.domain;

public class ProductReviewCommentIsTooLong extends RuntimeException {
    public ProductReviewCommentIsTooLong(String comment) {
        super("The review comment <" + comment + "> is too long. Max 550 chars");
    }
}
