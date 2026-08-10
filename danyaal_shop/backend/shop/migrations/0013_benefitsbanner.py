# Generated manually
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0012_sociallinks'),
    ]

    operations = [
        migrations.CreateModel(
            name='BenefitsBanner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='Benefits Banner', max_length=100)),
                ('desktop_image', models.ImageField(upload_to='banners/')),
                ('mobile_image', models.ImageField(blank=True, null=True, upload_to='banners/')),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
    ]
