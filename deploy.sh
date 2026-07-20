#!/bin/bash

# Initialize Git repository if not already done
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
else
    echo "Git repository already initialized."
fi

# Link remote repository
echo "Connecting to GitHub repository..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/Atulscript/elvohr.git

# Set default branch to main
git branch -M main

# Stage and commit all changes
echo "Staging files..."
git add .
echo "Committing files..."
git commit -m "Initialize project with LinkedIn + Reddit design"

# Push to main branch
echo "Pushing code to GitHub..."
git push -u origin main

# Deploy to GitHub Pages
echo "Building and deploying to GitHub Pages..."
npm run deploy

echo "--------------------------------------------------------"
echo "All steps completed! Check deployment status on:"
echo "https://github.com/Atulscript/elvohr/settings/pages"
echo "--------------------------------------------------------"
