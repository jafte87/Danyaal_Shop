from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User, Category, Product, ProductImage,
    ShippingOption, Discount, Order, OrderItem,
    Wishlist, Testimonial, SellYourPhone,
    SellYourPhoneImage, Newsletter, Banner
)

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3  # shows 3 empty image slots by default

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    exclude = ['slug']
    inlines = [ProductImageInline]

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    exclude = ['slug']

admin.site.register(User, UserAdmin)
admin.site.register(ShippingOption)
admin.site.register(Discount)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Wishlist)
admin.site.register(Testimonial)
admin.site.register(SellYourPhone)
admin.site.register(SellYourPhoneImage)
admin.site.register(Newsletter)
admin.site.register(Banner)