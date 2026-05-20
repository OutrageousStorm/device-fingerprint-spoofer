#!/usr/bin/env python3
"""Generate realistic Android fingerprints"""
import random, subprocess

BRANDS = ['google', 'samsung', 'nokia', 'motorola']
MODELS = {'google': ['Pixel 8', 'Pixel 7'], 'samsung': ['Galaxy S24', 'Galaxy S23']}

def generate():
    brand = random.choice(BRANDS)
    model = random.choice(MODELS.get(brand, ['Unknown']))
    build = f"{brand}/{model.lower()}/generic:15/{random.randint(100,500)}:user/release-keys"
    return build

if __name__ == '__main__':
    print(f"Generated fingerprint: {generate()}")
