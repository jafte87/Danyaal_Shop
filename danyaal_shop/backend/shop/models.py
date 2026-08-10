from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from io import BytesIO
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import UploadedFile


def compress_image(image_field, max_width=1920, quality=85):
    """Resize to max_width and re-save as JPEG at given quality."""
    if not image_field:
        return
        
    # Only compress if it's a newly uploaded file, not an already saved file
    if getattr(image_field, 'file', None) and not isinstance(image_field.file, UploadedFile):
        return
        
    try:
        from PIL import Image as PilImage
        img = PilImage.open(image_field)
        
        # Resize FIRST to drastically reduce memory usage during mode conversion
        if img.width > max_width:
            ratio = max_width / img.width
            img = img.resize((max_width, int(img.height * ratio)), PilImage.LANCZOS)
            
        # Convert to RGB (JPEG doesn't support transparency)
        if img.mode in ('RGBA', 'LA', 'P'):
            background = PilImage.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'RGBA':
                background.paste(img, mask=img.split()[3])
            else:
                background.paste(img.convert('RGBA'), mask=img.convert('RGBA').split()[3])
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
            
        output = BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        output.seek(0)
        base_name = image_field.name.rsplit('.', 1)[0] + '.jpg'
        image_field.save(base_name, ContentFile(output.read()), save=False)
    except Exception:
        pass  # If compression fails, keep original


class User(AbstractUser):
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)

    def __str__(self):
        return self.email or self.username
    

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'


class Product(models.Model):
    CONDITION_CHOICES = [
        ('good', 'Good'),
        ('very_good', 'Very Good'),
        ('excellent', 'Excellent'),
        ('new', 'New'),
    ]
    NETWORK_CHOICES = [
        ('unlocked', 'Unlocked'),
        ('locked', 'Locked'),
    ]

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    storage = models.CharField(max_length=20)
    colour = models.CharField(max_length=50)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    battery_health = models.PositiveIntegerField(blank=True, null=True, help_text="iPhones only, percentage")
    network_status = models.CharField(max_length=20, choices=NETWORK_CHOICES)
    accessories = models.CharField(max_length=255, blank=True)
    warranty_period = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    in_stock = models.BooleanField(default=True)
    delivery_estimate = models.CharField(max_length=100)
    description = models.TextField()
    is_featured = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)
    is_best_seller = models.BooleanField(default=False)
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.brand}-{self.model}-{self.storage}-{self.colour}")
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.brand} {self.model} - {self.storage} - {self.colour}"
    

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.product}"
    

class ShippingOption(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    delivery_estimate = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    

class Discount(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed'),
    ]
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES)
    value = models.DecimalField(max_digits=8, decimal_places=2)
    min_order_value = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code
    

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipping_option = models.ForeignKey(ShippingOption, on_delete=models.SET_NULL, null=True)
    shipping_address = models.TextField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.ForeignKey(Discount, on_delete=models.SET_NULL, blank=True, null=True)
    stripe_payment_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user}"
    

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product} in Order #{self.order.id}"
    

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user} - {self.product}"
    

class Testimonial(models.Model):
    customer_name = models.CharField(max_length=100)
    customer_avatar = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    comment = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_name} - {self.rating}★"
    

class SellYourPhone(models.Model):
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    storage = models.CharField(max_length=20)
    condition = models.CharField(max_length=50)
    network = models.CharField(max_length=50)
    imei = models.CharField(max_length=20, blank=True)
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    customer_address = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.brand} {self.model} - {self.customer_name}"
    

class SellYourPhoneImage(models.Model):
    submission = models.ForeignKey(SellYourPhone, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='sell_submissions/')

    def __str__(self):
        return f"Image for submission #{self.submission.id}"
    

class Newsletter(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class AboutUs(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='about/', blank=True, null=True)
    mission = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

class Banner(models.Model):
    PAGE_CHOICES = [
        ('home', 'Home'),
        ('shop', 'Shop'),
        ('sell', 'Sell Your Phone'),
        ('about', 'About Us'),
        ('contact', 'Contact Us'),
        ('faqs', 'FAQs'),
    ]
    image = models.ImageField(upload_to='banners/')
    mobile_image = models.ImageField(upload_to='banners/', blank=True, null=True)
    title = models.CharField(max_length=255, blank=True)
    subtitle = models.CharField(max_length=255, blank=True)
    link = models.URLField(blank=True)
    page = models.CharField(max_length=20, choices=PAGE_CHOICES, default='home')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.page} - {self.title or f'Banner #{self.id}'}"

    def save(self, *args, **kwargs):
        if self.image:
            compress_image(self.image, max_width=1920)
        if self.mobile_image:
            compress_image(self.mobile_image, max_width=768)
        super().save(*args, **kwargs)


class BenefitsBanner(models.Model):
    title = models.CharField(max_length=100, default='Benefits Banner')
    desktop_image = models.ImageField(upload_to='banners/')
    mobile_image = models.ImageField(upload_to='banners/', blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.desktop_image:
            compress_image(self.desktop_image, max_width=1920)
        if self.mobile_image:
            compress_image(self.mobile_image, max_width=768)
        super().save(*args, **kwargs)


class SectionBackground(models.Model):
    SECTION_CHOICES = [
        ('best_sellers', 'Best Sellers'),
        ('new_arrivals', 'New Arrivals'),
        ('featured_products', 'Featured Products'),
    ]
    section = models.CharField(
        max_length=30, choices=SECTION_CHOICES, unique=True
    )
    background_image = models.ImageField(upload_to='sections/')
    mobile_background_image = models.ImageField(upload_to='sections/', blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.get_section_display()

    def save(self, *args, **kwargs):
        if self.background_image:
            compress_image(self.background_image, max_width=1920)
        if self.mobile_background_image:
            compress_image(self.mobile_background_image, max_width=768)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Section Background'
        verbose_name_plural = 'Section Backgrounds'


class ContactInfo(models.Model):
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    whatsapp = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    hours = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return "Contact Info"

    class Meta:
        verbose_name_plural = 'Contact Info'

class ContactSubmission(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=100)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"

class FAQ(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.question

class PolicyPage(models.Model):
    PAGE_CHOICES = [
        ('warranty', 'Warranty Information'),
        ('returns', 'Returns & Refund Policy'),
        ('privacy', 'Privacy Policy'),
        ('terms', 'Terms & Conditions'),
    ]
    page = models.CharField(max_length=20, choices=PAGE_CHOICES, unique=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class SocialLinks(models.Model):
    instagram = models.URLField(blank=True)
    facebook = models.URLField(blank=True)
    tiktok = models.URLField(blank=True)
    whatsapp = models.URLField(blank=True)
    x_twitter = models.URLField(blank=True, verbose_name='X (Twitter)')
    youtube = models.URLField(blank=True)

    def __str__(self):
        return 'Social Media Links'

    class Meta:
        verbose_name = 'Social Media Links'
        verbose_name_plural = 'Social Media Links'