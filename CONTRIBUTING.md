# Contributing to KAI Platform

Thank you for your interest in contributing to KAI! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, versions)

### Suggesting Features

We love new ideas! Please create an issue with:
- Clear description of the feature
- Use case and benefits
- Potential implementation approach

### Code Contributions

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/kai-platform.git
   cd kai-platform
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   # Backend tests
   cd backend
   pytest

   # Frontend tests
   cd frontend
   npm test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

   **Commit Message Guidelines:**
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for improvements
   - `Docs:` for documentation
   - `Refactor:` for code refactoring
   - `Test:` for adding tests

6. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Development Guidelines

### Code Style

**Python (Backend):**
- Follow PEP 8
- Use type hints
- Document functions with docstrings
- Keep functions focused and small

**TypeScript/React (Frontend):**
- Use functional components
- Follow React best practices
- Use TypeScript for type safety
- Keep components small and reusable

### Project Structure

Please maintain the existing project structure:
```
backend/
  agents/     - AI agent implementations
  api/        - API routes
  models/     - Database models
  services/   - Business logic

frontend/
  app/        - Next.js pages
  components/ - React components
  lib/        - Utilities
```

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage

### Documentation

- Update README.md if needed
- Add comments for complex logic
- Update API documentation
- Include examples

## Pull Request Process

1. Ensure your PR description clearly describes the changes
2. Link related issues
3. Update documentation
4. Ensure all tests pass
5. Request review from maintainers

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

## Community

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow our Code of Conduct

## Questions?

Feel free to ask questions by:
- Creating an issue
- Reaching out to maintainers
- Joining our Discord community

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to KAI! 🎉
