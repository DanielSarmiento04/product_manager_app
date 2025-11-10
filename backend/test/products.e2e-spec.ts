import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './../src/modules/products/entities/product.entity';
import { Repository } from 'typeorm';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let productsRepository: Repository<Product>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same global pipes as main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    productsRepository = moduleFixture.get<Repository<Product>>(
      getRepositoryToken(Product),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean the database before each test
    await productsRepository.query('DELETE FROM products');
  });

  describe('POST /products', () => {
    it('should create a new product', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Aspirin 500mg',
          description: 'Pain reliever and fever reducer',
          price: 9.99,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Aspirin 500mg');
          expect(res.body.description).toBe('Pain reliever and fever reducer');
          expect(res.body.price).toBe(9.99);
          expect(res.body).toHaveProperty('created_at');
          expect(res.body).toHaveProperty('updated_at');
        });
    });

    it('should create a product with minimum price', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Cheap Product',
          description: 'Very affordable',
          price: 0.01,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.price).toBe(0.01);
        });
    });

    it('should create a product with maximum valid price', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Expensive Product',
          description: 'Very expensive pharmaceutical',
          price: 999999.99,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.price).toBe(999999.99);
        });
    });

    it('should fail with validation error for missing name', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          description: 'Missing name field',
          price: 10.0,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('name');
        });
    });

    it('should fail with validation error for missing description', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Product Name',
          price: 10.0,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('description');
        });
    });

    it('should fail with validation error for missing price', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Product Name',
          description: 'Product description',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('price');
        });
    });

    it('should fail with validation error for negative price', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Product Name',
          description: 'Product description',
          price: -10.0,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBeDefined();
        });
    });

    it('should fail with validation error for name exceeding 255 characters', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'A'.repeat(256),
          description: 'Product description',
          price: 10.0,
        })
        .expect(400);
    });

    it('should accept name with exactly 255 characters', () => {
      const name = 'A'.repeat(255);
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: name,
          description: 'Product description',
          price: 10.0,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe(name);
          expect(res.body.name.length).toBe(255);
        });
    });

    it('should reject extra properties when forbidNonWhitelisted is true', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Product Name',
          description: 'Product description',
          price: 10.0,
          extraField: 'should not be allowed',
        })
        .expect(400);
    });

    it('should handle special characters in name', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Product™ with © symbols ® and émojis 🎉',
          description: 'Description with special chars',
          price: 10.0,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe(
            'Product™ with © symbols ® and émojis 🎉',
          );
        });
    });

    it('should convert string price to number', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Product Name',
          description: 'Product description',
          price: '19.99',
        })
        .expect(201)
        .expect((res) => {
          expect(typeof res.body.price).toBe('number');
          expect(res.body.price).toBe(19.99);
        });
    });
  });

  describe('GET /products', () => {
    it('should return an empty array when no products exist', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect([]);
    });

    it('should return all products', async () => {
      // Create test products
      await productsRepository.save([
        {
          name: 'Product 1',
          description: 'Description 1',
          price: 10.0,
        },
        {
          name: 'Product 2',
          description: 'Description 2',
          price: 20.0,
        },
        {
          name: 'Product 3',
          description: 'Description 3',
          price: 30.0,
        },
      ]);

      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(3);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('description');
          expect(res.body[0]).toHaveProperty('price');
          expect(res.body[0]).toHaveProperty('created_at');
          expect(res.body[0]).toHaveProperty('updated_at');
        });
    });

    it('should return products in correct format', async () => {
      await productsRepository.save({
        name: 'Aspirin 500mg',
        description: 'Pain reliever',
        price: 9.99,
      });

      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect((res) => {
          expect(res.body[0].name).toBe('Aspirin 500mg');
          expect(res.body[0].price).toBe(9.99);
        });
    });
  });

  describe('GET /products/:id', () => {
    it('should return a product by id', async () => {
      const product = await productsRepository.save({
        name: 'Aspirin 500mg',
        description: 'Pain reliever',
        price: 9.99,
      });

      return request(app.getHttpServer())
        .get(`/products/${product.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(product.id);
          expect(res.body.name).toBe('Aspirin 500mg');
          expect(res.body.price).toBe(9.99);
        });
    });

    it('should return 404 for non-existent product', () => {
      return request(app.getHttpServer())
        .get('/products/99999')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('not found');
        });
    });

    it('should handle invalid id format', () => {
      return request(app.getHttpServer()).get('/products/invalid').expect(400);
    });

    it('should handle negative ids', () => {
      return request(app.getHttpServer()).get('/products/-1').expect(404);
    });

    it('should handle id 0', () => {
      return request(app.getHttpServer()).get('/products/0').expect(404);
    });
  });

  describe('PATCH /products/:id', () => {
    it('should update a product name', async () => {
      const product = await productsRepository.save({
        name: 'Original Name',
        description: 'Original description',
        price: 10.0,
      });

      return request(app.getHttpServer())
        .patch(`/products/${product.id}`)
        .send({ name: 'Updated Name' })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Name');
          expect(res.body.description).toBe('Original description');
          expect(res.body.price).toBe(10.0);
        });
    });

    it('should update a product price', async () => {
      const product = await productsRepository.save({
        name: 'Product Name',
        description: 'Description',
        price: 10.0,
      });

      return request(app.getHttpServer())
        .patch(`/products/${product.id}`)
        .send({ price: 25.99 })
        .expect(200)
        .expect((res) => {
          expect(res.body.price).toBe(25.99);
          expect(res.body.name).toBe('Product Name');
        });
    });

    it('should update a product description', async () => {
      const product = await productsRepository.save({
        name: 'Product Name',
        description: 'Original',
        price: 10.0,
      });

      return request(app.getHttpServer())
        .patch(`/products/${product.id}`)
        .send({ description: 'Updated description' })
        .expect(200)
        .expect((res) => {
          expect(res.body.description).toBe('Updated description');
        });
    });

    it('should update all fields at once', async () => {
      const product = await productsRepository.save({
        name: 'Old Name',
        description: 'Old description',
        price: 10.0,
      });

      return request(app.getHttpServer())
        .patch(`/products/${product.id}`)
        .send({
          name: 'New Name',
          description: 'New description',
          price: 50.0,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('New Name');
          expect(res.body.description).toBe('New description');
          expect(res.body.price).toBe(50.0);
        });
    });

    it('should return 404 when updating non-existent product', () => {
      return request(app.getHttpServer())
        .patch('/products/99999')
        .send({ name: 'Updated Name' })
        .expect(404);
    });

    it('should validate updated fields', async () => {
      const product = await productsRepository.save({
        name: 'Product',
        description: 'Description',
        price: 10.0,
      });

      return request(app.getHttpServer())
        .patch(`/products/${product.id}`)
        .send({ price: -10 })
        .expect(400);
    });

    it('should reject updates with extra fields', async () => {
      const product = await productsRepository.save({
        name: 'Product',
        description: 'Description',
        price: 10.0,
      });

      return request(app.getHttpServer())
        .patch(`/products/${product.id}`)
        .send({
          name: 'Updated',
          extraField: 'not allowed',
        })
        .expect(400);
    });

    it('should allow empty update (no changes)', async () => {
      const product = await productsRepository.save({
        name: 'Product',
        description: 'Description',
        price: 10.0,
      });

      return request(app.getHttpServer())
        .patch(`/products/${product.id}`)
        .send({})
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Product');
          expect(res.body.description).toBe('Description');
          expect(res.body.price).toBe(10.0);
        });
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete a product', async () => {
      const product = await productsRepository.save({
        name: 'Product to delete',
        description: 'Will be deleted',
        price: 10.0,
      });

      await request(app.getHttpServer())
        .delete(`/products/${product.id}`)
        .expect(200);

      // Verify product was deleted
      const deletedProduct = await productsRepository.findOneBy({
        id: product.id,
      });
      expect(deletedProduct).toBeNull();
    });

    it('should return 404 when deleting non-existent product', () => {
      return request(app.getHttpServer()).delete('/products/99999').expect(404);
    });

    it('should not allow deletion with invalid id', () => {
      return request(app.getHttpServer())
        .delete('/products/invalid')
        .expect(400);
    });
  });

  describe('Concurrent operations', () => {
    it('should handle multiple simultaneous reads', async () => {
      await productsRepository.save([
        { name: 'Product 1', description: 'Desc 1', price: 10.0 },
        { name: 'Product 2', description: 'Desc 2', price: 20.0 },
      ]);

      const requests = Array(5)
        .fill(null)
        .map(() => request(app.getHttpServer()).get('/products'));

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
      });
    });

    it('should handle multiple simultaneous creates', async () => {
      const products = [
        { name: 'Product 1', description: 'Desc 1', price: 10.0 },
        { name: 'Product 2', description: 'Desc 2', price: 20.0 },
        { name: 'Product 3', description: 'Desc 3', price: 30.0 },
      ];

      const requests = products.map((product) =>
        request(app.getHttpServer()).post('/products').send(product),
      );

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
      });

      // Verify all products were created
      const allProducts = await productsRepository.find();
      expect(allProducts).toHaveLength(3);
    });
  });

  describe('CRUD workflow', () => {
    it('should complete a full CRUD lifecycle', async () => {
      // CREATE
      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Lifecycle Product',
          description: 'Testing full CRUD',
          price: 15.99,
        })
        .expect(201);

      const productId = createResponse.body.id;
      expect(productId).toBeDefined();

      // READ (single)
      const readResponse = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200);

      expect(readResponse.body.name).toBe('Lifecycle Product');

      // UPDATE
      const updateResponse = await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .send({
          name: 'Updated Lifecycle Product',
          price: 19.99,
        })
        .expect(200);

      expect(updateResponse.body.name).toBe('Updated Lifecycle Product');
      expect(updateResponse.body.price).toBe(19.99);

      // READ (verify update)
      const verifyResponse = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200);

      expect(verifyResponse.body.name).toBe('Updated Lifecycle Product');
      expect(verifyResponse.body.price).toBe(19.99);

      // DELETE
      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .expect(200);

      // VERIFY DELETION
      await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(404);
    });
  });

  describe('Edge cases', () => {
    it('should handle very long descriptions', async () => {
      const longDescription = 'A'.repeat(5000);

      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Product with long description',
          description: longDescription,
          price: 10.0,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.description.length).toBe(5000);
        });
    });

    it('should handle product with all minimum values', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'A',
          description: 'B',
          price: 0.01,
        })
        .expect(201);
    });

    it('should maintain precision for decimal prices', async () => {
      const testPrices = [0.01, 1.99, 10.5, 99.99, 999.99];

      for (const price of testPrices) {
        const response = await request(app.getHttpServer())
          .post('/products')
          .send({
            name: `Product ${price}`,
            description: 'Test price precision',
            price: price,
          })
          .expect(201);

        expect(response.body.price).toBe(price);
      }
    });

    it('should handle Unicode characters properly', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: '日本語 Product 中文',
          description: 'Описание на русском ελληνικά',
          price: 10.0,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe('日本語 Product 中文');
          expect(res.body.description).toBe('Описание на русском ελληνικά');
        });
    });
  });

  describe('Error responses', () => {
    it('should return proper error format for validation errors', () => {
      return request(app.getHttpServer())
        .post('/products')
        .send({
          name: '',
          description: '',
          price: 'invalid',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body.statusCode).toBe(400);
        });
    });

    it('should return proper error format for not found', async () => {
      return request(app.getHttpServer())
        .get('/products/99999')
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body.statusCode).toBe(404);
        });
    });
  });
});
