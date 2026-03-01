import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
    en: {
        translation: {
            "home": "Home",
            "products": "Products",
            "cart": "Cart",
            "checkout": "Checkout",
            "login": "Login",
            "register": "Register",
            "add_to_cart": "Add to Cart",
            "free_shipping": "Free Shipping",
            "easy_returns": "Easy Returns",
            "secure_payment": "Secure Payment",
            "newsletter_title": "Get 10% Off Your First Order!",
            "subscribe": "Subscribe",
        }
    },
    fr: {
        translation: {
            "home": "Accueil",
            "products": "Produits",
            "cart": "Panier",
            "checkout": "Paiement",
            "login": "Connexion",
            "register": "S'inscrire",
            "add_to_cart": "Ajouter au panier",
            "free_shipping": "Livraison Gratuite",
            "easy_returns": "Retours Faciles",
            "secure_payment": "Paiement Sécurisé",
            "newsletter_title": "Obtenez 10% sur votre première commande !",
            "subscribe": "S'abonner",
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
