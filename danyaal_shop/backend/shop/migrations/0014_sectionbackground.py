# Generated manually
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0013_benefitsbanner'),
    ]

    operations = [
        migrations.CreateModel(
            name='SectionBackground',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('section', models.CharField(choices=[('best_sellers', 'Best Sellers'), ('new_arrivals', 'New Arrivals'), ('featured_products', 'Featured Products')], max_length=30, unique=True)),
                ('background_image', models.ImageField(upload_to='sections/')),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'Section Background',
                'verbose_name_plural': 'Section Backgrounds',
            },
        ),
    ]
