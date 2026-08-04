"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from shop.models import Product
from django.utils import timezone


def sitemap_xml(request):
    """Dynamic XML sitemap covering all static pages and active product pages."""
    base = 'https://danyaalshop.com'  # update to real domain before launch
    today = timezone.now().date().isoformat()

    static_pages = [
        ('/', '1.0', 'daily'),
        ('/shop', '0.9', 'daily'),
        ('/sell-your-phone', '0.8', 'weekly'),
        ('/about-us', '0.6', 'monthly'),
        ('/contact-us', '0.6', 'monthly'),
        ('/faqs', '0.6', 'monthly'),
        ('/warranty-information', '0.5', 'monthly'),
        ('/returns-refund-policy', '0.5', 'monthly'),
        ('/privacy-policy', '0.4', 'yearly'),
        ('/terms-and-conditions', '0.4', 'yearly'),
    ]

    urls_xml = ''
    for loc, priority, freq in static_pages:
        urls_xml += (
            f'  <url>\n'
            f'    <loc>{base}{loc}</loc>\n'
            f'    <lastmod>{today}</lastmod>\n'
            f'    <changefreq>{freq}</changefreq>\n'
            f'    <priority>{priority}</priority>\n'
            f'  </url>\n'
        )

    products = Product.objects.filter(in_stock=True).values('slug', 'created_at')
    for product in products:
        lastmod = product['created_at'].date().isoformat() if product.get('created_at') else today
        urls_xml += (
            f'  <url>\n'
            f'    <loc>{base}/product/{product["slug"]}</loc>\n'
            f'    <lastmod>{lastmod}</lastmod>\n'
            f'    <changefreq>weekly</changefreq>\n'
            f'    <priority>0.8</priority>\n'
            f'  </url>\n'
        )

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + urls_xml +
        '</urlset>'
    )
    return HttpResponse(xml, content_type='application/xml')


def robots_txt(request):
    """Standard robots.txt pointing search engines to the sitemap."""
    lines = [
        'User-agent: *',
        'Disallow: /admin/',
        'Disallow: /api/',
        '',
        'Sitemap: https://danyaalshop.com/sitemap.xml',
    ]
    return HttpResponse('\n'.join(lines), content_type='text/plain')


urlpatterns = [
    path('portal/', admin.site.urls),
    path('api/', include('shop.urls')),
    path('sitemap.xml', sitemap_xml, name='sitemap'),
    path('robots.txt', robots_txt, name='robots-txt'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)