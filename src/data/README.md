# Publications Data

This file contains all publication metadata including dates, summaries, and tags.

## Adding a New Publication

1. **Add the PDF file** to `public/wp-content/uploads/publications/`

2. **Add the publication data** to `src/data/publications.js`:

```javascript
{
  title: 'Your Publication Title',
  date: '2024',  // Year of publication
  summary: 'One-line summary of what this publication is about.',
  tags: ['Tag1', 'Tag2', 'Tag3'],  // 2-4 relevant tags
  pdf: 'your-filename.pdf'  // Must match the filename in the folder
}
```

## Tags

Use consistent tags across publications. Common tags include:
- **Diversiteit** - For diversity-related publications
- **Gender** - For gender equality topics
- **Talent** - For talent development
- **Monitor** - For monitoring/research reports
- **Bedrijven** - For business/company research
- **Overheid** - For government/public sector
- **Loopbaan** - For career development
- **Emancipatie** - For emancipation topics
- **Kwaliteit** - For quality-related research

## Date Format

Use the year of publication (e.g., '2024', '2023', '2020').

## Summary

Keep summaries concise (one sentence, max 2 sentences). They should give readers a quick understanding of what the publication covers.


