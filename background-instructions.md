# 🎨 Add Your Background Image

## 📁 Step 1: Place Your Image
1. Save your background image in the same folder as your HTML/CSS files
2. Recommended name: `background.jpg` or `background.png`
3. Make sure it's high-resolution (1920x1080 or higher)

## ⚙️ Step 2: Update CSS
Replace this line in `styles.css` (line 79):
```css
background-image: url('your-background-image.jpg');
```

With your actual image name:
```css
background-image: url('background.jpg');
```

## 🎯 Step 3: Optimize (Optional)
If your image is too large, you can:
- Compress it with TinyPNG.com
- Use WebP format for better performance
- Keep file size under 2MB for fast loading

## ✨ Step 4: Adjust Overlay (Optional)
If text is hard to read, adjust the overlay opacity in `styles.css` (line 72):
```css
linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%);
```
- Increase opacity (0.9) for darker overlay
- Decrease opacity (0.7) for lighter overlay

## 🚀 Done!
Your background image will now appear behind all content with:
- ✅ Fixed positioning (doesn't scroll)
- ✅ Proper overlay for text readability
- ✅ Animated particles on top
- ✅ Responsive scaling

## 📱 Mobile Optimization
The background is automatically optimized for mobile with:
- `background-attachment: fixed` for desktop
- Responsive scaling for all screen sizes
- Performance-friendly rendering
