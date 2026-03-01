# Content Style Guide

This guide defines the voice, tone, and structure for all content on Claude Code Learning. Our goal: content that feels like a **knowledgeable friend** teaching you, not a textbook lecturing at you.

---

## Voice: Friendly Professional

We're warm and approachable, but we respect your time. We explain the "why" before the "how." We use real scenarios, not generic examples.

### What This Sounds Like

**Before (AI-generic):**
> "This section will cover the installation of Git on your system."

**After (friendly professional):**
> "Let's get Git installed. Once it's running, you'll have superpowers: undo mistakes, experiment safely, and never lose your work again."

**Before:**
> "You will learn how to create variables in Python."

**After:**
> "Variables are where your data lives. Think of them as labeled boxes—you put something in, give it a name, and grab it whenever you need it."

### Key Principles

1. **Lead with benefits, not actions**
   - Bad: "This guide teaches you to set up VS Code"
   - Good: "After this, you'll have a coding environment that actually helps you write better code"

2. **Use "you" and "we"**
   - Bad: "Users should configure their settings"
   - Good: "Let's configure your settings"

3. **Include real scenarios**
   - Bad: "Variables store data"
   - Good: "Imagine you're analyzing sales data—you need somewhere to store that revenue number while you calculate growth"

4. **Active voice, present tense**
   - Bad: "The file will be created by the command"
   - Good: "This command creates the file"

5. **No empty filler phrases**
   - Cut: "It's worth noting that...", "It's important to understand that...", "As you may know..."

---

## Section Structure: Problem → Solution → Practice

Every major section should follow this pattern:

### 1. Hook (1-2 sentences)
A real problem, scenario, or question that makes the reader say "yes, I need this."

**Example:**
> "Ever lost hours of work because you forgot to save? Or broke something and couldn't remember what it looked like before? Git fixes both."

### 2. Why It Matters (2-4 sentences)
What happens without this knowledge. What's possible with it. Stakes and benefits.

**Example:**
> "Without version control, you're always one mistake away from disaster. With Git, every change is saved, every experiment is reversible, and you can collaborate without chaos."

### 3. The Core Concept (varies)
Clear explanation of what we're learning. Use analogies when helpful.

### 4. Hands-On Practice
Actual doing. Code examples, exercises, step-by-step instructions.

### 5. Quick Check
A quiz question, reflection prompt, or "try this" challenge.

### 6. What's Next (1 sentence)
Clear pointer to the next logical step.

---

## Visual Variety Requirements

**Rule: Every ~500 words should include at least one visual element:**

- `<Diagram>` - Flowcharts, workflows, decision trees
- `<Callout>` - Important notes, tips, warnings
- `<Steps>` - Sequential instructions
- `<Tabs>` - Mac/Windows alternatives, Python/R choices
- `<FileTree>` - Directory structures
- Code blocks with syntax highlighting
- `<BeforeAfter>` - Transformations (when built)
- `<Quiz>` - Knowledge checks (when built)

### Diagram Usage

Use diagrams for:
- **Workflows**: Git flow, data pipelines, deployment processes
- **Decision trees**: "Python or R?", "CLI or GUI?"
- **Architecture**: How components connect
- **Processes**: Step-by-step with branching logic

```jsx
<Diagram title="Git Workflow" type="flowchart" caption="The basic cycle of working with Git">
{`flowchart LR
    A[Edit Files] --> B[Stage Changes]
    B --> C[Commit]
    C --> D{More changes?}
    D -->|Yes| A
    D -->|No| E[Push to Remote]
`}
</Diagram>
```

### Callout Types

- `tip` - Helpful suggestions, shortcuts, pro tips
- `warning` - Potential pitfalls, things to avoid
- `note` - Additional context, clarifications
- `terminal` - Terminal-specific instructions

```jsx
<Callout type="tip">
  You can press Tab to autocomplete file paths in the terminal. Huge time saver.
</Callout>

<Callout type="warning">
  Never commit files containing passwords or API keys. We'll set up .gitignore to prevent this.
</Callout>
```

---

## Real Examples Over Generic

### Variables
**Bad:** `name = "Alice"`, `age = 25`
**Good:** `project_name = "q4-sales-analysis"`, `coffee_budget = 127.50`

### Functions
**Bad:** Calculator, greeting function
**Good:** Data cleaner, email formatter, report generator

### Projects
**Bad:** "Build a todo app"
**Good:** "Automate your weekly expense report", "Clean messy CSV exports from your CRM"

### Scenarios
**Bad:** "Alice lives in San Francisco and wants to..."
**Good:** "You just got a CSV export from Salesforce. It's a mess—duplicate columns, inconsistent dates, missing values. Let's fix it."

---

## Code Block Guidelines

### Always Include Context
```python
# Good: Explain what we're doing
# Load the sales data from our exports folder
import pandas as pd
sales = pd.read_csv("data/q4_sales.csv")
```

### Show Output When Helpful
```python
>>> len(sales)
1247

>>> sales.columns.tolist()
['date', 'product', 'revenue', 'region']
```

### Highlight Key Lines
Use comments to draw attention:
```python
df = pd.read_csv("data.csv")
df = df.dropna()  # <- This removes rows with missing values
df.to_csv("clean_data.csv")
```

---

## Platform-Specific Content

Use `<Tabs>` for Mac/Windows differences:

```jsx
<Tabs>
  <TabList>
    <Tab>Mac</Tab>
    <Tab>Windows</Tab>
  </TabList>
  <TabPanel>
    Open Terminal: Press Cmd + Space, type "Terminal", press Enter
  </TabPanel>
  <TabPanel>
    Open PowerShell: Press Win + X, select "Windows PowerShell"
  </TabPanel>
</Tabs>
```

Or use `<Callout>` for minor differences inline:

```jsx
<Callout type="note">
  **Windows users:** Replace `Cmd` with `Ctrl` for all keyboard shortcuts.
</Callout>
```

---

## Headings and Hierarchy

### H1: Page Title Only
One per page, set in frontmatter.

### H2: Major Sections
Clear, scannable. Often include benefit or outcome.
- "Setting Up Your Environment" → "Getting Your Tools Ready"
- "Understanding Variables" → "Variables: Where Your Data Lives"

### H3: Subsections
More specific. Action-oriented when possible.
- "Installing Python"
- "Your First Script"
- "Common Gotchas"

### H4+: Use Sparingly
Prefer reorganizing content over deep nesting.

---

## Forbidden Phrases

These make content feel generic. Cut them ruthlessly:

- "In this section, we will..."
- "It's important to note that..."
- "As mentioned earlier..."
- "Simply put..."
- "In other words..."
- "Let's dive in" / "Let's get started" (overused)
- "First and foremost..."
- "At the end of the day..."
- "That being said..."

---

## Checklist: Before Publishing

- [ ] Does the intro hook the reader with a real problem?
- [ ] Is the "why" clear before the "how"?
- [ ] Are there visual elements every ~500 words?
- [ ] Are code examples using realistic scenarios (not calculators)?
- [ ] Does it use "you" and "we" (not "users" or "one")?
- [ ] Are all generic phrases removed?
- [ ] Would a human actually write this?
- [ ] Does a beginner have enough context to follow?
- [ ] Is there a clear next step at the end?

---

## Quick Reference: Component Usage

| Component | Use For |
|-----------|---------|
| `<Diagram>` | Workflows, decision trees, architecture |
| `<Callout type="tip">` | Helpful shortcuts, pro tips |
| `<Callout type="warning">` | Potential pitfalls |
| `<Callout type="note">` | Additional context |
| `<Steps>` | Sequential instructions |
| `<Tabs>` | Platform/language alternatives |
| `<FileTree>` | Directory structures |
| `<Kbd>` | Keyboard shortcuts (`<Kbd>Cmd</Kbd> + <Kbd>S</Kbd>`) |
| `<Checklist>` | Task lists with checkboxes |

---

## Example Transformation

### Before (Generic)

```markdown
## Installing Homebrew

Homebrew is a package manager for macOS. It allows you to install software from the command line.

### Steps

1. Open Terminal
2. Run the following command:
   ```bash
   /bin/bash -c "$(curl -fsSL https://brew.sh/install.sh)"
   ```
3. Verify the installation by running:
   ```bash
   brew --version
   ```

Homebrew is now installed on your system.
```

### After (Engaging)

```markdown
## Homebrew: Your Mac's Missing App Store

Ever tried installing a developer tool and found yourself downloading sketchy `.pkg` files from random websites? Homebrew fixes that.

<Diagram type="flowchart" caption="Why Homebrew beats manual installs">
{`flowchart LR
    A[Need a tool] --> B[brew install tool-name]
    B --> C[Done. Auto-updates forever.]
`}
</Diagram>

Think of it as an app store for developer tools—except everything is free and you control it from the terminal.

<Callout type="tip">
Most tools you'll need (Git, Node.js, Python) can be installed with a single `brew install` command.
</Callout>

<Steps>
<Step title="Open Terminal">
  Press <Kbd>Cmd</Kbd> + <Kbd>Space</Kbd>, type "Terminal", press Enter.

  You'll see a window with a blinking cursor. This is where the magic happens.
</Step>

<Step title="Run the installer">
  Paste this command and press Enter:

  ```bash
  /bin/bash -c "$(curl -fsSL https://brew.sh/install.sh)"
  ```

  <Callout type="terminal">
  You'll be asked for your password. Type it (nothing appears—that's normal) and press Enter.
  </Callout>
</Step>

<Step title="Verify it worked">
  ```bash
  brew --version
  ```

  See a version number? You're ready to install anything.
</Step>
</Steps>

**Next up:** Let's use Homebrew to install Git, your first superpower tool.
```

---

## Summary

1. **Voice**: Friendly professional—warm but efficient
2. **Structure**: Problem → Why → How → Practice → Check → Next
3. **Visuals**: Something every ~500 words
4. **Examples**: Real scenarios, not generic calculators
5. **Language**: Active, direct, "you" and "we"

When in doubt, ask: "Would a skilled friend explain it this way?"
