from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings as django_settings
from .models import AboutUs
from .serializers import AboutUsSerializer
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import (
    Category, Product, ShippingOption,
    Discount, Order, OrderItem, Wishlist,
    Testimonial, SellYourPhone, Newsletter, Banner,
    ContactInfo, ContactSubmission, FAQ, PolicyPage, SocialLinks
)
from .serializers import (
    CategorySerializer, ProductSerializer, UserSerializer,
    OrderSerializer, OrderItemSerializer, ShippingOptionSerializer,
    DiscountSerializer, WishlistSerializer, TestimonialSerializer,
    SellYourPhoneSerializer, NewsletterSerializer, BannerSerializer, ContactInfoSerializer,
    ContactSubmissionSerializer, FAQSerializer, PolicyPageSerializer, SocialLinksSerializer
)
from django.db.models import Count
from rest_framework.pagination import PageNumberPagination
from .models import User
from django.db.models import Q


def send_order_confirmation_email(order, order_items, customer_email, customer_name, shipping_address):
    """
    Send an order confirmation email to the customer and a notification to the store owner.
    Wrapped in try/except so a misconfigured SMTP never blocks order creation.
    """
    try:
        # --- Build items list ---
        items_text = '\n'.join(
            f"  • {item.product.brand} {item.product.model} ({item.product.storage}, {item.product.colour}) — £{item.price}"
            for item in order_items
            if item.product
        ) or '  • (items not available)'

        subject = f"Order Confirmed — #{order.id} | Danyaal Shop"

        customer_body = (
            f"Hi {customer_name or 'there'},\n\n"
            f"Thank you for your order! Here's a summary:\n\n"
            f"Order #{order.id}\n"
            f"Date: {order.created_at.strftime('%d %B %Y')}\n\n"
            f"Items:\n{items_text}\n\n"
            f"Total: £{order.total_price}\n"
            f"Shipping to: {shipping_address}\n\n"
            f"We'll be in touch once your order has been dispatched.\n\n"
            f"Thanks,\nThe Danyaal Shop Team"
        )

        owner_body = (
            f"New order received!\n\n"
            f"Order #{order.id}\n"
            f"Customer: {customer_name or 'Guest'} <{customer_email}>\n"
            f"Shipping to: {shipping_address}\n\n"
            f"Items:\n{items_text}\n\n"
            f"Total: £{order.total_price}\n"
        )

        from_email = django_settings.DEFAULT_FROM_EMAIL
        owner_email = getattr(django_settings, 'EMAIL_ORDER_RECIPIENT', None)

        # Send to customer
        if customer_email:
            send_mail(subject, customer_body, from_email, [customer_email], fail_silently=False)

        # Notify store owner
        if owner_email:
            send_mail(
                f"[New Order] #{order.id} — £{order.total_price}",
                owner_body,
                from_email,
                [owner_email],
                fail_silently=False,
            )
    except Exception as email_err:
        # Never let email failure crash the order flow
        print(f'[EMAIL ERROR] Could not send confirmation email: {email_err}', flush=True)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ProductPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 48
    
from django.db.models import Q
import stripe
from django.conf import settings
stripe.api_key = settings.STRIPE_SECRET_KEY



class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    pagination_class = ProductPagination

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
                Q(brand__icontains=search) |
                Q(model__icontains=search) |
                Q(colour__icontains=search) |
                Q(storage__icontains=search)
            )
        if is_featured == 'true':
            queryset = queryset.filter(is_featured=True)
        if is_new_arrival == 'true':
            queryset = queryset.filter(is_new_arrival=True)
        if is_best_seller == 'true':
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
        
        try:
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
        except User.DoesNotExist:
            user = None

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

class CreateOrderFromSessionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        import traceback as tb
        def log_debug(msg):
            print(msg, flush=True)
            with open('debug_order.log', 'a') as f:
                f.write(msg + '\n')

        session_id = request.data.get('session_id')
        log_debug('--- NEW ORDER REQUEST ---')
        log_debug(f'session_id: {session_id}')

        if not session_id:
            return Response({'error': 'No session ID'}, status=400)

        try:
            session = stripe.checkout.Session.retrieve(session_id)
            log_debug(f'Status: {session.status}, Payment: {session.payment_status}')

            if Order.objects.filter(stripe_payment_id=session_id).exists():
                log_debug('Order already exists.')
                return Response({'status': 'already created'})

            if session.payment_status != 'paid':
                log_debug(f'Not paid: {session.payment_status}')
                return Response({'error': f'Payment not completed: {session.payment_status}'}, status=400)

            # ---- Resolve user ----
            if request.user and request.user.is_authenticated:
                user = request.user
                log_debug(f'Authenticated user: {user}')
            else:
                # session.metadata is a Stripe object — use getattr, NOT .get()
                metadata = getattr(session, 'metadata', None)
                user_id = getattr(metadata, 'user_id', None) if metadata else None
                log_debug(f'metadata user_id: {user_id}')
                user = None
                if user_id:
                    try:
                        user = User.objects.get(id=user_id)
                    except User.DoesNotExist:
                        pass

            # ---- Resolve shipping address ----
            customer_details = getattr(session, 'customer_details', None)
            shipping_address = 'No address provided'
            if customer_details:
                address = getattr(customer_details, 'address', None)
                if address:
                    parts = [
                        getattr(address, 'line1', '') or '',
                        getattr(address, 'line2', '') or '',
                        getattr(address, 'city', '') or '',
                        getattr(address, 'postal_code', '') or '',
                        getattr(address, 'country', '') or '',
                    ]
                    shipping_address = ' '.join(p for p in parts if p).strip() or 'No address provided'
                else:
                    shipping_address = getattr(customer_details, 'name', '') or 'No address provided'

            # ---- Resolve shipping option ----
            metadata = getattr(session, 'metadata', None)
            shipping_option_id = getattr(metadata, 'shipping_option_id', None) if metadata else None
            shipping_option_obj = None
            if shipping_option_id:
                try:
                    shipping_option_obj = ShippingOption.objects.get(id=shipping_option_id)
                except ShippingOption.DoesNotExist:
                    pass

            log_debug('Creating Order in DB...')
            order = Order.objects.create(
                user=user,
                status='processing',
                shipping_address=shipping_address,
                shipping_option=shipping_option_obj,
                total_price=session.amount_total / 100,
                stripe_payment_id=session_id,
            )
            log_debug(f'Order #{order.id} created!')

            # ---- Create order items from Stripe line items ----
            log_debug('Fetching line items...')
            line_items = stripe.checkout.Session.list_line_items(session_id)
            for item in line_items.data:
                desc = getattr(item, 'description', '') or ''
                if 'Shipping' not in desc:
                    model_str = desc.split(' ')[-1] if ' ' in desc else desc
                    product = Product.objects.filter(model__icontains=model_str).first()
                    if product:
                        OrderItem.objects.create(
                            order=order,
                            product=product,
                            price=item.amount_total / 100
                        )
                        log_debug(f'OrderItem created: {product}')
                    else:
                        log_debug(f'No product match for: {model_str}')

            log_debug(f'SUCCESS: Order #{order.id} fully created')

            # ---- Send confirmation emails ----
            customer_email = getattr(customer_details, 'email', None) if customer_details else None
            customer_name = getattr(customer_details, 'name', None) if customer_details else None
            if not customer_email and user:
                customer_email = user.email
                customer_name = customer_name or f'{user.first_name} {user.last_name}'.strip() or user.email
            fresh_items = order.items.select_related('product').all()
            send_order_confirmation_email(order, fresh_items, customer_email, customer_name, shipping_address)
            log_debug(f'Emails dispatched for Order #{order.id}')

            return Response({'status': 'created', 'order_id': order.id})

        except stripe.error.StripeError as e:
            log_debug(f'Stripe error: {str(e)}')
            return Response({'error': f'Stripe error: {str(e)}'}, status=400)
        except Exception as e:
            log_debug(f'UNEXPECTED ERROR:\n{tb.format_exc()}')
            return Response({'error': str(e)}, status=400)
        
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
    
class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



class CreateCheckoutSessionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        cart_items = request.data.get('items', [])
        shipping_option = request.data.get('shipping_option', None)
        discount_code = request.data.get('discount_code', '')

        if not cart_items:
            return Response(
                {'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            line_items = []
            subtotal = 0

            for item in cart_items:
                price = float(item['price'])
                qty = int(item.get('quantity', 1))
                subtotal += price * qty
                line_items.append({
                    'price_data': {
                        'currency': 'gbp',
                        'product_data': {
                            'name': f"{item['brand']} {item['model']}",
                            'description': f"{item['storage']} · {item['colour']} · {item['condition']}",
                        },
                        'unit_amount': int(price * 100),
                    },
                    'quantity': qty,
                })

            if shipping_option:
                line_items.append({
                    'price_data': {
                        'currency': 'gbp',
                        'product_data': {
                            'name': f"Shipping — {shipping_option['name']}",
                        },
                        'unit_amount': int(float(shipping_option['price']) * 100),
                    },
                    'quantity': 1,
                })

            discounts = []
            if discount_code:
                try:
                    from django.utils import timezone
                    discount = Discount.objects.get(code=discount_code, is_active=True)
                    if not discount.expires_at or discount.expires_at > timezone.now():
                        if discount.discount_type == 'percentage':
                            discount_amount = int(subtotal * float(discount.value) / 100 * 100)
                        else:
                            discount_amount = int(min(float(discount.value), subtotal) * 100)
                        coupon = stripe.Coupon.create(
                            amount_off=discount_amount,
                            currency='gbp',
                            duration='once',
                        )
                        discounts = [{'coupon': coupon.id}]
                except Discount.DoesNotExist:
                    pass

            session = stripe.checkout.Session.create(
                line_items=line_items,
                mode='payment',
                shipping_address_collection={
                    'allowed_countries': ['GB'],
                },
                discounts=discounts if discounts else [],
                success_url='https://danyaal-project-wlyy.vercel.app/order/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url='https://danyaal-project-wlyy.vercel.app/cart',
                metadata={
                    'user_id': request.user.id if request.user.is_authenticated else None,
                    'discount_code': discount_code,
                    'shipping_option_id': shipping_option['id'] if shipping_option else None,
                }
            )

            return Response({'url': session.url})

        except Exception as e:
            print('STRIPE ERROR:', str(e))
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
class AboutUsView(generics.ListAPIView):
    serializer_class = AboutUsSerializer
    permission_classes = [AllowAny]
    queryset = AboutUs.objects.filter(is_active=True)

class ContactInfoView(generics.ListAPIView):
    serializer_class = ContactInfoSerializer
    permission_classes = [AllowAny]
    queryset = ContactInfo.objects.filter(is_active=True)

class ContactSubmissionView(generics.CreateAPIView):
    serializer_class = ContactSubmissionSerializer
    permission_classes = [AllowAny]

class FAQListView(generics.ListAPIView):
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]
    queryset = FAQ.objects.filter(is_active=True)

class PolicyPageView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, page):
        try:
            policy = PolicyPage.objects.get(page=page)
            serializer = PolicyPageSerializer(policy)
            return Response(serializer.data)
        except PolicyPage.DoesNotExist:
            return Response(
                {'error': 'Page not found'},
                status=status.HTTP_404_NOT_FOUND
            )

@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET

        try:
            if webhook_secret:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, webhook_secret
                )
            else:
                event = json.loads(payload)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            self.handle_successful_payment(session)

        return Response({'status': 'ok'})

    def handle_successful_payment(self, session):
        try:
            user_id = session.get('metadata', {}).get('user_id')
            user = User.objects.get(id=user_id) if user_id else None

            shipping_option_id = session.get('metadata', {}).get('shipping_option_id')
            shipping_option_obj = None
            if shipping_option_id:
                try:
                    shipping_option_obj = ShippingOption.objects.get(id=shipping_option_id)
                except ShippingOption.DoesNotExist:
                    pass

            # get line items from session
            line_items = stripe.checkout.Session.list_line_items(session['id'])

            customer_details = session.get('customer_details', {})
            address = customer_details.get('address', {})
            shipping_address = f"{address.get('line1', '')} {address.get('line2', '')} {address.get('city', '')} {address.get('postal_code', '')} {address.get('country', '')}".strip() or customer_details.get('name', '') or ''

            order = Order.objects.create(
                user=user,
                status='processing',
                shipping_address=shipping_address,
                shipping_option=shipping_option_obj,
                total_price=session['amount_total'] / 100,
                stripe_payment_id=session['id'],
            )

            for item in line_items.data:
                if 'Shipping' not in item['description']:
                    try:
                        product = Product.objects.get(
                            model__icontains=item['description'].split(' ')[1]
                        )
                        OrderItem.objects.create(
                            order=order,
                            product=product,
                            price=item['amount_total'] / 100
                        )
                    except Product.DoesNotExist:
                        pass
            # ---- Send confirmation emails via webhook path ----
            customer_details_w = session.get('customer_details', {})
            customer_email_w = customer_details_w.get('email') if customer_details_w else None
            customer_name_w = customer_details_w.get('name') if customer_details_w else None
            if not customer_email_w and user:
                customer_email_w = user.email
                customer_name_w = customer_name_w or f'{user.first_name} {user.last_name}'.strip() or user.email
            fresh_items_w = order.items.select_related('product').all()
            send_order_confirmation_email(order, fresh_items_w, customer_email_w, customer_name_w, shipping_address)

        except Exception as e:
            print('WEBHOOK ERROR:', str(e))


class SocialLinksView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        obj = SocialLinks.objects.first()
        if not obj:
            return Response({'instagram': '', 'facebook': '', 'tiktok': '', 'whatsapp': '', 'x_twitter': '', 'youtube': ''})
        serializer = SocialLinksSerializer(obj)
        return Response(serializer.data)
