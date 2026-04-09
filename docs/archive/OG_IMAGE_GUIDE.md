# 🖼️ Creating Your Open Graph (OG) Image

## What is an OG Image?

The Open Graph image is what appears when your website is shared on:
- Facebook
- LinkedIn
- Twitter/X
- WhatsApp
- Slack
- Text messages

**Current Status:** Missing at `/public/og-image.jpg`

---

## Specifications

### Required Dimensions
- **Width:** 1200 pixels
- **Height:** 630 pixels
- **Aspect Ratio:** 1.91:1
- **File Format:** JPG or PNG (JPG preferred for smaller file size)
- **File Size:** Under 1MB (smaller is better)
- **Location:** `/public/og-image.jpg`

---

## Design Recommendations

### Option 1: Simple Professional (Recommended)

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│        BURCH CONTRACTING            │
│     Professional Home Services      │
│                                     │
│   🏠 Home Repair & Remodeling       │
│   📞 (864) 724-4600                │
│   📍 Simpsonville, SC               │
│                                     │
│   burchcontracting.com              │
│                                     │
└─────────────────────────────────────┘
```

**Colors:**
- Background: White or #f9fafb (light gray)
- Primary Text: #1e40af (blue)
- Secondary Text: #374151 (dark gray)
- Accent: #2563eb (bright blue)

### Option 2: With Background Image

**Layout:**
```
┌─────────────────────────────────────┐
│  [Photo of completed project]       │
│                                     │
│  ┌─────────────────────┐           │
│  │ BURCH CONTRACTING   │           │
│  │ Reliable Home       │           │
│  │ Repair & Remodeling │           │
│  │ (864) 724-4600      │           │
│  └─────────────────────┘           │
└─────────────────────────────────────┘
```

**Tips:**
- Use a high-quality project photo as background
- Add semi-transparent overlay for text readability
- Keep text large and bold (minimum 48px font)

### Option 3: Before/After Split

**Layout:**
```
┌──────────────┬──────────────┐
│              │              │
│   BEFORE     │    AFTER     │
│              │              │
│  [Photo 1]   │  [Photo 2]   │
│              │              │
├──────────────┴──────────────┤
│  BURCH CONTRACTING          │
│  Quality You Can See        │
│  (864) 724-4600             │
└─────────────────────────────┘
```

---

## Tools to Create OG Image

### Free Online Tools (No Design Skills Required)
1. **Canva** (canva.com) - Recommended ⭐
   - Free templates available
   - Template: "Facebook Post" (1200x630)
   - Drag-and-drop interface
   - Export as JPG

2. **Adobe Express** (express.adobe.com)
   - Free social media templates
   - Professional looking results

3. **Figma** (figma.com)
   - Free for individuals
   - More control over design
   - Professional-grade tool

### Desktop Software
1. **Photoshop** - If you have it
2. **GIMP** - Free alternative to Photoshop
3. **Paint.NET** - Simple, free Windows tool

---

## Step-by-Step: Creating in Canva (Easiest)

1. **Go to Canva.com** and sign up (free)

2. **Create Custom Size:**
   - Click "Create a design"
   - Select "Custom size"
   - Enter: 1200 x 630 pixels
   - Click "Create design"

3. **Add Background:**
   - Choose solid color (#f9fafb) OR
   - Upload project photo

4. **Add Company Name:**
   - Click "Text" → "Add heading"
   - Type: "BURCH CONTRACTING"
   - Font: Bold, Sans-serif (like Montserrat or Poppins)
   - Size: 80-100px
   - Color: #1e40af (blue)

5. **Add Tagline:**
   - Add another text: "Reliable Home Repair & Remodeling"
   - Size: 40-50px
   - Color: #374151 (dark gray)

6. **Add Contact Info:**
   - Phone: (864) 724-4600
   - Location: Simpsonville, SC
   - Size: 30-35px

7. **Add Icons (Optional):**
   - Search "house icon" in Elements
   - Search "phone icon"
   - Search "location icon"

8. **Download:**
   - Click "Share" → "Download"
   - Format: JPG
   - Quality: Standard (smaller file size)
   - Save as `og-image.jpg`

9. **Upload to Website:**
   - Save file to: `/public/og-image.jpg`
   - Already configured in your site!

---

## Quick Test

After uploading, test how it looks:

### Facebook Sharing Debugger
https://developers.facebook.com/tools/debug/

### LinkedIn Post Inspector
https://www.linkedin.com/post-inspector/

### Twitter Card Validator
https://cards-dev.twitter.com/validator

### Open Graph Preview Tool
https://www.opengraph.xyz/

---

## Example Text Content

Use this exact content for consistent branding:

**Main Headline:**
```
BURCH CONTRACTING
```

**Subheadline (choose one):**
```
Reliable Home Repair & Remodeling You Can Trust
Professional Home Services in Simpsonville, SC
Quality Craftsmanship Since [Year]
```

**Contact Info:**
```
📞 (864) 724-4600
📧 estimates@burchcontracting.com
📍 Simpsonville, SC 29681
🌐 burchcontracting.com
```

---

## Color Palette (Use These Exact Colors)

```css
/* Primary Blue */
#1e40af

/* Bright Blue (accents) */
#2563eb

/* Dark Gray (body text) */
#374151

/* Medium Gray */
#6b7280

/* Light Gray (backgrounds) */
#f9fafb

/* White */
#ffffff
```

---

## Pro Tips

### Do's ✅
- ✅ Use your actual project photos
- ✅ Keep text large and readable
- ✅ Use high contrast (dark text on light background)
- ✅ Include phone number prominently
- ✅ Test on multiple social platforms
- ✅ Keep file size under 500KB

### Don'ts ❌
- ❌ Don't use too much text (keep it simple)
- ❌ Don't use small fonts (minimum 30px)
- ❌ Don't use low-quality images
- ❌ Don't forget to save as JPG (not PNG)
- ❌ Don't use confusing or busy backgrounds
- ❌ Don't exceed 1MB file size

---

## Alternative: AI-Generated Image

### Use DALL-E or Midjourney

**Prompt:**
```
Create a professional social media banner for a home contracting company. 
1200x630 pixels. Clean, modern design. 
Features: "BURCH CONTRACTING" in bold blue text, 
"Reliable Home Repair & Remodeling" subtitle, 
phone number (864) 724-4600, 
white/light gray background, 
subtle house icon, professional and trustworthy look.
```

---

## Automated Solution (Advanced)

If you want to auto-generate OG images dynamically:

### Vercel OG Image Generator
```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    (
      <div style={{ 
        background: '#f9fafb', 
        width: '100%', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h1 style={{ fontSize: 80, color: '#1e40af' }}>
          BURCH CONTRACTING
        </h1>
        <p style={{ fontSize: 40, color: '#374151' }}>
          Reliable Home Repair & Remodeling
        </p>
        <p style={{ fontSize: 30, color: '#6b7280' }}>
          📞 (864) 724-4600
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

---

## Current Status

Your website already references the OG image in the code:
```typescript
// src/app/layout.tsx (line 40)
images: [
  {
    url: "https://burchcontracting.com/og-image.jpg",
    width: 1200,
    height: 630,
    alt: "Burch Contracting - Professional Home Services",
  },
]
```

**All you need to do is create the image and save it as `/public/og-image.jpg`!**

---

## Time Estimate

- **Using Canva:** 15-20 minutes
- **Using Photoshop:** 30-45 minutes
- **Using AI Generator:** 5-10 minutes

---

## Need Help?

If you need assistance:
1. Take a screenshot of your business card or truck
2. Send to a designer on Fiverr ($10-25)
3. Request: "1200x630 Open Graph image for social media"
4. Turnaround: 1-2 days

---

**Priority Level:** Medium (improves social sharing)  
**Impact:** High (professional appearance on social media)  
**Difficulty:** Easy (no technical skills required)

Once created, your website will look professional when shared on Facebook, LinkedIn, WhatsApp, and all other platforms! 🎉
