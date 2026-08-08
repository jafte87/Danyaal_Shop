from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Categories
    path('categories/', views.CategoryListView.as_view(), name='category-list'),

    # Filter
    path('products/filters/', views.ProductFiltersView.as_view(), name='product-filters'),

    # Products
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),

    # Auth
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # Wishlist
    path('wishlist/', views.WishlistView.as_view(), name='wishlist'),
    path('wishlist/<int:product_id>/', views.WishlistAddRemoveView.as_view(), name='wishlist-toggle'),

    # Orders
    path('orders/', views.OrderListView.as_view(), name='order-list'),
    path('orders/create/', views.OrderCreateView.as_view(), name='order-create'),
    path('orders/create-from-session/', views.CreateOrderFromSessionView.as_view(), name='create-order-from-session'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
    # Shipping + Discount
    path('shipping/', views.ShippingOptionListView.as_view(), name='shipping-list'),
    path('discount/validate/', views.DiscountValidateView.as_view(), name='discount-validate'),

    # Testimonials
    path('testimonials/', views.TestimonialListView.as_view(), name='testimonial-list'),

    # Sell Your Phone
    path('sell/', views.SellYourPhoneView.as_view(), name='sell-your-phone'),

    # Newsletter
    path('newsletter/', views.NewsletterView.as_view(), name='newsletter'),

    # Banners
    path('banners/', views.BannerListView.as_view(), name='banner-list'),
    path('benefits-banner/', views.BenefitsBannerView.as_view(), name='benefits-banner'),
    path('section-backgrounds/', views.SectionBackgroundView.as_view(), name='section-backgrounds'),
    
    path('auth/delete/', views.DeleteAccountView.as_view(), name='delete-account'),
    path('auth/profile/', views.UserProfileView.as_view(), name='user-profile'),

    path('checkout/create-session/', views.CreateCheckoutSessionView.as_view(), name='create-checkout-session'),

    path('about/', views.AboutUsView.as_view(), name='about-us'),

    path('contact-info/', views.ContactInfoView.as_view(), name='contact-info'),

    path('contact/', views.ContactSubmissionView.as_view(), name='contact-submission'),

    path('faqs/', views.FAQListView.as_view(), name='faqs'),

    path('policy/<str:page>/', views.PolicyPageView.as_view(), name='policy-page'),

    path('webhook/', views.StripeWebhookView.as_view(), name='stripe-webhook'),

    path('social-links/', views.SocialLinksView.as_view(), name='social-links'),

]