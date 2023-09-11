package tv.codely.ecommerce.products.application;

import tv.codely.ecommerce.products.domain.Product;
import tv.codely.ecommerce.products.domain.ProductId;
import tv.codely.ecommerce.products.domain.ProductNotExist;
import tv.codely.ecommerce.products.domain.ProductRepository;

public record ProductFinder(ProductRepository repository) {
    public Product find(String id) {
        return this.repository
            .search(new ProductId(id))
            .orElseThrow(() -> new ProductNotExist(new ProductId(id)));
    }
}
