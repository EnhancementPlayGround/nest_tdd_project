// inventory-manager.interface.ts
import { EntityManager } from 'typeorm';

export interface InventoryManager {
  deductInventory(
    entityManager: EntityManager,
    productId: number,
    quantity: number,
  ): Promise<void>;
}
