package tv.codely.ecommerce.products.domain;

public class Product {
    private final ProductId id;
    private final ProductName name;
    private final ProductPrice price;

    public Product(String id, String name, String price) {
        this.id = new ProductId(id);
        this.name = new ProductName(name);
        this.price = new ProductPrice(price);
    }
}
