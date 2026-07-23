from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import (
    Category, Product, ShippingOption,
    Discount, Order, OrderItem, Wishlist,
    Testimonial, SellYourPhone, Newsletter, Banner
)
from .serializers import (
    CategorySerializer, ProductSerializer, UserSerializer,
    OrderSerializer, OrderItemSerializer, ShippingOptionSerializer,
    DiscountSerializer, WishlistSerializer, TestimonialSerializer,
    SellYourPhoneSerializer, NewsletterSerializer, BannerSerializer
)
from django.db.models import Count

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.filter(in_stock=True)
        
        brand = self.request.query_params.get('brand')
        model = self.request.query_params.get('model')
        condition = self.request.query_params.get('condition')
        storage = self.request.query_params.get('storage')
        colour = self.request.query_params.get('colour')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        search = self.request.query_params.get('search')
        is_featured = self.request.query_params.get('is_featured')
        is_new_arrival = self.request.query_params.get('is_new_arrival')
        is_best_seller = self.request.query_params.get('is_best_seller')

        if brand:
            queryset = queryset.filter(brand__icontains=brand)
        if model:
            queryset = queryset.filter(model__icontains=model)
        if condition:
            queryset = queryset.filter(condition=condition)
        if storage:
            queryset = queryset.filter(storage=storage)
        if colour:
            queryset = queryset.filter(colour__icontains=colour)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if search:
            queryset = queryset.filter(
                brand__icontains=search
            ) | queryset.filter(
                model__icontains=search
            )
        if is_featured:
            queryset = queryset.filter(is_featured=True)
        if is_new_arrival:
            queryset = queryset.filter(is_new_arrival=True)
        if is_best_seller:
            queryset = queryset.filter(is_best_seller=True)

        return queryset
    
class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    queryset = Product.objects.all()

class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
class WishlistView(generics.ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)


class WishlistAddRemoveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
            wishlist_item, created = Wishlist.objects.get_or_create(
                user=request.user,
                product=product
            )
            if not created:
                wishlist_item.delete()
                return Response({'status': 'removed'})
            return Response({'status': 'added'})
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ShippingOptionListView(generics.ListAPIView):
    serializer_class = ShippingOptionSerializer
    permission_classes = [AllowAny]
    queryset = ShippingOption.objects.filter(is_active=True)


class DiscountValidateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        try:
            discount = Discount.objects.get(code=code, is_active=True)
            from django.utils import timezone
            if discount.expires_at and discount.expires_at < timezone.now():
                return Response(
                    {'error': 'Discount code has expired'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            return Response(DiscountSerializer(discount).data)
        except Discount.DoesNotExist:
            return Response(
                {'error': 'Invalid discount code'},
                status=status.HTTP_404_NOT_FOUND
            )
        

class TestimonialListView(generics.ListAPIView):
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]
    queryset = Testimonial.objects.filter(is_active=True)


class SellYourPhoneView(generics.CreateAPIView):
    serializer_class = SellYourPhoneSerializer
    permission_classes = [AllowAny]


class NewsletterView(generics.CreateAPIView):
    serializer_class = NewsletterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        if Newsletter.objects.filter(email=email).exists():
            return Response(
                {'error': 'Email already subscribed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)


class BannerListView(generics.ListAPIView):
    serializer_class = BannerSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        page = self.request.query_params.get('page', 'home')
        return Banner.objects.filter(is_active=True, page=page)

class ProductFiltersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        brands = Product.objects.values_list('brand', flat=True).distinct()
        colours = Product.objects.values_list('colour', flat=True).distinct()
        storages = Product.objects.values_list('storage', flat=True).distinct()
        conditions = Product.objects.values_list('condition', flat=True).distinct()

        return Response({
            'brands': list(brands),
            'colours': list(colours),
            'storages': list(storages),
            'conditions': list(conditions),
        })