package tv.codely.ecommerce.product_reviews.domain;

import tv.codely.ecommerce.products.application.ProductFinder;

public class ProductReviewEnsurer {
    public static void ensure(Integer rating, String comment, ProductFinder finder, String productId) {
        ProductReviewRatingEnsurer.ensure(rating);
        ProductReviewCommentEnsurer.ensure(comment);
        finder.find(productId);
    }
}
