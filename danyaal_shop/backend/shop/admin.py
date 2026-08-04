from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from unfold.admin import ModelAdmin as UnfoldModelAdmin, TabularInline as UnfoldTabularInline
from .models import (
    User, Category, Product, ProductImage,
    ShippingOption, Discount, Order, OrderItem,
    Wishlist, Testimonial, SellYourPhone,
    SellYourPhoneImage, Newsletter, Banner, ContactInfo,
    AboutUs, ContactSubmission, FAQ, PolicyPage, SocialLinks
)


class ProductImageInline(UnfoldTabularInline):
    model = ProductImage
    extra = 3


@admin.register(Product)
class ProductAdmin(UnfoldModelAdmin):
    exclude = ['slug']
    inlines = [ProductImageInline]
    list_display = ('__str__', 'brand', 'model', 'storage', 'colour', 'condition', 'price', 'in_stock', 'is_featured', 'is_best_seller', 'is_new_arrival')
    list_display_links = ('__str__', 'brand', 'model', 'storage', 'colour', 'condition')
    list_filter = ('brand', 'condition', 'in_stock', 'is_featured', 'is_best_seller', 'is_new_arrival', 'category')
    search_fields = ('brand', 'model', 'colour', 'storage')
    list_editable = ('price', 'in_stock', 'is_featured', 'is_best_seller', 'is_new_arrival')


@admin.register(Category)
class CategoryAdmin(UnfoldModelAdmin):
    exclude = ['slug']
    list_display = ('name',)
    list_display_links = ('name',)


class OrderItemInline(UnfoldTabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'price')


@admin.register(Order)
class OrderAdmin(UnfoldModelAdmin):
    list_display = ('id', 'user', 'status', 'total_price', 'shipping_option', 'created_at')
    list_display_links = ('id', 'user', 'total_price', 'shipping_option', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'user__username', 'stripe_payment_id')
    readonly_fields = ('stripe_payment_id', 'created_at', 'updated_at')
    inlines = [OrderItemInline]
    list_editable = ('status',)


@admin.register(Discount)
class DiscountAdmin(UnfoldModelAdmin):
    list_display = ('code', 'discount_type', 'value', 'is_active', 'expires_at')
    list_display_links = ('code', 'discount_type', 'value', 'expires_at')
    list_editable = ('is_active',)


@admin.register(SellYourPhone)
class SellYourPhoneAdmin(UnfoldModelAdmin):
    list_display = ('brand', 'model', 'storage', 'condition', 'customer_name', 'customer_email', 'created_at')
    list_display_links = ('brand', 'model', 'storage', 'condition', 'customer_name', 'customer_email', 'created_at')
    list_filter = ('brand', 'condition')
    search_fields = ('brand', 'model', 'customer_email', 'customer_name')


@admin.register(Newsletter)
class NewsletterAdmin(UnfoldModelAdmin):
    list_display = ('email', 'created_at')
    list_display_links = ('email', 'created_at')
    search_fields = ('email',)


@admin.register(Banner)
class BannerAdmin(UnfoldModelAdmin):
    list_display = ('title', 'page', 'is_active')
    list_display_links = ('title', 'page')
    list_editable = ('is_active',)
    list_filter = ('page', 'is_active')


@admin.register(Testimonial)
class TestimonialAdmin(UnfoldModelAdmin):
    list_display = ('customer_name', 'rating', 'is_active')
    list_display_links = ('customer_name', 'rating')
    list_editable = ('is_active',)


@admin.register(FAQ)
class FAQAdmin(UnfoldModelAdmin):
    list_display = ('question', 'is_active')
    list_display_links = ('question',)
    list_editable = ('is_active',)


@admin.register(PolicyPage)
class PolicyPageAdmin(UnfoldModelAdmin):
    list_display = ('page',)
    list_display_links = ('page',)


@admin.register(ContactInfo)
class ContactInfoAdmin(UnfoldModelAdmin):
    list_display = ('__str__', 'is_active')
    list_display_links = ('__str__',)
    list_editable = ('is_active',)


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(UnfoldModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at')
    list_display_links = ('name', 'email', 'subject', 'created_at')
    search_fields = ('name', 'email')
    readonly_fields = ('name', 'email', 'subject', 'message', 'created_at')


@admin.register(AboutUs)
class AboutUsAdmin(UnfoldModelAdmin):
    list_display = ('title', 'is_active')
    list_display_links = ('title',)
    list_editable = ('is_active',)


@admin.register(ShippingOption)
class ShippingOptionAdmin(UnfoldModelAdmin):
    list_display = ('name', 'price', 'delivery_estimate', 'is_active')
    list_display_links = ('name', 'price', 'delivery_estimate')
    list_editable = ('is_active',)


# Register User with Unfold-aware UserAdmin
class CustomUserAdmin(UnfoldModelAdmin, UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    list_display_links = ('username', 'email', 'first_name', 'last_name')
    search_fields = ('username', 'email', 'first_name', 'last_name')


admin.site.register(User, CustomUserAdmin)
admin.site.register(Wishlist)
admin.site.register(SellYourPhoneImage)


@admin.register(SocialLinks)
class SocialLinksAdmin(UnfoldModelAdmin):
    fieldsets = [
        ('Social Media Links', {'fields': ['instagram', 'facebook', 'tiktok', 'whatsapp', 'x_twitter', 'youtube']}),
    ]

    def has_add_permission(self, request):
        # Only allow one record
        return not SocialLinks.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False