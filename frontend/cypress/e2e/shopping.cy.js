describe('Luxe Store Shopping Flow', () => {
    beforeEach(() => {
        // Usually you would seed database or setup local storage here
        cy.visit('/');
    });

    it('loads the homepage and shows featured products', () => {
        cy.contains('Discover True Luxury').should('be.visible');
        cy.get('.product-card').should('have.length.at.least', 1);
    });

    it('can navigate to products page and view a product', () => {
        cy.contains('Products').click();
        cy.url().should('include', '/products');

        // Click on the first product
        cy.get('.product-card').first().click();

        // Make sure we are on product detail page
        cy.get('.add-to-cart-btn').should('be.visible');
    });

    it('can add a product to the cart', () => {
        // Direct link to avoid relying on dynamic data for basic smoke test
        cy.visit('/products/wireless-headphones');

        // Click add to cart
        cy.get('.add-to-cart-btn').click();

        // Expect success toast
        cy.contains('added to cart').should('be.visible');

        // Should show up in cart sidebar (if it auto-opens) or cart badge
        // Then navigate to cart
        cy.visit('/cart');
        cy.contains('Shopping Cart').should('be.visible');
        cy.get('.cart-item-row').should('have.length.at.least', 1);
    });
});
