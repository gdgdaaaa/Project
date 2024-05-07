from django.core.management.base import BaseCommand
from demo.ml_utils.recommender_system import RecommenderSystem


class Command(BaseCommand):
    help = 'Calculates and stores student and course similarities in the database.'

    def handle(self, *args, **options):
        recommender_system = RecommenderSystem()
        recommender_system.calculate()
        self.stdout.write(self.style.SUCCESS('Successfully calculated and saved similarities.'))