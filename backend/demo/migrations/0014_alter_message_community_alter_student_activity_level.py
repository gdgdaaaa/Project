# Generated by Django 4.1 on 2024-04-26 13:34

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("demo", "0013_homostudentsimilarity"),
    ]

    operations = [
        migrations.AlterField(
            model_name="message",
            name="community",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="messages",
                to="demo.community",
            ),
        ),
        migrations.AlterField(
            model_name="student",
            name="activity_level",
            field=models.FloatField(
                default=0.5,
                validators=[
                    django.core.validators.MaxValueValidator(1),
                    django.core.validators.MinValueValidator(0),
                ],
            ),
        ),
    ]