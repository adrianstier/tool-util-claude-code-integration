# Project Templates

This directory contains reusable templates that users can copy into their own projects.

## Available Templates

### Core Templates (In Root)

- **CLAUDE.md**: Project context and workflow documentation
- **.claudeignore**: Context management for Claude
- **.vscode/settings.json**: VS Code configuration optimized for Claude Code

## How to Use Templates

### For New Projects

1. Copy the templates you need:

   ```bash
   cp ../CLAUDE.md ./
   cp ../.claudeignore ./
   cp -r ../.vscode ./
   ```

2. Customize CLAUDE.md for your project:
   - Update project name and description
   - Document your architecture
   - Add your tech stack details
   - Include project-specific commands

3. Update .claudeignore:
   - Add any large files or directories specific to your project
   - Exclude build artifacts
   - Remove items that don't apply

4. Adjust .vscode/settings.json:
   - Set your preferred model
   - Add project-specific context files
   - Configure language-specific settings

## Template Guidelines

When creating new templates:

1. **Keep them minimal**: Only include what's essential
2. **Add clear comments**: Explain what each section does
3. **Use placeholders**: Mark areas users need to customize
4. **Test cross-platform**: Ensure they work on Mac and Windows
5. **Document usage**: Add instructions in this README

## Future Templates (Planned)

- Python data analysis project template
- R analysis project template
- FastAPI app template
- React + Next.js app template
- Automation script template
- GitHub Actions workflow templates
