// tests/data/categories.test.js
import { categories } from '../../src/data/categories';

describe('Categories Data', () => {
  test('should export an array of categories', () => {
    expect(Array.isArray(categories)).toBe(true);
  });

  test('should not be an empty array', () => {
    expect(categories.length).toBeGreaterThan(0);
  });

  test('should contain "ทั้งหมด" category', () => {
    expect(categories).toContain('ทั้งหมด');
  });

  test('should contain "ธรรมชาติ" category', () => {
    expect(categories).toContain('ธรรมชาติ');
  });

  test('should have a specific number of categories', () => {
    // This test is a bit brittle if categories change often,
    // but good for ensuring the structure is as expected.
    // Current categories: ['ทั้งหมด', 'ธรรมชาติ', 'วัฒนธรรม', 'ช้อปปิ้ง', 'ร้านอาหาร', 'คาเฟ่']
    expect(categories.length).toBe(6);
  });
});
