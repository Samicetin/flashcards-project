// Redux middleware to persist state to localStorage
export const localStorageMiddleware = store => next => action => {
  const result = next(action);
  const state = store.getState();
  try {
    localStorage.setItem('flashcardsState', JSON.stringify(state));
  } catch (e) {
    // Ignore write errors
  }
  return result;
};

// Function to load state from localStorage
export function loadState() {
  try {
    const serializedState = localStorage.getItem('flashcardsState');
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}
