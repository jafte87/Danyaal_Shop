from rest_framework import serializers
from .models import (
    Category, Product, ProductImage,
    User, Order, OrderItem, ShippingOption,
    Discount, Wishlist, Testimonial,
    SellYourPhone, SellYourPhoneImage,
    Newsletter, Banner, AboutUs, ContactInfo,
    ContactSubmission, FAQ, PolicyPage, SocialLinks
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'order']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_id', 'brand', 'model', 'slug',
            'storage', 'colour', 'condition', 'battery_health',
            'network_status', 'accessories', 'warranty_period',
            'price', 'in_stock', 'delivery_estimate', 'description',
            'is_featured', 'is_new_arrival', 'is_best_seller',
            'meta_title', 'meta_description', 'created_at', 'images'
        ]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'address', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
        )
        return user
    
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'status', 'shipping_option',
            'shipping_address', 'total_price', 'discount',
            'stripe_payment_id', 'created_at', 'updated_at', 'items'
        ]
        extra_kwargs = {
            'stripe_payment_id': {'read_only': True},
            'user': {'read_only': True},
        }

class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'created_at']

class ShippingOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingOption
        fields = ['id', 'name', 'price', 'delivery_estimate']

class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['id', 'code', 'discount_type', 'value', 'min_order_value', 'expires_at']

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'customer_name', 'customer_avatar', 'comment', 'rating']

class SellYourPhoneSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = SellYourPhone
        fields = [
            'id', 'brand', 'model', 'storage', 'condition',
            'network', 'imei', 'customer_name', 'customer_email',
            'customer_phone', 'notes', 'images', 'created_at'
        ]

    def create(self, validated_data):
        images = validated_data.pop('images', [])
        submission = SellYourPhone.objects.create(**validated_data)
        for image in images:
            SellYourPhoneImage.objects.create(submission=submission, image=image)
        return submission
    
class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ['id', 'email']

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ['id', 'image', 'mobile_image', 'title', 'subtitle', 'link', 'order', 'page']

class AboutUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutUs
        fields = ['id', 'title', 'description', 'image', 'mission']

class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = ['email', 'phone', 'whatsapp', 'address', 'hours']

class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['name', 'email', 'phone', 'subject', 'message']

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'order']

class PolicyPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PolicyPage
        fields = '__all__'

class SocialLinksSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLinks
        fields = ['instagram', 'facebook', 'tiktok', 'whatsapp', 'x_twitter', 'youtube']