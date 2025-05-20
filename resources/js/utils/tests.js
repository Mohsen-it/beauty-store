// Test script to verify functionality and performance
// Run this script to check if all features are working correctly

import { dataCache, apiClient, stateManager } from './utils/cache';

// Function to test navigation performance
async function testNavigationPerformance() {
  console.log('Testing navigation performance...');

  const routes = [
    '/',
    '/products',
    '/cart',
    '/favorites'
  ];

  const results = [];

  for (const route of routes) {
    // Measure navigation time
    const startTime = performance.now();

    try {
      // Simulate navigation
      await new Promise(resolve => {
        const link = document.createElement('a');
        link.href = route;
        link.click();

        // Wait for page to load
        window.addEventListener('load', () => {
          const endTime = performance.now();
          const duration = endTime - startTime;

          results.push({
            route,
            duration,
            success: true
          });

          resolve();
        }, { once: true });
      });
    } catch (error) {
      results.push({
        route,
        error: error.message,
        success: false
      });
    }
  }

  console.log('Navigation performance results:', results);
  return results;
}

// Function to test caching functionality
function testCaching() {
  console.log('Testing caching functionality...');

  // Test data cache
  const testKey = 'test-data';
  const testData = { foo: 'bar', timestamp: Date.now() };

  // Set data in cache
  dataCache.set(testKey, testData);

  // Get data from cache
  const cachedData = dataCache.get(testKey);

  // Verify data integrity
  const cacheSuccess = JSON.stringify(cachedData) === JSON.stringify(testData);

  console.log('Data cache test:', cacheSuccess ? 'PASSED' : 'FAILED');

  // Test state persistence
  const stateKey = 'test-state';
  const stateData = { count: 42, items: ['a', 'b', 'c'] };

  // Save state
  stateManager.saveState(stateKey, stateData);

  // Load state
  const loadedState = stateManager.loadState(stateKey);

  // Verify state integrity
  const stateSuccess = JSON.stringify(loadedState) === JSON.stringify(stateData);

  console.log('State persistence test:', stateSuccess ? 'PASSED' : 'FAILED');

  return {
    dataCacheTest: cacheSuccess,
    statePersistenceTest: stateSuccess
  };
}

// Service worker test function has been removed
// The application no longer uses service workers

// Function to test animation performance
function testAnimationPerformance() {
  console.log('Testing animation performance...');

  // Create a test element
  const testElement = document.createElement('div');
  testElement.style.position = 'fixed';
  testElement.style.top = '0';
  testElement.style.left = '0';
  testElement.style.width = '100px';
  testElement.style.height = '100px';
  testElement.style.background = 'red';
  testElement.style.opacity = '0';
  testElement.style.zIndex = '9999';

  document.body.appendChild(testElement);

  // Measure animation performance
  const frames = [];
  let startTime;
  let rafId;

  return new Promise(resolve => {
    startTime = performance.now();

    function animate(timestamp) {
      const elapsed = timestamp - startTime;

      if (elapsed < 1000) { // Run for 1 second
        // Record frame timing
        frames.push({
          timestamp,
          elapsed
        });

        // Animate opacity
        const progress = elapsed / 1000;
        testElement.style.opacity = progress.toString();

        rafId = requestAnimationFrame(animate);
      } else {
        // Animation complete
        cancelAnimationFrame(rafId);

        // Calculate FPS
        let totalFrames = frames.length;
        let fps = totalFrames / (elapsed / 1000);

        // Calculate jank (dropped frames)
        let jankFrames = 0;
        for (let i = 1; i < frames.length; i++) {
          const frameDuration = frames[i].timestamp - frames[i-1].timestamp;
          // Consider a frame as janky if it takes more than 20ms (less than 50fps)
          if (frameDuration > 20) {
            jankFrames++;
          }
        }

        // Clean up
        document.body.removeChild(testElement);

        const results = {
          fps,
          totalFrames,
          jankFrames,
          jankPercentage: (jankFrames / totalFrames) * 100
        };

        console.log('Animation performance results:', results);
        resolve(results);
      }
    }

    rafId = requestAnimationFrame(animate);
  });
}

// Run all tests
async function runTests() {
  console.log('Starting tests...');

  const results = {
    caching: testCaching(),
    animationPerformance: await testAnimationPerformance(),
    navigationPerformance: await testNavigationPerformance()
  };

  console.log('All tests completed!');
  console.log('Test results:', results);

  // Determine overall success
  const success =
    results.caching.dataCacheTest &&
    results.caching.statePersistenceTest &&
    results.animationPerformance.fps > 30 &&
    results.animationPerformance.jankPercentage < 20 &&
    results.navigationPerformance.every(r => r.success);

  console.log('Overall test result:', success ? 'PASSED' : 'FAILED');

  return {
    success,
    results
  };
}

// Export test functions
export {
  testCaching,
  testAnimationPerformance,
  testNavigationPerformance,
  runTests
};
