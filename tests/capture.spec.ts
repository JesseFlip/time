import { test, expect } from '@playwright/test';

test.describe('Task Capture', () => {
  test('should add a new task and display it in the grid', async ({ page }) => {
    await page.goto('/');

    // 1. Open the "Add Task" dialog
    await page.getByRole('button', { name: /add task/i }).first().click();

    // 2. Fill in the task details
    await page.getByLabel(/title/i).fill('Buy groceries');
    await page.getByLabel(/notes/i).fill('Milk, eggs, bread');
    
    // Select quadrant (default is 'do', let's change to 'schedule')
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /schedule/i }).click();

    // 3. Submit the form
    await page.getByRole('button', { name: /add task/i }).last().click();

    // 4. Verify the task is in the "SCHEDULE" quadrant
    const scheduleCard = page.getByTestId('quadrant-schedule');
    await expect(scheduleCard).toContainText('Buy groceries');
    await expect(scheduleCard).toContainText('Milk, eggs, bread');
  });
});
