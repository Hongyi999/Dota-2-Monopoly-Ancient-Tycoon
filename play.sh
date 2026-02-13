#!/bin/bash

# Ancient Tycoon - Quick Start Script

echo "🎮 Ancient Tycoon - Web Edition"
echo "================================"
echo ""
echo "Opening game in your browser..."
echo ""

# Try to open in browser
if command -v xdg-open &> /dev/null; then
    xdg-open web/index.html
elif command -v open &> /dev/null; then
    open web/index.html
elif command -v start &> /dev/null; then
    start web/index.html
else
    echo "✅ Game files are ready!"
    echo ""
    echo "📂 Please open this file in your browser:"
    echo "   $(pwd)/web/index.html"
    echo ""
fi

echo "🎯 Game Features:"
echo "   • 10 Dota 2 Heroes"
echo "   • 40 Board Spaces"
echo "   • 2-5 Player Support"
echo "   • Beautiful UI"
echo ""
echo "⌨️  Keyboard Shortcuts:"
echo "   • Space - Roll Dice"
echo "   • Enter - End Turn"
echo "   • Esc   - Close Modals"
echo ""
echo "📖 For more info, see web/README.md"
echo ""
