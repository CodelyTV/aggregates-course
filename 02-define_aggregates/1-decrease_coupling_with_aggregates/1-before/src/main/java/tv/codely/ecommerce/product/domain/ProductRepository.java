package tv.codely.ecommerce.product.domain;

import java.util.Optional;

public interface ProductRepository {
    Optional<Product> search(ProductId id);

    void save(Product product);
}
