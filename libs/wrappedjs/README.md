# Stay inline with WrappedJS

**Inline tools for JavaScript and TypeScript.**

This package provides wrapped versions of basic JavaScript code blocks like `switch` and `try-catch`, making them usable in a more inline fashion for flexible usage inside function parameters, chained calls, or simply in a single line of code. I created it out of frustration with not being able to use switch inline—hope it softens your coding experience :).

---

## Installation

You can install the package via npm:

```
npm install wrappedjs
```

---

## Features

- **Inline `switch` statement**: Use a `switch`-like behavior with more flexibility, including a separator for grouping cases together.
- **Inline `try-catch` block**: A wrapped version of `try-catch` that simplifies error handling for async functions or promises.
  
---

## Usage

### `select`

This function acts as a flexible `switch-case` statement and can be used inline, similar to a ternary operator. It allows you to define multiple keys for a single case using a separator.

#### Example 1: Using a separator

```typescript
const result = select('case1', {
    'case1:case2': 'value1',
    'case3': 'value2'
}, ':');

console.log(result); // Output: 'value1'
```

#### Example 2: Using multiple keys for the same value (more efficient)

```typescript
const result = select('case1', {
    'case1': 'value1',
    'case2': 'value1',
    'case3': 'value2'
});

console.log(result); // Output: 'value1'
```

#### Example 3: Using the `from` method

```typescript
const result = select('case1')
    .from({
        'case1': 'value1',
        'case2': 'value2'
    });

console.log(result); // Output: 'value1'
```

---

### `try_catch`

This function wraps your `try-catch` block, making it more concise and easier to use inline. It returns a tuple containing either the result or the error.

#### Example:

```typescript
const [result, error] = await try_catch(async () => {
    // Some async code that might fail
    return await fetchData();
});

if (error) {
    console.error('Error:', error);
} else {
    console.log('Result:', result);
}
```

---

## License

MIT License. Feel free to use, modify, and distribute this package under the terms of the MIT License.

---

## Repository

[GitHub Repository](https://github.com/yourusername/your-repository)

---

## Author

Miguel Ríos Marcos <miguel12105marcos@gmail.com>  
[GitHub: @mriioos](https://github.com/mriioos)  
[npm: @miguelrios](https://npmjs.com/~miguelrios)

---
