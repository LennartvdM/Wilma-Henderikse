# Publications Folder

This folder contains all PDF publications for the website.

## Adding New Publications

Simply drop your PDF files into this folder, then add the filename to the `pdfFilenames` array in `src/pages/Publicaties.js`.

The system will automatically:
- Generate a readable title from the filename
- Create a link to the PDF
- Sort publications alphabetically

## Filename Format

Use lowercase with hyphens or underscores for spaces:
- `my-new-publication.pdf` ✅
- `My New Publication.pdf` ❌ (will be converted to lowercase)

Examples:
- `diversiteit-en-kwaliteit.pdf` → "Diversiteit En Kwaliteit"
- `monitor-talent-2024.pdf` → "Monitor Talent 2024"

