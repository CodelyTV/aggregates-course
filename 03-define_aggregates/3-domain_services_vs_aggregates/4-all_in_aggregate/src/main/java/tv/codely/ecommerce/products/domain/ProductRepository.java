package tv.codely.ecommerce.products.domain;

import java.util.Optional;

public interface ProductRepository {
    Optional<Product> search(ProductId id);

    void save(Product product);
}
