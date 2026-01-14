import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create products
  const products = [
    {
      name: '21-Day Protocol',
      slug: '21-day-protocol',
      price: 2700, // €27 in cents
      description: 'Complete 21-day attachment healing program with daily exercises, journaling prompts, and guided meditations.',
      fileUrl: null, // Will be set to actual file URL when uploaded
      active: true,
    },
    {
      name: 'Premium PDF Guide',
      slug: 'premium-pdf',
      price: 900, // €9 in cents
      description: 'Comprehensive PDF guide to understanding and healing anxious attachment patterns.',
      fileUrl: null,
      active: true,
    },
    {
      name: 'Free PDF Guide',
      slug: 'free-pdf',
      price: 0, // Free
      description: 'Introduction to attachment styles and healing basics.',
      fileUrl: null,
      active: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        price: product.price,
        description: product.description,
        active: product.active,
      },
      create: product,
    });
    console.log(`Created/updated product: ${product.name}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
