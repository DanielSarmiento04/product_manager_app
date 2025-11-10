import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  // TypeORM returns DECIMAL/NUMERIC columns as strings by default because JS
  // `number` can't safely represent arbitrary-precision decimals. For this
  // application we convert to/from number at the ORM boundary using a simple
  // transformer. For production-critical financial calculations prefer a
  // dedicated decimal library (e.g. decimal.js) and keep values as strings.
  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) =>
        value === null || value === undefined ? value : value.toFixed(2),
      from: (value: string) =>
        value === null || value === undefined ? value : parseFloat(value),
    },
  })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
