# 🎲 Lottery App

A beautiful and interactive web application for conducting lotteries with customizable winner selection.

## Features

✅ **Pre-filled Participants**: 20 pre-loaded names ready for lottery
✅ **Customizable Winner Count**: Set how many winners to select (default: 5)
✅ **Interactive UI**: Start/Stop button with visual feedback
✅ **Randomization Display**: Shows spinning names during lottery
✅ **Winner Announcement**: Displays selected winners with animations
✅ **Visual Highlights**: Selected participants are highlighted in the list
✅ **Responsive Design**: Works on desktop and mobile devices
✅ **Modern UI**: Beautiful gradient design with smooth animations

## How to Use

1. **Open the Application**: Simply open `index.html` in your web browser
2. **Set Winner Count**: Use the number input to specify how many winners you want (1-20)
3. **Start Lottery**: Click the "Start Lottery" button to begin the randomization
4. **Watch the Magic**: Names will spin rapidly in the display area
5. **Stop and Reveal**: Click "Stop Lottery" to select and display the winners
6. **Celebrate**: Winners are highlighted in both the results and participant list

## File Structure

```
lotteryApp/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling and animations
├── script.js       # JavaScript lottery logic
└── README.md       # This documentation
```

## Technical Features

- **Pure JavaScript**: No external dependencies required
- **CSS Animations**: Smooth transitions and visual effects
- **Responsive Grid**: Adapts to different screen sizes
- **Sound Effects**: Optional audio feedback (Web Audio API)
- **Confetti Animation**: Celebratory effect for winners
- **Modular Code**: Clean, organized JavaScript classes

## Customization

### Adding More Participants
Edit the `participants` array in `script.js`:
```javascript
this.participants = [
    'Your Name Here',
    'Another Person',
    // ... add more names
];
```

### Changing Default Winner Count
Modify the `value` attribute in the HTML input:
```html
<input type="number" id="winnerCount" value="3" min="1" max="50">
```

### Styling Customization
All colors, fonts, and animations can be customized in `styles.css`.

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Future Enhancements

The code is structured to easily add:
- Custom participant management
- Different lottery modes
- Export results
- Multiple lottery rounds
- Custom themes

Enjoy your lottery app! 🎉
