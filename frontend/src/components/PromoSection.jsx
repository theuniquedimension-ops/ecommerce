import React from 'react';

const PromoSection = ({ image, products }) => {
    return (
        <div className="featuredSection">
            <div className="featuredBanner">
                <img src={image} alt="banner" />
            </div>
            <div className="slider">
                {products.map((product) => (
                    <div className="card" key={product.id}>
                        <img src={product.image} alt="product" className="carding" />
                        <h2>{product.name}</h2>
                        <p>{product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PromoSection;
