# 🤝 Contributing to DheeNotifications

Thank you for your interest in contributing to DheeNotifications! This document provides guidelines and instructions for contributing to the project.

## 🎯 How to Contribute

### 🐛 Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS information
   - Screenshots if applicable

### 💡 Suggesting Features

1. **Check existing feature requests** to avoid duplicates
2. **Use the feature request template**
3. **Provide clear description**:
   - Problem the feature solves
   - Proposed solution
   - Alternative solutions considered
   - Additional context

### 🔧 Code Contributions

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Submit a pull request**

## 🚀 Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- Git

### Setup Steps
```bash
# Clone your fork
git clone https://github.com/your-username/Dheenotifications.git
cd Dheenotifications

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Setup environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Start development servers
docker-compose up -d  # Start PostgreSQL and Redis
cd backend && npm run dev  # Start backend
cd frontend && npm run dev  # Start frontend
```

## 📝 Coding Standards

### JavaScript/TypeScript
- Use ES6+ features
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions
- Prefer async/await over promises

### React Components
- Use functional components with hooks
- Follow component naming conventions
- Keep components small and focused
- Use TypeScript for type safety

### Backend Code
- Follow RESTful API conventions
- Use proper HTTP status codes
- Implement proper error handling
- Add input validation
- Use middleware for common functionality

### Database
- Use Prisma for database operations
- Write proper migrations
- Add database indexes for performance
- Follow naming conventions

## 🧪 Testing Guidelines

### Before Submitting
- [ ] All existing tests pass
- [ ] New features have tests
- [ ] Manual testing completed
- [ ] No console errors
- [ ] Code follows style guidelines

### Test Types
- **Unit Tests**: Test individual functions
- **Integration Tests**: Test API endpoints
- **E2E Tests**: Test complete user flows
- **Manual Tests**: Follow testing guide

## 📋 Pull Request Process

### PR Requirements
1. **Clear title** describing the change
2. **Detailed description** of what was changed and why
3. **Link to related issues** if applicable
4. **Screenshots** for UI changes
5. **Test results** showing everything works

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
```

### Review Process
1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** by reviewers
4. **Approval** required before merge

## 🏗️ Project Structure

```
Dheenotifications/
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utility functions
│   │   └── worker.js       # Background jobs
│   ├── prisma/             # Database schema
│   └── tests/              # Backend tests
├── frontend/               # Next.js app
│   ├── app/                # App router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities
│   └── tests/              # Frontend tests
├── docs/                   # Documentation
└── scripts/                # Build/deploy scripts
```

## 🎨 UI/UX Guidelines

### Design Principles
- **Simplicity**: Keep interfaces clean and intuitive
- **Consistency**: Use consistent patterns and components
- **Accessibility**: Follow WCAG guidelines
- **Responsiveness**: Support all device sizes

### Component Guidelines
- Use Tailwind CSS for styling
- Follow Headless UI patterns
- Implement proper loading states
- Add error boundaries
- Use semantic HTML

## 🔒 Security Guidelines

### Code Security
- Validate all inputs
- Sanitize user data
- Use parameterized queries
- Implement proper authentication
- Follow OWASP guidelines

### Dependency Security
- Keep dependencies updated
- Audit for vulnerabilities
- Use security headers
- Implement rate limiting

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex algorithms
- Explain business logic
- Update README for new features

### API Documentation
- Document all endpoints
- Include request/response examples
- Specify authentication requirements
- Document error responses

## 🚀 Release Process

### Version Numbering
- Follow Semantic Versioning (SemVer)
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

### Release Steps
1. Update version numbers
2. Update CHANGELOG.md
3. Create release branch
4. Test thoroughly
5. Create GitHub release
6. Deploy to production

## 🌟 Recognition

### Contributors
All contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

### Types of Contributions
- Code contributions
- Bug reports
- Feature suggestions
- Documentation improvements
- Testing and QA
- Design and UX feedback

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: dheemanthmadaiah@gmail.com for private matters

### Response Times
- **Bug reports**: 24-48 hours
- **Feature requests**: 1-2 weeks
- **Pull requests**: 2-3 days
- **Questions**: 24 hours

## 📋 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Personal attacks
- Spam or off-topic content

### Enforcement
Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report issues to: dheemanthmadaiah@gmail.com

## 🎉 Thank You!

Your contributions make DheeNotifications better for everyone. Whether you're fixing bugs, adding features, improving documentation, or helping other users, every contribution is valuable and appreciated!

---

**Happy Contributing! 🚀**