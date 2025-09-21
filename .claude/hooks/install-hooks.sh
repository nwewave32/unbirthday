#!/bin/bash

# Install custom git hooks

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Installing custom git hooks...${NC}"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy our custom hooks
cp .claude/hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

echo -e "${GREEN}✓ Pre-commit hook installed successfully${NC}"

# Create a post-checkout hook for automatic README updates
cat > .git/hooks/post-checkout << 'EOF'
#!/bin/bash

# Post-checkout hook for updating documentation after branch switches

# Only run on branch checkouts (not file checkouts)
if [ "$3" = "1" ]; then
    echo "Branch switched - consider updating documentation if needed"
fi
EOF

chmod +x .git/hooks/post-checkout

echo -e "${GREEN}✓ Post-checkout hook installed successfully${NC}"

echo -e "${GREEN}All git hooks installed successfully!${NC}"
echo -e "${YELLOW}From now on, README.md and CLAUDE.md will be automatically updated on commits${NC}"