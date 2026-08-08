# Generated manually
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0014_sectionbackground'),
    ]

    operations = [
        migrations.AddField(
            model_name='sectionbackground',
            name='mobile_background_image',
            field=models.ImageField(blank=True, null=True, upload_to='sections/'),
        ),
    ]
