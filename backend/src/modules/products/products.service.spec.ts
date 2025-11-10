import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProduct: Product = {
    id: 1,
    name: 'Aspirin 500mg',
    description: 'Pain reliever and fever reducer',
    price: 9.99,
    created_at: new Date('2025-01-01'),
    updated_at: new Date('2025-01-01'),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createProductDto: CreateProductDto = {
      name: 'Aspirin 500mg',
      description: 'Pain reliever and fever reducer',
      price: 9.99,
    };

    it('should successfully create a product', async () => {
      mockRepository.create.mockReturnValue(mockProduct);
      mockRepository.save.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);

      expect(result).toEqual(mockProduct);
      expect(mockRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProduct);
    });

    it('should handle decimal prices correctly', async () => {
      const productWithDecimals = {
        ...createProductDto,
        price: 19.95,
      };
      const savedProduct = { ...mockProduct, price: 19.95 };

      mockRepository.create.mockReturnValue(savedProduct);
      mockRepository.save.mockResolvedValue(savedProduct);

      const result = await service.create(productWithDecimals);

      expect(result.price).toBe(19.95);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should handle very small prices', async () => {
      const productWithSmallPrice = {
        ...createProductDto,
        price: 0.01,
      };
      const savedProduct = { ...mockProduct, price: 0.01 };

      mockRepository.create.mockReturnValue(savedProduct);
      mockRepository.save.mockResolvedValue(savedProduct);

      const result = await service.create(productWithSmallPrice);

      expect(result.price).toBe(0.01);
    });

    it('should handle large prices', async () => {
      const productWithLargePrice = {
        ...createProductDto,
        price: 999999.99,
      };
      const savedProduct = { ...mockProduct, price: 999999.99 };

      mockRepository.create.mockReturnValue(savedProduct);
      mockRepository.save.mockResolvedValue(savedProduct);

      const result = await service.create(productWithLargePrice);

      expect(result.price).toBe(999999.99);
    });

    it('should create products with long descriptions', async () => {
      const longDescription = 'A'.repeat(1000);
      const productWithLongDesc = {
        ...createProductDto,
        description: longDescription,
      };
      const savedProduct = { ...mockProduct, description: longDescription };

      mockRepository.create.mockReturnValue(savedProduct);
      mockRepository.save.mockResolvedValue(savedProduct);

      const result = await service.create(productWithLongDesc);

      expect(result.description).toBe(longDescription);
      expect(result.description.length).toBe(1000);
    });

    it('should propagate database errors', async () => {
      mockRepository.create.mockReturnValue(mockProduct);
      mockRepository.save.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(service.create(createProductDto)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [
        mockProduct,
        { ...mockProduct, id: 2, name: 'Ibuprofen 400mg' },
      ];
      mockRepository.find.mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toEqual(products);
      expect(result).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no products exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
      mockRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);

      expect(result).toEqual(mockProduct);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when product does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Product with ID 999 not found',
      );
    });

    it('should handle findOne with id 0', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(0)).rejects.toThrow(NotFoundException);
    });

    it('should handle negative ids', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(-1)).rejects.toThrow(NotFoundException);
    });

    it('should handle very large ids', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(Number.MAX_SAFE_INTEGER)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateProductDto: UpdateProductDto = {
      name: 'Updated Aspirin 500mg',
      price: 12.99,
    };

    it('should update a product successfully', async () => {
      const updatedProduct = { ...mockProduct, ...updateProductDto };
      mockRepository.preload.mockResolvedValue(updatedProduct);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, updateProductDto);

      expect(result).toEqual(updatedProduct);
      expect(mockRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateProductDto,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedProduct);
    });

    it('should throw NotFoundException when updating non-existent product', async () => {
      mockRepository.preload.mockResolvedValue(null);

      await expect(service.update(999, updateProductDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(999, updateProductDto)).rejects.toThrow(
        'Product with ID 999 not found',
      );
    });

    it('should update only name', async () => {
      const partialUpdate = { name: 'New Name' };
      const updatedProduct = { ...mockProduct, name: 'New Name' };
      mockRepository.preload.mockResolvedValue(updatedProduct);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, partialUpdate);

      expect(result.name).toBe('New Name');
      expect(result.description).toBe(mockProduct.description);
      expect(result.price).toBe(mockProduct.price);
    });

    it('should update only price', async () => {
      const partialUpdate = { price: 15.99 };
      const updatedProduct = { ...mockProduct, price: 15.99 };
      mockRepository.preload.mockResolvedValue(updatedProduct);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, partialUpdate);

      expect(result.price).toBe(15.99);
      expect(result.name).toBe(mockProduct.name);
    });

    it('should update only description', async () => {
      const partialUpdate = { description: 'New description' };
      const updatedProduct = { ...mockProduct, description: 'New description' };
      mockRepository.preload.mockResolvedValue(updatedProduct);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, partialUpdate);

      expect(result.description).toBe('New description');
      expect(result.name).toBe(mockProduct.name);
      expect(result.price).toBe(mockProduct.price);
    });

    it('should update all fields', async () => {
      const fullUpdate: UpdateProductDto = {
        name: 'Completely New Product',
        description: 'Completely new description',
        price: 99.99,
      };
      const updatedProduct = { ...mockProduct, ...fullUpdate };
      mockRepository.preload.mockResolvedValue(updatedProduct);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, fullUpdate);

      expect(result.name).toBe(fullUpdate.name);
      expect(result.description).toBe(fullUpdate.description);
      expect(result.price).toBe(fullUpdate.price);
    });

    it('should handle empty update dto', async () => {
      const emptyUpdate = {};
      mockRepository.preload.mockResolvedValue(mockProduct);
      mockRepository.save.mockResolvedValue(mockProduct);

      const result = await service.update(1, emptyUpdate);

      expect(result).toEqual(mockProduct);
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when removing non-existent product', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow(
        'Product with ID 999 not found',
      );
    });

    it('should handle deletion of id 0', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(0)).rejects.toThrow(NotFoundException);
    });

    it('should handle database errors during deletion', async () => {
      mockRepository.delete.mockRejectedValue(new Error('Database error'));

      await expect(service.remove(1)).rejects.toThrow('Database error');
    });
  });

  describe('edge cases and concurrent operations', () => {
    it('should handle multiple concurrent creates', async () => {
      const createDtos: CreateProductDto[] = [
        { name: 'Product 1', description: 'Description 1', price: 10.0 },
        { name: 'Product 2', description: 'Description 2', price: 20.0 },
        { name: 'Product 3', description: 'Description 3', price: 30.0 },
      ];

      mockRepository.create.mockImplementation(
        (dto) => ({ ...mockProduct, ...dto }) as Product,
      );
      mockRepository.save.mockImplementation((product) =>
        Promise.resolve(product),
      );

      const results = await Promise.all(
        createDtos.map((dto) => service.create(dto)),
      );

      expect(results).toHaveLength(3);
      expect(mockRepository.create).toHaveBeenCalledTimes(3);
      expect(mockRepository.save).toHaveBeenCalledTimes(3);
    });

    it('should handle special characters in product name', async () => {
      const specialCharsDto: CreateProductDto = {
        name: 'Product™ with © special ® characters',
        description: 'Description with émojis 🎉',
        price: 25.5,
      };
      const savedProduct = { ...mockProduct, ...specialCharsDto };

      mockRepository.create.mockReturnValue(savedProduct);
      mockRepository.save.mockResolvedValue(savedProduct);

      const result = await service.create(specialCharsDto);

      expect(result.name).toBe(specialCharsDto.name);
      expect(result.description).toBe(specialCharsDto.description);
    });

    it('should maintain data integrity across multiple operations', async () => {
      // Create
      mockRepository.create.mockReturnValue(mockProduct);
      mockRepository.save.mockResolvedValue(mockProduct);
      const created = await service.create({
        name: mockProduct.name,
        description: mockProduct.description,
        price: mockProduct.price,
      });

      // Find
      mockRepository.findOneBy.mockResolvedValue(created);
      const found = await service.findOne(created.id);

      // Update
      const updateDto = { price: 15.99 };
      const updated = { ...found, ...updateDto };
      mockRepository.preload.mockResolvedValue(updated);
      mockRepository.save.mockResolvedValue(updated);
      const result = await service.update(found.id, updateDto);

      expect(result.id).toBe(created.id);
      expect(result.price).toBe(15.99);
      expect(result.name).toBe(created.name);
    });
  });

  describe('data validation scenarios', () => {
    it('should handle products with maximum length names', async () => {
      const maxLengthName = 'A'.repeat(255);
      const dto: CreateProductDto = {
        name: maxLengthName,
        description: 'Test description',
        price: 10.0,
      };
      const savedProduct = { ...mockProduct, name: maxLengthName };

      mockRepository.create.mockReturnValue(savedProduct);
      mockRepository.save.mockResolvedValue(savedProduct);

      const result = await service.create(dto);

      expect(result.name).toBe(maxLengthName);
      expect(result.name.length).toBe(255);
    });

    it('should handle prices with two decimal places', async () => {
      const prices = [0.01, 1.99, 10.5, 99.99, 999.99];

      for (const price of prices) {
        const dto: CreateProductDto = {
          name: 'Test Product',
          description: 'Test',
          price: price,
        };
        const savedProduct = { ...mockProduct, price };

        mockRepository.create.mockReturnValue(savedProduct);
        mockRepository.save.mockResolvedValue(savedProduct);

        const result = await service.create(dto);
        expect(result.price).toBe(price);
      }
    });
  });
});
