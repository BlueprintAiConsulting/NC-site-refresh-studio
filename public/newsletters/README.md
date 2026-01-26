# Newsletter PDFs

Place your newsletter PDF files in this directory.

## File Naming Convention

Use the format: `month-year.pdf` (e.g., `january-2026.pdf`)

## How to Add a New Newsletter

1. Save your PDF with the correct filename (lowercase month name, hyphen, year)
2. Place the PDF file in this directory
3. Update the `newsletters` array in `/src/components/Newsletter.tsx`:

```typescript
{
  month: "January",
  year: 2026,
  fileName: "january-2026.pdf",
  description: "Brief description of this month's newsletter content."
}
```

## Current Newsletters

- `january-2026.pdf` - January 2026 newsletter

## Example

After placing `february-2026.pdf` in this folder, add this entry to Newsletter.tsx:

```typescript
{
  month: "February",
  year: 2026,
  fileName: "february-2026.pdf",
  description: "Valentine's Day events and ministry updates."
}
```
