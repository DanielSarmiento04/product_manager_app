import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct: Product = {
    id: 1,
    name: 'Aspirin 500mg',
    description: 'Pain reliever and fever reducer',
    price: 9.99,
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
  };

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createProductDto: CreateProductDto = {
      name: 'Aspirin 500mg',
      description: 'Pain reliever and fever reducer',
      price: 9.99,
    };

    it('should create a new product', async () => {
      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(result).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should return the created product with all fields', async () => {
      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('created_at');
      expect(result).toHaveProperty('updated_at');
    });

    it('should handle creation with minimum price', async () => {
      const minPriceDto: CreateProductDto = {
        ...createProductDto,
        price: 0.01,
      };
      const minPriceProduct = { ...mockProduct, price: 0.01 };
      mockProductsService.create.mockResolvedValue(minPriceProduct);

      const result = await controller.create(minPriceDto);

      expect(result.price).toBe(0.01);
      expect(service.create).toHaveBeenCalledWith(minPriceDto);
    });

    it('should handle creation with maximum valid price', async () => {
      const maxPriceDto: CreateProductDto = {
        ...createProductDto,
        price: 999999.99,
      };
      const maxPriceProduct = { ...mockProduct, price: 999999.99 };
      mockProductsService.create.mockResolvedValue(maxPriceProduct);

      const result = await controller.create(maxPriceDto);

      expect(result.price).toBe(999999.99);
    });

    it('should handle special characters in name', async () => {
      const specialCharsDto: CreateProductDto = {
        name: 'Product™ with © symbols',
        description: 'Test description',
        price: 10.0,
      };
      const specialCharsProduct = {
        ...mockProduct,
        name: specialCharsDto.name,
      };
      mockProductsService.create.mockResolvedValue(specialCharsProduct);

      const result = await controller.create(specialCharsDto);

      expect(result.name).toBe(specialCharsDto.name);
    });

    it('should propagate service errors', async () => {
      mockProductsService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createProductDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [
        mockProduct,
        { ...mockProduct, id: 2, name: 'Ibuprofen 400mg' },
      ];
      mockProductsService.findAll.mockResolvedValue(products);

      const result = await controller.findAll();

      expect(result).toEqual(products);
      expect(result).toHaveLength(2);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no products exist', async () => {
      mockProductsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return products with all required fields', async () => {
      const products = [mockProduct];
      mockProductsService.findAll.mockResolvedValue(products);

      const result = await controller.findAll();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('price');
      expect(result[0]).toHaveProperty('created_at');
      expect(result[0]).toHaveProperty('updated_at');
    });

    it('should handle service errors', async () => {
      mockProductsService.findAll.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return a single product by id', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      await controller.findOne('123');

      expect(service.findOne).toHaveBeenCalledWith(123);
    });

    it('should handle single digit ids', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      await controller.findOne('5');

      expect(service.findOne).toHaveBeenCalledWith(5);
    });

    it('should handle large ids', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      await controller.findOne('999999');

      expect(service.findOne).toHaveBeenCalledWith(999999);
    });

    it('should throw NotFoundException when product does not exist', async () => {
      mockProductsService.findOne.mockRejectedValue(
        new NotFoundException('Product with ID 999 not found'),
      );

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.findOne('999')).rejects.toThrow(
        'Product with ID 999 not found',
      );
    });

    it('should handle NaN conversion gracefully', async () => {
      // The service should handle the NaN, but the controller converts it
      mockProductsService.findOne.mockRejectedValue(
        new NotFoundException('Product with ID NaN not found'),
      );

      await expect(controller.findOne('invalid')).rejects.toThrow(
        NotFoundException,
      );

      expect(service.findOne).toHaveBeenCalledWith(NaN);
    });
  });

  describe('update', () => {
    const updateProductDto: UpdateProductDto = {
      name: 'Updated Aspirin 500mg',
      price: 12.99,
    };

    it('should update a product successfully', async () => {
      const updatedProduct = { ...mockProduct, ...updateProductDto };
      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update('1', updateProductDto);

      expect(result).toEqual(updatedProduct);
      expect(service.update).toHaveBeenCalledWith(1, updateProductDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', async () => {
      const updatedProduct = { ...mockProduct, ...updateProductDto };
      mockProductsService.update.mockResolvedValue(updatedProduct);

      await controller.update('123', updateProductDto);

      expect(service.update).toHaveBeenCalledWith(123, updateProductDto);
    });

    it('should handle partial updates - name only', async () => {
      const partialUpdate: UpdateProductDto = { name: 'New Name' };
      const updatedProduct = { ...mockProduct, name: 'New Name' };
      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update('1', partialUpdate);

      expect(result.name).toBe('New Name');
      expect(service.update).toHaveBeenCalledWith(1, partialUpdate);
    });

    it('should handle partial updates - price only', async () => {
      const partialUpdate: UpdateProductDto = { price: 15.99 };
      const updatedProduct = { ...mockProduct, price: 15.99 };
      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update('1', partialUpdate);

      expect(result.price).toBe(15.99);
    });

    it('should handle partial updates - description only', async () => {
      const partialUpdate: UpdateProductDto = {
        description: 'New description',
      };
      const updatedProduct = { ...mockProduct, description: 'New description' };
      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update('1', partialUpdate);

      expect(result.description).toBe('New description');
    });

    it('should handle empty update dto', async () => {
      const emptyUpdate: UpdateProductDto = {};
      mockProductsService.update.mockResolvedValue(mockProduct);

      const result = await controller.update('1', emptyUpdate);

      expect(result).toEqual(mockProduct);
      expect(service.update).toHaveBeenCalledWith(1, emptyUpdate);
    });

    it('should throw NotFoundException when updating non-existent product', async () => {
      mockProductsService.update.mockRejectedValue(
        new NotFoundException('Product with ID 999 not found'),
      );

      await expect(controller.update('999', updateProductDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should propagate service errors', async () => {
      mockProductsService.update.mockRejectedValue(new Error('Database error'));

      await expect(controller.update('1', updateProductDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      mockProductsService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should convert string id to number', async () => {
      mockProductsService.remove.mockResolvedValue(undefined);

      await controller.remove('123');

      expect(service.remove).toHaveBeenCalledWith(123);
    });

    it('should not return anything on successful deletion', async () => {
      mockProductsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when removing non-existent product', async () => {
      mockProductsService.remove.mockRejectedValue(
        new NotFoundException('Product with ID 999 not found'),
      );

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
      await expect(controller.remove('999')).rejects.toThrow(
        'Product with ID 999 not found',
      );
    });

    it('should handle removal of various id formats', async () => {
      mockProductsService.remove.mockResolvedValue(undefined);

      await controller.remove('1');
      await controller.remove('999');
      await controller.remove('12345');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledWith(999);
      expect(service.remove).toHaveBeenCalledWith(12345);
      expect(service.remove).toHaveBeenCalledTimes(3);
    });

    it('should propagate service errors', async () => {
      mockProductsService.remove.mockRejectedValue(new Error('Database error'));

      await expect(controller.remove('1')).rejects.toThrow('Database error');
    });
  });

  describe('integration scenarios', () => {
    it('should handle create-read-update-delete flow', async () => {
      const createDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 10.0,
      };

      // Create
      mockProductsService.create.mockResolvedValue(mockProduct);
      const created = await controller.create(createDto);
      expect(created.id).toBe(1);

      // Read
      mockProductsService.findOne.mockResolvedValue(created);
      const found = await controller.findOne('1');
      expect(found).toEqual(created);

      // Update
      const updateDto: UpdateProductDto = { price: 15.0 };
      const updated = { ...created, price: 15.0 };
      mockProductsService.update.mockResolvedValue(updated);
      const result = await controller.update('1', updateDto);
      expect(result.price).toBe(15.0);

      // Delete
      mockProductsService.remove.mockResolvedValue(undefined);
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should handle multiple concurrent requests', async () => {
      const products = [mockProduct, { ...mockProduct, id: 2 }];
      mockProductsService.findAll.mockResolvedValue(products);

      const requests = [
        controller.findAll(),
        controller.findAll(),
        controller.findAll(),
      ];

      const results = await Promise.all(requests);

      expect(results).toHaveLength(3);
      results.forEach((result) => {
        expect(result).toEqual(products);
      });
      expect(service.findAll).toHaveBeenCalledTimes(3);
    });
  });

  describe('error handling', () => {
    it('should handle unexpected errors gracefully', async () => {
      mockProductsService.findOne.mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(controller.findOne('1')).rejects.toThrow('Unexpected error');
    });

    it('should handle timeout scenarios', async () => {
      mockProductsService.create.mockImplementation(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 100),
          ),
      );

      const createDto: CreateProductDto = {
        name: 'Test',
        description: 'Test',
        price: 10.0,
      };

      await expect(controller.create(createDto)).rejects.toThrow('Timeout');
    });
  });
});
