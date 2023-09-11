package tv.codely.ecommerce.product.domain;

public class ProductNotExist extends RuntimeException {
    public ProductNotExist(ProductId id) {
        super("The product with id <" + id.value() + "> does not exist");
    }
}
