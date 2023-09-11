package tv.codely.ecommerce.product.application;

import tv.codely.ecommerce.product.domain.*;

record ProductReviewAdder(ProductRepository repository) {
    public void add(String id, String productId, String userId, Integer rating, String comment) {
        var product = this.repository
            .search(new ProductId(productId))
            .orElseThrow(() -> new ProductNotExist(new ProductId(productId)));

        product.addReview(id, userId, rating, comment);

        this.repository.save(product);
        // this.eventBus.publish(product.pullDomainEvents());
    }
}
